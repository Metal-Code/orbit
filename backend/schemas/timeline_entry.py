from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from schemas.link import LinkCreate, LinkResponse
from schemas.attachment import AttachmentCreate, AttachmentResponse

class TimelineEntryCreate(BaseModel):
    title: str
    description: Optional[str] = None
    type: str
    links: Optional[List[LinkCreate]] = []
    attachments: Optional[List[AttachmentCreate]] = []

class TimelineEntryResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    type: str
    project_id: int
    added_by_name: str
    added_by_email: str
    created_at: datetime
    links: Optional[List[LinkResponse]] = []
    attachments: Optional[List[AttachmentResponse]] = []

    class Config:
        from_attributes = True