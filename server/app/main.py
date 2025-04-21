from fastapi import FastAPI
from fastapi_jwt_auth import AuthJWT
from app.routes import users, scraper  
from pydantic import BaseSettings
from app.database import Base, engine

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(users.router)
app.include_router(scraper.router)  

origins = [
    "http://localhost",
    "http://localhost:8081",
    "https://hydra.newpaltz.edu",
    "http://192.168.1.160:8081",
    "https://192.168.1.160:8081/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# JWT Settings using Pydantic
class Settings(BaseSettings):
    authjwt_secret_key: str

    class Config:
        env_file = ".env"  # Automatically load from .env

@AuthJWT.load_config
def get_config():
    return Settings()