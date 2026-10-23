from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "DrowsyGuard Pro"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "yoursecretkey"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/drowsyguard"
    
    INFLUXDB_URL: Optional[str] = None
    INFLUXDB_TOKEN: Optional[str] = None
    INFLUXDB_ORG: Optional[str] = None
    INFLUXDB_BUCKET: Optional[str] = None
    
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()
