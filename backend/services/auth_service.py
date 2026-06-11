from sqlalchemy.orm import Session
from models.user import User
from models.pending_registration import PendingRegistration
from schemas.user import UserCreate
from core.security import hash_password, verify_password, create_access_token
from core.config import RESEND_API_KEY, OTP_EXPIRE_SECONDS
from datetime import datetime, timezone, timedelta
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from core.config import GMAIL_USER, GMAIL_APP_PASSWORD
import threading


def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(email: str, full_name: str, otp: str):
    print(f"OTP for {email}: {otp}")
    def send():
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = "Your Orbit Verification Code"
            msg["From"] = GMAIL_USER
            msg["To"] = email
            html = f"""
                <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
                    <h2>Welcome to Orbit, {full_name}!</h2>
                    <p>Your verification code is:</p>
                    <h1 style="letter-spacing: 8px; font-size: 36px;">{otp}</h1>
                    <p>This code expires in 2 minutes.</p>
                </div>
            """
            msg.attach(MIMEText(html, "html"))
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
                server.sendmail(GMAIL_USER, email, msg.as_string())
            print(f"Email sent to {email}")
        except Exception as e:
            print(f"Email failed: {e}")

    threading.Thread(target=send).start()


def initiate_registration(db: Session, user_data: UserCreate):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise ValueError("Email already registered")

    otp = generate_otp()
    otp_expires_at = datetime.now(timezone.utc) + timedelta(seconds=OTP_EXPIRE_SECONDS)

    existing_pending = db.query(PendingRegistration).filter(
        PendingRegistration.email == user_data.email
    ).first()

    if existing_pending:
        existing_pending.otp = otp
        existing_pending.otp_expires_at = otp_expires_at
        existing_pending.full_name = user_data.full_name
        existing_pending.hashed_password = hash_password(user_data.password)
    else:
        pending = PendingRegistration(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
            otp=otp,
            otp_expires_at=otp_expires_at
        )
        db.add(pending)

    db.commit()
    send_otp_email(user_data.email, user_data.full_name, otp)
    return {"message": "OTP sent to your email"}

def complete_registration(db: Session, email: str, otp: str):
    pending = db.query(PendingRegistration).filter(
        PendingRegistration.email == email
    ).first()

    if not pending:
        raise ValueError("No pending registration found for this email")
    if pending.otp != otp:
        raise ValueError("Invalid OTP")
    if datetime.now(timezone.utc) > pending.otp_expires_at.replace(tzinfo=timezone.utc):
        raise ValueError("OTP has expired")

    new_user = User(
        full_name=pending.full_name,
        email=pending.email,
        hashed_password=pending.hashed_password,
        is_verified=True
    )
    db.add(new_user)
    db.delete(pending)
    db.commit()
    db.refresh(new_user)
    return new_user

def resend_otp(db: Session, email: str):
    pending = db.query(PendingRegistration).filter(
        PendingRegistration.email == email
    ).first()

    if not pending:
        raise ValueError("No pending registration found for this email")

    otp = generate_otp()
    otp_expires_at = datetime.now(timezone.utc) + timedelta(seconds=OTP_EXPIRE_SECONDS)
    pending.otp = otp
    pending.otp_expires_at = otp_expires_at
    db.commit()

    send_otp_email(pending.email, pending.full_name, otp)
    return {"message": "OTP resent successfully"}

def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise ValueError("Invalid email or password")
    if not verify_password(password, user.hashed_password):
        raise ValueError("Invalid email or password")

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()