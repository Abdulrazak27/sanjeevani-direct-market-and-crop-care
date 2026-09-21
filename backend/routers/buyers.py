from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database.db import get_db
from database.models import BuyerProfile, AuditLog

router = APIRouter(prefix="/api/buyers", tags=["Buyers"])

class BuyerCreateRequest(BaseModel):
    company_name: str
    rep_name: str
    phone: str
    email: Optional[str] = None
    location: Optional[str] = "Guntur Industrial Estate"
    district: Optional[str] = "Guntur"
    state: Optional[str] = "Andhra Pradesh"
    buyer_type: Optional[str] = "Processor"
    interested_crops: Optional[List[str]] = ["Tomato", "Chilli"]
    price_offered_qtl: Optional[float] = 2850.0
    min_qty_tons: Optional[float] = 5.0
    kyc_doc_name: Optional[str] = "GSTIN_KYC_DOC.pdf"

class BuyerStatusUpdateRequest(BaseModel):
    kyc_status: Optional[str] = None # Pending, Under Review, Verified, Rejected
    account_status: Optional[str] = None # Active, Suspended
    admin_name: Optional[str] = "Hitaishi Admin"

@router.get("")
def list_buyers(
    status: Optional[str] = None,
    buyer_type: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(BuyerProfile)
    if status:
        query = query.filter(BuyerProfile.kyc_status == status)
    if buyer_type:
        query = query.filter(BuyerProfile.buyer_type == buyer_type)
    if search:
        query = query.filter(
            (BuyerProfile.company_name.ilike(f"%{search}%")) |
            (BuyerProfile.rep_name.ilike(f"%{search}%")) |
            (BuyerProfile.phone.ilike(f"%{search}%"))
        )
    return query.order_by(BuyerProfile.created_at.desc()).all()

@router.get("/{buyer_id}")
def get_buyer_detail(buyer_id: str, db: Session = Depends(get_db)):
    buyer = db.query(BuyerProfile).filter(BuyerProfile.id == buyer_id).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    return buyer

@router.post("")
def create_buyer(req: BuyerCreateRequest, db: Session = Depends(get_db)):
    new_buyer = BuyerProfile(
        company_name=req.company_name,
        rep_name=req.rep_name,
        phone=req.phone,
        email=req.email,
        location=req.location,
        district=req.district,
        state=req.state,
        buyer_type=req.buyer_type,
        interested_crops=req.interested_crops,
        price_offered_qtl=req.price_offered_qtl,
        min_qty_tons=req.min_qty_tons,
        kyc_status="Pending",
        account_status="Active",
        kyc_doc_name=req.kyc_doc_name
    )
    db.add(new_buyer)

    audit = AuditLog(
        action=f"Registered New Buyer: {req.company_name}",
        user_name=req.rep_name,
        role="BUYER",
        entity="Buyer",
        entity_id=new_buyer.id,
        status="SUCCESS",
        details=f"Type: {req.buyer_type} | Offered Rate: ₹{req.price_offered_qtl}/Qtl | Doc: {req.kyc_doc_name}"
    )
    db.add(audit)

    db.commit()
    db.refresh(new_buyer)
    return new_buyer

@router.patch("/{buyer_id}/status")
def update_buyer_status(buyer_id: str, req: BuyerStatusUpdateRequest, db: Session = Depends(get_db)):
    buyer = db.query(BuyerProfile).filter(BuyerProfile.id == buyer_id).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    
    if req.kyc_status:
        buyer.kyc_status = req.kyc_status
    if req.account_status:
        buyer.account_status = req.account_status

    audit = AuditLog(
        action=f"Verified Buyer KYC: {buyer.company_name} -> {buyer.kyc_status}",
        user_name=req.admin_name or "Hitaishi Admin",
        role="MASTER_ADMIN",
        entity="Buyer",
        entity_id=buyer.id,
        status="SUCCESS",
        details=f"KYC Verification updated to {buyer.kyc_status}"
    )
    db.add(audit)

    db.commit()
    db.refresh(buyer)
    return {
        "success": True,
        "message": f"Buyer {buyer.company_name} status updated to {buyer.kyc_status}",
        "buyer": buyer
    }
