from fastapi import FastAPI
from fastapi_jwt_auth import AuthJWT
from app.routes import users
from app.database import Base, engine
import os
from dotenv import load_dotenv

load_dotenv()
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)

class Settings:
    authjwt_secret_key: str = os.getenv("JWT_SECRET")

@AuthJWT.load_config
def get_config():
    return Settings()