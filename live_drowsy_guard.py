import cv2
import mediapipe as mp
import numpy as np
from math import dist
import time
from collections import deque
import os
import pygame
from datetime import datetime

# ==========================================
#              SETTINGS & CONFIG
# ==========================================
MAR_THRESHOLD = 0.50        
DROWSY_TIME_LIMIT = 1.5     # Reduced for faster alert sync
SOS_TIME_LIMIT = 4.0        
PERCLOS_WINDOW = 100        

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ALARM_PATH = os.path.join(BASE_DIR, "assets", "alarm.wav")

class DrowsyGuardPro:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1, refine_landmarks=True,
            min_detection_confidence=0.5, min_tracking_confidence=0.5
        )
        
        self.LEFT_EYE_IDX = [33, 160, 158, 133, 153, 144]
        self.RIGHT_EYE_IDX = [362, 385, 387, 263, 373, 380]
        self.MOUTH_IDX = [13, 14, 61, 291]
        
        self.ear_history = deque(maxlen=PERCLOS_WINDOW)
        self.eye_closed_start_time = None
        self.last_yawn_time = 0
        self.yawn_count = 0
        self.fatigue_score = 0
        self.alert_stage = 0
        self.sos_triggered = False
        self.is_calibrated = False
        self.calibration_frames = []
        self.ear_threshold = 0.20 

        # Audio Setup
        pygame.mixer.init()
        self.alarm_loaded = os.path.exists(ALARM_PATH)
        if self.alarm_loaded:
            pygame.mixer.music.load(ALARM_PATH)
            print(f"[AUDIO] Alarm synced and loaded: {ALARM_PATH}")
        else:
            print("[AUDIO] ERROR: alarm.wav not found in assets folder!")

    def calculate_ear(self, landmarks, eye_indices, w, h):
        pts = [(landmarks[idx].x * w, landmarks[idx].y * h) for idx in eye_indices]
        left, top1, top2, right, bottom1, bottom2 = pts
        A, B, C = dist(top1, bottom1), dist(top2, bottom2), dist(left, right)
        return (A + B) / (2.0 * C) if C != 0 else 0.0

    def run(self):
        cap = cv2.VideoCapture(0)
        start_time = time.time()
        
        while True:
            ret, frame = cap.read()
            if not ret: break
            frame = cv2.flip(frame, 1)
            h, w = frame.shape[:2]
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_mesh.process(rgb)
            
            curr_time = time.time()
            elapsed = curr_time - start_time

            if results.multi_face_landmarks:
                landmarks = results.multi_face_landmarks[0].landmark
                ear = (self.calculate_ear(landmarks, self.LEFT_EYE_IDX, w, h) + 
                       self.calculate_ear(landmarks, self.RIGHT_EYE_IDX, w, h)) / 2.0
                mar = (dist((landmarks[13].x*w, landmarks[13].y*h), (landmarks[14].x*w, landmarks[14].y*h)) / 
                       dist((landmarks[61].x*w, landmarks[61].y*h), (landmarks[291].x*w, landmarks[291].y*h)))
                self.ear_history.append(ear)

                if not self.is_calibrated:
                    self.calibration_frames.append(ear)
                    cv2.putText(frame, f"SYNCING AI... {int(5-elapsed)}s", (50, h//2), 2, 1.5, (0, 255, 255), 3)
                    if elapsed > 5:
                        self.ear_threshold = np.mean(self.calibration_frames) * 0.70
                        self.is_calibrated = True
                else:
                    # SYNCED LOGIC
                    duration = 0
                    if ear < self.ear_threshold:
                        if self.eye_closed_start_time is None:
                            self.eye_closed_start_time = curr_time
                        duration = curr_time - self.eye_closed_start_time
                        
                        if duration > SOS_TIME_LIMIT:
                            self.alert_stage = 4
                        elif duration > DROWSY_TIME_LIMIT:
                            self.alert_stage = 3
                            if self.alarm_loaded and not pygame.mixer.music.get_busy():
                                pygame.mixer.music.play(-1) # Start Alarm
                        else:
                            self.alert_stage = 2
                    else:
                        self.eye_closed_start_time = None
                        self.alert_stage = 0
                        if pygame.mixer.music.get_busy():
                            pygame.mixer.music.stop() # Stop Alarm

                    # UI Drawing
                    color = (0, 255, 0)
                    if self.alert_stage >= 3: color = (0, 0, 255)
                    
                    cv2.putText(frame, f"EAR: {ear:.2f} (Target: {self.ear_threshold:.2f})", (20, 40), 1, 1.5, (255, 255, 255), 2)
                    cv2.putText(frame, f"FATIGUE: {int(duration*20)}%", (20, 80), 1, 2, color, 3)
                    
                    if self.alert_stage >= 3:
                        # FLASHING SYNCED ALERT
                        if int(time.time() * 5) % 2 == 0:
                            cv2.rectangle(frame, (0, 0), (w, h), (0, 0, 255), 20)
                            cv2.putText(frame, "!!! ALARM !!!", (w//2-150, h//2), 2, 3, (0, 0, 255), 5)

            cv2.imshow("DrowsyGuard Pro - Live Alert Sync", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'): break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    DrowsyGuardPro().run()
