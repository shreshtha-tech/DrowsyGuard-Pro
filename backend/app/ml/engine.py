import cv2
import mediapipe as mp
from mediapipe.python.solutions import face_mesh as mp_face_mesh
import numpy as np
from math import dist
from typing import Tuple, List, Optional
import time
from collections import deque

class DrowsinessEngine:
    def __init__(self):
        self.face_mesh = mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Landmark indices
        self.LEFT_EYE_IDX = [33, 160, 158, 133, 153, 144]
        self.RIGHT_EYE_IDX = [362, 385, 387, 263, 373, 380]
        self.MOUTH_IDX = [13, 14, 61, 291]
        
        # Temporal Analysis State (Per Driver ID - simplifies to singleton for now)
        self.ear_history = deque(maxlen=100) # ~5 seconds at 20fps
        self.mar_history = deque(maxlen=100)
        self.eye_closed_start_time = None
        self.last_yawn_time = 0
        self.yawn_count = 0
        self.blink_count = 0
        self.is_blinking = False
        
        # Thresholds
        self.EAR_THRESHOLD = 0.22
        self.MAR_THRESHOLD = 0.5
        self.DROWSY_TIME_LIMIT = 2.0 # Seconds eyes closed for Level 3
        self.SOS_TIME_LIMIT = 5.0    # Seconds eyes closed for SOS

    def calculate_ear(self, landmarks, eye_indices, w, h) -> float:
        pts = []
        for idx in eye_indices:
            lm = landmarks[idx]
            pts.append((lm.x * w, lm.y * h))
        
        left, top1, top2, right, bottom1, bottom2 = pts
        A = dist(top1, bottom1)
        B = dist(top2, bottom2)
        C = dist(left, right)
        return (A + B) / (2.0 * C) if C != 0 else 0.0

    def calculate_mar(self, landmarks, w, h) -> float:
        pts = []
        for idx in self.MOUTH_IDX:
            lm = landmarks[idx]
            pts.append((lm.x * w, lm.y * h))
        top, bottom, left, right = pts
        A = dist(top, bottom)
        C = dist(left, right)
        return A / C if C != 0 else 0.0

    def process_frame(self, frame: np.ndarray) -> dict:
        h, w = frame.shape[:2]
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        current_time = time.time()
        res = {
            "face_detected": False,
            "ear": 0.0,
            "mar": 0.0,
            "fatigue_score": 0.0,
            "alert_stage": 0,
            "eyes_closed_duration": 0.0,
            "trigger_sos": False
        }
        
        if not results.multi_face_landmarks:
            return res
            
        res["face_detected"] = True
        landmarks = results.multi_face_landmarks[0].landmark
        
        # 1. EAR Calculation
        left_ear = self.calculate_ear(landmarks, self.LEFT_EYE_IDX, w, h)
        right_ear = self.calculate_ear(landmarks, self.RIGHT_EYE_IDX, w, h)
        ear = (left_ear + right_ear) / 2.0
        res["ear"] = round(ear, 3)
        self.ear_history.append(ear)
        
        # 2. MAR Calculation
        mar = self.calculate_mar(landmarks, w, h)
        res["mar"] = round(mar, 3)
        self.mar_history.append(mar)
        
        # 3. Temporal Drowsiness Logic
        if ear < self.EAR_THRESHOLD:
            if self.eye_closed_start_time is None:
                self.eye_closed_start_time = current_time
            
            duration = current_time - self.eye_closed_start_time
            res["eyes_closed_duration"] = round(duration, 2)
            
            # Stage Escalation
            if duration > self.SOS_TIME_LIMIT:
                res["alert_stage"] = 4
                res["trigger_sos"] = True
            elif duration > self.DROWSY_TIME_LIMIT:
                res["alert_stage"] = 3
            else:
                res["alert_stage"] = 2
        else:
            self.eye_closed_start_time = None
            # Check for blink
            if ear > 0.28 and self.is_blinking: # Rough release threshold
                self.is_blinking = False
                self.blink_count += 1
            elif ear < 0.24:
                self.is_blinking = True
                
        # 4. Yawn Detection
        if mar > self.MAR_THRESHOLD:
            if current_time - self.last_yawn_time > 5: # Cooldown
                self.yawn_count += 1
                self.last_yawn_time = current_time
        
        # 5. Score Fusion (0-100)
        # PERCLOS (Percentage of eye closure over the window)
        perclos = sum(1 for e in self.ear_history if e < self.EAR_THRESHOLD) / len(self.ear_history)
        
        fatigue_score = (perclos * 70) + (min(1, res["eyes_closed_duration"] / 5) * 20) + (min(1, self.yawn_count / 3) * 10)
        res["fatigue_score"] = round(min(100, fatigue_score * 1.2), 1)
        
        # Adaptive Stage for low-level fatigue
        if res["alert_stage"] == 0:
            if res["fatigue_score"] > 60: res["alert_stage"] = 2
            elif res["fatigue_score"] > 40: res["alert_stage"] = 1
            
        return res

engine = DrowsinessEngine()
