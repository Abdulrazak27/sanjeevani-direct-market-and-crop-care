import datetime
import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database.db import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    email = Column(String(100), unique=True, index=True, nullable=True)
    full_name = Column(String(100), nullable=False)
    role = Column(String(30), default="FARMER", index=True) # MASTER_ADMIN, ADMIN, FARMER, BUYER, COLD_STORAGE, TRANSPORT
    account_status = Column(String(20), default="Active") # Active, Suspended, Deactivated
    verification_status = Column(String(20), default="Pending") # Verified, Pending, Rejected
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_login = Column(DateTime, default=datetime.datetime.utcnow)

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    full_name = Column(String(100), nullable=False, index=True)
    phone = Column(String(20), nullable=False, index=True)
    village = Column(String(100), default="Tadikonda")
    district = Column(String(100), default="Guntur", index=True)
    state = Column(String(100), default="Andhra Pradesh")
    main_crop = Column(String(100), default="Tomato", index=True)
    farm_size_acres = Column(Float, default=3.5)
    soil_type = Column(String(50), default="Red Sandy Loam")
    kyc_status = Column(String(20), default="Verified", index=True) # Pending, Verified, Rejected
    account_status = Column(String(20), default="Active") # Active, Suspended
    profile_photo_url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BuyerProfile(Base):
    __tablename__ = "buyer_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    company_name = Column(String(150), nullable=False, index=True)
    rep_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False, index=True)
    email = Column(String(100), nullable=True)
    location = Column(String(150), default="Guntur Industrial Estate")
    district = Column(String(100), default="Guntur", index=True)
    state = Column(String(100), default="Andhra Pradesh")
    buyer_type = Column(String(50), default="Processor") # Processor, Exporter, Wholesaler, Trader
    interested_crops = Column(JSON, default=list) # ["Tomato", "Chilli"]
    price_offered_qtl = Column(Float, default=2850.0)
    min_qty_tons = Column(Float, default=5.0)
    kyc_status = Column(String(20), default="Verified", index=True) # Pending, Under Review, Verified, Rejected
    account_status = Column(String(20), default="Active") # Active, Suspended
    kyc_doc_name = Column(String(150), default="GSTIN_37AABCU9603R1ZM.pdf")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Crop(Base):
    __tablename__ = "crops"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False, index=True)
    name_te = Column(String(100), nullable=True)
    name_hi = Column(String(100), nullable=True)
    category = Column(String(50), default="Vegetables") # Vegetables, Spices, Commercial, Grains
    variety = Column(String(100), default="Hybrid Prime")
    season = Column(String(50), default="Kharif") # Kharif, Rabi, Zaid
    harvest_status = Column(String(50), default="Optimal Harvest")
    expected_price_qtl = Column(Float, default=2800.0)
    current_mandi_price = Column(Float, default=2800.0)
    mandi_name = Column(String(100), default="Guntur Mandi")
    unit = Column(String(30), default="₹/Quintal")
    change_pct = Column(Float, default=5.2)
    trend = Column(String(10), default="up") # up, down
    image_url = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

