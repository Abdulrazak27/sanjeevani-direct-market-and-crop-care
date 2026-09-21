from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/farmers", tags=["Farmer Profile"])

class ProfileModel(BaseModel):
    full_name: str
    phone_number: str
    village: str
    district: str
    state: str
    main_crop: str
    farm_size_acres: float
    language: str = "te"
    profile_photo_url: Optional[str] = None

# Mock in-memory profile store for active session
CURRENT_FARMER_PROFILE = {
    "full_name": "Ramesh Kumar",
    "phone_number": "+91 9876543210",
    "village": "Tadikonda",
    "district": "Guntur",
    "state": "Andhra Pradesh",
    "main_crop": "Tomato",
    "farm_size_acres": 3.5,
    "language": "te",
    "profile_photo_url": None
}

@router.get("/profile")
async def get_farmer_profile():
    return {
        "success": True,
        "profile": CURRENT_FARMER_PROFILE
    }

@router.post("/profile")
async def update_farmer_profile(profile: ProfileModel):
    global CURRENT_FARMER_PROFILE
    CURRENT_FARMER_PROFILE.update(profile.model_dump())
    return {
        "success": True,
        "message": "Farmer profile updated successfully.",
        "profile": CURRENT_FARMER_PROFILE
    }
