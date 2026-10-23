import logging
from app.core.config import settings
from app.models.models import User, EmergencyContact, SOSIncident
from sqlalchemy.orm import Session
# from twilio.rest import Client # Needs credentials

class SOSService:
    def __init__(self):
        self.account_sid = settings.TWILIO_ACCOUNT_SID
        self.auth_token = settings.TWILIO_AUTH_TOKEN
        self.from_number = settings.TWILIO_PHONE_NUMBER
        # if self.account_sid and self.auth_token:
        #     self.client = Client(self.account_sid, self.auth_token)
        # else:
        self.client = None

    async def trigger_sos(self, db: Session, driver_id: int, trigger_type: str, location: dict):
        logging.info(f"Triggering SOS for driver {driver_id} due to {trigger_type}")
        
        # 1. Log incident in DB
        incident = SOSIncident(
            driver_id=driver_id,
            trigger_type=trigger_type,
            location_lat=location.get("lat"),
            location_lng=location.get("lng")
        )
        db.add(incident)
        db.commit()
        db.refresh(incident)
        
        # 2. Get emergency contacts
        contacts = db.query(EmergencyContact).filter(EmergencyContact.driver_id == driver_id).all()
        
        # 3. Notify contacts via Twilio
        for contact in contacts:
            self._send_sms(contact.phone, f"ALERT: DrowsyGuard detected critical danger for your driver. Location: https://maps.google.com/?q={location.get('lat')},{location.get('lng')}")
            
        return incident

    def _send_sms(self, to_number: str, message: str):
        if self.client:
            try:
                # self.client.messages.create(
                #     body=message,
                #     from_=self.from_number,
                #     to=to_number
                # )
                logging.info(f"SMS sent to {to_number}")
            except Exception as e:
                logging.error(f"Failed to send SMS to {to_number}: {e}")
        else:
            logging.warning(f"Twilio not configured. SMS not sent to {to_number}: {message}")

sos_service = SOSService()
