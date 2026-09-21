const fs = require("fs");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, "database", "sanjeevani_db.json");

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));

// Baseline Seed Data
const DEFAULT_SEED_DB = {
  version: Date.now(),
  farmers: [
    { id: "FAR_201", full_name: "Ramesh Kumar", phone: "+91 9876543210", village: "Tadikonda", district: "Guntur", state: "Andhra Pradesh", main_crop: "Tomato", farm_size_acres: 3.5, soil_type: "Red Sandy Loam", kyc_status: "Verified", account_status: "Active", created_at: "2026-09-15" },
    { id: "FAR_202", full_name: "Venkateswara Rao", phone: "+91 9848012345", village: "Tenali", district: "Guntur", state: "Andhra Pradesh", main_crop: "Chilli", farm_size_acres: 5.0, soil_type: "Black Clay Soil", kyc_status: "Verified", account_status: "Active", created_at: "2026-09-16" },
    { id: "FAR_203", full_name: "K. Satyanarayana", phone: "+91 9440156789", village: "Mangalagiri", district: "Guntur", state: "Andhra Pradesh", main_crop: "Turmeric", farm_size_acres: 4.2, soil_type: "Alluvial Soil", kyc_status: "Pending", account_status: "Active", created_at: "2026-09-19" }
  ],
  buyers: [
    { id: "BUY_301", company_name: "Sri Lakshmi Agri Processing Pvt Ltd", rep_name: "Anand Reddy", phone: "+91 9849011223", email: "procurement@srilakshmiagri.com", location: "Guntur Industrial Estate", district: "Guntur", state: "Andhra Pradesh", buyer_type: "Processor", interested_crops: ["Tomato", "Chilli"], price_offered_qtl: 2850.0, min_qty_tons: 5.0, kyc_status: "Verified", account_status: "Active", kyc_doc_name: "GSTIN_37AABCU9603R1ZM.pdf", created_at: "2026-09-17" },
    { id: "BUY_302", company_name: "Deccan Food Exports Ltd", rep_name: "P. Sudhakar", phone: "+91 9440188990", email: "exports@deccanfoods.in", location: "Autonagar, Vijayawada", district: "Krishna", state: "Andhra Pradesh", buyer_type: "Exporter", interested_crops: ["Chilli", "Turmeric"], price_offered_qtl: 19500.0, min_qty_tons: 10.0, kyc_status: "Verified", account_status: "Active", kyc_doc_name: "IEC_Trade_0512893411.pdf", created_at: "2026-09-18" },
    { id: "BUY_303", company_name: "Godavari Agro Traders", rep_name: "M. Ramachandra Rao", phone: "+91 9866123456", email: "trade@godavariagro.com", location: "Market Yard, Guntur", district: "Guntur", state: "Andhra Pradesh", buyer_type: "Wholesaler", interested_crops: ["Cotton", "Maize"], price_offered_qtl: 7500.0, min_qty_tons: 8.0, kyc_status: "Pending", account_status: "Active", kyc_doc_name: "FSSAI_Cert_1001904700.pdf", created_at: "2026-09-19" }
  ],
  crops: [
    { id: "CRP_01", name: "Tomato (Hybrid Grade A)", name_te: "టమోటా (హైబ్రిడ్ గ్రేడ్ A)", name_hi: "टमाटर (हाइब्रिड)", category: "Vegetables", variety: "Arka Rakshak", season: "Kharif", harvest_status: "Optimal Harvest", expected_price_qtl: 2800.0, current_mandi_price: 2800.0, mandi_name: "Guntur Mandi", unit: "₹/Quintal", change_pct: 5.2, trend: "up" },
    { id: "CRP_02", name: "Red Chilli (Teja / Dry)", name_te: "ఎండు మిర్చి (తేజ)", name_hi: "लाल मिर्च (तेजा)", category: "Spices", variety: "Teja Supreme", season: "Rabi", harvest_status: "Drying & Storing", expected_price_qtl: 19200.0, current_mandi_price: 19200.0, mandi_name: "Guntur Mirchi Yard", unit: "₹/Quintal", change_pct: 3.8, trend: "up" },
    { id: "CRP_03", name: "Turmeric (Salem Finger)", name_te: "పసుపు కొమ్ములు", name_hi: "हल्दी गांठ", category: "Spices", variety: "Prathibha", season: "Rabi", harvest_status: "Harvest Ready", expected_price_qtl: 13500.0, current_mandi_price: 13500.0, mandi_name: "Duggirala Market", unit: "₹/Quintal", change_pct: 1.5, trend: "up" },
    { id: "CRP_04", name: "Cotton (Shankar-6)", name_te: "పత్తి", name_hi: "कपास", category: "Commercial", variety: "Shankar-6", season: "Kharif", harvest_status: "Picking Phase", expected_price_qtl: 7450.0, current_mandi_price: 7450.0, mandi_name: "Adoni Mandi", unit: "₹/Quintal", change_pct: -0.8, trend: "down" }
  ],
  storage_facilities: [
    { id: "STR_401", facility_name: "Sri Lakshmi Agro Cold Storage", operator_name: "K. Venkateswara Rao", phone: "+91 98480 33441", location: "NH-16 Bypass Road", district: "Guntur", total_capacity_mt: 500.0, occupied_capacity_mt: 380.0, available_capacity_mt: 120.0, daily_rate_qtl: 12.0, temperature_c: 3.5, humidity_pct: 88.0, supported_crops: ["Tomato", "Chilli", "Turmeric"], maintenance_status: "Optimal", account_status: "Active", inventory: [] },
    { id: "STR_402", facility_name: "Guntur Mirchi Yard Mega Cold Storage", operator_name: "AP State Warehousing Corp", phone: "+91 98480 55662", location: "Mirchi Yard Complex", district: "Guntur", total_capacity_mt: 1200.0, occupied_capacity_mt: 950.0, available_capacity_mt: 250.0, daily_rate_qtl: 14.0, temperature_c: 2.0, humidity_pct: 82.0, supported_crops: ["Chilli", "Turmeric", "Spices"], maintenance_status: "Optimal", account_status: "Active", inventory: [] }
  ],
  agreements: [
    { id: "AGR_501", agreement_code: "AGR-2026-089", farmer_id: "FAR_201", farmer_name: "Ramesh Kumar", buyer_id: "BUY_301", buyer_name: "Sri Lakshmi Agri Processing Pvt Ltd", storage_name: "Sri Lakshmi Agro Cold Storage", crop_name: "Tomato (Grade A)", quantity_qtl: 100.0, agreed_price_qtl: 2850.0, total_value: 285000.0, start_date: "2026-09-15", end_date: "2026-10-15", status: "Active" },
    { id: "AGR_502", agreement_code: "AGR-2026-090", farmer_id: "FAR_202", farmer_name: "Venkateswara Rao", buyer_id: "BUY_302", buyer_name: "Deccan Food Exports Ltd", storage_name: "Guntur Mirchi Yard Mega Cold Storage", crop_name: "Red Chilli (Teja)", quantity_qtl: 25.0, agreed_price_qtl: 19500.0, total_value: 487500.0, start_date: "2026-09-18", end_date: "2026-11-18", status: "Active" }
  ],
  payments: [
    { id: "TXN_701", txn_code: "TXN-2026-0901", agreement_id: "AGR_501", payer_name: "Sri Lakshmi Agri Processing Pvt Ltd", payee_name: "Ramesh Kumar", amount: 85500.0, payment_method: "NEFT Bank Direct", status: "Success", reference_number: "SBI9928172635", created_at: "2026-09-16" },
    { id: "TXN_702", txn_code: "TXN-2026-0902", agreement_id: "AGR_502", payer_name: "Deccan Food Exports Ltd", payee_name: "Venkateswara Rao", amount: 146250.0, payment_method: "RTGS Direct Transfer", status: "Success", reference_number: "HDFC8837162534", created_at: "2026-09-19" }
  ],
  worker_requests: [
    { id: "WR_101", farmer_name: "Ramesh Kumar", phone: "+91 9876543210", work_type: "Tomato Harvesting", workers_needed: 6, date: "Tomorrow", location: "Tadikonda, Guntur", status: "Requested", created_at: "2026-09-20" }
  ],
  diagnoses: [
    {
      id: "DIAG_101",
      timestamp: "2026-09-20 10:30:00",
      farmerName: "Ramesh Kumar",
      cropName: "Tomato",
      diseaseName: "Early Blight (Alternaria solani)",
      confidencePct: 96.4,
      severity: "Moderate",
      status: "Verified",
      photoUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80",
      organicRemedy: "Apply Copper Oxychloride 50 WP (3g/litre) or Neem Seed Kernel Extract (5%) spray at 10-day intervals.",
      agronomistNotes: "Approved by ICAR Agronomist Dr. B. K. Sharma. Mild concentric rings observed on lower foliage."
    }
  ],
  audit_logs: [
    { id: "LOG_01", action: "System Initialized with Persistent Database", user_name: "Master Admin", role: "MASTER_ADMIN", entity: "System", entity_id: "SYS_01", status: "SUCCESS", details: "Single authoritative database connected.", timestamp: new Date().toISOString() }
  ],
  storage_bookings: [
    {
      id: "CSB_501",
      booking_code: "CSB-2026-001",
      facility_id: "STR_401",
      facility_name: "Sri Lakshmi Agro Cold Storage",
      location: "NH-16 Bypass Road, Guntur",
      farmer_id: "FAR_201",
      farmer_name: "Ramesh Kumar",
      farmer_phone: "+91 9876543210",
      crop_name: "Tomato (Hybrid Grade A)",
      quantity_mt: 10.0,
      duration_days: 30,
      daily_rate_qtl: 12.0,
      total_amount: 10000.0,
      required_advance: 2000.0,
      amount_paid: 0.0,
      remaining_amount: 10000.0,
      payment_status: "Advance Payment Pending",
      txn_id: null,
      payment_date: null,
      payment_method: null,
      created_at: "2026-09-20"
    },
    {
      id: "CSB_502",
      booking_code: "CSB-2026-002",
      facility_id: "STR_402",
      facility_name: "Guntur Mirchi Yard Mega Cold Storage",
      location: "Mirchi Yard Complex, Guntur",
      farmer_id: "FAR_202",
      farmer_name: "Venkateswara Rao",
      farmer_phone: "+91 9848012345",
      crop_name: "Red Chilli (Teja Supreme)",
      quantity_mt: 25.0,
      duration_days: 60,
      daily_rate_qtl: 14.0,
      total_amount: 25000.0,
      required_advance: 5000.0,
      amount_paid: 5000.0,
      remaining_amount: 20000.0,
      payment_status: "20% Advance Paid",
      txn_id: "TXN-CS-2026-0902",
      payment_date: "2026-09-18 14:30",
      payment_method: "UPI Instant Pay",
      created_at: "2026-09-18"
    }
  ],
  cms: {
    hero_banner: {
      key: "hero_banner",
      title: "Sanjeevani AgriTech Platform",
      subtitle: "From Crop Care to Market — Your Farming Saathi.",
      notice_text: "Special Procurement Drive: Guntur Mirchi Yard live rates +5.2% above MSP.",
      support_phone: "8977520059",
      is_active: true
    }
  }
};

