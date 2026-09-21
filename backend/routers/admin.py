from fastapi import APIRouter

router = APIRouter(prefix="/api/admin", tags=["Admin & Model Metadata"])

@router.get("/model-metadata")
async def get_model_metadata():
    return {
        "success": True,
        "model_name": "Sanjeevani WPF Vision Classifier",
        "version": "v1.4-WPF-YOLOv8",
        "dataset": "WPF Plant Dataset (Plant Village Extended)",
        "supported_classes": [
            "Tomato - Healthy",
            "Tomato - Early Blight",
            "Tomato - Late Blight",
            "Cotton - Healthy",
            "Cotton - Bacterial Blight",
            "Chilli - Leaf Curl",
            "Maize - Fall Armyworm"
        ],
        "status": "Active / Deployed",
        "trained_date": "2026-08-15",
        "deployed_date": "2026-09-01",
        "framework": "PyTorch / OpenCV / FastAPI Inference"
    }
