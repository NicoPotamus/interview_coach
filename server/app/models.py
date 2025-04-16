from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(255))
    location = Column(String(100))
    saved_jobs = relationship("SavedJob", back_populates="user")

class SavedJob(Base):
    __tablename__ = "saved_jobs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_title = Column(String(100))
    company = Column(String(100))
    location = Column(String(100))
    description = Column(Text)
    user = relationship("User", back_populates="saved_jobs")