// Database Loader & Persister
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
      const merged = { ...DEFAULT_SEED_DB, ...data };
      if (!merged.storage_bookings || merged.storage_bookings.length === 0) {
        merged.storage_bookings = DEFAULT_SEED_DB.storage_bookings;
      }
      return merged;
    }
  } catch (err) {
    console.warn("Failed to load DB file, using fallback baseline:", err);
  }
  return JSON.parse(JSON.stringify(DEFAULT_SEED_DB));
}

let db = loadDb();

function saveDb() {
  db.version = Date.now();
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to persist database to disk:", err);
  }
}

// Ensure initial database file is written
saveDb();

// -------------------------------------------------------------
// SYSTEM & SYNC ENDPOINTS
// -------------------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    app: "SANJEEVANI",
    tagline: "From Crop Care to Market - Your Farming Saathi",
    database: "Single Source of Truth Database Connected",
    version: db.version
  });
});

app.get("/api/sync/state", (req, res) => {
  res.json({
    version: db.version,
    counts: {
      farmers: db.farmers.length,
      buyers: db.buyers.length,
      storage: db.storage_facilities.length,
      crops: db.crops.length,
      agreements: db.agreements.length,
      diagnoses: db.diagnoses.length,
      audit_logs: db.audit_logs.length
    }
  });
});

app.get("/api/sync/all", (req, res) => {
  res.json({
    version: db.version,
    farmers: db.farmers,
    buyers: db.buyers,
    storage: db.storage_facilities,
    storage_bookings: db.storage_bookings || [],
    crops: db.crops,
    agreements: db.agreements,
    payments: db.payments || [],
    diagnoses: db.diagnoses,
    worker_requests: db.worker_requests,
    cms: db.cms,
    audit_logs: db.audit_logs
  });
});

