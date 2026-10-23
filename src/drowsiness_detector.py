import cv2
import time
import numpy as np
import mediapipe as mp
import pygame
import os
from math import dist
from datetime import datetime

# ------------ SETTINGS ------------
EAR_THRESHOLD = 0.40        # tuned for your face
DROWSINESS_SECONDS = 5     # alarm after 10 seconds of closed eyes
ALARM_REPEAT = -1           # -1 = loop alarm, 0 = play once

# ------------ PATHS ------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALARM_PATH = os.path.join(BASE_DIR, "assets", "alarm.wav")

LOG_DIR = os.path.join(BASE_DIR, "logs")
LOG_FILE = os.path.join(LOG_DIR, "events.log")

# ------------ MEDIAPIPE SETUP ------------
mp_face_mesh = mp.solutions.face_mesh

# Eye landmark indices for Mediapipe Face Mesh
LEFT_EYE_IDX = [33, 160, 158, 133, 153, 144]
RIGHT_EYE_IDX = [362, 385, 387, 263, 373, 380]


# ------------ UTILS ------------

def ensure_log_dir():
    """Create logs/ folder if it doesn't exist."""
    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)


def log_event(event_type: str, details: str = ""):
    """Append an event line to logs/events.log with timestamp."""
    ensure_log_dir()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] [{event_type}] {details}\n"
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line)


def eye_aspect_ratio(landmarks, eye_indices, image_w, image_h):
    """Compute EAR from selected eye landmarks."""
    pts = []
    for idx in eye_indices:
        lm = landmarks[idx]
        x = int(lm.x * image_w)
        y = int(lm.y * image_h)
        pts.append((x, y))

    left, top1, top2, right, bottom1, bottom2 = pts

    A = dist(top1, bottom1)
    B = dist(top2, bottom2)
    C = dist(left, right)

    if C == 0:
        return 0.0, pts

    ear = (A + B) / (2.0 * C)
    return ear, pts


def main():
    # ---------- INIT ALARM ----------
    alarm_enabled = False
    if os.path.exists(ALARM_PATH):
        pygame.mixer.init()
        pygame.mixer.music.load(ALARM_PATH)
        alarm_enabled = True
        print("[INFO] Alarm sound loaded.")
    else:
        print("[WARNING] Alarm sound not found.")
        print("         Visual alert only (no sound).")

    # ---------- INIT CAMERA ----------
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("[ERROR] Could not open webcam.")
        return

    # State variables
    eye_closed_start = None   # time when eyes first became closed
    alarm_on = False

    print("[INFO] Starting Driver Drowsiness Detection...")
    print("[INFO] Press 'q' to quit.")

    with mp_face_mesh.FaceMesh(
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    ) as face_mesh:

        while True:
            ret, frame = cap.read()
            if not ret:
                print("[ERROR] Failed to grab frame.")
                break

            frame = cv2.flip(frame, 1)
            h, w = frame.shape[:2]

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(rgb_frame)

            ear = None

            if results.multi_face_landmarks:
                for face_landmarks in results.multi_face_landmarks:
                    landmarks = face_landmarks.landmark

                    # ===== EYE / DROWSINESS =====
                    leftEAR, left_pts = eye_aspect_ratio(landmarks, LEFT_EYE_IDX, w, h)
                    rightEAR, right_pts = eye_aspect_ratio(landmarks, RIGHT_EYE_IDX, w, h)
                    ear = (leftEAR + rightEAR) / 2.0

                    # draw eye points
                    for pt in left_pts + right_pts:
                        cv2.circle(frame, pt, 1, (0, 255, 0), -1)

                    current_time = time.time()

                    if ear < EAR_THRESHOLD:
                        if eye_closed_start is None:
                            eye_closed_start = current_time

                        closed_duration = current_time - eye_closed_start

                        # show eyes-closed timer
                        cv2.putText(
                            frame,
                            f"Eyes closed: {closed_duration:.1f}s",
                            (30, 70),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.7,
                            (0, 255, 255),
                            2
                        )

                        if closed_duration >= DROWSINESS_SECONDS:
                            cv2.putText(
                                frame,
                                "DROWSINESS ALERT!",
                                (30, 110),
                                cv2.FONT_HERSHEY_SIMPLEX,
                                1.2,
                                (0, 0, 255),
                                3
                            )
                            if alarm_enabled and not alarm_on:
                                pygame.mixer.music.play(ALARM_REPEAT)
                                alarm_on = True
                                log_event(
                                    "DROWSINESS",
                                    f"Eyes closed for {closed_duration:.1f}s, EAR={ear:.2f}"
                                )
                    else:
                        eye_closed_start = None
                        if alarm_on:
                            pygame.mixer.music.stop()
                            alarm_on = False

                    break  # only first face

            # ===== TEXT OVERLAYS =====
            if ear is not None:
                cv2.putText(
                    frame,
                    f"EAR: {ear:.2f}",
                    (30, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (255, 255, 255),
                    2
                )
            else:
                cv2.putText(
                    frame,
                    "Face not detected",
                    (30, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (0, 0, 255),
                    2
                )

            # show frame
            cv2.imshow("Driver Drowsiness Detection", frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord('q') or key == 27:  # 'q' or ESC
                break

    # ---------- CLEANUP ----------
    cap.release()
    cv2.destroyAllWindows()
    if alarm_enabled:
        pygame.mixer.music.stop()
        pygame.mixer.quit()
    print("[INFO] Exiting...")
    print(f"[INFO] Events logged to: {LOG_FILE}")


if __name__ == "__main__":
    main()
