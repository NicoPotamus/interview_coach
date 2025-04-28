from fastapi import APIRouter, Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.auth import hash_password, verify_password, get_db
from app.models import User

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterModel(BaseModel):
    email: EmailStr
    password: str

class LoginModel(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register(user: RegisterModel, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(email=user.email, password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User created successfully"}

@router.post("/login")
def login(user: LoginModel, db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    existing = db.query(User).filter(User.email == user.email).first()
    if not existing or not verify_password(user.password, existing.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = Authorize.create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}