from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    full_name : str
    email : EmailStr
    password : str

class UserLogin(BaseModel):
    email : EmailStr
    password : str

class UserResponse(BaseModel):
    id  : int
    full_name : str
    email : str
    role : str
    org_id : Optional[int]
    created_at : datetime

    class config:
        from_attributes : True