from pydantic import BaseModel
from typing import Optional

class LinkCreate(BaseModel):
    url: str
    label: Optional[str] = None

class LinkResponse(BaseModel):
    id: int
    url: str
    label: Optional[str]
    timeline_entry_id: int

    class Config:
        from_attributes = True