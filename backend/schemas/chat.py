from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    question: str

class SourceLink(BaseModel):
    url: str
    label: Optional[str] = None

class SourceAttachment(BaseModel):
    url: str
    label: Optional[str] = None
    type: Optional[str] = None

class ChatSource(BaseModel):
    entry_id: int
    title: str
    links: List[SourceLink] = []
    attachments: List[SourceAttachment] = []

class ChatResponse(BaseModel):
    answer: str
    sources: List[ChatSource] = []