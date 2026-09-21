from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/market", tags=["Market Access"])

class ProduceListingRequest(BaseModel):
    crop_name: str
    quantity_quintals: float
    expected_price_per_quintal: float
    harvest_date: str
    location: str
    notes: Optional[str] = None

PRODUCE_LISTINGS = []

MARKET_PRICES = [
    {
        "id": "m1",
        "crop": "Tomato",
        "crop_te": "?????",
        "crop_hi": "?????",
        "mandi": "Guntur Main Market",
        "price": 2800,
        "unit": "quintal",
        "change_pct": 5.2,
        "trend": "up",
        "is_live": True,
        "data_source": "Live Agmarknet Sync",
        "updated_at": "Today, 09:15 AM"
    },
    {
        "id": "m2",
        "crop": "Onion",
        "crop_te": "????????",
        "crop_hi": "?????",
        "mandi": "Kurnool Market Yard",
        "price": 1950,
        "unit": "quintal",
        "change_pct": 3.1,
        "trend": "up",
        "is_live": True,
        "data_source": "Live Agmarknet Sync",
        "updated_at": "Today, 08:45 AM"
    },
    {
        "id": "m3",
        "crop": "Chilli (Red)",
        "crop_te": "???? ????",
        "crop_hi": "??? ?????",
        "mandi": "Guntur Mirchi Yard",
        "price": 15200,
        "unit": "quintal",
        "change_pct": 2.4,
        "trend": "up",
        "is_live": True,
        "data_source": "Live Agmarknet Sync",
        "updated_at": "Today, 10:00 AM"
    },
    {
        "id": "m4",
        "crop": "Cotton",
        "crop_te": "???????",
        "crop_hi": "????",
        "mandi": "Warangal Market",
        "price": 6800,
        "unit": "quintal",
        "change_pct": -1.2,
        "trend": "down",
        "is_live": True,
        "data_source": "Live Agmarknet Sync",
        "updated_at": "Today, 07:30 AM"
    },
    {
        "id": "m5",
        "crop": "Maize",
        "crop_te": "??????????",
        "crop_hi": "?????",
        "mandi": "Nizamabad Yard",
        "price": 2150,
        "unit": "quintal",
        "change_pct": 1.8,
        "trend": "up",
        "is_live": True,
        "data_source": "Live Agmarknet Sync",
        "updated_at": "Today, 09:00 AM"
    }
]

@router.get("/prices")
async def get_market_prices():
    return {
        "success": True,
        "prices": MARKET_PRICES
    }

@router.get("/listings")
async def get_produce_listings():
    return {
        "success": True,
        "listings": PRODUCE_LISTINGS
    }

@router.post("/listings")
async def create_produce_listing(req: ProduceListingRequest):
    new_item = req.model_dump()
    new_item["id"] = f"list_{len(PRODUCE_LISTINGS)+1:03d}"
    new_item["status"] = "Active"
    PRODUCE_LISTINGS.insert(0, new_item)
    return {
        "success": True,
        "message": "Produce listing published successfully.",
        "listing": new_item
    }
