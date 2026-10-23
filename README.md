# DrowsyGuard Pro

DrowsyGuard Pro is a prototype driver drowsiness system. Its API uses MediaPipe face landmarks to estimate eye closure and fatigue.

## Project Structure

- `backend/`: FastAPI application, ML engine, and database models.
- `web/`: React.js fleet manager dashboard.
- `mobile/`: React Native (Expo) driver application.
- `docker-compose.yml`: Local development setup with PostgreSQL and InfluxDB.

## Core Features

1. **Real-time Detection**: Multi-metric analysis including EAR, PERCLOS, and head pose.
2. **Multi-Stage Alerts**: Progressive alerts from vibration to loud alarms.
3. **Emergency incidents**: Critical detections can be recorded in the database. SMS and calls are not implemented yet.
4. **Fleet dashboard prototype**: The web dashboard currently shows sample drivers; it is not connected to live data.

## Getting Started

### 1. Prerequisites
- Docker & Docker Compose
- Node.js (v20+)
- Python (v3.10+)
- Expo Go app on your mobile device (for testing the app)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Alternatively, use Docker:
```bash
docker-compose up --build
```

### 3. Web Dashboard Setup
```bash
cd web
npm install
npm run dev
```
Visit `http://localhost:5173` to view the dashboard.

### 4. Mobile App Setup
```bash
cd mobile
npm install
npx expo start
```
Scan the QR code with the Expo Go app to test on your phone.

Set `EXPO_PUBLIC_API_URL` in `mobile/.env` to the backend's reachable HTTP(S) URL. When testing on a phone, `127.0.0.1` points to the phone, so use your computer's LAN address or a deployed API. The mobile client currently uses driver ID 1; account pairing and authenticated detection are not implemented.

### Render backend

The root `Dockerfile` builds the backend web service. Keep the Docker context as `.` and Dockerfile path as `./Dockerfile`. Configure `DATABASE_URL` for a reachable PostgreSQL database and set a unique `SECRET_KEY` in Render's environment settings. The backend will not start if its configured database cannot be reached. Check `/health` and `/docs` after deployment. The web dashboard requires a separate static site deployment from `web/`.

## API Documentation
Once the backend is running, visit `http://localhost:8000/docs` for the full Swagger documentation.

## License
MIT
