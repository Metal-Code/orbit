from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class OrganizationCreate(BaseModel):
    name : str
    description: Optional[str] = None


class OrganizationResponse(BaseModel):
    id : int
    name : str
    description : Optional[str]
    invite_code : str
    created_by : int
    created_at : datetime

    class Config:
        from_attributes = True