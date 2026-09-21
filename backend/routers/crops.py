from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import datetime
from database.db import get_db
from database.models import Crop, AuditLog

router = APIRouter(prefix="/api/crops", tags=["Crops & Mandi Prices"])

class CropCreateUpdateRequest(BaseModel):
    name: str
    name_te: Optional[str] = None
    name_hi: Optional[str] = None
    category: Optional[str] = "Vegetables"
    variety: Optional[str] = "Standard Hybrid"
    season: Optional[str] = "Kharif"
    harvest_status: Optional[str] = "Harvest Ready"
    expected_price_qtl: Optional[float] = 2800.0
    current_mandi_price: Optional[float] = 2800.0
    mandi_name: Optional[str] = "Guntur Mandi"
    unit: Optional[str] = "₹/Quintal"
    change_pct: Optional[float] = 0.0
    trend: Optional[str] = "up"
    admin_name: Optional[str] = "Hitaishi Admin"

@router.get("")
def list_crops(category: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Crop)
    if category:
        query = query.filter(Crop.category == category)
    if search:
        query = query.filter(Crop.name.ilike(f"%{search}%"))
    return query.order_by(Crop.name.asc()).all()

@router.get("/{crop_id}")
def get_crop_detail(crop_id: str, db: Session = Depends(get_db)):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop

@router.post("")
def add_crop(req: CropCreateUpdateRequest, db: Session = Depends(get_db)):
    new_crop = Crop(
        name=req.name,
        name_te=req.name_te,
        name_hi=req.name_hi,
        category=req.category,
        variety=req.variety,
        season=req.season,
        harvest_status=req.harvest_status,
        expected_price_qtl=req.expected_price_qtl,
        current_mandi_price=req.current_mandi_price,
        mandi_name=req.mandi_name,
        unit=req.unit,
        change_pct=req.change_pct,
        trend=req.trend,
        updated_at=datetime.datetime.utcnow()
    )
    db.add(new_crop)

    audit = AuditLog(
        action=f"Added New Crop: {req.name}",
        user_name=req.admin_name or "Hitaishi Admin",
        role="MASTER_ADMIN",
        entity="Crop",
        entity_id=new_crop.id,
        status="SUCCESS",
        details=f"Rate: ₹{req.current_mandi_price}/Qtl at {req.mandi_name}"
    )
    db.add(audit)

    db.commit()
    db.refresh(new_crop)
    return new_crop

@router.put("/{crop_id}")
def update_crop(crop_id: str, req: CropCreateUpdateRequest, db: Session = Depends(get_db)):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    
    crop.name = req.name
    if req.name_te: crop.name_te = req.name_te
    if req.name_hi: crop.name_hi = req.name_hi
    if req.category: crop.category = req.category
    if req.variety: crop.variety = req.variety
    if req.season: crop.season = req.season
    if req.harvest_status: crop.harvest_status = req.harvest_status
    if req.expected_price_qtl: crop.expected_price_qtl = req.expected_price_qtl
    if req.current_mandi_price: 
        # Calculate price trend
        if req.current_mandi_price != crop.current_mandi_price:
            crop.trend = "up" if req.current_mandi_price > crop.current_mandi_price else "down"
            crop.change_pct = round(((req.current_mandi_price - crop.current_mandi_price) / crop.current_mandi_price) * 100, 1)
        crop.current_mandi_price = req.current_mandi_price
    if req.mandi_name: crop.mandi_name = req.mandi_name
    crop.updated_at = datetime.datetime.utcnow()

    audit = AuditLog(
        action=f"Updated Crop Details: {crop.name}",
        user_name=req.admin_name or "Hitaishi Admin",
        role="MASTER_ADMIN",
        entity="Crop",
        entity_id=crop.id,
        status="SUCCESS",
        details=f"Price: ₹{crop.current_mandi_price}/Qtl | Status: {crop.harvest_status}"
    )
    db.add(audit)

    db.commit()
    db.refresh(crop)
    return crop