// Collection-level Sync Endpoints (handles full array updates from saveShared...)
app.post("/api/farmers/sync", (req, res) => {
  if (Array.isArray(req.body)) {
    db.farmers = req.body.map(f => ({
      id: f.id,
      full_name: f.name || f.full_name,
      phone: f.phone,
      village: f.village || "Guntur Rural",
      district: f.district || "Guntur",
      state: f.state || "Andhra Pradesh",
      main_crop: f.mainCrop || f.main_crop || "Tomato",
      farm_size_acres: parseFloat(f.farmSizeAcres || f.farm_size_acres) || 3.0,
      soil_type: f.soilType || f.soil_type || "Red Sandy Loam",
      kyc_status: f.verificationStatus === "Verified" || f.kyc_status === "Verified" ? "Verified" : (f.verificationStatus === "Rejected" || f.kyc_status === "Rejected" ? "Rejected" : "Pending"),
      account_status: f.accountStatus || f.account_status || "Active",
      kyc_doc_url: f.kycDocUrl || f.kyc_doc_url || "Aadhaar Verified",
      land_record_no: f.landRecordNo || f.land_record_no || "PATTADAR_VERIFIED",
      created_at: f.createdDate || f.created_at || new Date().toISOString()
    }));
    saveDb();
  }
  res.json({ success: true, count: db.farmers.length, version: db.version });
});

app.post("/api/buyers/sync", (req, res) => {
  if (Array.isArray(req.body)) {
    db.buyers = req.body.map(b => ({
      id: b.id,
      company_name: b.companyName || b.company_name,
      rep_name: b.repName || b.rep_name || "Authorized Agent",
      phone: b.phone,
      email: b.email || "buyer@agritrade.com",
      location: b.location || "Guntur Mandi",
      district: b.district || "Guntur",
      state: b.state || "Andhra Pradesh",
      buyer_type: b.buyerType || b.buyer_type || "Wholesaler",
      interested_crops: b.interestedCrops || b.interested_crops || ["Tomato"],
      price_offered_qtl: parseFloat(b.priceOfferedQtl || b.price_offered_qtl) || 2800,
      min_qty_tons: parseFloat(b.minQtyTons || b.min_qty_tons) || 5,
      kyc_status: b.kycStatus || b.kyc_status || "Verified",
      account_status: b.accountStatus || b.account_status || "Active",
      kyc_doc_name: b.kycDocName || b.kyc_doc_name || "DOC_VERIFIED.pdf",
      created_at: b.createdDate || b.created_at || new Date().toISOString()
    }));
    saveDb();
  }
  res.json({ success: true, count: db.buyers.length, version: db.version });
});

app.post("/api/cold-storage/sync", (req, res) => {
  if (Array.isArray(req.body)) {
    db.storage_facilities = req.body.map(s => ({
      id: s.id,
      facility_name: s.facilityName || s.facility_name,
      operator_name: s.operatorName || s.operator_name || "Facility Operator",
      phone: s.phone,
      location: s.location,
      district: s.district || "Guntur",
      total_capacity_mt: parseFloat(s.totalCapacityMT || s.total_capacity_mt) || 1000,
      occupied_capacity_mt: parseFloat(s.occupiedCapacityMT || s.occupied_capacity_mt) || 0,
      available_capacity_mt: parseFloat(s.availableCapacityMT || s.available_capacity_mt) || 1000,
      daily_rate_qtl: parseFloat(s.dailyRateQtl || s.daily_rate_qtl) || 10,
      temperature_c: parseFloat(s.temperatureC || s.temperature_c) || 3.5,
      humidity_pct: parseFloat(s.humidityPct || s.humidity_pct) || 85,
      supported_crops: s.supportedCrops || s.supported_crops || ["Tomato", "Chilli"],
      maintenance_status: s.maintenanceStatus || s.maintenance_status || "Optimal",
      account_status: s.accountStatus || s.account_status || "Active",
      inventory: s.inventory || []
    }));
    saveDb();
  }
  res.json({ success: true, count: db.storage_facilities.length, version: db.version });
});

app.post("/api/crops/sync", (req, res) => {
  if (Array.isArray(req.body)) {
    db.crops = req.body.map((c, i) => ({
      id: c.id || `CRP_0${i + 1}`,
      name: c.crop || c.name,
      name_te: c.cropTe || c.name_te || c.crop || c.name,
      name_hi: c.cropHi || c.name_hi || c.crop || c.name,
      category: c.category || "Commercial",
      variety: c.variety || "Hybrid",
      season: c.season || "Kharif",
      harvest_status: c.harvest_status || "Optimal Harvest",
      expected_price_qtl: parseFloat(c.price || c.current_mandi_price) || 2800,
      current_mandi_price: parseFloat(c.price || c.current_mandi_price) || 2800,
      mandi_name: c.mandi || c.mandi_name || "Guntur Mandi",
      unit: c.unit || "₹/Quintal",
      change_pct: parseFloat(c.changePct || c.change_pct) || 0,
      trend: c.trend || "up"
    }));
    saveDb();
  }
  res.json({ success: true, count: db.crops.length, version: db.version });
});

app.post("/api/agreements/sync", (req, res) => {
  if (Array.isArray(req.body)) {
    db.agreements = req.body.map(a => ({
      id: a.id,
      agreement_code: a.agreementCode || a.agreement_code || a.id,
      farmer_id: a.farmerId || a.farmer_id || "FAR_001",
      farmer_name: a.farmerName || a.farmer_name,
      buyer_id: a.buyerId || a.buyer_id || "BUY_001",
      buyer_name: a.buyerName || a.buyer_name,
      storage_name: a.coldStorageAssigned || a.storage_name || "Central Cold Storage",
      crop_name: a.cropName || a.crop_name,
      quantity_qtl: parseFloat(a.quantityQtl || a.quantity_qtl) || 50,
      agreed_price_qtl: parseFloat(a.agreedPriceQtl || a.agreed_price_qtl) || 2800,
      total_value: parseFloat(a.totalValue || a.total_value) || 140000,
      start_date: a.startDate || a.start_date,
      end_date: a.endDate || a.end_date,
      status: a.status || "Active"
    }));
    saveDb();
  }
  res.json({ success: true, count: db.agreements.length, version: db.version });
});

app.post("/api/diagnoses/sync", (req, res) => {
  if (Array.isArray(req.body)) {
    db.diagnoses = req.body;
    saveDb();
  }
  res.json({ success: true, count: db.diagnoses.length, version: db.version });
});

app.post("/api/payments/sync", (req, res) => {
  if (Array.isArray(req.body)) {
    db.payments = req.body;
    saveDb();
  }
  res.json({ success: true, count: (db.payments || []).length, version: db.version });
});

app.get("/api/market/prices", (req, res) => {
  res.json({
    success: true,
    prices: db.crops.map(c => ({
      id: c.id,
      crop: c.name,
      crop_te: c.name_te,
      crop_hi: c.name_hi,
      mandi: c.mandi_name,
      price: c.current_mandi_price,
      unit: c.unit,
      change_pct: c.change_pct,
      trend: c.trend,
      is_live: true,
      data_source: "Single Source of Truth Mandi Feed",
      updated_at: "Live"
    }))
  });
});

