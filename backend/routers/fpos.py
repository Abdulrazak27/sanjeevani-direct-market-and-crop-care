from fastapi import APIRouter

router = APIRouter(prefix="/api/fpos", tags=["FPO Directory"])

FPOS_DATA = [
    {
        "id": "fpo_1",
        "name": "Amaravathi Farmers Producer Company Ltd",
        "location": "Tadikonda, Guntur District",
        "supported_crops": ["Tomato", "Chilli", "Maize"],
        "member_count": 850,
        "contact_phone": "Demo Contact: +91 90000 22001",
        "benefits": ["Bulk fertilizer discounts", "Direct export pool", "Free soil testing"],
        "verified": True,
        "is_demo": True
    },
    {
        "id": "fpo_2",
        "name": "Rayalaseema Horticulture FPO",
        "location": "Kurnool Rural",
        "supported_crops": ["Onion", "Groundnut", "Banana"],
        "member_count": 1200,
        "contact_phone": "Demo Contact: +91 90000 22002",
        "benefits": ["Guaranteed minimum support price", "Cold storage preference"],
        "verified": True,
        "is_demo": True
    }
]

@router.get("")
async def get_fpos():
    return {
        "success": True,
        "fpos": FPOS_DATA
    }
