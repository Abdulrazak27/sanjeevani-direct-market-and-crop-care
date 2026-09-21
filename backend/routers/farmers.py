from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import datetime
from database.db import get_db
from database.models import FarmerProfile, AuditLog

router = APIRouter(prefix="/api/farmers", tags=["Farmers"])

class FarmerCreateRequest(BaseModel):
    full_name: str
    phone: str
    village: Optional[str] = "Tadikonda"
    district: Optional[str] = "Guntur"
    state: Optional[str] = "Andhra Pradesh"
    main_crop: Optional[str] = "Tomato"
    farm_size_acres: Optional[float] = 3.5
    soil_type: Optional[str] = "Red Sandy Loam"
    profile_photo_url: Optional[str] = None

class FarmerStatusUpdateRequest(BaseModel):
    kyc_status: Optional[str] = None # Pending, Verified, Rejected
    account_status: Optional[str] = None # Active, Suspended
    admin_name: Optional[str] = "Hitaishi Admin"

@router.get("")
def list_farmers(
    status: Optional[str] = None,
    district: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(FarmerProfile)
    if status:
        query = query.filter(FarmerProfile.kyc_status == status)
    if district:
        query = query.filter(FarmerProfile.district == district)
    if search:
        query = query.filter(
            (FarmerProfile.full_name.ilike(f"%{search}%")) |
            (FarmerProfile.phone.ilike(f"%{search}%")) |
            (FarmerProfile.main_crop.ilike(f"%{search}%"))
        )
    return query.order_by(FarmerProfile.created_at.desc()).all()

@router.get("/{farmer_id}")
def get_farmer_detail(farmer_id: str, db: Session = Depends(get_db)):
    farmer = db.query(FarmerProfile).filter(FarmerProfile.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return farmer

@router.post("")
def create_farmer(req: FarmerCreateRequest, db: Session = Depends(get_db)):
    # Check if existing by phone
    existing = db.query(FarmerProfile).filter(FarmerProfile.phone == req.phone).first()
    if existing:
        existing.full_name = req.full_name
        existing.village = req.village
        existing.district = req.district
        existing.state = req.state
        existing.main_crop = req.main_crop
        existing.farm_size_acres = req.farm_size_acres
        if req.profile_photo_url:
            existing.profile_photo_url = req.profile_photo_url
        db.commit()
        db.refresh(existing)
        return existing

    new_farmer = FarmerProfile(
        full_name=req.full_name,
        phone=req.phone,
        village=req.village,
        district=req.district,
        state=req.state,
        main_crop=req.main_crop,
        farm_size_acres=req.farm_size_acres,
        soil_type=req.soil_type,
        kyc_status="Pending",
        account_status="Active",
        profile_photo_url=req.profile_photo_url
    )
    db.add(new_farmer)
    
    # Audit log
    audit = AuditLog(
        action=f"Registered New Farmer: {req.full_name}",
        user_name=req.full_name,
        role="FARMER",
        entity="Farmer",
        entity_id=new_farmer.id,
        status="SUCCESS",
        details=f"Location: {req.village}, {req.district} | Crop: {req.main_crop} ({req.farm_size_acres} Acres)"
    )
    db.add(audit)
    
    db.commit()
    db.refresh(new_farmer)
    return new_farmer

@router.patch("/{farmer_id}/status")
def update_farmer_status(farmer_id: str, req: FarmerStatusUpdateRequest, db: Session = Depends(get_db)):
    farmer = db.query(FarmerProfile).filter(FarmerProfile.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    
    if req.kyc_status:
        farmer.kyc_status = req.kyc_status
    if req.account_status:
        farmer.account_status = req.account_status

    # Log action
    audit = AuditLog(
        action=f"Updated Farmer Status: {farmer.full_name} -> {farmer.kyc_status}",
        user_name=req.admin_name or "Hitaishi Admin",
        role="MASTER_ADMIN",
        entity="Farmer",
        entity_id=farmer.id,
        status="SUCCESS",
        details=f"KYC Status: {farmer.kyc_status} | Account Status: {farmer.account_status}"
    )
    db.add(audit)

    db.commit()
    db.refresh(farmer)
    return {
        "success": True,
        "message": f"Farmer {farmer.full_name} status updated to {farmer.kyc_status}",
        "farmer": farmer
    }
