from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
import datetime
from database.db import get_db
from database.models import CMSContent, AuditLog

router = APIRouter(prefix="/api/cms", tags=["Live Web CMS"])

class CMSUpdateRequest(BaseModel):
    title: str
    subtitle: Optional[str] = None
    banner_url: Optional[str] = None
    notice_text: Optional[str] = None
    is_active: Optional[bool] = True
    admin_name: Optional[str] = "Hitaishi Admin"

@router.get("")
def list_cms_content(db: Session = Depends(get_db)):
    return db.query(CMSContent).all()

@router.get("/{key}")
def get_cms_content(key: str, db: Session = Depends(get_db)):
    content = db.query(CMSContent).filter(CMSContent.key == key).first()
    if not content:
        raise HTTPException(status_code=404, detail="CMS content not found")
    return content

@router.put("/{key}")
def update_cms_content(key: str, req: CMSUpdateRequest, db: Session = Depends(get_db)):
    content = db.query(CMSContent).filter(CMSContent.key == key).first()
    if not content:
        content = CMSContent(key=key)
        db.add(content)
    
    content.title = req.title
    if req.subtitle is not None: content.subtitle = req.subtitle
    if req.banner_url is not None: content.banner_url = req.banner_url
    if req.notice_text is not None: content.notice_text = req.notice_text
    if req.is_active is not None: content.is_active = req.is_active
    content.updated_at = datetime.datetime.utcnow()

    audit = AuditLog(
        action=f"Updated Live Web CMS: [{key}] {req.title}",
        user_name=req.admin_name or "Hitaishi Admin",
        role="MASTER_ADMIN",
        entity="CMS",
        entity_id=key,
        status="SUCCESS",
        details=f"Live CMS notice/banner updated for public website."
    )
    db.add(audit)

    db.commit()
    db.refresh(content)
    return content
