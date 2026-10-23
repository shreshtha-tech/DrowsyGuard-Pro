from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", hide_input_in_errors=True)
    PROJECT_NAME: str = "DrowsyGuard Pro"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    DATABASE_URL: str
    
    INFLUXDB_URL: Optional[str] = None
    INFLUXDB_TOKEN: Optional[str] = None
    INFLUXDB_ORG: Optional[str] = None
    INFLUXDB_BUCKET: Optional[str] = None
    
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None

settings = Settings()
