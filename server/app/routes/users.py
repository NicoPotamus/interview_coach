from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi_jwt_auth import AuthJWT
from app import models, auth, schemas
from app.database import get_db

router = APIRouter()

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = auth.hash_password(user.password)
    new_user = models.User(**user.dict(exclude={"password"}), password=hashed_pw)
    db.add(new_user)
    db.commit()
    return {"msg": "User registered"}

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = Authorize.create_access_token(subject=db_user.email)
    return {"access_token": access_token}