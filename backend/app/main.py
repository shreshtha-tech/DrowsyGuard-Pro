from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import auth, detection
from app.db.base_class import Base
from app.db.session import engine
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

@app.get("/")
async def root():
    return {"message": "DrowsyGuard Pro API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
