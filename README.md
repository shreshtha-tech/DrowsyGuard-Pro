# DrowsyGuard Pro

DrowsyGuard Pro is a comprehensive driver safety system that uses AI (YOLOv8 & MediaPipe) to detect drowsiness in real-time and alert drivers and fleet managers.

## Project Structure

- `backend/`: FastAPI application, ML engine, and database models.
- `web/`: React.js fleet manager dashboard.
- `mobile/`: React Native (Expo) driver application.
- `docker-compose.yml`: Local development setup with PostgreSQL and InfluxDB.

## Core Features

1. **Real-time Detection**: Multi-metric analysis including EAR, PERCLOS, and head pose.
2. **Multi-Stage Alerts**: Progressive alerts from vibration to loud alarms.
3. **Emergency SOS**: Automated SMS/Calls via Twilio when critical drowsiness is detected.
4. **Fleet Dashboard**: Live monitoring and historical analytics for fleet managers.

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

## API Documentation
Once the backend is running, visit `http://localhost:8000/docs` for the full Swagger documentation.

## License
MIT
