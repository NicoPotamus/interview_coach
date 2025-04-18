from fastapi import FastAPI
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseSettings
from app.routes import users
from app.database import Base, engine

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(users.router)

# JWT Settings using Pydantic
class Settings(BaseSettings):
    authjwt_secret_key: str

    class Config:
        env_file = ".env"  # Automatically load from .env

@AuthJWT.load_config
def get_config():
    return Settings()