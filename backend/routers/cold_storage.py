from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database.db import get_db
from database.models import ColdStorageFacility, StorageBooking, AuditLog

router = APIRouter(prefix="/api/cold-storage", tags=["Cold Storage"])

class StorageFacilityCreateUpdateRequest(BaseModel):
    facility_name: str
    operator_name: Optional[str] = "Sri Lakshmi Logistics"
    phone: Optional[str] = "+91 98480 33441"
    location: Optional[str] = "Guntur Bypass Road"
    district: Optional[str] = "Guntur"
    state: Optional[str] = "Andhra Pradesh"
    total_capacity_mt: Optional[float] = 500.0
    occupied_capacity_mt: Optional[float] = 380.0
    daily_rate_qtl: Optional[float] = 12.0
    temperature_c: Optional[float] = 3.5
    humidity_pct: Optional[float] = 88.0
    supported_crops: Optional[List[str]] = ["Tomato", "Chilli"]
    maintenance_status: Optional[str] = "Optimal"
    admin_name: Optional[str] = "Hitaishi Admin"

class StorageBookingRequest(BaseModel):
    facility_id: str
    farmer_name: str
    phone: str
    crop_name: str
    batch_size_mt: float
    duration_days: Optional[int] = 30

@router.get("")
def list_facilities(district: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(ColdStorageFacility)
    if district:
        query = query.filter(ColdStorageFacility.district == district)
    return query.all()

@router.get("/{facility_id}")
def get_facility_detail(facility_id: str, db: Session = Depends(get_db)):
    facility = db.query(ColdStorageFacility).filter(ColdStorageFacility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility

@router.post("")
def add_facility(req: StorageFacilityCreateUpdateRequest, db: Session = Depends(get_db)):
    avail = max(0.0, req.total_capacity_mt - req.occupied_capacity_mt)
    facility = ColdStorageFacility(
        facility_name=req.facility_name,
        operator_name=req.operator_name,
        phone=req.phone,
        location=req.location,
        district=req.district,
        state=req.state,
        total_capacity_mt=req.total_capacity_mt,
        occupied_capacity_mt=req.occupied_capacity_mt,
        available_capacity_mt=avail,
        daily_rate_qtl=req.daily_rate_qtl,
        temperature_c=req.temperature_c,
        humidity_pct=req.humidity_pct,
        supported_crops=req.supported_crops,
        maintenance_status=req.maintenance_status,
        account_status="Active"
    )
    db.add(facility)

    audit = AuditLog(
        action=f"Registered Cold Storage Facility: {req.facility_name}",
        user_name=req.admin_name or "Hitaishi Admin",
        role="MASTER_ADMIN",
        entity="Cold Storage",
        entity_id=facility.id,
        status="SUCCESS",
        details=f"Capacity: {req.total_capacity_mt} MT | Location: {req.location}"
    )
    db.add(audit)

    db.commit()
    db.refresh(facility)
    return facility

@router.post("/book")
def book_storage_space(req: StorageBookingRequest, db: Session = Depends(get_db)):
    facility = db.query(ColdStorageFacility).filter(ColdStorageFacility.id == req.facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    if facility.available_capacity_mt < req.batch_size_mt:
        raise HTTPException(status_code=400, detail="Requested capacity exceeds available space.")
    
    # Update facility capacity
    facility.occupied_capacity_mt += req.batch_size_mt
    facility.available_capacity_mt = max(0.0, facility.total_capacity_mt - facility.occupied_capacity_mt)

    booking = StorageBooking(
        facility_id=facility.id,
        facility_name=facility.facility_name,
        farmer_name=req.farmer_name,
        phone=req.phone,
        crop_name=req.crop_name,
        batch_size_mt=req.batch_size_mt,
        daily_rate_qtl=facility.daily_rate_qtl,
        status="Active"
    )
    db.add(booking)

    audit = AuditLog(
        action=f"Booked Cold Storage Space: {req.farmer_name} at {facility.facility_name}",
        user_name=req.farmer_name,
        role="FARMER",
        entity="Cold Storage",
        entity_id=facility.id,
        status="SUCCESS",
        details=f"Quantity: {req.batch_size_mt} MT of {req.crop_name} reserved."
    )
    db.add(audit)

    db.commit()
    db.refresh(booking)
    return {
        "success": True,
        "message": "Storage space booked successfully!",
        "booking": booking,
        "updated_facility": facility
    }
