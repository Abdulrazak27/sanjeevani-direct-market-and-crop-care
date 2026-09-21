from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from database.db import get_db
from database.models import AuditLog

router = APIRouter(prefix="/api/audit-logs", tags=["Audit & Activity Logs"])

@router.get("")
def list_audit_logs(limit: int = 50, entity: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(AuditLog)
    if entity:
        query = query.filter(AuditLog.entity == entity)
    return query.order_by(AuditLog.timestamp.desc()).limit(limit).all()
