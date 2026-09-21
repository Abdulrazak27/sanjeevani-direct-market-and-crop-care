from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import datetime
from database.db import get_db
from database.models import User, PlatformSetting, AuditLog

router = APIRouter(prefix="/api/settings", tags=["Settings & Users"])

class UserCreateRequest(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    full_name: str
    role: str = "ADMIN" # MASTER_ADMIN, ADMIN, FARMER, BUYER
    account_status: str = "Active"
    admin_name: Optional[str] = "Hitaishi Admin"

@router.get("/users")
def list_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()

@router.post("/users")
def create_user(req: UserCreateRequest, db: Session = Depends(get_db)):
    new_user = User(
        phone=req.phone,
        email=req.email,
        full_name=req.full_name,
        role=req.role,
        account_status=req.account_status,
        verification_status="Verified"
    )
    db.add(new_user)

    audit = AuditLog(
        action=f"Created New System User: {req.full_name} ({req.role})",
        user_name=req.admin_name or "Hitaishi Admin",
        role="MASTER_ADMIN",
        entity="User",
        entity_id=new_user.id,
        status="SUCCESS",
        details=f"Email: {req.email} | Phone: {req.phone}"
    )
    db.add(audit)

    db.commit()
    db.refresh(new_user)
    return new_user
