from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone, timedelta
from core.database import Base

class PendingRegistration(Base):
    __tablename__ = "pending_registrations"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    otp = Column(String, nullable=False)
    otp_expires_at = Column(DateTime, nullable=False)