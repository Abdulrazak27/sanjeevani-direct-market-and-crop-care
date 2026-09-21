import datetime
from database.db import SessionLocal, Base, engine
from database.models import (
    User, FarmerProfile, BuyerProfile, Crop, ColdStorageFacility,
    StorageBooking, Agreement, PaymentTransaction, WorkerTeam,
    WorkerRequest, AuditLog, CMSContent, PlatformSetting
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(FarmerProfile).first():
            print("Database already contains data. Skipping initial seeding.")
            return

        print("Seeding Sanjeevani relational database with production baseline data...")

        # 1. Admin Users
        admin_user = User(
            id="USR_ADMIN_01",
            phone="+91 99999 00000",
            email="admin@sanjeevani.com",
            full_name="Hitaishi Devarapalli",
            role="MASTER_ADMIN",
            account_status="Active",
            verification_status="Verified"
        )
        db.add(admin_user)

        # 2. Farmers
        farmer1 = FarmerProfile(
            id="FAR_201",
            full_name="Ramesh Kumar",
            phone="+91 9876543210",
            village="Tadikonda",
            district="Guntur",
            state="Andhra Pradesh",
            main_crop="Tomato",
            farm_size_acres=3.5,
            soil_type="Red Sandy Loam",
            kyc_status="Verified",
            account_status="Active"
        )
        farmer2 = FarmerProfile(
            id="FAR_202",
            full_name="Venkateswara Rao",
            phone="+91 9848012345",
            village="Tenali",
            district="Guntur",
            state="Andhra Pradesh",
            main_crop="Chilli",
            farm_size_acres=5.0,
            soil_type="Black Clay Soil",
            kyc_status="Verified",
            account_status="Active"
        )
        farmer3 = FarmerProfile(
            id="FAR_203",
            full_name="K. Satyanarayana",
            phone="+91 9440156789",
            village="Mangalagiri",
            district="Guntur",
            state="Andhra Pradesh",
            main_crop="Turmeric",
            farm_size_acres=4.2,
            soil_type="Alluvial Soil",
            kyc_status="Pending",
            account_status="Active"
        )
        db.add_all([farmer1, farmer2, farmer3])

        # 3. Buyers
        buyer1 = BuyerProfile(
            id="BUY_301",
            company_name="Sri Lakshmi Agri Processing Pvt Ltd",
            rep_name="Anand Reddy",
            phone="+91 9849011223",
            email="procurement@srilakshmiagri.com",
            location="Guntur Industrial Estate",
            district="Guntur",
            state="Andhra Pradesh",
            buyer_type="Processor",
            interested_crops=["Tomato", "Chilli"],
            price_offered_qtl=2850.0,
            min_qty_tons=5.0,
            kyc_status="Verified",
            account_status="Active",
            kyc_doc_name="GSTIN_37AABCU9603R1ZM.pdf"
        )
        buyer2 = BuyerProfile(
            id="BUY_302",
            company_name="Deccan Food Exports Ltd",
            rep_name="P. Sudhakar",
            phone="+91 9440188990",
            email="exports@deccanfoods.in",
            location="Autonagar, Vijayawada",
            district="Krishna",
            state="Andhra Pradesh",
            buyer_type="Exporter",
            interested_crops=["Chilli", "Turmeric"],
            price_offered_qtl=19500.0,
            min_qty_tons=10.0,
            kyc_status="Verified",
            account_status="Active",
            kyc_doc_name="IEC_Trade_0512893411.pdf"
        )
        buyer3 = BuyerProfile(
            id="BUY_303",
            company_name="Godavari Agro Traders",
            rep_name="M. Ramachandra Rao",
            phone="+91 9866123456",
            email="trade@godavariagro.com",
            location="Market Yard, Guntur",
            district="Guntur",
            state="Andhra Pradesh",
            buyer_type="Wholesaler",
            interested_crops=["Cotton", "Maize"],
            price_offered_qtl=7500.0,
            min_qty_tons=8.0,
            kyc_status="Pending",
            account_status="Active",
            kyc_doc_name="FSSAI_Cert_1001904700.pdf"
        )
        db.add_all([buyer1, buyer2, buyer3])

        # 4. Crops & Mandi Rates
        crop1 = Crop(
            id="CRP_01",
            name="Tomato (Hybrid Grade A)",
            name_te="టమోటా (హైబ్రిడ్ గ్రేడ్ A)",
            name_hi="टमाटर (हाइब्रिड ग्रेड A)",
            category="Vegetables",
            variety="Arka Rakshak / Sahu",
            season="Kharif",
            harvest_status="Optimal Harvest",
            expected_price_qtl=2800.0,
            current_mandi_price=2800.0,
            mandi_name="Guntur Mandi",
            unit="₹/Quintal",
            change_pct=5.2,
            trend="up"
        )
        crop2 = Crop(
            id="CRP_02",
            name="Red Chilli (Teja / Dry)",
            name_te="ఎండు మిర్చి (తేజ రకం)",
            name_hi="लाल मिर्च (तेजा)",
            category="Spices",
            variety="Teja Supreme",
            season="Rabi",
            harvest_status="Drying & Storing",
            expected_price_qtl=19200.0,
            current_mandi_price=19200.0,
            mandi_name="Guntur Mirchi Yard",
            unit="₹/Quintal",
            change_pct=3.8,
            trend="up"
        )
        crop3 = Crop(
            id="CRP_03",
            name="Turmeric (Salem Finger)",
            name_te="పసుపు కొమ్ములు (సేలం)",
            name_hi="हल्दी गांठ (सलेम)",
            category="Spices",
            variety="Prathibha",
            season="Rabi",
            harvest_status="Harvest Ready",
            expected_price_qtl=13500.0,
            current_mandi_price=13500.0,
            mandi_name="Duggirala Market",
            unit="₹/Quintal",
            change_pct=1.5,
            trend="up"
        )
        crop4 = Crop(
            id="CRP_04",
            name="Cotton (Shankar-6 / Long Staple)",
            name_te="పత్తి (శంకర్-6)",
            name_hi="कपास (शंकर-6)",
            category="Commercial",
            variety="Shankar-6",
            season="Kharif",
            harvest_status="Picking Phase",
            expected_price_qtl=7450.0,
            current_mandi_price=7450.0,
            mandi_name="Adoni Mandi",
            unit="₹/Quintal",
            change_pct=-0.8,
            trend="down"
        )
        db.add_all([crop1, crop2, crop3, crop4])

        # 5. Cold Storage Facilities
        storage1 = ColdStorageFacility(
            id="STR_401",
            facility_name="Sri Lakshmi Agro Cold Storage",
            operator_name="K. Venkateswara Rao",
            phone="+91 98480 33441",
            location="NH-16 Bypass Road",
            district="Guntur",
            state="Andhra Pradesh",
            total_capacity_mt=500.0,
            occupied_capacity_mt=380.0,
            available_capacity_mt=120.0,
            daily_rate_qtl=12.0,
            temperature_c=3.5,
            humidity_pct=88.0,
            supported_crops=["Tomato", "Chilli", "Turmeric"],
            maintenance_status="Optimal",
            account_status="Active"
        )
        storage2 = ColdStorageFacility(
            id="STR_402",
            facility_name="Guntur Mirchi Yard Mega Cold Storage",
            operator_name="AP State Warehousing Corp",
            phone="+91 98480 55662",
            location="Mirchi Yard Complex",
            district="Guntur",
            state="Andhra Pradesh",
            total_capacity_mt=1200.0,
            occupied_capacity_mt=950.0,
            available_capacity_mt=250.0,
            daily_rate_qtl=14.0,
            temperature_c=2.0,
            humidity_pct=82.0,
            supported_crops=["Chilli", "Turmeric", "Spices"],
            maintenance_status="Optimal",
            account_status="Active"
        )
        db.add_all([storage1, storage2])

        # 6. Agreements / Contracts
        agr1 = Agreement(
            id="AGR_501",
            agreement_code="AGR-2026-089",
            farmer_id="FAR_201",
            farmer_name="Ramesh Kumar",
            buyer_id="BUY_301",
            buyer_name="Sri Lakshmi Agri Processing Pvt Ltd",
            storage_id="STR_401",
            storage_name="Sri Lakshmi Agro Cold Storage",
            crop_name="Tomato (Grade A)",
            quantity_qtl=100.0,
            agreed_price_qtl=2850.0,
            total_value=285000.0,
            start_date="2026-09-15",
            end_date="2026-10-15",
            status="Active"
        )
        agr2 = Agreement(
            id="AGR_502",
            agreement_code="AGR-2026-090",
            farmer_id="FAR_202",
            farmer_name="Venkateswara Rao",
            buyer_id="BUY_302",
            buyer_name="Deccan Food Exports Ltd",
            storage_id="STR_402",
            storage_name="Guntur Mirchi Yard Mega Cold Storage",
            crop_name="Red Chilli (Teja)",
            quantity_qtl=25.0,
            agreed_price_qtl=19500.0,
            total_value=487500.0,
            start_date="2026-09-18",
            end_date="2026-11-18",
            status="Active"
        )
        db.add_all([agr1, agr2])

        # 7. Payment Transactions
        txn1 = PaymentTransaction(
            id="TXN_701",
            txn_code="TXN-2026-0901",
            agreement_id="AGR_501",
            payer_name="Sri Lakshmi Agri Processing Pvt Ltd",
            payee_name="Ramesh Kumar",
            amount=85500.0, # 30% Advance
            payment_method="NEFT Bank Direct",
            status="Success",
            reference_number="SBI9928172635"
        )
        txn2 = PaymentTransaction(
            id="TXN_702",
            txn_code="TXN-2026-0902",
            agreement_id="AGR_502",
            payer_name="Deccan Food Exports Ltd",
            payee_name="Venkateswara Rao",
            amount=146250.0, # 30% Advance
            payment_method="RTGS Direct Transfer",
            status="Success",
            reference_number="HDFC8837162534"
        )
        db.add_all([txn1, txn2])

        # 8. Worker Teams & Requests
        wteam1 = WorkerTeam(
            id="WT_01",
            work_type="Harvesting & Picking",
            work_type_te="పంట కోత & ఎంపిక కూలీలు",
            work_type_hi="कटाई और तुड़ाई मजदूर",
            workers_count=8,
            rate_per_day=500.0,
            status="Available",
            coordinator_name="Srinivas Rao",
            coordinator_phone="+91 9876543210",
            description="Trained in careful tomato & chilli crop harvesting, minimum bruising, grading at field."
        )
        wteam2 = WorkerTeam(
            id="WT_02",
            work_type="Field Weeding & Cleaning",
            work_type_te="కలుపు తీత & పొలం శుభ్రత",
            work_type_hi="निराई और खेत सफाई",
            workers_count=6,
            rate_per_day=450.0,
            status="Available",
            coordinator_name="Srinivas Rao",
            coordinator_phone="+91 9876543210",
            description="Organic weed removal, bed maintenance, drip irrigation channel clearing."
        )
        db.add_all([wteam1, wteam2])

        wreq1 = WorkerRequest(
            id="WR_101",
            farmer_name="Ramesh Kumar",
            phone="+91 9876543210",
            work_type="Tomato Harvesting",
            workers_needed=6,
            date="Tomorrow",
            location="Tadikonda, Guntur",
            status="Requested"
        )
        db.add(wreq1)

        # 9. Audit Logs
        log1 = AuditLog(
            id="LOG_01",
            action="System Initialized with Relational Database",
            user_name="Hitaishi Admin",
            role="MASTER_ADMIN",
            entity="System",
            entity_id="SYS_01",
            status="SUCCESS",
            details="Single source of truth initialized with SQLAlchemy and SQLite/PostgreSQL engine."
        )
        log2 = AuditLog(
            id="LOG_02",
            action="Verified Farmer KYC Profile",
            user_name="Hitaishi Admin",
            role="MASTER_ADMIN",
            entity="Farmer",
            entity_id="FAR_201",
            status="SUCCESS",
            details="Farmer Ramesh Kumar (Tadikonda) verified and approved."
        )
        db.add_all([log1, log2])

        # 10. CMS Content
        cms1 = CMSContent(
            id="CMS_01",
            key="hero_banner",
            title="Sanjeevani AgriTech Platform",
            subtitle="From Crop Care to Market — Your Farming Saathi.",
            notice_text="Special Procurement Drive: Guntur Mirchi Yard live rates +5.2% above MSP.",
            is_active=True
        )
        db.add(cms1)

        db.commit()
        print("Database seeding completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
