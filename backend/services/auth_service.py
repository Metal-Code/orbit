from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate
from core.security import hash_password, verify_password, create_access_token
from core.config import RESEND_API_KEY, REPORT_EMAIL, OTP_EXPIRE_SECONDS
from datetime import datetime, timezone, timedelta
import random
import resend

resend.api_key = RESEND_API_KEY

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(email: str, full_name: str, otp: str):
    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": email,
        "subject": "Your Orbit OTP Code",
        "html": f"""
            <h2>Welcome to Orbit, {full_name}!</h2>
            <p>Your OTP code is:</p>
            <h1 style="letter-spacing: 8px;">{otp}</h1>
            <p>This code expires in 45 seconds.</p>
        """
    })

def register_user(db: Session, user_data: UserCreate):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise ValueError("Email already registered")

    otp = generate_otp()
    otp_expires_at = datetime.now(timezone.utc) + timedelta(seconds=OTP_EXPIRE_SECONDS)

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        is_verified=False,
        otp=otp,
        otp_expires_at=otp_expires_at
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    send_otp_email(new_user.email, new_user.full_name, otp)

    return new_user

def verify_otp(db: Session, email: str, otp: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise ValueError("User not found")
    if user.is_verified:
        raise ValueError("User already verified")
    if user.otp != otp:
        raise ValueError("Invalid OTP")
    if datetime.now(timezone.utc) > user.otp_expires_at.replace(tzinfo=timezone.utc):
        raise ValueError("OTP has expired")

    user.is_verified = True
    user.otp = None
    user.otp_expires_at = None
    db.commit()
    db.refresh(user)
    return user

def resend_otp(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise ValueError("User not found")
    if user.is_verified:
        raise ValueError("User already verified")

    otp = generate_otp()
    otp_expires_at = datetime.now(timezone.utc) + timedelta(seconds=OTP_EXPIRE_SECONDS)

    user.otp = otp
    user.otp_expires_at = otp_expires_at
    db.commit()

    send_otp_email(user.email, user.full_name, otp)
    return {"message": "OTP resent successfully"}

def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise ValueError("Invalid email or password")
    if not verify_password(password, user.hashed_password):
        raise ValueError("Invalid email or password")
    if not user.is_verified:
        raise ValueError("Please verify your email first")

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()