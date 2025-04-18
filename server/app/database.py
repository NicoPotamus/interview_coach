import os
import time
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Import custom DB wait logic
from app.db_wait import wait_for_db

# Load environment variables
load_dotenv()

# Get the database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment.")

# Wait for the DB to be ready before creating the engine
wait_for_db(DATABASE_URL)

# Create SQLAlchemy engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# Dependency to be used with FastAPI or other DI frameworks
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()