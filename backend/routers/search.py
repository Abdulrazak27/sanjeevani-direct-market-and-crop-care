from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import FarmerProfile, BuyerProfile, Crop, ColdStorageFacility, Agreement, PaymentTransaction

router = APIRouter(prefix="/api/search", tags=["Global Search"])

@router.get("")
def search_global(q: str, db: Session = Depends(get_db)):
    if not q or len(q.strip()) < 2:
        return {"results": []}

    query_str = f"%{q.strip()}%"
    results = []

    # 1. Search Farmers
    farmers = db.query(FarmerProfile).filter(
        (FarmerProfile.full_name.ilike(query_str)) |
        (FarmerProfile.phone.ilike(query_str)) |
        (FarmerProfile.main_crop.ilike(query_str)) |
        (FarmerProfile.village.ilike(query_str))
    ).limit(5).all()

    for f in farmers:
        results.append({
            "entity": "Farmer",
            "id": f.id,
            "title": f.full_name,
            "subtitle": f"{f.village}, {f.district} • {f.main_crop} ({f.farm_size_acres} Acres)",
            "status": f.kyc_status,
            "route_module": "farmers"
        })

    # 2. Search Buyers
    buyers = db.query(BuyerProfile).filter(
        (BuyerProfile.company_name.ilike(query_str)) |
        (BuyerProfile.rep_name.ilike(query_str)) |
        (BuyerProfile.phone.ilike(query_str)) |
        (BuyerProfile.location.ilike(query_str))
    ).limit(5).all()

    for b in buyers:
        results.append({
            "entity": "Buyer",
            "id": b.id,
            "title": b.company_name,
            "subtitle": f"Rep: {b.rep_name} • {b.buyer_type} ({b.district})",
            "status": b.kyc_status,
            "route_module": "buyers"
        })

    # 3. Search Crops
    crops = db.query(Crop).filter(
        (Crop.name.ilike(query_str)) |
        (Crop.category.ilike(query_str)) |
        (Crop.mandi_name.ilike(query_str))
    ).limit(5).all()

    for c in crops:
        results.append({
            "entity": "Crop",
            "id": c.id,
            "title": c.name,
            "subtitle": f"₹{c.current_mandi_price}/Qtl at {c.mandi_name}",
            "status": c.harvest_status,
            "route_module": "crops"
        })

    # 4. Search Cold Storage
    storages = db.query(ColdStorageFacility).filter(
        (ColdStorageFacility.facility_name.ilike(query_str)) |
        (ColdStorageFacility.location.ilike(query_str)) |
        (ColdStorageFacility.operator_name.ilike(query_str))
    ).limit(5).all()

    for s in storages:
        results.append({
            "entity": "Cold Storage",
            "id": s.id,
            "title": s.facility_name,
            "subtitle": f"{s.location} • Available: {s.available_capacity_mt}/{s.total_capacity_mt} MT",
            "status": s.maintenance_status,
            "route_module": "storage"
        })

    # 5. Search Agreements
    agreements = db.query(Agreement).filter(
        (Agreement.agreement_code.ilike(query_str)) |
        (Agreement.farmer_name.ilike(query_str)) |
        (Agreement.buyer_name.ilike(query_str)) |
        (Agreement.crop_name.ilike(query_str))
    ).limit(5).all()

    for a in agreements:
        results.append({
            "entity": "Agreement",
            "id": a.id,
            "title": a.agreement_code,
            "subtitle": f"{a.farmer_name} ↔ {a.buyer_name} (₹{a.total_value:,.2f})",
            "status": a.status,
            "route_module": "agreements"
        })

    return {"results": results}
