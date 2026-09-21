from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import datetime
from database.db import get_db
from database.models import Agreement, AuditLog

router = APIRouter(prefix="/api/agreements", tags=["Agreements & Contracts"])

class AgreementCreateRequest(BaseModel):
    farmer_id: Optional[str] = None
    farmer_name: str
    buyer_id: Optional[str] = None
    buyer_name: str
    storage_id: Optional[str] = None
    storage_name: Optional[str] = None
    crop_name: str
    quantity_qtl: float
    agreed_price_qtl: float
    start_date: Optional[str] = "2026-09-20"
    end_date: Optional[str] = "2026-10-20"
    status: Optional[str] = "Active" # Draft, Active, Expiring Soon, Completed, Cancelled
    admin_name: Optional[str] = "Hitaishi Admin"

class AgreementStatusUpdateRequest(BaseModel):
    status: str
    admin_name: Optional[str] = "Hitaishi Admin"

@router.get("")
def list_agreements(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Agreement)
    if status:
        query = query.filter(Agreement.status == status)
    return query.order_by(Agreement.created_at.desc()).all()

@router.get("/{agreement_id}")
def get_agreement_detail(agreement_id: str, db: Session = Depends(get_db)):
    agr = db.query(Agreement).filter(Agreement.id == agreement_id).first()
    if not agr:
        raise HTTPException(status_code=404, detail="Agreement not found")
    return agr

@router.post("")
def create_agreement(req: AgreementCreateRequest, db: Session = Depends(get_db)):
    count = db.query(Agreement).count()
    code = f"AGR-2026-{count+101:03d}"
    total = req.quantity_qtl * req.agreed_price_qtl

    agreement = Agreement(
        agreement_code=code,
        farmer_id=req.farmer_id,
        farmer_name=req.farmer_name,
        buyer_id=req.buyer_id,
        buyer_name=req.buyer_name,
        storage_id=req.storage_id,
        storage_name=req.storage_name,
        crop_name=req.crop_name,
        quantity_qtl=req.quantity_qtl,
        agreed_price_qtl=req.agreed_price_qtl,
        total_value=total,
        start_date=req.start_date,
        end_date=req.end_date,
        status=req.status or "Active"
    )
    db.add(agreement)

    audit = AuditLog(
        action=f"Created Agreement {code}: {req.farmer_name} ↔ {req.buyer_name}",
        user_name=req.admin_name or "Hitaishi Admin",
        role="MASTER_ADMIN",
        entity="Agreement",
        entity_id=agreement.id,
        status="SUCCESS",
        details=f"Crop: {req.crop_name} | Qty: {req.quantity_qtl} Qtl | Value: ₹{total:,.2f}"
    )
    db.add(audit)

    db.commit()
    db.refresh(agreement)
    return agreement

@router.patch("/{agreement_id}/status")
def update_agreement_status(agreement_id: str, req: AgreementStatusUpdateRequest, db: Session = Depends(get_db)):
    agr = db.query(Agreement).filter(Agreement.id == agreement_id).first()
    if not agr:
        raise HTTPException(status_code=404, detail="Agreement not found")
    
    agr.status = req.status

    audit = AuditLog(
        action=f"Updated Agreement Status {agr.agreement_code} -> {req.status}",
        user_name=req.admin_name or "Hitaishi Admin",
        role="MASTER_ADMIN",
        entity="Agreement",
        entity_id=agr.id,
        status="SUCCESS",
        details=f"Status set to {req.status}"
    )
    db.add(audit)

    db.commit()
    db.refresh(agr)
    return agr
