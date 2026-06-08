from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone, timedelta
from core.database import Base
IST = timezone(timedelta(hours=5, minutes=30))
class TimelineEntry(Base):
    __tablename__ = "timeline_entries"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    type = Column(String, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    added_by_name = Column(String, nullable=False)
    added_by_email = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(IST))

    project = relationship("Project", back_populates="timeline_entries")
    links = relationship("Link", back_populates="timeline_entry")
    attachments = relationship("Attachment", back_populates="timeline_entry")