from sqlalchemy import Column, Integer, String, ForeignKey, DATETIME
from core.database import Base
from datetime import datetime
from sqlalchemy.orm import relationship

class Link(Base):
    __tablename__ = "links"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    label = Column(String, nullable=True)
    timeline_entry_id = Column(Integer, ForeignKey("timeline_entries.id"), nullable=False)

    timeline_entry = relationship("TimelineEntry", back_populates="links")