class ColdStorageFacility(Base):
    __tablename__ = "cold_storage_facilities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    facility_name = Column(String(150), nullable=False, index=True)
    operator_name = Column(String(100), default="Sri Lakshmi Logistics")
    phone = Column(String(20), default="+91 98480 33441")
    location = Column(String(150), default="Guntur Bypass Road")
    district = Column(String(100), default="Guntur", index=True)
    state = Column(String(100), default="Andhra Pradesh")
    total_capacity_mt = Column(Float, default=500.0)
    occupied_capacity_mt = Column(Float, default=380.0)
    available_capacity_mt = Column(Float, default=120.0)
    daily_rate_qtl = Column(Float, default=12.0)
    temperature_c = Column(Float, default=3.5)
    humidity_pct = Column(Float, default=88.0)
    supported_crops = Column(JSON, default=list) # ["Tomato", "Chilli", "Turmeric"]
    maintenance_status = Column(String(30), default="Optimal") # Optimal, Maintenance Required
    account_status = Column(String(20), default="Active")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class StorageBooking(Base):
    __tablename__ = "storage_bookings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    facility_id = Column(String(36), ForeignKey("cold_storage_facilities.id"), nullable=True)
    facility_name = Column(String(150), nullable=False)
    farmer_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    crop_name = Column(String(100), nullable=False)
    batch_size_mt = Column(Float, default=10.0)
    entry_date = Column(String(30), default="2026-09-18")
    expiry_date = Column(String(30), default="2026-11-18")
    status = Column(String(20), default="Active") # Active, Expired, Released
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Agreement(Base):
    __tablename__ = "agreements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    agreement_code = Column(String(50), unique=True, index=True)
    farmer_id = Column(String(36), nullable=True)
    farmer_name = Column(String(100), nullable=False)
    buyer_id = Column(String(36), nullable=True)
    buyer_name = Column(String(150), nullable=False)
    storage_id = Column(String(36), nullable=True)
    storage_name = Column(String(150), nullable=True)
    crop_name = Column(String(100), nullable=False)
    quantity_qtl = Column(Float, default=100.0)
    agreed_price_qtl = Column(Float, default=2850.0)
    total_value = Column(Float, default=285000.0)
    start_date = Column(String(30), default="2026-09-15")
    end_date = Column(String(30), default="2026-10-15")
    status = Column(String(30), default="Active", index=True) # Draft, Active, Expiring Soon, Completed, Cancelled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    txn_code = Column(String(50), unique=True, index=True)
    agreement_id = Column(String(36), nullable=True)
    payer_name = Column(String(150), nullable=False)
    payee_name = Column(String(150), nullable=False)
    amount = Column(Float, default=50000.0)
    payment_method = Column(String(50), default="Bank Transfer (NEFT/RTGS)")
    status = Column(String(20), default="Success", index=True) # Success, Pending, Failed
    reference_number = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class WorkerTeam(Base):
    __tablename__ = "worker_teams"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    work_type = Column(String(100), nullable=False)
    work_type_te = Column(String(100), nullable=True)
    work_type_hi = Column(String(100), nullable=True)
    workers_count = Column(Integer, default=8)
    rate_per_day = Column(Float, default=500.0)
    status = Column(String(20), default="Available") # Available, Limited, Unavailable
    coordinator_name = Column(String(100), default="Srinivas Rao")
    coordinator_phone = Column(String(20), default="+91 9876543210")
    description = Column(Text, nullable=True)

class WorkerRequest(Base):
    __tablename__ = "worker_requests"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    farmer_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    work_type = Column(String(100), nullable=False)
    workers_needed = Column(Integer, default=6)
    date = Column(String(50), default="Tomorrow")
    location = Column(String(150), default="Tadikonda, Guntur")
    status = Column(String(30), default="Requested", index=True) # Requested, Assigned, In Progress, Completed, Cancelled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    action = Column(String(150), nullable=False, index=True)
    user_name = Column(String(100), default="Admin")
    role = Column(String(50), default="MASTER_ADMIN")
    entity = Column(String(50), nullable=True) # Farmer, Buyer, Crop, Storage, Agreement
    entity_id = Column(String(50), nullable=True)
    status = Column(String(20), default="SUCCESS") # SUCCESS, FAILED, WARNING
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

class CMSContent(Base):
    __tablename__ = "cms_content"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    key = Column(String(50), unique=True, index=True)
    title = Column(String(200), nullable=False)
    subtitle = Column(Text, nullable=True)
    banner_url = Column(Text, nullable=True)
    notice_text = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

class PlatformSetting(Base):
    __tablename__ = "platform_settings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    setting_key = Column(String(100), unique=True, index=True)
    setting_value = Column(Text, nullable=False)
    category = Column(String(50), default="General")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
