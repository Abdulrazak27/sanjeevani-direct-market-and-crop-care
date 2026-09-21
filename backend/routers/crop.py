from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, List, Dict, Any
from ai.model_pipeline import run_wpf_ai_inference
import datetime

router = APIRouter(prefix="/api/crop", tags=["Crop AI & Diagnosis"])

# In-memory history cache
DIAGNOSIS_HISTORY: List[Dict[str, Any]] = [
    {
        "id": "diag_001",
        "crop": "Tomato",
        "condition": "Early Blight (Alternaria solani)",
        "confidence": 0.92,
        "severity": "moderate",
        "date": "2026-09-18 10:30 AM",
        "image_preview": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80"
    }
]

@router.post("/identify")
async def identify_crop_disease(
    image: UploadFile = File(...),
    crop_hint: Optional[str] = Form(None)
):
    """
    Core AI crop identification & disease detection endpoint.
    Processes uploaded file via WPF Computer Vision Pipeline.
    """
    contents = await image.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")
        
    result = run_wpf_ai_inference(contents, crop_hint)
    
    if result.get("success"):
        # Log to history
        new_entry = {
            "id": f"diag_{len(DIAGNOSIS_HISTORY)+1:03d}",
            "crop": result.get("crop"),
            "condition": result.get("condition"),
            "confidence": result.get("confidence"),
            "severity": result.get("severity"),
            "date": datetime.datetime.now().strftime("%Y-%m-%d %I:%M %p")
        }
        DIAGNOSIS_HISTORY.insert(0, new_entry)
        
    return result

@router.get("/diagnosis")
async def get_diagnosis_history():
    return {
        "success": True,
        "history": DIAGNOSIS_HISTORY
    }
