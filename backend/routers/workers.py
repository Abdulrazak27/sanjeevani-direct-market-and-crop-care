from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database.db import get_db
from database.models import WorkerTeam, WorkerRequest, AuditLog

router = APIRouter(prefix="/api/workers", tags=["Farm Workers"])

class WorkerRequestCreate(BaseModel):
    farmer_name: str
    phone: str
    work_type: str
    workers_needed: int
    date: Optional[str] = "Tomorrow"
    location: Optional[str] = "Tadikonda, Guntur"

class WorkerStatusUpdate(BaseModel):
    status: str # Requested, Assigned, In Progress, Completed, Cancelled
    admin_name: Optional[str] = "Srinivas Rao (Coordinator)"

@router.get("/teams")
def list_worker_teams(db: Session = Depends(get_db)):
    return db.query(WorkerTeam).all()

@router.get("/requests")
def list_worker_requests(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(WorkerRequest)
    if status:
        query = query.filter(WorkerRequest.status == status)
    return query.order_by(WorkerRequest.created_at.desc()).all()

@router.post("/requests")
def create_worker_request(req: WorkerRequestCreate, db: Session = Depends(get_db)):
    wreq = WorkerRequest(
        farmer_name=req.farmer_name,
        phone=req.phone,
        work_type=req.work_type,
        workers_needed=req.workers_needed,
        date=req.date,
        location=req.location,
        status="Requested"
    )
    db.add(wreq)

    audit = AuditLog(
        action=f"New Farm Worker Request: {req.farmer_name} requested {req.workers_needed} workers",
        user_name=req.farmer_name,
        role="FARMER",
        entity="Workers",
        entity_id=wreq.id,
        status="SUCCESS",
        details=f"Work: {req.work_type} | Date: {req.date} | Location: {req.location}"
    )
    db.add(audit)

    db.commit()
    db.refresh(wreq)
    return wreq

@router.patch("/requests/{request_id}/status")
def update_worker_request_status(request_id: str, req: WorkerStatusUpdate, db: Session = Depends(get_db)):
    wreq = db.query(WorkerRequest).filter(WorkerRequest.id == request_id).first()
    if not wreq:
        raise HTTPException(status_code=404, detail="Request not found")
    
    wreq.status = req.status

    audit = AuditLog(
        action=f"Updated Worker Request Status: {wreq.farmer_name} -> {req.status}",
        user_name=req.admin_name or "Srinivas Rao",
        role="MASTER_ADMIN",
        entity="Workers",
        entity_id=wreq.id,
        status="SUCCESS",
        details=f"Request status set to {req.status}"
    )
    db.add(audit)

    db.commit()
    db.refresh(wreq)
    return wreq