app.get("/api/fpos", (req, res) => {
  res.json({
    fpos: [
      { id: "fpo_1", name: "Amaravathi Farmers Producer Company Ltd", location: "Tadikonda, Guntur District", supported_crops: ["Tomato", "Chilli", "Maize"], member_count: 850, contact_phone: "+91 90000 22001", benefits: ["Bulk fertilizer discounts", "Direct export pool"], verified: true, is_demo: true },
      { id: "fpo_2", name: "Rythu Bharosa FPO Cooperative Society", location: "Vijayawada Rural, AP", supported_crops: ["Paddy", "Maize", "Vegetables"], member_count: 1200, contact_phone: "+91 90000 22002", benefits: ["Seed subsidy", "Custom hiring center"], verified: true, is_demo: true }
    ]
  });
});

// Dashboard Statistics Endpoint
app.get("/api/dashboard/stats", (req, res) => {
  const totalFarmers = db.farmers.length;
  const activeFarmers = db.farmers.filter(f => f.kyc_status === "Verified").length;
  const pendingFarmers = db.farmers.filter(f => f.kyc_status === "Pending").length;

  const totalBuyers = db.buyers.length;
  const verifiedBuyers = db.buyers.filter(b => b.kyc_status === "Verified").length;
  const pendingBuyers = db.buyers.filter(b => b.kyc_status === "Pending").length;

  const totalCap = db.storage_facilities.reduce((acc, f) => acc + (f.total_capacity_mt || 0), 0);
  const occupiedCap = db.storage_facilities.reduce((acc, f) => acc + (f.occupied_capacity_mt || 0), 0);
  const freeCap = db.storage_facilities.reduce((acc, f) => acc + (f.available_capacity_mt || 0), 0);
  const usagePct = totalCap > 0 ? ((occupiedCap / totalCap) * 100).toFixed(1) : 0;

  const totalRevenue = db.payments.filter(p => p.status === "Success").reduce((acc, p) => acc + p.amount, 0);

  res.json({
    farmers: { total: totalFarmers, active: activeFarmers, pending: pendingFarmers, suspended: 0 },
    buyers: { total: totalBuyers, verified: verifiedBuyers, pending: pendingBuyers, suspended: 0 },
    cold_storage: {
      total_facilities: db.storage_facilities.length,
      active_facilities: db.storage_facilities.length,
      total_capacity_mt: totalCap,
      used_capacity_mt: occupiedCap,
      free_capacity_mt: freeCap,
      usage_percentage: parseFloat(usagePct)
    },
    crops: { total: db.crops.length, harvest_ready: db.crops.filter(c => c.harvest_status && c.harvest_status.includes("Harvest")).length },
    agreements: { total: db.agreements.length, active: db.agreements.filter(a => a.status === "Active").length, expiring: 0 },
    revenue: { total_processed: totalRevenue, total_transactions: db.payments.length, successful_transactions: db.payments.filter(p => p.status === "Success").length, pending_transactions: 0 },
    alerts: pendingBuyers > 0 ? [{ id: "alt_1", type: "kyc", title: `${pendingBuyers} Buyer KYC Pending`, severity: "high", action: "Review in Buyers" }] : [],
    recent_activities: db.audit_logs
  });
});

// -------------------------------------------------------------
// FARMERS CRUD
// -------------------------------------------------------------
app.get("/api/farmers", (req, res) => res.json(db.farmers));

app.post("/api/farmers", (req, res) => {
  const newFarmer = {
    id: req.body.id || `FAR_${Date.now().toString().slice(-4)}`,
    full_name: req.body.full_name || req.body.name || "New Farmer",
    phone: req.body.phone || "+91 9876543210",
    village: req.body.village || "Guntur",
    district: req.body.district || "Guntur",
    state: req.body.state || "Andhra Pradesh",
    main_crop: req.body.main_crop || req.body.mainCrop || "Tomato",
    farm_size_acres: parseFloat(req.body.farm_size_acres || req.body.farmSizeAcres) || 3.0,
    soil_type: req.body.soil_type || req.body.soilType || "Red Sandy Loam",
    kyc_status: req.body.kyc_status || req.body.verificationStatus || "Pending",
    account_status: req.body.account_status || req.body.accountStatus || "Active",
    created_at: new Date().toISOString()
  };
  
  // Check if exists by id or phone to upsert
  const existingIdx = db.farmers.findIndex(f => f.id === newFarmer.id || (newFarmer.phone && f.phone.replace(/\s+/g, '') === newFarmer.phone.replace(/\s+/g, '')));
  if (existingIdx >= 0) {
    db.farmers[existingIdx] = { ...db.farmers[existingIdx], ...newFarmer };
  } else {
    db.farmers.unshift(newFarmer);
  }
  
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Registered / Upserted Farmer: ${newFarmer.full_name}`,
    user_name: newFarmer.full_name,
    role: "FARMER",
    entity: "Farmer",
    entity_id: newFarmer.id,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json(newFarmer);
});

app.put("/api/farmers/:id", (req, res) => {
  const idx = db.farmers.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Farmer not found" });
  db.farmers[idx] = { ...db.farmers[idx], ...req.body };
  saveDb();
  res.json(db.farmers[idx]);
});

app.patch("/api/farmers/:id/status", (req, res) => {
  const farmer = db.farmers.find(f => f.id === req.params.id);
  if (!farmer) return res.status(404).json({ error: "Farmer not found" });
  if (req.body.kyc_status) farmer.kyc_status = req.body.kyc_status;
  if (req.body.account_status) farmer.account_status = req.body.account_status;
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Updated Farmer Status: ${farmer.full_name} -> ${farmer.kyc_status}`,
    user_name: req.body.admin_name || "Admin",
    role: "MASTER_ADMIN",
    entity: "Farmer",
    entity_id: farmer.id,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json({ success: true, farmer });
});

