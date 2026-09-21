from fastapi import APIRouter

router = APIRouter(prefix="/api/notifications", tags=["Notification Center"])

NOTIFICATIONS = [
    {
        "id": "n1",
        "type": "weather",
        "title": "??? Rain Alert Expected Today",
        "title_te": "??? ????? ????? ????????",
        "title_hi": "??? ?? ????? ?? ???????",
        "message": "65% rain probability today. Hold off on irrigation.",
        "time": "10 mins ago",
        "is_read": False,
        "target_screen": "home"
    },
    {
        "id": "n2",
        "type": "market",
        "title": "?? Tomato Prices Up +5.2%",
        "title_te": "?? ????? ???? +5.2% ????????",
        "title_hi": "?? ????? ?? ??? +5.2% ????",
        "message": "Current rate in Guntur Market is ?2,800/quintal.",
        "time": "1 hour ago",
        "is_read": False,
        "target_screen": "market"
    },
    {
        "id": "n3",
        "type": "worker",
        "title": "?? Worker Booking Confirmed",
        "title_te": "?? ????? ??????? ????????",
        "title_hi": "?? ????? ?????? ?? ?????? ???",
        "message": "4 workers confirmed for Harvesting on 2026-09-20.",
        "time": "3 hours ago",
        "is_read": True,
        "target_screen": "work"
    }
]

@router.get("")
async def get_notifications():
    return {
        "success": True,
        "notifications": NOTIFICATIONS
    }
