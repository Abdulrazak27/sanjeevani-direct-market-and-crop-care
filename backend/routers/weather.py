from fastapi import APIRouter
from ai.weather_service import fetch_live_weather

router = APIRouter(prefix="/api/weather", tags=["Weather Intelligence"])

@router.get("")
async def get_weather(lat: float = 16.3067, lon: float = 80.4365):
    weather_data = await fetch_live_weather(lat, lon)
    return weather_data

@router.get("/alerts")
async def get_weather_alerts(lat: float = 16.3067, lon: float = 80.4365):
    weather_data = await fetch_live_weather(lat, lon)
    return {
        "success": True,
        "alerts": weather_data.get("alerts", [])
    }