app.delete("/api/farmers/:id", (req, res) => {
  const idx = db.farmers.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Farmer not found" });
  const removed = db.farmers.splice(idx, 1)[0];
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Deleted Farmer: ${removed.full_name}`,
    user_name: "Admin",
    role: "MASTER_ADMIN",
    entity: "Farmer",
    entity_id: removed.id,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json({ success: true, removed });
});

// -------------------------------------------------------------
// BUYERS CRUD
// -------------------------------------------------------------
app.get("/api/buyers", (req, res) => res.json(db.buyers));

app.post("/api/buyers", (req, res) => {
  const newBuyer = {
    id: req.body.id || `BUY_${Date.now().toString().slice(-4)}`,
    company_name: req.body.company_name || req.body.companyName || "Agri Buyer",
    rep_name: req.body.rep_name || req.body.repName || "Company Rep",
    phone: req.body.phone || "+91 9849011223",
    email: req.body.email || "buyer@agritrade.com",
    location: req.body.location || "Guntur Market Yard",
    district: req.body.district || "Guntur",
    state: req.body.state || "Andhra Pradesh",
    buyer_type: req.body.buyer_type || req.body.buyerType || "Wholesaler",
    interested_crops: req.body.interested_crops || req.body.interestedCrops || ["Tomato"],
    price_offered_qtl: parseFloat(req.body.price_offered_qtl || req.body.priceOfferedQtl) || 2800,
    min_qty_tons: parseFloat(req.body.min_qty_tons || req.body.minQtyTons) || 5,
    kyc_status: req.body.kyc_status || req.body.kycStatus || "Verified",
    account_status: req.body.account_status || req.body.accountStatus || "Active",
    kyc_doc_name: req.body.kyc_doc_name || req.body.kycDocName || "Trade_License.pdf",
    created_at: new Date().toISOString()
  };
  const existingIdx = db.buyers.findIndex(b => b.id === newBuyer.id);
  if (existingIdx !== -1) {
    db.buyers[existingIdx] = { ...db.buyers[existingIdx], ...newBuyer };
  } else {
    db.buyers.unshift(newBuyer);
  }
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Registered New Buyer: ${newBuyer.company_name}`,
    user_name: newBuyer.rep_name,
    role: "BUYER",
    entity: "Buyer",
    entity_id: newBuyer.id,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json(newBuyer);
});

app.put("/api/buyers/:id", (req, res) => {
  const idx = db.buyers.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Buyer not found" });
  db.buyers[idx] = { ...db.buyers[idx], ...req.body };
  saveDb();
  res.json(db.buyers[idx]);
});

app.patch("/api/buyers/:id/status", (req, res) => {
  const buyer = db.buyers.find(b => b.id === req.params.id);
  if (!buyer) return res.status(404).json({ error: "Buyer not found" });
  if (req.body.kyc_status) buyer.kyc_status = req.body.kyc_status;
  if (req.body.account_status) buyer.account_status = req.body.account_status;
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Verified Buyer KYC: ${buyer.company_name} -> ${buyer.kyc_status}`,
    user_name: req.body.admin_name || "Admin",
    role: "MASTER_ADMIN",
    entity: "Buyer",
    entity_id: buyer.id,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json({ success: true, buyer });
});

app.delete("/api/buyers/:id", (req, res) => {
  const idx = db.buyers.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Buyer not found" });
  const removed = db.buyers.splice(idx, 1)[0];
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Deleted Buyer: ${removed.company_name}`,
    user_name: "Admin",
    role: "MASTER_ADMIN",
    entity: "Buyer",
    entity_id: removed.id,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json({ success: true, removed });
});

// -------------------------------------------------------------
// COLD STORAGE CRUD
// -------------------------------------------------------------
app.get("/api/cold-storage", (req, res) => res.json(db.storage_facilities));

app.post("/api/cold-storage", (req, res) => {
  const newStorage = {
    id: req.body.id || `STR_${Date.now().toString().slice(-4)}`,
    facility_name: req.body.facility_name || req.body.facilityName || "Cold Storage Facility",
    operator_name: req.body.operator_name || req.body.operatorName || "Facility Operator",
    phone: req.body.phone || "+91 98480 33441",
    location: req.body.location || "Guntur Hub",
    district: req.body.district || "Guntur",
    total_capacity_mt: parseFloat(req.body.total_capacity_mt || req.body.totalCapacityMT) || 1000,
    occupied_capacity_mt: parseFloat(req.body.occupied_capacity_mt || req.body.occupiedCapacityMT) || 0,
    available_capacity_mt: parseFloat(req.body.available_capacity_mt || req.body.availableCapacityMT) || 1000,
    daily_rate_qtl: parseFloat(req.body.daily_rate_qtl || req.body.dailyRateQtl) || 10,
    temperature_c: parseFloat(req.body.temperature_c || req.body.temperatureC) || 3.5,
    humidity_pct: parseFloat(req.body.humidity_pct || req.body.humidityPct) || 85,
    supported_crops: req.body.supported_crops || req.body.supportedCrops || ["Tomato", "Chilli"],
    maintenance_status: req.body.maintenance_status || req.body.maintenanceStatus || "Optimal",
    account_status: req.body.account_status || req.body.accountStatus || "Active",
    inventory: req.body.inventory || []
  };
  db.storage_facilities.unshift(newStorage);
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Added Cold Storage: ${newStorage.facility_name}`,
    user_name: newStorage.operator_name,
    role: "COLD STORAGE OPERATOR",
    entity: "Cold Storage",
    entity_id: newStorage.id,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json(newStorage);
});

app.put("/api/cold-storage/:id", (req, res) => {
  const idx = db.storage_facilities.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Storage facility not found" });
  db.storage_facilities[idx] = { ...db.storage_facilities[idx], ...req.body };
  saveDb();
  res.json(db.storage_facilities[idx]);
});

app.delete("/api/cold-storage/:id", (req, res) => {
  const idx = db.storage_facilities.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Storage facility not found" });
  const removed = db.storage_facilities.splice(idx, 1)[0];
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Deleted Storage Facility: ${removed.facility_name}`,
    user_name: "Admin",
    role: "MASTER_ADMIN",
    entity: "Cold Storage",
    entity_id: removed.id,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json({ success: true, removed });
});

app.post("/api/cold-storage/book", (req, res) => {
  const facility = db.storage_facilities.find(f => f.id === req.body.facility_id);
  if (!facility) return res.status(404).json({ error: "Facility not found" });
  const batchSize = parseFloat(req.body.batch_size_mt) || 10;
  facility.occupied_capacity_mt = (facility.occupied_capacity_mt || 0) + batchSize;
  facility.available_capacity_mt = Math.max(0, facility.total_capacity_mt - facility.occupied_capacity_mt);
  if (!facility.inventory) facility.inventory = [];
  facility.inventory.push({
    id: `BAT_${Date.now().toString().slice(-4)}`,
    cropName: req.body.crop_name || "Tomato",
    farmerName: req.body.farmer_name || "Farmer",
    batchSizeMT: batchSize,
    entryDate: new Date().toISOString().split("T")[0],
    expiryDate: req.body.expiry_date || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  });
  saveDb();
  res.json({ success: true, message: "Storage space booked!", facility });
});

// -------------------------------------------------------------
// COLD STORAGE BOOKINGS & 20% ADVANCE PAYMENT SYSTEM
// -------------------------------------------------------------
app.get("/api/cold-storage/bookings", (req, res) => {
  let list = db.storage_bookings || [];
  const farmerId = req.query.farmer_id || req.query.farmerId;
  const facilityId = req.query.facility_id || req.query.facilityId;
  const id = req.query.id || req.query.booking_code || req.query.bookingCode;

  if (farmerId) list = list.filter(b => b.farmer_id === farmerId || b.farmerId === farmerId);
  if (facilityId) list = list.filter(b => b.facility_id === facilityId || b.facilityId === facilityId);
  if (id) list = list.filter(b => b.id === id || b.booking_code === id || b.bookingCode === id);

  res.json(list);
});

