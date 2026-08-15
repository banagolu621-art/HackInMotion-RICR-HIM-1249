import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from models import User
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from database import get_db

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
def register(user: RegisterRequest, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # bcrypt has a 72-byte password limit
    password_bytes = user.password.encode("utf-8")

    if len(password_bytes) > 72:
        raise HTTPException(
            status_code=400, detail="Password must be 72 bytes or fewer"
        )

    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")

    new_user = User(name=user.name, email=user.email, password=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "Registration successful",
        "user": {"id": new_user.id, "name": new_user.name, "email": new_user.email},
    }


@router.post("/login")
def login(user: LoginRequest, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    password_correct = bcrypt.checkpw(
        user.password.encode("utf-8"), existing_user.password.encode("utf-8")
    )

    if not password_correct:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email,
        },
    }
