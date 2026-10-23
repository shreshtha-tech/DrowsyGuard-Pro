from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
import base64
import cv2
import numpy as np
import json
import logging
from sqlalchemy.orm import Session
from app.ml.engine import engine
from app.services.sos import sos_service
from app.api import deps

router = APIRouter()

@router.websocket("/stream")
async def detection_stream(websocket: WebSocket, db: Session = Depends(deps.get_db)):
    await websocket.accept()
    logging.info("WebSocket connection established")
    
    # Track SOS triggering to avoid multiple calls
    sos_triggered = False
    
    try:
        while True:
            # Expecting data in format: {"image": "base64_string", "driver_id": 1, "location": {"lat": 0, "lng": 0}}
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            image_data = payload.get("image")
            driver_id = payload.get("driver_id", 1)
            location = payload.get("location", {"lat": 0, "lng": 0})
            
            if not image_data:
                continue
                
            try:
                # Handle possible base64 prefix
                if "," in image_data:
                    image_data = image_data.split(",")[1]
                
                decoded_data = base64.b64decode(image_data)
                np_data = np.frombuffer(decoded_data, np.uint8)
                frame = cv2.imdecode(np_data, cv2.IMREAD_COLOR)
                
                if frame is not None:
                    # Process frame with temporal engine
                    results = engine.process_frame(frame)
                    
                    # 6. EMERGENCY ESCALATION
                    if results.get("trigger_sos") and not sos_triggered:
                        logging.warning(f"CRITICAL: Triggering SOS for Driver {driver_id}")
                        await sos_service.trigger_sos(
                            db=db, 
                            driver_id=driver_id, 
                            trigger_type="auto_drowsy", 
                            location=location
                        )
                        sos_triggered = True
                    elif not results.get("trigger_sos"):
                        sos_triggered = False # Reset if they recover
                    
                    # Send results back
                    await websocket.send_json(results)
                    
            except Exception as e:
                logging.error(f"Error processing frame: {e}")
                await websocket.send_json({"error": "Processing failed"})
                
    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except Exception as e:
        logging.error(f"WebSocket error: {e}")