app.post("/api/cold-storage/bookings", (req, res) => {
  if (!db.storage_bookings) db.storage_bookings = [];
  const b = req.body;
  const count = db.storage_bookings.length;
  const bookingCode = b.booking_code || b.bookingCode || `CSB-2026-${(count + 1).toString().padStart(3, "0")}`;
  const totalAmount = parseFloat(b.total_amount || b.totalAmount) || 10000;
  const requiredAdvance = Math.round(totalAmount * 0.20);

  const newBooking = {
    id: b.id || `CSB_${Date.now().toString().slice(-4)}`,
    booking_code: bookingCode,
    bookingCode: bookingCode,
    facility_id: b.facility_id || b.facilityId || "STR_401",
    facilityId: b.facility_id || b.facilityId || "STR_401",
    facility_name: b.facility_name || b.facilityName || "Sri Lakshmi Agro Cold Storage",
    facilityName: b.facility_name || b.facilityName || "Sri Lakshmi Agro Cold Storage",
    location: b.location || "Guntur Hub",
    farmer_id: b.farmer_id || b.farmerId || "FAR_201",
    farmerId: b.farmer_id || b.farmerId || "FAR_201",
    farmer_name: b.farmer_name || b.farmerName || "Ramesh Kumar",
    farmerName: b.farmer_name || b.farmerName || "Ramesh Kumar",
    farmer_phone: b.farmer_phone || b.farmerPhone || "+91 9876543210",
    farmerPhone: b.farmer_phone || b.farmerPhone || "+91 9876543210",
    crop_name: b.crop_name || b.cropName || "Tomato",
    cropName: b.crop_name || b.cropName || "Tomato",
    quantity_mt: parseFloat(b.quantity_mt || b.quantityMT) || 10,
    quantityMT: parseFloat(b.quantity_mt || b.quantityMT) || 10,
    duration_days: parseInt(b.duration_days || b.durationDays) || 30,
    durationDays: parseInt(b.duration_days || b.durationDays) || 30,
    daily_rate_qtl: parseFloat(b.daily_rate_qtl || b.dailyRateQtl) || 12,
    dailyRateQtl: parseFloat(b.daily_rate_qtl || b.dailyRateQtl) || 12,
    total_amount: totalAmount,
    totalAmount: totalAmount,
    required_advance: requiredAdvance,
    requiredAdvance: requiredAdvance,
    amount_paid: 0,
    amountPaid: 0,
    remaining_amount: totalAmount,
    remainingAmount: totalAmount,
    payment_status: "Advance Payment Pending",
    paymentStatus: "Advance Payment Pending",
    txn_id: null,
    txnId: null,
    payment_date: null,
    paymentDate: null,
    payment_method: null,
    paymentMethod: null,
    created_at: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString().split("T")[0]
  };

  db.storage_bookings.unshift(newBooking);

  // Update facility occupancy as well
  const facility = (db.storage_facilities || []).find(f => f.id === newBooking.facility_id);
  if (facility) {
    facility.occupied_capacity_mt = (facility.occupied_capacity_mt || 0) + newBooking.quantity_mt;
    facility.available_capacity_mt = Math.max(0, facility.total_capacity_mt - facility.occupied_capacity_mt);
  }

  if (!db.audit_logs) db.audit_logs = [];
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Created Cold Storage Booking ${newBooking.bookingCode} at ${newBooking.facilityName}`,
    user_name: newBooking.farmerName,
    role: "FARMER",
    entity: "Cold Storage Booking",
    entity_id: newBooking.id,
    status: "SUCCESS",
    details: `Total: ₹${totalAmount} | 20% Advance Req: ₹${requiredAdvance} | Remaining: ₹${totalAmount}`,
    timestamp: new Date().toISOString()
  });

  saveDb();
  res.status(201).json({ success: true, booking: newBooking, ...newBooking });
});

app.post("/api/cold-storage/bookings/pay-advance", (req, res) => {
  const { booking_id, bookingId, amount, payment_method, paymentMethod } = req.body;
  const targetId = booking_id || bookingId;
  if (!db.storage_bookings) db.storage_bookings = [];
  const booking = db.storage_bookings.find(b => b.id === targetId || b.booking_code === targetId || b.bookingCode === targetId);
  if (!booking) return res.status(404).json({ error: "Cold storage booking not found" });

  if (booking.payment_status === "20% Advance Paid" || booking.paymentStatus === "20% Advance Paid") {
    return res.status(400).json({ error: "20% Advance has already been paid for this booking.", booking });
  }

  const totalAmount = parseFloat(booking.total_amount || booking.totalAmount) || 10000;
  const requiredAdvance = Math.round(totalAmount * 0.20);
  const paidAmount = parseFloat(amount) || requiredAdvance;
  const method = payment_method || paymentMethod || "UPI Instant Pay";
  const txnId = `TXN-CS-2026-${(db.payments ? db.payments.length + 901 : 1001).toString().padStart(4, "0")}`;
  const now = new Date().toISOString().replace("T", " ").slice(0, 16);

  booking.amount_paid = paidAmount;
  booking.amountPaid = paidAmount;
  booking.required_advance = requiredAdvance;
  booking.requiredAdvance = requiredAdvance;
  booking.remaining_amount = Math.max(0, totalAmount - paidAmount);
  booking.remainingAmount = Math.max(0, totalAmount - paidAmount);
  booking.payment_status = "20% Advance Paid";
  booking.paymentStatus = "20% Advance Paid";
  booking.txn_id = txnId;
  booking.txnId = txnId;
  booking.payment_date = now;
  booking.paymentDate = now;
  booking.payment_method = method;
  booking.paymentMethod = method;

  // Add to payments table
  if (!db.payments) db.payments = [];
  db.payments.unshift({
    id: `TXN_CS_${Date.now().toString().slice(-4)}`,
    txn_code: txnId,
    txnCode: txnId,
    agreement_id: booking.id,
    agreementId: booking.id,
    payer_name: booking.farmer_name || booking.farmerName || "Farmer",
    payerName: booking.farmer_name || booking.farmerName || "Farmer",
    payee_name: booking.facility_name || booking.facilityName || "Cold Storage",
    payeeName: booking.facility_name || booking.facilityName || "Cold Storage",
    amount: paidAmount,
    payment_method: method,
    paymentMethod: method,
    status: "Success",
    reference_number: `REF_CS_${Date.now()}`,
    referenceNumber: `REF_CS_${Date.now()}`,
    created_at: now,
    createdAt: now
  });

  // Log in audit logs
  if (!db.audit_logs) db.audit_logs = [];
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Paid 20% Cold Storage Advance ${txnId}: ₹${paidAmount.toLocaleString()} for Booking ${booking.booking_code || booking.bookingCode || booking.id}`,
    user_name: booking.farmer_name || booking.farmerName || "Farmer",
    role: "FARMER",
    entity: "Cold Storage Booking",
    entity_id: booking.id,
    status: "SUCCESS",
    details: `Total: ₹${totalAmount} | 20% Advance Paid: ₹${paidAmount} | Remaining: ₹${booking.remaining_amount} | Method: ${method}`,
    timestamp: new Date().toISOString()
  });

  saveDb();
  res.json({
    success: true,
    message: "20% Advance payment recorded successfully!",
    booking,
    txn_id: txnId,
    txnId: txnId
  });
});

