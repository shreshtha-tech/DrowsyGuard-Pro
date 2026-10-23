from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from app.api.endpoints import auth, detection
from app.db.base_class import Base
from app.db.session import engine
from pathlib import Path
import logging

# Initialize database tables
# In a real app, use Alembic migrations
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DrowsyGuard Pro API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(detection.router, prefix="/api/detect", tags=["Detection"])

@app.get("/health")
async def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except SQLAlchemyError:
        raise HTTPException(status_code=503, detail="Database unavailable")
    return {"status": "healthy"}

# Serve the built React dashboard from the same Render service. When running
# the API directly from source without a frontend build, keep the API root useful.
frontend_dir = Path(__file__).resolve().parent / "static"
if (frontend_dir / "index.html").is_file():
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="web")
else:
    @app.get("/")
    async def root():
        return {"message": "DrowsyGuard Pro API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
