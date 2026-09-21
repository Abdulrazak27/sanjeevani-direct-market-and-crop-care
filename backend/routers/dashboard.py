from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.db import get_db
from database.models import (
    FarmerProfile, BuyerProfile, ColdStorageFacility, Crop,
    Agreement, PaymentTransaction, AuditLog, WorkerRequest
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard Statistics"])

@router.get("/stats")
def get_dashboard_statistics(db: Session = Depends(get_db)):
    # 1. Farmers stats
    total_farmers = db.query(FarmerProfile).count()
    active_farmers = db.query(FarmerProfile).filter(FarmerProfile.kyc_status == "Verified").count()
    pending_farmers = db.query(FarmerProfile).filter(FarmerProfile.kyc_status == "Pending").count()
    suspended_farmers = db.query(FarmerProfile).filter(FarmerProfile.account_status == "Suspended").count()

    # 2. Buyers stats
    total_buyers = db.query(BuyerProfile).count()
    verified_buyers = db.query(BuyerProfile).filter(BuyerProfile.kyc_status == "Verified").count()
    pending_buyers = db.query(BuyerProfile).filter(BuyerProfile.kyc_status == "Pending").count()
    suspended_buyers = db.query(BuyerProfile).filter(BuyerProfile.account_status == "Suspended").count()

    # 3. Cold Storage stats
    total_facilities = db.query(ColdStorageFacility).count()
    active_facilities = db.query(ColdStorageFacility).filter(ColdStorageFacility.account_status == "Active").count()
    total_capacity = db.query(func.sum(ColdStorageFacility.total_capacity_mt)).scalar() or 0.0
    occupied_capacity = db.query(func.sum(ColdStorageFacility.occupied_capacity_mt)).scalar() or 0.0
    free_capacity = db.query(func.sum(ColdStorageFacility.available_capacity_mt)).scalar() or 0.0
    capacity_pct = round((occupied_capacity / total_capacity * 100), 1) if total_capacity > 0 else 0.0

    # 4. Crops stats
    total_crops = db.query(Crop).count()
    harvest_ready_crops = db.query(Crop).filter(Crop.harvest_status.ilike("%harvest%")).count()

    # 5. Agreements stats
    total_agreements = db.query(Agreement).count()
    active_agreements = db.query(Agreement).filter(Agreement.status == "Active").count()
    expiring_agreements = db.query(Agreement).filter(Agreement.status == "Expiring Soon").count()

    # 6. Revenue & Payments stats
    total_revenue = db.query(func.sum(PaymentTransaction.amount)).filter(PaymentTransaction.status == "Success").scalar() or 0.0
    total_txns = db.query(PaymentTransaction).count()
    success_txns = db.query(PaymentTransaction).filter(PaymentTransaction.status == "Success").count()
    pending_txns = db.query(PaymentTransaction).filter(PaymentTransaction.status == "Pending").count()

    # 7. Recent platform activities
    recent_activities = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(8).all()

    # 8. Dynamic operational alerts
    alerts = []
    if pending_buyers > 0:
        alerts.append({
            "id": "alt_buyer_kyc",
            "type": "kyc",
            "title": f"{pending_buyers} Buyer KYC Verification Pending",
            "severity": "high",
            "action": "Review in Buyers Section"
        })
    if pending_farmers > 0:
        alerts.append({
            "id": "alt_farmer_kyc",
            "type": "verification",
            "title": f"{pending_farmers} Farmer Profile Verifications Required",
            "severity": "medium",
            "action": "Review in Farmers Section"
        })
    if capacity_pct >= 75.0:
        alerts.append({
            "id": "alt_storage_cap",
            "type": "storage",
            "title": f"Cold Storage Capacity Alert: {capacity_pct}% Occupied",
            "severity": "warning",
            "action": "Inspect Storage Facilities"
        })
    if expiring_agreements > 0:
        alerts.append({
            "id": "alt_agr_expiring",
            "type": "agreements",
            "title": f"{expiring_agreements} Sale Agreements Expiring Soon",
            "severity": "medium",
            "action": "Check Agreements"
        })

    return {
        "farmers": {
            "total": total_farmers,
            "active": active_farmers,
            "pending": pending_farmers,
            "suspended": suspended_farmers
        },
        "buyers": {
            "total": total_buyers,
            "verified": verified_buyers,
            "pending": pending_buyers,
            "suspended": suspended_buyers
        },
        "cold_storage": {
            "total_facilities": total_facilities,
            "active_facilities": active_facilities,
            "total_capacity_mt": total_capacity,
            "used_capacity_mt": occupied_capacity,
            "free_capacity_mt": free_capacity,
            "usage_percentage": capacity_pct
        },
        "crops": {
            "total": total_crops,
            "harvest_ready": harvest_ready_crops
        },
        "agreements": {
            "total": total_agreements,
            "active": active_agreements,
            "expiring": expiring_agreements
        },
        "revenue": {
            "total_processed": total_revenue,
            "total_transactions": total_txns,
            "successful_transactions": success_txns,
            "pending_transactions": pending_txns
        },
        "alerts": alerts,
        "recent_activities": recent_activities
    }