app.post("/api/cold-storage/bookings/sync", (req, res) => {
  if (Array.isArray(req.body)) {
    db.storage_bookings = req.body;
    saveDb();
  }
  res.json({ success: true, count: (db.storage_bookings || []).length, version: db.version });
});

// -------------------------------------------------------------
// CROPS & MANDI CRUD
// -------------------------------------------------------------
app.get("/api/crops", (req, res) => res.json(db.crops));

app.post("/api/crops", (req, res) => {
  const newCrop = {
    id: req.body.id || `CRP_${Date.now().toString().slice(-4)}`,
    name: req.body.name || "New Commodity",
    category: req.body.category || "Vegetables",
    variety: req.body.variety || "Commercial Hybrid",
    season: req.body.season || "Kharif",
    harvest_status: req.body.harvest_status || "Harvesting Ready",
    expected_price_qtl: parseFloat(req.body.expected_price_qtl) || 2800,
    current_mandi_price: parseFloat(req.body.current_mandi_price) || 2800,
    mandi_name: req.body.mandi_name || "Guntur Mandi",
    unit: req.body.unit || "₹/Quintal",
    change_pct: parseFloat(req.body.change_pct) || 0,
    trend: req.body.trend || "up"
  };
  db.crops.unshift(newCrop);
  saveDb();
  res.json(newCrop);
});

app.put("/api/crops/:id", (req, res) => {
  const crop = db.crops.find(c => c.id === req.params.id);
  if (!crop) return res.status(404).json({ error: "Crop not found" });
  Object.assign(crop, req.body);
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Updated Mandi Rate: ${crop.name} -> ₹${crop.current_mandi_price}/Qtl`,
    user_name: "Admin",
    role: "MASTER_ADMIN",
    entity: "Crop",
    entity_id: crop.id,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json(crop);
});

app.delete("/api/crops/:id", (req, res) => {
  const idx = db.crops.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Crop not found" });
  const removed = db.crops.splice(idx, 1)[0];
  saveDb();
  res.json({ success: true, removed });
});

// -------------------------------------------------------------
// AGREEMENTS / CONTRACTS CRUD
// -------------------------------------------------------------
app.get("/api/agreements", (req, res) => res.json(db.agreements));

app.post("/api/agreements", (req, res) => {
  const newAgr = {
    id: req.body.id || `AGR_${Date.now().toString().slice(-4)}`,
    agreement_code: req.body.agreement_code || req.body.agreementCode || `AGR-2026-${Math.floor(100 + Math.random() * 900)}`,
    farmer_id: req.body.farmer_id || req.body.farmerId || "FAR_201",
    farmer_name: req.body.farmer_name || req.body.farmerName || "Farmer",
    buyer_id: req.body.buyer_id || req.body.buyerId || "BUY_301",
    buyer_name: req.body.buyer_name || req.body.buyerName || "Buyer",
    storage_name: req.body.storage_name || req.body.storageName || "Central Cold Storage",
    crop_name: req.body.crop_name || req.body.cropName || "Tomato",
    quantity_qtl: parseFloat(req.body.quantity_qtl || req.body.quantityQtl) || 50,
    agreed_price_qtl: parseFloat(req.body.agreed_price_qtl || req.body.agreedPriceQtl) || 2800,
    total_value: parseFloat(req.body.total_value || req.body.totalValue) || (parseFloat(req.body.quantity_qtl || req.body.quantityQtl || 50) * parseFloat(req.body.agreed_price_qtl || req.body.agreedPriceQtl || 2800)),
    start_date: req.body.start_date || req.body.startDate || new Date().toISOString().split("T")[0],
    end_date: req.body.end_date || req.body.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    status: req.body.status || "Active"
  };
  db.agreements.unshift(newAgr);
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Created Agreement: ${newAgr.agreement_code} (${newAgr.crop_name})`,
    user_name: newAgr.farmer_name,
    role: "FARMER",
    entity: "Agreement",
    entity_id: newAgr.id,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json(newAgr);
});

app.put("/api/agreements/:id", (req, res) => {
  const idx = db.agreements.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Agreement not found" });
  db.agreements[idx] = { ...db.agreements[idx], ...req.body };
  saveDb();
  res.json(db.agreements[idx]);
});

app.delete("/api/agreements/:id", (req, res) => {
  const idx = db.agreements.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Agreement not found" });
  const removed = db.agreements.splice(idx, 1)[0];
  saveDb();
  res.json({ success: true, removed });
});

// -------------------------------------------------------------
// CROP AI DIAGNOSES / SCANS
// -------------------------------------------------------------
app.get("/api/diagnoses", (req, res) => res.json(db.diagnoses || []));

app.post("/api/diagnoses", (req, res) => {
  if (!db.diagnoses) db.diagnoses = [];
  const newDiag = {
    id: req.body.id || `DIAG_${Date.now().toString().slice(-4)}`,
    timestamp: req.body.timestamp || new Date().toISOString().replace("T", " ").slice(0, 19),
    farmerName: req.body.farmerName || req.body.farmer_name || "Ramesh Kumar",
    cropName: req.body.cropName || req.body.crop_name || "Tomato",
    diseaseName: req.body.diseaseName || req.body.disease_name || "Early Blight",
    confidencePct: parseFloat(req.body.confidencePct || req.body.confidence_pct) || 95.0,
    severity: req.body.severity || "Moderate",
    status: req.body.status || "Verified",
    photoUrl: req.body.photoUrl || req.body.photo_url || "",
    organicRemedy: req.body.organicRemedy || req.body.organic_remedy || "Apply bio-fungicide or Neem oil solution.",
    agronomistNotes: req.body.agronomistNotes || req.body.agronomist_notes || "Under agronomist inspection."
  };
  db.diagnoses.unshift(newDiag);
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Submitted Crop AI Scan: ${newDiag.cropName} (${newDiag.diseaseName})`,
    user_name: newDiag.farmerName,
    role: "FARMER",
    entity: "Crop",
    entity_id: newDiag.id,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json(newDiag);
});

app.patch("/api/diagnoses/:id/status", (req, res) => {
  if (!db.diagnoses) db.diagnoses = [];
  const item = db.diagnoses.find(d => d.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Diagnosis record not found" });
  if (req.body.status) item.status = req.body.status;
  if (req.body.agronomistNotes) item.agronomistNotes = req.body.agronomistNotes;
  saveDb();
  res.json({ success: true, item });
});

app.delete("/api/diagnoses/:id", (req, res) => {
  if (!db.diagnoses) db.diagnoses = [];
  const idx = db.diagnoses.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Diagnosis not found" });
  const removed = db.diagnoses.splice(idx, 1)[0];
  if (!db.audit_logs) db.audit_logs = [];
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Deleted Crop AI Scan: ${removed.cropName || removed.crop || "Crop"} (${removed.diseaseName || removed.condition || "Diagnosis"})`,
    user_name: req.body.admin_name || "Admin",
    role: "MASTER_ADMIN",
    entity: "Crop AI Diagnosis",
    entity_id: removed.id,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json({ success: true, removed });
});

