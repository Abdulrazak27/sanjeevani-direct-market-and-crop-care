from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/transport", tags=["Logistics & Transport"])

class TransportBookingRequest(BaseModel):
    produce_type: str
    quantity_quintals: float
    pickup_location: str
    destination: str
    preferred_date: str
    vehicle_type: str

BOOKING_REQUESTS: List[dict] = [
    {
        "id": "tr_101",
        "produce_type": "Tomato",
        "quantity_quintals": 20.0,
        "pickup_location": "Tadikonda Village",
        "destination": "Guntur Main Market",
        "preferred_date": "2026-09-20",
        "vehicle_type": "Mini Truck (2 Ton)",
        "estimated_cost": 1200,
        "status": "Confirmed",
        "driver_contact": "Demo Contact: +91 90000 44001"
    }
]

VEHICLES = [
    {
        "id": "v1",
        "vehicle_type": "Mini Truck (Bolero / Ace)",
        "capacity_tons": 2.0,
        "rate_per_km": 25,
        "estimated_base": 1200,
        "is_demo": True
    },
    {
        "id": "v2",
        "vehicle_type": "Medium LCV (Eicher 14 ft)",
        "capacity_tons": 5.0,
        "rate_per_km": 40,
        "estimated_base": 2400,
        "is_demo": True
    }
]

@router.get("/vehicles")
async def get_vehicles():
    return {"success": True, "vehicles": VEHICLES}

@router.get("/bookings")
async def get_bookings():
    return {"success": True, "bookings": BOOKING_REQUESTS}

@router.post("/request")
async def create_transport_request(req: TransportBookingRequest):
    new_req = req.model_dump()
    new_req["id"] = f"tr_{101 + len(BOOKING_REQUESTS)}"
    new_req["estimated_cost"] = int(req.quantity_quintals * 60)
    new_req["status"] = "Requested"
    new_req["driver_contact"] = "Assigning Driver..."
    BOOKING_REQUESTS.insert(0, new_req)
    return {"success": True, "message": "Transport booking request submitted.", "booking": new_req}
