from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base

class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    timeline_entry_id = Column(Integer, ForeignKey("timeline_entries.id"), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    timeline_entry = relationship("TimelineEntry", back_populates="attachments")