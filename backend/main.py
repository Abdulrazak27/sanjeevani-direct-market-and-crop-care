import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database.db import engine, Base
from database.seed import seed_database
from routers import (
    auth, farmers, buyers, crops, cold_storage,
    agreements, payments, workers, audit_logs,
    cms, dashboard, search, settings, ai_chat, weather
)

load_dotenv()

# Initialize Database Schema & Seed Data
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="Sanjeevani Centralized Platform API",
    description="Unified API Engine and Single Source of Truth for Farmer Web App & Master Admin",
    version="2.0.0"
)

# Enable CORS for Main Web App & Admin Panel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Unified REST Routers
app.include_router(auth.router)
app.include_router(farmers.router)
app.include_router(buyers.router)
app.include_router(crops.router)
app.include_router(cold_storage.router)
app.include_router(agreements.router)
app.include_router(payments.router)
app.include_router(workers.router)
app.include_router(audit_logs.router)
app.include_router(cms.router)
app.include_router(dashboard.router)
app.include_router(search.router)
app.include_router(settings.router)
app.include_router(ai_chat.router)
app.include_router(weather.router)

@app.get("/")
async def root():
    return {
        "app": "SANJEEVANI Centralized Platform API",
        "status": "online",
        "version": "2.0.0",
        "database": "Relational Database Connected (Single Source of Truth)",
        "tagline": "From Crop Care to Market — Your Farming Saathi."
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "Single Source of Truth Relational Database (SQLAlchemy)",
        "ai_engine": "WPF Plant Computer Vision Pipeline Ready",
        "weather_service": "Open-Meteo Live Connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
