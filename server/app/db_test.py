from sqlalchemy.engine.url import make_url
from sqlalchemy import create_engine

url = make_url("mysql+pymysql://coach_user:coach_pass@db/interview_coach")
print("Parsed DB URL:", url)

engine = create_engine(url)
print("Engine created successfully!")