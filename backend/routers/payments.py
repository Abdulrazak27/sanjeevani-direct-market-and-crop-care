from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import func
from database.db import get_db
from database.models import PaymentTransaction, AuditLog

router = APIRouter(prefix="/api/payments", tags=["Payments & Revenue"])

class PaymentCreateRequest(BaseModel):
    agreement_id: Optional[str] = None
    payer_name: str
    payee_name: str
    amount: float
    payment_method: Optional[str] = "NEFT Direct Bank"
    status: Optional[str] = "Success" # Success, Pending, Failed
    reference_number: Optional[str] = None
    admin_name: Optional[str] = "Hitaishi Admin"

@router.get("")
def list_payments(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(PaymentTransaction)
    if status:
        query = query.filter(PaymentTransaction.status == status)
    return query.order_by(PaymentTransaction.created_at.desc()).all()

@router.get("/summary")
def get_payment_summary(db: Session = Depends(get_db)):
    total_revenue = db.query(func.sum(PaymentTransaction.amount)).filter(PaymentTransaction.status == "Success").scalar() or 0.0
    total_txns = db.query(PaymentTransaction).count()
    success_txns = db.query(PaymentTransaction).filter(PaymentTransaction.status == "Success").count()
    pending_txns = db.query(PaymentTransaction).filter(PaymentTransaction.status == "Pending").count()
    failed_txns = db.query(PaymentTransaction).filter(PaymentTransaction.status == "Failed").count()

    return {
        "total_revenue": total_revenue,
        "total_transactions": total_txns,
        "successful_transactions": success_txns,
        "pending_transactions": pending_txns,
        "failed_transactions": failed_txns
    }

@router.post("")
def record_payment(req: PaymentCreateRequest, db: Session = Depends(get_db)):
    count = db.query(PaymentTransaction).count()
    code = f"TXN-2026-{count+901:04d}"

    txn = PaymentTransaction(
        txn_code=code,
        agreement_id=req.agreement_id,
        payer_name=req.payer_name,
        payee_name=req.payee_name,
        amount=req.amount,
        payment_method=req.payment_method,
        status=req.status or "Success",
        reference_number=req.reference_number or f"REF_{count+1000}"
    )
    db.add(txn)

    audit = AuditLog(
        action=f"Recorded Payment {code}: ₹{req.amount:,.2f} from {req.payer_name} to {req.payee_name}",
        user_name=req.admin_name or "Hitaishi Admin",
        role="MASTER_ADMIN",
        entity="Payment",
        entity_id=txn.id,
        status="SUCCESS",
        details=f"Method: {req.payment_method} | Status: {req.status}"
    )
    db.add(audit)

    db.commit()
    db.refresh(txn)
    return txn
