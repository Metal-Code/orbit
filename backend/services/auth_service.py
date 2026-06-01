from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate
from core.security import hash_password, verify_password, create_access_token

def register_user(db : Session, user_data : UserCreate):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise ValueError("Email already registered")
    
    new_user = User(
        full_name = user_data.full_name,
        email = user_data.email,
        hashed_password = hash_password(user_data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def login_user(db : Session, email : str, password : str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise ValueError("Invalid email")
    if not verify_password(password, user.hashed_password):
        raise ValueError("Invalid password")
    
    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


def get_user_by_email(db : Session, email : str):
    return db.query(User).filter(User.email == email).first()