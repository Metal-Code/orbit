from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.user import UserCreate, UserLogin, UserResponse
from services.auth_service import (
    initiate_registration, complete_registration,
    resend_otp, login_user
)
from dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        return initiate_registration(db, user_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/verify-otp", response_model=UserResponse)
def verify(email: str, otp: str, db: Session = Depends(get_db)):
    try:
        return complete_registration(db, email, otp)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/resend-otp")
def resend(email: str, db: Session = Depends(get_db)):
    try:
        return resend_otp(db, email)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    try:
        return login_user(db, user_data.email, user_data.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=UserResponse)
def me(current_user = Depends(get_current_user)):
    return current_user