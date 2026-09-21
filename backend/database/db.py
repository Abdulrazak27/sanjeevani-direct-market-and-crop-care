import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Database Connection URL: Uses PostgreSQL / Supabase if configured, otherwise SQLite for portable zero-setup
DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("SUPABASE_DB_URL")

if not DATABASE_URL:
    # Use SQLite relational database located in the backend data directory
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "sanjeevani.db")
    DATABASE_URL = f"sqlite:///{db_path}"

# SQLite specific connect args
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False,
    future=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """FastAPI Dependency for database session management"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