// -------------------------------------------------------------
// CMS & AUDIT LOGS
// -------------------------------------------------------------
app.get("/api/cms", (req, res) => res.json(db.cms));

app.get("/api/cms/:key", (req, res) => {
  res.json(db.cms[req.params.key] || { title: "Sanjeevani", subtitle: "AgriTech Platform" });
});

app.put("/api/cms/:key", (req, res) => {
  db.cms[req.params.key] = { ...db.cms[req.params.key], ...req.body };
  saveDb();
  res.json(db.cms[req.params.key]);
});

app.get("/api/audit-logs", (req, res) => res.json(db.audit_logs));

app.post("/api/audit-logs", (req, res) => {
  const newLog = {
    id: req.body.id || `LOG_${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...req.body
  };
  db.audit_logs.unshift(newLog);
  saveDb();
  res.json(newLog);
});

// Payments & Workers
app.get("/api/payments", (req, res) => {
  const agreementId = req.query.agreement_id || req.query.agreementId;
  let list = db.payments || [];
  if (agreementId) {
    list = list.filter(p => 
      p.agreement_id === agreementId || 
      p.agreementId === agreementId ||
      (p.agreement_id && p.agreement_id.replace("AGR_", "AGR-") === agreementId.replace("AGR_", "AGR-"))
    );
  }
  if (req.query.format === "array" || (!req.query.agreement_id && !req.query.agreementId)) {
    return res.json(list);
  }
  return res.json({ success: true, payments: list, data: list });
});

app.post("/api/payments", (req, res) => {
  if (!db.payments) db.payments = [];
  const count = db.payments.length;
  const code = req.body.txn_code || req.body.txnCode || `TXN-2026-${(count + 901).toString().padStart(4, "0")}`;
  const amountVal = parseFloat(req.body.amount) || 0;
  
  const newPayment = {
    id: req.body.id || `TXN_${Date.now().toString().slice(-4)}`,
    txn_code: code,
    txnCode: code,
    agreement_id: req.body.agreement_id || req.body.agreementId || null,
    agreementId: req.body.agreement_id || req.body.agreementId || null,
    payer_name: req.body.payer_name || req.body.payerName || "Direct Crop Buyer",
    payerName: req.body.payer_name || req.body.payerName || "Direct Crop Buyer",
    payee_name: req.body.payee_name || req.body.payeeName || "Farmer Producer",
    payeeName: req.body.payee_name || req.body.payeeName || "Farmer Producer",
    amount: amountVal,
    payment_method: req.body.payment_method || req.body.paymentMethod || "UPI / Direct Bank Transfer",
    paymentMethod: req.body.payment_method || req.body.paymentMethod || "UPI / Direct Bank Transfer",
    status: req.body.status || "Success",
    reference_number: req.body.reference_number || req.body.referenceNumber || `REF_${Date.now()}`,
    referenceNumber: req.body.reference_number || req.body.referenceNumber || `REF_${Date.now()}`,
    created_at: req.body.created_at || new Date().toISOString().slice(0, 10),
    createdAt: req.body.created_at || new Date().toISOString().slice(0, 10)
  };

  db.payments.unshift(newPayment);

  // Append to Audit Logs
  if (!db.audit_logs) db.audit_logs = [];
  db.audit_logs.unshift({
    id: `LOG_${Date.now()}`,
    action: `Recorded Advance Payment ${code}: ₹${amountVal.toLocaleString()} for Agreement ${newPayment.agreement_id || "N/A"}`,
    user_name: newPayment.payer_name,
    role: "BUYER",
    entity: "Payment",
    entity_id: newPayment.id,
    status: "SUCCESS",
    details: `Amount: ₹${amountVal} | Method: ${newPayment.payment_method} | Ref: ${newPayment.reference_number}`,
    timestamp: new Date().toISOString()
  });

  saveDb();
  res.status(201).json({
    success: true,
    payment: newPayment,
    ...newPayment
  });
});
app.get("/api/workers/requests", (req, res) => res.json(db.worker_requests));
app.post("/api/workers/requests", (req, res) => {
  const newReq = { id: `WR_${Date.now().toString().slice(-4)}`, status: "Requested", created_at: new Date().toISOString(), ...req.body };
  db.worker_requests.unshift(newReq);
  saveDb();
  res.json(newReq);
});

// Global Search
app.get("/api/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const results = [];
  db.farmers.filter(f => (f.full_name && f.full_name.toLowerCase().includes(q)) || (f.phone && f.phone.includes(q))).forEach(f => results.push({ entity: "Farmer", id: f.id, title: f.full_name, subtitle: `${f.village}, ${f.district} • ${f.main_crop}`, status: f.kyc_status, route_module: "farmers" }));
  db.buyers.filter(b => (b.company_name && b.company_name.toLowerCase().includes(q)) || (b.phone && b.phone.includes(q))).forEach(b => results.push({ entity: "Buyer", id: b.id, title: b.company_name, subtitle: `${b.rep_name} • ${b.buyer_type}`, status: b.kyc_status, route_module: "buyers" }));
  db.crops.filter(c => (c.name && c.name.toLowerCase().includes(q))).forEach(c => results.push({ entity: "Crop", id: c.id, title: c.name, subtitle: `₹${c.current_mandi_price}/Qtl at ${c.mandi_name}`, status: c.harvest_status, route_module: "crops" }));
  res.json({ results });
});

// Serve frontend dist if exists
const frontendBuild = path.join(__dirname, "frontend", "dist");
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.use((req, res) => {
    res.sendFile(path.join(frontendBuild, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`SANJEEVANI Unified Platform Server active on port ${PORT}`);
});
