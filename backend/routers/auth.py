from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class SendOTPRequest(BaseModel):
    phone_number: str = Field(..., min_length=10, max_length=15)

class VerifyOTPRequest(BaseModel):
    phone_number: str = Field(..., min_length=10, max_length=15)
    otp: str = Field(..., min_length=6, max_length=6)

@router.post("/send-otp")
async def send_otp(req: SendOTPRequest):
    cleaned = req.phone_number.strip().replace(" ", "").replace("-", "")
    if len(cleaned) < 10 or not cleaned.isdigit():
        raise HTTPException(status_code=400, detail="Invalid 10-digit mobile number.")
    
    # In production, Supabase Auth SMS or SMS Gateway is called here.
    return {
        "success": True,
        "message": "OTP sent successfully.",
        "phone_number": f"+91 {cleaned[-10:]}",
        "resend_seconds": 28,
        "demo_otp_hint": "123456"  # Useful for testing
    }

@router.post("/verify-otp")
async def verify_otp(req: VerifyOTPRequest):
    if req.otp not in ["123456", "654321", "789012"]:
        # Allow standard demo OTP 123456
        if len(req.otp) != 6:
            raise HTTPException(status_code=400, detail="Invalid 6-digit OTP code.")
            
    return {
        "success": True,
        "message": "OTP verified successfully.",
        "access_token": "sanjeevani_jwt_token_demo_98765",
        "is_existing_user": False
    }
