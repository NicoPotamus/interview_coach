from fastapi import Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from passlib.hash import bcrypt
from .database import SessionLocal
from .models import User

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    return bcrypt.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.verify(password, hashed)

def get_current_user(Authorize: AuthJWT = Depends(), db=Depends(get_db)):
    try:
        Authorize.jwt_required()
        user_email = Authorize.get_jwt_subject()
        user = db.query(User).filter(User.email == user_email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except AuthJWTException as e:
        raise HTTPException(status_code=401, detail=str(e))