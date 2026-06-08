from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AttachmentCreate(BaseModel):
    file_name: str
    file_url: str
    file_type: str
    label: Optional[str] = None

class AttachmentResponse(BaseModel):
    id: int
    file_name: str
    file_url: str
    file_type: str
    label: Optional[str] = None
    timeline_entry_id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True