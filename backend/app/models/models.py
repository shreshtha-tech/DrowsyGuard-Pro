from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="driver") # driver, fleet_manager, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DriverProfile(Base):
    __tablename__ = "driver_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    baseline_ear = Column(Float, default=0.3)
    baseline_blink_rate = Column(Float, default=15.0)
    sensitivity_level = Column(String, default="medium")
    license_number = Column(String)
    medical_notes = Column(Text)
    
    user = relationship("User", backref="profile")

class DetectionEvent(Base):
    __tablename__ = "detection_events"
    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    ear_value = Column(Float)
    blink_count = Column(Integer)
    yawn_count = Column(Integer)
    head_pitch = Column(Float)
    head_yaw = Column(Float)
    fatigue_score = Column(Float)
    alert_stage = Column(Integer)
    gps_lat = Column(Float)
    gps_lng = Column(Float)
    video_clip_url = Column(String)

class SOSIncident(Base):
    __tablename__ = "sos_incidents"
    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("users.id"))
    trigger_type = Column(String) # manual, auto_drowsy, auto_unresponsive
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    location_lat = Column(Float)
    location_lng = Column(Float)
    contacts_notified = Column(Boolean, default=False)
    response_time = Column(Float) # seconds
    resolved_at = Column(DateTime(timezone=True))
    video_url = Column(String)
    report_pdf_url = Column(String)

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"
    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    relation = Column(String)
    notify_order = Column(Integer, default=1)
    whatsapp_enabled = Column(Boolean, default=False)
    sms_template = Column(Text)

class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("users.id"))
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True))
    distance_km = Column(Float, default=0.0)
    avg_fatigue_score = Column(Float)
    max_fatigue_score = Column(Float)
    alert_count = Column(Integer, default=0)
    route_geojson = Column(Text)
