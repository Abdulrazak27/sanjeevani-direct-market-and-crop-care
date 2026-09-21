// Unified Reactive Shared Data Store for Sanjeevani Farmer Web App & Master Admin Portal
// Supports real-time cross-tab synchronization via LocalStorage, Storage Events, and BroadcastChannel

export interface SharedFarmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  mainCrop: string;
  farmSizeAcres: number;
  soilType: string;
  verificationStatus: "Verified" | "Pending Verification" | "Rejected";
  accountStatus: "Active" | "Suspended" | "Deactivated";
  kycDocUrl: string;
  landRecordNo: string;
  previousCrops: string[];
  assignedBuyer: string;
  assignedStorage: string;
  createdDate: string;
  lastActivity: string;
  profilePhoto?: string | null;
}

export interface SharedBuyer {
  id: string;
  companyName: string;
  repName: string;
  phone: string;
  email: string;
  location: string;
  district: string;
  buyerType: string;
  interestedCrops: string[];
  priceOfferedQtl: number;
  minQtyTons: number;
  kycStatus: "Pending" | "Under Review" | "Verified" | "Rejected" | "Suspended";
  accountStatus: "Active" | "Suspended" | "Deactivated";
  kycDocName: string;
  totalAgreements: number;
  createdDate: string;
  lastActivity: string;
}

export interface StorageInventoryBatch {
  id: string;
  cropName: string;
  farmerName: string;
  batchSizeMT: number;
  entryDate: string;
  expiryDate: string;
}

export interface SharedStorage {
  id: string;
  facilityName: string;
  operatorName: string;
  phone: string;
  location: string;
  district: string;
  totalCapacityMT: number;
  occupiedCapacityMT: number;
  availableCapacityMT: number;
  dailyRateQtl: number;
  temperatureC: number;
  humidityPct: number;
  supportedCrops: string[];
  maintenanceStatus: string;
  accountStatus: "Active" | "Suspended";
  inventory: StorageInventoryBatch[];
}

export interface SharedAgreement {
  id: string;
  agreementCode: string;
  farmerName: string;
  buyerName: string;
  cropName: string;
  quantityQtl: number;
  agreedPriceQtl: number;
  totalValue: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Pending" | "Terminated";
  coldStorageAssigned: string;
  createdDate?: string;
}

export interface SharedPayment {
  id: string;
  txnCode: string;
  agreementId: string;
  payerName: string;
  payeeName: string;
  amount: number;
  paymentMethod: string;
  status: "Success" | "Pending" | "Failed";
  referenceNumber?: string;
  createdAt?: string;
}

export interface AdvancePaymentCalculation {
  totalAmount: number;
  requiredAdvance: number;
  amountPaid: number;
  remainingAdvance: number;
  remainingTotal: number;
  paymentStatus: "Pending" | "Partially Paid" | "Paid";
  advancePercentage: number;
}

export interface SharedStorageBooking {
  id: string;
  bookingCode: string;
  facilityId: string;
  facilityName: string;
  location?: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  cropName: string;
  quantityMT: number;
  durationDays: number;
  dailyRateQtl: number;
  totalAmount: number;
  requiredAdvance: number;
  amountPaid: number;
  remainingAmount: number;
  paymentStatus: "Advance Payment Pending" | "20% Advance Paid";
  txnId?: string;
  paymentDate?: string;
  paymentMethod?: string;
  createdAt: string;
}

export interface ColdStorageAdvanceCalculation {
  totalAmount: number;
  requiredAdvance: number;
  amountPaid: number;
  remainingAmount: number;
  advancePercentage: number;
  paymentStatus: "Advance Payment Pending" | "20% Advance Paid";
  isAdvancePaid: boolean;
}

export interface SharedWorkerRequest {
  id: string;
  farmerName: string;
  phone: string;
  workType: string;
  workersNeeded: number;
  date: string;
  location: string;
  status: "Requested" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface SharedMandiPrice {
  id: string;
  crop: string;
  cropTe: string;
  cropHi: string;
  mandi: string;
  price: number;
  unit: string;
  changePct: number;
  trend: "up" | "down";
  updatedAt: string;
}

export interface SharedCropDiagnosis {
  id: string;
  date: string;
  farmerName: string;
  farmerPhone: string;
  location: string;
  crop: string;
  condition: string;
  confidence: number;
  severity: "mild" | "moderate" | "severe" | "healthy";
  image: string;
  treatment: string[];
  status: "New" | "Reviewed" | "Agronomist Verified";
  agronomistNotes?: string;
}

export interface SharedCMS {
  bannerText: string;
  bannerEnabled: boolean;
  supportPhone: string;
  noticeText: string;
  mandiRates: {
    tomato: number;
    chilli: number;
    paddy: number;
    cotton: number;
    onion: number;
    maize: number;
    turmeric: number;
  };
}

export interface SharedAuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userId: string;
  userRole: "ADMIN" | "FARMER" | "BUYER" | "COLD STORAGE OPERATOR";
  module: "Farmer" | "Buyer" | "Cold Storage" | "Crop" | "Agreement" | "User" | "CMS" | "Diagnosis" | "Worker";
  action: string;
  recordId: string;
  prevValue: string;
  newValue: string;
  status: "Success" | "Warning" | "Denied";
}

// -------------------------------------------------------------
// DEFAULT SEED DATA
// -------------------------------------------------------------

const DEFAULT_FARMERS: SharedFarmer[] = [
  {
    id: "FAR_201",
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    village: "Tadikonda",
    district: "Guntur",
    state: "Andhra Pradesh",
    mainCrop: "Tomato",
    farmSizeAcres: 3.5,
    soilType: "Red Sandy Loam",
    verificationStatus: "Verified",
    accountStatus: "Active",
    kycDocUrl: "Aadhaar Verified (XXXX-XXXX-9012)",
    landRecordNo: "PATTADAR_PASSBOOK_8890",
    previousCrops: ["Chilli", "Cotton"],
    assignedBuyer: "Sri Lakshmi Agri Buyers & Processors",
    assignedStorage: "Guntur Central Cold Care & Logistics",
    createdDate: "2026-01-15",
    lastActivity: "Just now"
  },
  {
    id: "FAR_202",
    name: "Venkateswara Rao",
    phone: "+91 98480 12345",
    village: "Tenali",
    district: "Guntur",
    state: "Andhra Pradesh",
    mainCrop: "Chilli",
    farmSizeAcres: 5.0,
    soilType: "Black Cotton Soil",
    verificationStatus: "Verified",
    accountStatus: "Active",
    kycDocUrl: "Aadhaar Verified (XXXX-XXXX-4421)",
    landRecordNo: "PATTADAR_PASSBOOK_4412",
    previousCrops: ["Groundnut", "Maize"],
    assignedBuyer: "AgriProcure South Ltd",
    assignedStorage: "Tenali Farmers Cold Warehouse",
    createdDate: "2026-02-10",
    lastActivity: "1 hour ago"
  },
  {
    id: "FAR_203",
    name: "Srinivasa Reddy",
    phone: "+91 98765 43212",
    village: "Mangalagiri",
    district: "Guntur",
    state: "Andhra Pradesh",
    mainCrop: "Turmeric",
    farmSizeAcres: 4.2,
    soilType: "Alluvial Soil",
    verificationStatus: "Pending Verification",
    accountStatus: "Active",
    kycDocUrl: "Document Submitted (Aadhaar Pending)",
    landRecordNo: "PATTADAR_PASSBOOK_1109",
    previousCrops: ["Pulses"],
    assignedBuyer: "Unassigned",
    assignedStorage: "Unassigned",
    createdDate: "2026-09-18",
    lastActivity: "3 hours ago"
  }
];

const DEFAULT_BUYERS: SharedBuyer[] = [
  {
    id: "BUY_101",
    companyName: "Sri Lakshmi Agri Buyers & Processors",
    repName: "K. Satyanarayana",
    phone: "+91 90000 11001",
    email: "contact@srilakshmiagri.com",
    location: "Guntur Mandi Yard",
    district: "Guntur",
    buyerType: "Wholesaler & Exporter",
    interestedCrops: ["Tomato", "Chilli", "Rice / Paddy"],
    priceOfferedQtl: 2900,
    minQtyTons: 15,
    kycStatus: "Verified",
    accountStatus: "Active",
    kycDocName: "GSTIN_28AABCU9012K1Z9_GST_CERT.pdf",
    totalAgreements: 14,
    createdDate: "2026-01-10",
    lastActivity: "25 mins ago"
  },
  {
    id: "BUY_102",
    companyName: "AgriProcure South Ltd",
    repName: "Vikram Shah",
    phone: "+91 90000 11002",
    email: "procurement@agriprocure.in",
    location: "Vijayawada Commercial Hub",
    district: "Krishna",
    buyerType: "Food Processing Company",
    interestedCrops: ["Rice / Paddy", "Maize", "Cotton"],
    priceOfferedQtl: 2750,
    minQtyTons: 25,
    kycStatus: "Under Review",
    accountStatus: "Active",
    kycDocName: "COMPANY_REGISTRATION_AP2026.pdf",
    totalAgreements: 8,
    createdDate: "2026-08-05",
    lastActivity: "2 hours ago"
  },
  {
    id: "BUY_103",
    companyName: "Apex Grain Mills & Exports",
    repName: "Deepak Patel",
    phone: "+91 90000 11003",
    email: "apex@grainmills.com",
    location: "Hyderabad Industrial Yard",
    district: "Hyderabad",
    buyerType: "Exporter",
    interestedCrops: ["Rice / Paddy", "Groundnut"],
    priceOfferedQtl: 3100,
    minQtyTons: 40,
    kycStatus: "Pending",
    accountStatus: "Active",
    kycDocName: "PAN_CERTIFICATE_APEX.pdf",
    totalAgreements: 2,
    createdDate: "2026-09-15",
    lastActivity: "Yesterday"
  }
];

const DEFAULT_STORAGE: SharedStorage[] = [
  {
    id: "STO_301",
    facilityName: "Guntur Central Cold Care & Logistics",
    operatorName: "Subba Rao",
    phone: "+91 90000 22001",
    location: "NH-16 Highway, Guntur",
    district: "Guntur",
    totalCapacityMT: 5000,
    occupiedCapacityMT: 3800,
    availableCapacityMT: 1200,
    dailyRateQtl: 8,
    temperatureC: 4.5,
    humidityPct: 88,
    supportedCrops: ["Tomato", "Chilli", "Fruits"],
    maintenanceStatus: "Optimal",
    accountStatus: "Active",
    inventory: [
      { id: "INV_1", cropName: "Tomato", farmerName: "Ramesh Kumar", batchSizeMT: 50, entryDate: "2026-09-10", expiryDate: "2026-10-10" },
      { id: "INV_2", cropName: "Chilli", farmerName: "Srinivasa Reddy", batchSizeMT: 120, entryDate: "2026-09-12", expiryDate: "2026-12-12" }
    ]
  },
  {
    id: "STO_302",
    facilityName: "Tenali Farmers Cold Warehouse",
    operatorName: "K. Prasad",
    phone: "+91 90000 22002",
    location: "Tenali Industrial Area",
    district: "Guntur",
    totalCapacityMT: 3000,
    occupiedCapacityMT: 1800,
    availableCapacityMT: 1200,
    dailyRateQtl: 7,
    temperatureC: 3.8,
    humidityPct: 85,
    supportedCrops: ["Rice / Paddy", "Maize", "Pulses"],
    maintenanceStatus: "Optimal",
    accountStatus: "Active",
    inventory: [
      { id: "INV_3", cropName: "Rice / Paddy", farmerName: "Venkateswara Rao", batchSizeMT: 200, entryDate: "2026-09-01", expiryDate: "2027-03-01" }
    ]
  }
];

const DEFAULT_AGREEMENTS: SharedAgreement[] = [
  {
    id: "AGR_880",
    agreementCode: "SANJ-AGR-2026-0901",
    farmerName: "Ramesh Kumar",
    buyerName: "Sri Lakshmi Agri Buyers & Processors",
    cropName: "Tomato (Grade A)",
    quantityQtl: 100,
    agreedPriceQtl: 2850,
    totalValue: 285000,
    startDate: "2026-09-15",
    endDate: "2026-10-15",
    status: "Active",
    coldStorageAssigned: "Guntur Central Cold Care & Logistics"
  },
  {
    id: "AGR_881",
    agreementCode: "SANJ-AGR-2026-0902",
    farmerName: "Venkateswara Rao",
    buyerName: "AgriProcure South Ltd",
    cropName: "Red Chilli (Teja)",
    quantityQtl: 25,
    agreedPriceQtl: 19500,
    totalValue: 487500,
    startDate: "2026-09-18",
    endDate: "2026-11-18",
    status: "Active",
    coldStorageAssigned: "Tenali Farmers Cold Warehouse"
  }
];

const DEFAULT_PAYMENTS: SharedPayment[] = [
  {
    id: "TXN_701",
    txnCode: "TXN-2026-0901",
    agreementId: "AGR_880",
    payerName: "Sri Lakshmi Agri Buyers & Processors",
    payeeName: "Ramesh Kumar",
    amount: 57000,
    paymentMethod: "NEFT Direct Bank",
    status: "Success",
    referenceNumber: "SBI9928172635",
    createdAt: "2026-09-16"
  },
  {
    id: "TXN_702",
    txnCode: "TXN-2026-0902",
    agreementId: "AGR_881",
    payerName: "AgriProcure South Ltd",
    payeeName: "Venkateswara Rao",
    amount: 97500,
    paymentMethod: "RTGS Bank Transfer",
    status: "Success",
    referenceNumber: "HDFC8837162534",
    createdAt: "2026-09-19"
  }
];

export const DEFAULT_STORAGE_BOOKINGS: SharedStorageBooking[] = [
  {
    id: "CSB_501",
    bookingCode: "CSB-2026-001",
    facilityId: "STR_401",
    facilityName: "Sri Lakshmi Agro Cold Storage",
    location: "NH-16 Bypass Road, Guntur",
    farmerId: "FAR_201",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 9876543210",
    cropName: "Tomato (Hybrid Grade A)",
    quantityMT: 10,
    durationDays: 30,
    dailyRateQtl: 12,
    totalAmount: 10000,
    requiredAdvance: 2000,
    amountPaid: 0,
    remainingAmount: 10000,
    paymentStatus: "Advance Payment Pending",
    createdAt: "2026-09-20"
  },
  {
    id: "CSB_502",
    bookingCode: "CSB-2026-002",
    facilityId: "STR_402",
    facilityName: "Guntur Mirchi Yard Mega Cold Storage",
    location: "Mirchi Yard Complex, Guntur",
    farmerId: "FAR_202",
    farmerName: "Venkateswara Rao",
    farmerPhone: "+91 9848012345",
    cropName: "Red Chilli (Teja Supreme)",
    quantityMT: 25,
    durationDays: 60,
    dailyRateQtl: 14,
    totalAmount: 25000,
    requiredAdvance: 5000,
    amountPaid: 5000,
    remainingAmount: 20000,
    paymentStatus: "20% Advance Paid",
    txnId: "TXN-CS-2026-0902",
    paymentDate: "2026-09-18 14:30",
    paymentMethod: "UPI Instant Pay",
    createdAt: "2026-09-18"
  }
];

const DEFAULT_WORKER_REQUESTS: SharedWorkerRequest[] = [
  {
    id: "wr_001",
    farmerName: "Ramesh Kumar",
    phone: "+91 98765 43210",
    workType: "Tomato Harvesting",
    workersNeeded: 6,
    date: "Tomorrow",
    location: "Tadikonda, Guntur",
    status: "Requested",
    createdAt: "2026-09-20 09:30 AM"
  },
  {
    id: "wr_002",
    farmerName: "Venkateswara Rao",
    phone: "+91 98480 12345",
    workType: "Field Weeding & Cleaning",
    workersNeeded: 4,
    date: "2026-09-22",
    location: "Tenali, Guntur",
    status: "Assigned",
    createdAt: "2026-09-19 02:15 PM"
  }
];

const DEFAULT_MANDI_PRICES: SharedMandiPrice[] = [
  {
    id: "m_001",
    crop: "Tomato (Hybrid Grade A)",
    cropTe: "టమోటా (హైబ్రిడ్ గ్రేడ్ A)",
    cropHi: "टमाटर (हाइब्रिड)",
    mandi: "Guntur Mandi",
    price: 2800,
    unit: "₹/Quintal",
    changePct: 5.2,
    trend: "up",
    updatedAt: "Today 08:30 AM"
  },
  {
    id: "m_002",
    crop: "Red Chilli (Teja / Dry)",
    cropTe: "ఎండు మిర్చి (తేజ)",
    cropHi: "लाल मिर्च (तेजा)",
    mandi: "Guntur Mirchi Yard",
    price: 19200,
    unit: "₹/Quintal",
    changePct: 3.8,
    trend: "up",
    updatedAt: "Today 08:30 AM"
  },
  {
    id: "m_003",
    crop: "Turmeric (Salem Finger)",
    cropTe: "పసుపు కొమ్ములు",
    cropHi: "హल्दी गांठ",
    mandi: "Duggirala Market",
    price: 13500,
    unit: "₹/Quintal",
    changePct: 1.5,
    trend: "up",
    updatedAt: "Today 08:30 AM"
  },
  {
    id: "m_004",
    crop: "Cotton (Shankar-6)",
    cropTe: "పత్తి",
    cropHi: "कपास",
    mandi: "Adoni Mandi",
    price: 7450,
    unit: "₹/Quintal",
    changePct: -0.8,
    trend: "down",
    updatedAt: "Today 08:30 AM"
  }
];

const DEFAULT_DIAGNOSES: SharedCropDiagnosis[] = [
  {
    id: "diag_101",
    date: "2026-09-18 10:30 AM",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98765 43210",
    location: "Tadikonda, Guntur",
    crop: "Tomato",
    condition: "Early Blight (Alternaria solani)",
    confidence: 0.94,
    severity: "moderate",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=400&q=80",
    treatment: [
      "Remove and destroy severely infected lower leaves.",
      "Ensure wide plant spacing for proper airflow and sunlight penetration.",
      "Apply organic neem oil solution (5ml/liter of water) during early morning.",
      "Avoid overhead irrigation to prevent leaf moisture buildup."
    ],
    status: "Agronomist Verified",
    agronomistNotes: "Approved organic spray protocol. Recommended repeat application in 7 days."
  },
  {
    id: "diag_102",
    date: "2026-09-12 04:15 PM",
    farmerName: "Venkateswara Rao",
    farmerPhone: "+91 98480 12345",
    location: "Tenali, Guntur",
    crop: "Chilli",
    condition: "Chilli Leaf Curl Virus",
    confidence: 0.89,
    severity: "severe",
    image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=400&q=80",
    treatment: [
      "Install yellow sticky traps (10 traps per acre) to control whiteflies.",
      "Spray organic bio-pesticide Verticillium lecanii.",
      "Remove heavily stunted plants to stop virus transmission."
    ],
    status: "Reviewed",
    agronomistNotes: "Whitefly vector confirmed. Deploy yellow sticky traps immediately."
  },
  {
    id: "diag_103",
    date: "2026-09-02 09:00 AM",
    farmerName: "Srinivasa Reddy",
    farmerPhone: "+91 98765 43212",
    location: "Mangalagiri, Guntur",
    crop: "Cotton",
    condition: "Healthy Leaf - No supported disease detected",
    confidence: 0.97,
    severity: "healthy",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=80",
    treatment: [
      "Crop appears healthy! Maintain balanced NPK fertilization.",
      "Continue weekly field monitoring."
    ],
    status: "Reviewed"
  }
];

const DEFAULT_CMS: SharedCMS = {
  bannerText: "🚨 Monsoon Mandi Special: Direct crop procurement active across AP & Telangana with 0% commission!",
  bannerEnabled: true,
  supportPhone: "8977520059",
  noticeText: "Special Procurement Drive: Guntur Mirchi Yard live rates +5.2% above MSP.",
  mandiRates: {
    tomato: 2800,
    chilli: 19200,
    paddy: 2750,
    cotton: 7450,
    onion: 1950,
    maize: 2100,
    turmeric: 13500
  }
};

const DEFAULT_AUDIT_LOGS: SharedAuditLog[] = [
  {
    id: "LOG_901",
    timestamp: "2026-09-20 18:45:10",
    userName: "Hitaishi Admin",
    userId: "ADM_001",
    userRole: "ADMIN",
    module: "Buyer",
    action: "Approve Buyer KYC",
    recordId: "BUY_101",
    prevValue: "KYC Status: Under Review",
    newValue: "KYC Status: Verified",
    status: "Success"
  },
  {
    id: "LOG_902",
    timestamp: "2026-09-20 15:30:22",
    userName: "Ramesh Kumar",
    userId: "FAR_201",
    userRole: "FARMER",
    module: "Crop",
    action: "Updated Soil & Crop Record",
    recordId: "FAR_201",
    prevValue: "Soil: Red Sandy, Crop: Tomato",
    newValue: "Soil: Red Sandy Loam, Crop: Tomato",
    status: "Success"
  },
  {
    id: "LOG_903",
    timestamp: "2026-09-20 14:15:00",
    userName: "Sri Lakshmi Agri Buyers",
    userId: "BUY_101",
    userRole: "BUYER",
    module: "Agreement",
    action: "Submitted Direct Procurement Contract",
    recordId: "AGR_880",
    prevValue: "Status: Draft",
    newValue: "Status: Active Contract (100 Quintals)",
    status: "Success"
  }
];

// -------------------------------------------------------------
// CENTRALIZED BACKEND API SYNCHRONIZATION ENGINE
// -------------------------------------------------------------

export const getApiBaseUrl = (): string => {
  if (typeof window === "undefined") return "http://localhost:3000/api";
  if ((window as any).__SANJEEVANI_API_URL__) return (window as any).__SANJEEVANI_API_URL__;
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:3000/api";
  }
  return "/api";
};

let lastKnownVersion = 0;
let isSyncing = false;

export const syncAllFromBackend = async (): Promise<boolean> => {
  if (isSyncing || typeof window === "undefined") return false;
  isSyncing = true;
  try {
    const res = await fetch(`${getApiBaseUrl()}/sync/all`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      lastKnownVersion = data.version || Date.now();

      if (data.farmers && Array.isArray(data.farmers)) {
        const mappedFarmers: SharedFarmer[] = data.farmers.map((f: any) => ({
          id: f.id,
          name: f.full_name || f.name,
          phone: f.phone,
          village: f.village,
          district: f.district,
          state: f.state || "Andhra Pradesh",
          mainCrop: f.main_crop || f.mainCrop || "Tomato",
          farmSizeAcres: parseFloat(f.farm_size_acres || f.farmSizeAcres) || 3.0,
          soilType: f.soil_type || f.soilType || "Red Sandy Loam",
          verificationStatus: (f.kyc_status === "Verified" ? "Verified" : f.kyc_status === "Rejected" ? "Rejected" : "Pending Verification") as any,
          accountStatus: (f.account_status || "Active") as any,
          kycDocUrl: f.kyc_doc_url || f.kycDocUrl || "Self Declared",
          landRecordNo: f.land_record_no || f.landRecordNo || "PENDING_VERIFY",
          previousCrops: f.previous_crops || f.previousCrops || [],
          assignedBuyer: f.assigned_buyer || f.assignedBuyer || "Unassigned",
          assignedStorage: f.assigned_storage || f.assignedStorage || "Unassigned",
          createdDate: f.created_at || f.createdDate || new Date().toISOString().slice(0, 10),
          lastActivity: f.last_activity || f.lastActivity || "Active",
          profilePhoto: f.profile_photo_url || f.profilePhoto || null
        }));
        localStorage.setItem("sanjeevani_farmers", JSON.stringify(mappedFarmers));
      }

      if (data.buyers && Array.isArray(data.buyers)) {
        const mappedBuyers: SharedBuyer[] = data.buyers.map((b: any) => ({
          id: b.id,
          companyName: b.company_name || b.companyName,
          repName: b.rep_name || b.repName,
          phone: b.phone,
          email: b.email || "buyer@agri.com",
          location: b.location,
          district: b.district,
          buyerType: b.buyer_type || b.buyerType || "Wholesaler",
          interestedCrops: b.interested_crops || b.interestedCrops || ["Tomato"],
          priceOfferedQtl: parseFloat(b.price_offered_qtl || b.priceOfferedQtl) || 2800,
          minQtyTons: parseFloat(b.min_qty_tons || b.minQtyTons) || 5,
          kycStatus: (b.kyc_status || b.kycStatus || "Verified") as any,
          accountStatus: (b.account_status || b.accountStatus || "Active") as any,
          kycDocName: b.kyc_doc_name || b.kycDocName || "Trade_License.pdf",
          totalAgreements: b.total_agreements || b.totalAgreements || 0,
          createdDate: b.created_at || b.createdDate || new Date().toISOString().slice(0, 10),
          lastActivity: b.last_activity || b.lastActivity || "Just now"
        }));
        localStorage.setItem("sanjeevani_buyers", JSON.stringify(mappedBuyers));
      }

      if (data.storage && Array.isArray(data.storage)) {
        const mappedStorage: SharedStorage[] = data.storage.map((s: any) => ({
          id: s.id,
          facilityName: s.facility_name || s.facilityName,
          operatorName: s.operator_name || s.operatorName,
          phone: s.phone,
          location: s.location,
          district: s.district,
          totalCapacityMT: parseFloat(s.total_capacity_mt || s.totalCapacityMT) || 1000,
          occupiedCapacityMT: parseFloat(s.occupied_capacity_mt || s.occupiedCapacityMT) || 0,
          availableCapacityMT: parseFloat(s.available_capacity_mt || s.availableCapacityMT) || 1000,
          dailyRateQtl: parseFloat(s.daily_rate_qtl || s.dailyRateQtl) || 10,
          temperatureC: parseFloat(s.temperature_c || s.temperatureC) || 3.5,
          humidityPct: parseFloat(s.humidity_pct || s.humidityPct) || 85,
          supportedCrops: s.supported_crops || s.supportedCrops || ["Tomato"],
          maintenanceStatus: s.maintenance_status || s.maintenanceStatus || "Optimal",
          accountStatus: (s.account_status || s.accountStatus || "Active") as any,
          inventory: s.inventory || []
        }));
        localStorage.setItem("sanjeevani_storage", JSON.stringify(mappedStorage));
      }

      if (data.crops && Array.isArray(data.crops)) {
        const mappedCrops: SharedMandiPrice[] = data.crops.map((c: any) => ({
          id: c.id,
          crop: c.name,
          cropTe: c.name_te || c.cropTe || c.name,
          cropHi: c.name_hi || c.cropHi || c.name,
          mandi: c.mandi_name || c.mandi || "Guntur Mandi",
          price: parseFloat(c.current_mandi_price || c.price) || 2800,
          changePct: parseFloat(c.change_pct || c.changePct) || 0,
          trend: (c.trend || "up") as any,
          updatedAt: c.updated_at || c.updatedAt || "Live APMC Feed"
        }));
        localStorage.setItem("sanjeevani_mandi_prices", JSON.stringify(mappedCrops));
      }

      if (data.agreements && Array.isArray(data.agreements)) {
        const mappedAgreements: SharedAgreement[] = data.agreements.map((a: any) => ({
          id: a.id,
          agreementCode: a.agreement_code || a.agreementCode || a.id,
          farmerName: a.farmer_name || a.farmerName,
          buyerName: a.buyer_name || a.buyerName,
          cropName: a.crop_name || a.cropName,
          quantityQtl: parseFloat(a.quantity_qtl || a.quantityQtl) || 50,
          agreedPriceQtl: parseFloat(a.agreed_price_qtl || a.agreedPriceQtl) || 2800,
          totalValue: parseFloat(a.total_value || a.totalValue) || 140000,
          startDate: a.start_date || a.startDate || new Date().toISOString().slice(0, 10),
          endDate: a.end_date || a.endDate || new Date().toISOString().slice(0, 10),
          status: (a.status || "Active") as any,
          coldStorageAssigned: a.storage_name || a.coldStorageAssigned || "Central Cold Storage",
          createdDate: a.created_at || a.createdDate || a.start_date
        }));
        localStorage.setItem("sanjeevani_agreements", JSON.stringify(mappedAgreements));
      }

      if (data.diagnoses && Array.isArray(data.diagnoses)) {
        localStorage.setItem("sanjeevani_diagnoses", JSON.stringify(data.diagnoses));
      }

      if (data.cms) {
        const hero = data.cms.hero_banner || data.cms;
        const mappedCMS: SharedCMS = {
          bannerText: hero.notice_text || hero.bannerText || DEFAULT_CMS.bannerText,
          bannerEnabled: hero.is_active !== undefined ? hero.is_active : (hero.bannerEnabled !== undefined ? hero.bannerEnabled : true),
          supportPhone: hero.support_phone || hero.supportPhone || DEFAULT_CMS.supportPhone,
          noticeText: hero.notice_text || hero.noticeText || DEFAULT_CMS.noticeText,
          mandiRates: hero.mandiRates || DEFAULT_CMS.mandiRates
        };
        localStorage.setItem("sanjeevani_cms", JSON.stringify(mappedCMS));
      }

      if (data.audit_logs && Array.isArray(data.audit_logs)) {
        localStorage.setItem("sanjeevani_audit_logs", JSON.stringify(data.audit_logs));
      }

      if (data.payments && Array.isArray(data.payments)) {
        const mappedPayments: SharedPayment[] = data.payments.map((p: any) => ({
          id: p.id,
          txnCode: p.txn_code || p.txnCode || p.id,
          agreementId: p.agreement_id || p.agreementId,
          payerName: p.payer_name || p.payerName || "Buyer",
          payeeName: p.payee_name || p.payeeName || "Farmer",
          amount: parseFloat(p.amount) || 0,
          paymentMethod: p.payment_method || p.paymentMethod || "Direct Bank Transfer",
          status: (p.status || "Success") as any,
          referenceNumber: p.reference_number || p.referenceNumber,
          createdAt: p.created_at || p.createdAt || new Date().toISOString().slice(0, 10)
        }));
        localStorage.setItem("sanjeevani_payments", JSON.stringify(mappedPayments));
      }

      if (data.storage_bookings && Array.isArray(data.storage_bookings)) {
        const mappedStorageBookings: SharedStorageBooking[] = data.storage_bookings.map((b: any) => ({
          id: b.id,
          bookingCode: b.booking_code || b.bookingCode || b.id,
          facilityId: b.facility_id || b.facilityId || "STR_401",
          facilityName: b.facility_name || b.facilityName || "Cold Storage",
          location: b.location,
          farmerId: b.farmer_id || b.farmerId || "FAR_201",
          farmerName: b.farmer_name || b.farmerName || "Farmer",
          farmerPhone: b.farmer_phone || b.farmerPhone,
          cropName: b.crop_name || b.cropName || "Tomato",
          quantityMT: parseFloat(b.quantity_mt || b.quantityMT) || 10,
          durationDays: parseInt(b.duration_days || b.durationDays) || 30,
          dailyRateQtl: parseFloat(b.daily_rate_qtl || b.dailyRateQtl) || 12,
          totalAmount: parseFloat(b.total_amount || b.totalAmount) || 10000,
          requiredAdvance: parseFloat(b.required_advance || b.requiredAdvance) || Math.round((parseFloat(b.total_amount || b.totalAmount) || 10000) * 0.20),
          amountPaid: parseFloat(b.amount_paid || b.amountPaid) || 0,
          remainingAmount: parseFloat(b.remaining_amount || b.remainingAmount) || (parseFloat(b.total_amount || b.totalAmount) || 10000),
          paymentStatus: (b.payment_status || b.paymentStatus || "Advance Payment Pending") as any,
          txnId: b.txn_id || b.txnId,
          paymentDate: b.payment_date || b.paymentDate,
          paymentMethod: b.payment_method || b.paymentMethod,
          createdAt: b.created_at || b.createdAt || new Date().toISOString().slice(0, 10)
        }));
        localStorage.setItem("sanjeevani_storage_bookings", JSON.stringify(mappedStorageBookings));
      }

      notifyStorageUpdate("sync_all", { timestamp: Date.now() });
      return true;
    }
  } catch (err) {
    // console.warn("Backend sync notice:", err);
  } finally {
    isSyncing = false;
  }
  return false;
};

// Start background poll to keep both separate URLs in lockstep sync
if (typeof window !== "undefined") {
  syncAllFromBackend();

  setInterval(async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/sync/state`, { cache: "no-store" });
      if (res.ok) {
        const state = await res.json();
        if (state.version && state.version !== lastKnownVersion) {
          await syncAllFromBackend();
        }
      }
    } catch {}
  }, 2000);
}

// -------------------------------------------------------------
// BROADCAST CHANNEL & EVENT DISPATCHING
// -------------------------------------------------------------

let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    broadcastChannel = new BroadcastChannel("sanjeevani_sync_hub");
    broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.type === "sanjeevani_storage_update") {
        window.dispatchEvent(new CustomEvent("sanjeevani_storage_update", { detail: event.data }));
      }
    };
  } catch (e) {
    console.warn("BroadcastChannel not available:", e);
  }
}

export const notifyStorageUpdate = (entityKey?: string, data?: any) => {
  if (typeof window === "undefined") return;
  const payload = { type: "sanjeevani_storage_update", entityKey, data, timestamp: Date.now() };
  window.dispatchEvent(new CustomEvent("sanjeevani_storage_update", { detail: payload }));
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(payload);
    } catch (e) {
      console.warn("Failed to post broadcast message:", e);
    }
  }
};

// -------------------------------------------------------------
// FARMERS GET / SAVE / UPSERT / DELETE
// -------------------------------------------------------------

export const getSharedFarmers = (): SharedFarmer[] => {
  try {
    const raw = localStorage.getItem("sanjeevani_farmers");
    return raw ? JSON.parse(raw) : DEFAULT_FARMERS;
  } catch {
    return DEFAULT_FARMERS;
  }
};

export const saveSharedFarmers = (farmers: SharedFarmer[]) => {
  localStorage.setItem("sanjeevani_farmers", JSON.stringify(farmers));
  notifyStorageUpdate("farmers", farmers);
  fetch(`${getApiBaseUrl()}/farmers/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(farmers)
  }).catch(() => {});
};

export const upsertSharedFarmer = (farmerData: Partial<SharedFarmer> & { phone: string; name: string }): SharedFarmer => {
  const list = getSharedFarmers();
  const cleanPhone = farmerData.phone.replace(/\s+/g, "");
  const existingIndex = list.findIndex(
    f => f.phone.replace(/\s+/g, "") === cleanPhone || (farmerData.id && f.id === farmerData.id)
  );

  let updatedRecord: SharedFarmer;

  if (existingIndex >= 0) {
    updatedRecord = {
      ...list[existingIndex],
      ...farmerData,
      lastActivity: "Just now"
    };
    list[existingIndex] = updatedRecord;
  } else {
    updatedRecord = {
      id: farmerData.id || `FAR_${Date.now().toString().slice(-4)}`,
      name: farmerData.name,
      phone: farmerData.phone,
      village: farmerData.village || "Guntur Rural",
      district: farmerData.district || "Guntur",
      state: farmerData.state || "Andhra Pradesh",
      mainCrop: farmerData.mainCrop || "Tomato",
      farmSizeAcres: farmerData.farmSizeAcres || 3.0,
      soilType: farmerData.soilType || "Red Sandy Loam",
      verificationStatus: farmerData.verificationStatus || "Pending Verification",
      accountStatus: farmerData.accountStatus || "Active",
      kycDocUrl: farmerData.kycDocUrl || "Self Declared",
      landRecordNo: farmerData.landRecordNo || "PENDING_VERIFY",
      previousCrops: farmerData.previousCrops || [],
      assignedBuyer: farmerData.assignedBuyer || "Unassigned",
      assignedStorage: farmerData.assignedStorage || "Unassigned",
      createdDate: new Date().toISOString().slice(0, 10),
      lastActivity: "Just registered",
      profilePhoto: farmerData.profilePhoto || null
    };
    list.unshift(updatedRecord);
  }

  saveSharedFarmers(list);

  // Sync to Backend REST API
  fetch(`${getApiBaseUrl()}/farmers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: updatedRecord.id,
      full_name: updatedRecord.name,
      phone: updatedRecord.phone,
      village: updatedRecord.village,
      district: updatedRecord.district,
      state: updatedRecord.state,
      main_crop: updatedRecord.mainCrop,
      farm_size_acres: updatedRecord.farmSizeAcres,
      soil_type: updatedRecord.soilType,
      kyc_status: updatedRecord.verificationStatus === "Verified" ? "Verified" : "Pending",
      account_status: updatedRecord.accountStatus
    })
  }).catch(() => {});

  return updatedRecord;
};

export const deleteSharedFarmer = (farmerId: string) => {
  const current = getSharedFarmers().filter(f => f.id !== farmerId);
  saveSharedFarmers(current);
  fetch(`${getApiBaseUrl()}/farmers/${farmerId}`, { method: "DELETE" }).catch(() => {});
};

// -------------------------------------------------------------
// BUYERS GET / SAVE / ADD / UPDATE / DELETE
// -------------------------------------------------------------

export const getSharedBuyers = (): SharedBuyer[] => {
  try {
    const raw = localStorage.getItem("sanjeevani_buyers");
    return raw ? JSON.parse(raw) : DEFAULT_BUYERS;
  } catch {
    return DEFAULT_BUYERS;
  }
};

export const saveSharedBuyers = (buyers: SharedBuyer[]) => {
  localStorage.setItem("sanjeevani_buyers", JSON.stringify(buyers));
  notifyStorageUpdate("buyers", buyers);
  fetch(`${getApiBaseUrl()}/buyers/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buyers)
  }).catch(() => {});
};

export const addSharedBuyer = (buyer: Partial<SharedBuyer>): SharedBuyer => {
  const list = getSharedBuyers();
  const newBuyer: SharedBuyer = {
    id: buyer.id || `BUY_${Date.now().toString().slice(-4)}`,
    companyName: buyer.companyName || "New Agri Buyer",
    repName: buyer.repName || "Representative",
    phone: buyer.phone || "+91 90000 00000",
    email: buyer.email || "buyer@agri.com",
    location: buyer.location || "Mandi Yard",
    district: buyer.district || "Guntur",
    buyerType: buyer.buyerType || "Wholesaler",
    interestedCrops: buyer.interestedCrops || ["Tomato"],
    priceOfferedQtl: buyer.priceOfferedQtl || 2500,
    minQtyTons: buyer.minQtyTons || 5,
    kycStatus: buyer.kycStatus || "Verified",
    accountStatus: buyer.accountStatus || "Active",
    kycDocName: buyer.kycDocName || "DOC_SUBMITTED.pdf",
    totalAgreements: 0,
    createdDate: new Date().toISOString().slice(0, 10),
    lastActivity: "Just now"
  };
  list.unshift(newBuyer);
  saveSharedBuyers(list);

  // Sync to Backend REST API
  fetch(`${getApiBaseUrl()}/buyers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: newBuyer.id,
      company_name: newBuyer.companyName,
      rep_name: newBuyer.repName,
      phone: newBuyer.phone,
      email: newBuyer.email,
      location: newBuyer.location,
      district: newBuyer.district,
      buyer_type: newBuyer.buyerType,
      interested_crops: newBuyer.interestedCrops,
      price_offered_qtl: newBuyer.priceOfferedQtl,
      min_qty_tons: newBuyer.minQtyTons,
      kyc_status: newBuyer.kycStatus,
      account_status: newBuyer.accountStatus
    })
  }).catch(() => {});

  return newBuyer;
};

export const updateSharedBuyer = (buyerId: string, updates: Partial<SharedBuyer>) => {
  const list = getSharedBuyers();
  const idx = list.findIndex(b => b.id === buyerId);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    saveSharedBuyers(list);
    fetch(`${getApiBaseUrl()}/buyers/${buyerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    }).catch(() => {});
  }
};

export const deleteSharedBuyer = (buyerId: string) => {
  const current = getSharedBuyers().filter(b => b.id !== buyerId);
  saveSharedBuyers(current);
  fetch(`${getApiBaseUrl()}/buyers/${buyerId}`, { method: "DELETE" }).catch(() => {});
};

// -------------------------------------------------------------
// COLD STORAGE GET / SAVE / ADD / UPDATE / DELETE / BOOK
// -------------------------------------------------------------

export const getSharedStorage = (): SharedStorage[] => {
  try {
    const raw = localStorage.getItem("sanjeevani_storage");
    return raw ? JSON.parse(raw) : DEFAULT_STORAGE;
  } catch {
    return DEFAULT_STORAGE;
  }
};

export const saveSharedStorage = (storage: SharedStorage[]) => {
  localStorage.setItem("sanjeevani_storage", JSON.stringify(storage));
  notifyStorageUpdate("storage", storage);
  fetch(`${getApiBaseUrl()}/cold-storage/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(storage)
  }).catch(() => {});
};

export const addSharedStorage = (facility: Partial<SharedStorage>): SharedStorage => {
  const storages = getSharedStorage();
  const newStorage: SharedStorage = {
    id: facility.id || `STR_${Date.now().toString().slice(-4)}`,
    facilityName: facility.facilityName || "Cold Storage Facility",
    operatorName: facility.operatorName || "Facility Operator",
    phone: facility.phone || "+91 98480 33441",
    location: facility.location || "Guntur Hub",
    district: facility.district || "Guntur",
    totalCapacityMT: facility.totalCapacityMT || 1000,
    occupiedCapacityMT: facility.occupiedCapacityMT || 0,
    availableCapacityMT: facility.availableCapacityMT || 1000,
    dailyRateQtl: facility.dailyRateQtl || 10,
    temperatureC: facility.temperatureC || 3.5,
    humidityPct: facility.humidityPct || 85,
    supportedCrops: facility.supportedCrops || ["Tomato", "Chilli"],
    maintenanceStatus: facility.maintenanceStatus || "Optimal",
    accountStatus: facility.accountStatus || "Active",
    inventory: facility.inventory || []
  };
  storages.unshift(newStorage);
  saveSharedStorage(storages);

  // Sync to Backend REST API
  fetch(`${getApiBaseUrl()}/cold-storage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: newStorage.id,
      facility_name: newStorage.facilityName,
      operator_name: newStorage.operatorName,
      phone: newStorage.phone,
      location: newStorage.location,
      district: newStorage.district,
      total_capacity_mt: newStorage.totalCapacityMT,
      occupied_capacity_mt: newStorage.occupiedCapacityMT,
      available_capacity_mt: newStorage.availableCapacityMT,
      daily_rate_qtl: newStorage.dailyRateQtl,
      temperature_c: newStorage.temperatureC,
      humidity_pct: newStorage.humidityPct,
      supported_crops: newStorage.supportedCrops,
      maintenance_status: newStorage.maintenanceStatus,
      account_status: newStorage.accountStatus
    })
  }).catch(() => {});

  return newStorage;
};

export const updateSharedStorage = (storageId: string, updates: Partial<SharedStorage>) => {
  const storages = getSharedStorage();
  const idx = storages.findIndex(s => s.id === storageId);
  if (idx !== -1) {
    storages[idx] = { ...storages[idx], ...updates };
    saveSharedStorage(storages);
    fetch(`${getApiBaseUrl()}/cold-storage/${storageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    }).catch(() => {});
  }
};

export const deleteSharedStorage = (storageId: string) => {
  const current = getSharedStorage().filter(s => s.id !== storageId);
  saveSharedStorage(current);
  fetch(`${getApiBaseUrl()}/cold-storage/${storageId}`, { method: "DELETE" }).catch(() => {});
};

export const bookStorageBatch = (facilityId: string, booking: {
  cropName: string;
  farmerName: string;
  batchSizeMT: number;
  durationMonths?: number;
}): boolean => {
  const storages = getSharedStorage();
  const target = storages.find(s => s.id === facilityId);
  if (!target) return false;

  target.occupiedCapacityMT = Math.min(target.totalCapacityMT, target.occupiedCapacityMT + booking.batchSizeMT);
  target.availableCapacityMT = Math.max(0, target.totalCapacityMT - target.occupiedCapacityMT);

  const entryDate = new Date().toISOString().slice(0, 10);
  const exp = new Date();
  exp.setMonth(exp.getMonth() + (booking.durationMonths || 3));
  const expiryDate = exp.toISOString().slice(0, 10);

  target.inventory.unshift({
    id: `INV_${Date.now().toString().slice(-4)}`,
    cropName: booking.cropName,
    farmerName: booking.farmerName,
    batchSizeMT: booking.batchSizeMT,
    entryDate,
    expiryDate
  });

  saveSharedStorage(storages);

  // Sync to Backend REST API
  fetch(`${getApiBaseUrl()}/cold-storage/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      facility_id: facilityId,
      crop_name: booking.cropName,
      farmer_name: booking.farmerName,
      batch_size_mt: booking.batchSizeMT,
      expiry_date: expiryDate
    })
  }).catch(() => {});

  addSharedAuditLog({
    userName: booking.farmerName,
    userId: "FARMER_CLIENT",
    userRole: "FARMER",
    module: "Cold Storage",
    action: `Booked ${booking.batchSizeMT} MT at ${target.facilityName}`,
    recordId: target.id,
    prevValue: `Available: ${target.availableCapacityMT + booking.batchSizeMT} MT`,
    newValue: `Available: ${target.availableCapacityMT} MT`,
    status: "Success"
  });

  return true;
};

// -------------------------------------------------------------
// AGREEMENTS GET / SAVE / ADD / DELETE
// -------------------------------------------------------------

export const getSharedAgreements = (): SharedAgreement[] => {
  try {
    const raw = localStorage.getItem("sanjeevani_agreements");
    return raw ? JSON.parse(raw) : DEFAULT_AGREEMENTS;
  } catch {
    return DEFAULT_AGREEMENTS;
  }
};

export const saveSharedAgreements = (agreements: SharedAgreement[]) => {
  localStorage.setItem("sanjeevani_agreements", JSON.stringify(agreements));
  notifyStorageUpdate("agreements", agreements);
  fetch(`${getApiBaseUrl()}/agreements/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agreements)
  }).catch(() => {});
};

export const addSharedAgreement = (agr: Omit<SharedAgreement, "id" | "agreementCode">): SharedAgreement => {
  const current = getSharedAgreements();
  const newAgr: SharedAgreement = {
    ...agr,
    id: `AGR_${Date.now().toString().slice(-4)}`,
    agreementCode: `SANJ-AGR-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
    createdDate: new Date().toISOString().slice(0, 10)
  };
  const updated = [newAgr, ...current];
  saveSharedAgreements(updated);

  // Sync to Backend REST API
  fetch(`${getApiBaseUrl()}/agreements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: newAgr.id,
      agreement_code: newAgr.agreementCode,
      farmer_name: newAgr.farmerName,
      buyer_name: newAgr.buyerName,
      storage_name: newAgr.coldStorageAssigned,
      crop_name: newAgr.cropName,
      quantity_qtl: newAgr.quantityQtl,
      agreed_price_qtl: newAgr.agreedPriceQtl,
      total_value: newAgr.totalValue,
      start_date: newAgr.startDate,
      end_date: newAgr.endDate,
      status: newAgr.status
    })
  }).catch(() => {});

  addSharedAuditLog({
    userName: agr.farmerName,
    userId: "FARMER_CLIENT",
    userRole: "FARMER",
    module: "Agreement",
    action: `Created Procurement Agreement with ${agr.buyerName}`,
    recordId: newAgr.id,
    prevValue: "None",
    newValue: `${agr.cropName} (${agr.quantityQtl} Qtl @ ₹${agr.agreedPriceQtl})`,
    status: "Success"
  });

  return newAgr;
};

export const deleteSharedAgreement = (agreementId: string) => {
  const current = getSharedAgreements().filter(a => a.id !== agreementId);
  saveSharedAgreements(current);
  fetch(`${getApiBaseUrl()}/agreements/${agreementId}`, { method: "DELETE" }).catch(() => {});
};

// -------------------------------------------------------------
// WORKER REQUESTS GET / SAVE / ADD
// -------------------------------------------------------------

export const getSharedWorkerRequests = (): SharedWorkerRequest[] => {
  try {
    const raw = localStorage.getItem("sanjeevani_worker_requests");
    return raw ? JSON.parse(raw) : DEFAULT_WORKER_REQUESTS;
  } catch {
    return DEFAULT_WORKER_REQUESTS;
  }
};

export const saveSharedWorkerRequests = (reqs: SharedWorkerRequest[]) => {
  localStorage.setItem("sanjeevani_worker_requests", JSON.stringify(reqs));
  notifyStorageUpdate("worker_requests", reqs);
};

export const addSharedWorkerRequest = (req: Omit<SharedWorkerRequest, "id" | "createdAt">): SharedWorkerRequest => {
  const current = getSharedWorkerRequests();
  const newReq: SharedWorkerRequest = {
    ...req,
    id: `wr_${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })
  };
  const updated = [newReq, ...current];
  saveSharedWorkerRequests(updated);

  fetch(`${getApiBaseUrl()}/workers/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: newReq.id,
      farmer_name: req.farmerName,
      phone: req.phone,
      work_type: req.workType,
      workers_needed: req.workersNeeded,
      date: req.date,
      location: req.location
    })
  }).catch(() => {});

  addSharedAuditLog({
    userName: req.farmerName,
    userId: "FARMER_CLIENT",
    userRole: "FARMER",
    module: "Worker",
    action: `Requested ${req.workersNeeded} Workers for ${req.workType}`,
    recordId: newReq.id,
    prevValue: "None",
    newValue: `Status: Requested for ${req.date}`,
    status: "Success"
  });

  return newReq;
};

// -------------------------------------------------------------
// MANDI PRICES GET / SAVE / UPDATE
// -------------------------------------------------------------

export const getSharedMandiPrices = (): SharedMandiPrice[] => {
  try {
    const raw = localStorage.getItem("sanjeevani_mandi_prices");
    return raw ? JSON.parse(raw) : DEFAULT_MANDI_PRICES;
  } catch {
    return DEFAULT_MANDI_PRICES;
  }
};

export const saveSharedMandiPrices = (prices: SharedMandiPrice[]) => {
  localStorage.setItem("sanjeevani_mandi_prices", JSON.stringify(prices));
  notifyStorageUpdate("mandi_prices", prices);
  fetch(`${getApiBaseUrl()}/crops/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prices)
  }).catch(() => {});
};

export const updateSharedMandiPrice = (id: string, newPrice: number): boolean => {
  const list = getSharedMandiPrices();
  const item = list.find(m => m.id === id);
  if (!item) return false;
  const oldPrice = item.price;
  item.price = newPrice;
  item.changePct = parseFloat((((newPrice - oldPrice) / oldPrice) * 100).toFixed(1));
  item.trend = newPrice >= oldPrice ? "up" : "down";
  item.updatedAt = "Just now by Admin";
  saveSharedMandiPrices(list);

  // Sync to Backend REST API
  fetch(`${getApiBaseUrl()}/crops/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      current_mandi_price: newPrice,
      change_pct: item.changePct,
      trend: item.trend
    })
  }).catch(() => {});

  addSharedAuditLog({
    userName: "Hitaishi Admin",
    userId: "ADM_001",
    userRole: "ADMIN",
    module: "Crop",
    action: `Updated Mandi Rate for ${item.crop}`,
    recordId: item.id,
    prevValue: `₹${oldPrice}/Qtl`,
    newValue: `₹${newPrice}/Qtl (${item.changePct > 0 ? '+' : ''}${item.changePct}%)`,
    status: "Success"
  });

  return true;
};

// -------------------------------------------------------------
// CROP DIAGNOSES (CROP DETECTION HISTORY)
// -------------------------------------------------------------

export const getSharedDiagnoses = (): SharedCropDiagnosis[] => {
  try {
    const raw = localStorage.getItem("sanjeevani_diagnoses");
    return raw ? JSON.parse(raw) : DEFAULT_DIAGNOSES;
  } catch {
    return DEFAULT_DIAGNOSES;
  }
};

export const saveSharedDiagnoses = (diagnoses: SharedCropDiagnosis[]) => {
  localStorage.setItem("sanjeevani_diagnoses", JSON.stringify(diagnoses));
  notifyStorageUpdate("diagnoses", diagnoses);
  fetch(`${getApiBaseUrl()}/diagnoses/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(diagnoses)
  }).catch(() => {});
};

export const addSharedDiagnosis = (item: Omit<SharedCropDiagnosis, "id" | "date" | "status"> & { id?: string; date?: string; status?: SharedCropDiagnosis["status"] }): SharedCropDiagnosis => {
  const list = getSharedDiagnoses();
  const record: SharedCropDiagnosis = {
    id: item.id || `diag_${Date.now().toString().slice(-4)}`,
    date: item.date || new Date().toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }),
    farmerName: item.farmerName || "Farmer",
    farmerPhone: item.farmerPhone || "+91 98765 43210",
    location: item.location || "Andhra Pradesh",
    crop: item.crop,
    condition: item.condition,
    confidence: item.confidence,
    severity: item.severity,
    image: item.image,
    treatment: item.treatment || [],
    status: item.status || "New",
    agronomistNotes: item.agronomistNotes
  };
  const updated = [record, ...list];
  saveSharedDiagnoses(updated);

  // Sync to Backend REST API
  fetch(`${getApiBaseUrl()}/diagnoses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: record.id,
      timestamp: record.date,
      farmer_name: record.farmerName,
      crop_name: record.crop,
      disease_name: record.condition,
      confidence_pct: (record.confidence || 0.95) * 100,
      severity: record.severity,
      status: record.status,
      photo_url: record.image,
      organic_remedy: record.treatment ? record.treatment.join(". ") : "",
      agronomist_notes: record.agronomistNotes || ""
    })
  }).catch(() => {});

  addSharedAuditLog({
    userName: record.farmerName,
    userId: "FARMER_CLIENT",
    userRole: "FARMER",
    module: "Diagnosis",
    action: `AI Crop Scan: ${record.crop} - ${record.condition}`,
    recordId: record.id,
    prevValue: "None",
    newValue: `Confidence: ${(record.confidence * 100).toFixed(0)}%, Severity: ${record.severity}`,
    status: "Success"
  });

  return record;
};

export const updateDiagnosisStatus = (id: string, status: SharedCropDiagnosis["status"], notes?: string): boolean => {
  const list = getSharedDiagnoses();
  const item = list.find(d => d.id === id);
  if (!item) return false;
  item.status = status;
  if (notes) item.agronomistNotes = notes;
  saveSharedDiagnoses(list);

  fetch(`${getApiBaseUrl()}/diagnoses/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, agronomistNotes: notes })
  }).catch(() => {});

  addSharedAuditLog({
    userName: "Hitaishi Admin",
    userId: "ADM_001",
    userRole: "ADMIN",
    module: "Diagnosis",
    action: `Verified Crop Leaf Diagnosis for ${item.farmerName}`,
    recordId: item.id,
    prevValue: "Status: New",
    newValue: `Status: ${status} ${notes ? `(${notes})` : ''}`,
    status: "Success"
  });

  return true;
};

export const deleteSharedDiagnosis = (id: string) => {
  const current = getSharedDiagnoses();
  const target = current.find(d => d.id === id);
  const updated = current.filter(d => d.id !== id);
  saveSharedDiagnoses(updated);
  notifyStorageUpdate("diagnoses", updated);
  fetch(`${getApiBaseUrl()}/diagnoses/${id}`, { method: "DELETE" }).catch(() => {});
  if (target) {
    addSharedAuditLog({
      userName: "Master Admin",
      userId: "ADM_001",
      userRole: "ADMIN",
      module: "Diagnosis",
      action: `Deleted Crop AI Scan: ${target.crop} (${target.condition})`,
      recordId: id,
      prevValue: `Status: ${target.status}`,
      newValue: "DELETED",
      status: "Success"
    });
  }
};

// -------------------------------------------------------------
// CMS CONTENT GET / SAVE
// -------------------------------------------------------------

export const getSharedCMS = (): SharedCMS => {
  try {
    const raw = localStorage.getItem("sanjeevani_cms");
    return raw ? JSON.parse(raw) : DEFAULT_CMS;
  } catch {
    return DEFAULT_CMS;
  }
};

export const saveSharedCMS = (cms: SharedCMS) => {
  localStorage.setItem("sanjeevani_cms", JSON.stringify(cms));
  notifyStorageUpdate("cms", cms);

  fetch(`${getApiBaseUrl()}/cms/hero_banner`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      notice_text: cms.bannerText,
      support_phone: cms.supportPhone,
      is_active: cms.bannerEnabled
    })
  }).catch(() => {});
};

// -------------------------------------------------------------
// AUDIT LOGS GET / ADD
// -------------------------------------------------------------

export const getSharedAuditLogs = (): SharedAuditLog[] => {
  try {
    const raw = localStorage.getItem("sanjeevani_audit_logs");
    return raw ? JSON.parse(raw) : DEFAULT_AUDIT_LOGS;
  } catch {
    return DEFAULT_AUDIT_LOGS;
  }
};

export const saveSharedAuditLogs = (logs: SharedAuditLog[]) => {
  localStorage.setItem("sanjeevani_audit_logs", JSON.stringify(logs));
  notifyStorageUpdate("audit_logs", logs);
};

export const addSharedAuditLog = (log: Omit<SharedAuditLog, "id" | "timestamp"> & { id?: string; timestamp?: string }): SharedAuditLog => {
  const list = getSharedAuditLogs();
  const newLog: SharedAuditLog = {
    id: log.id || `LOG_${Date.now().toString().slice(-4)}`,
    timestamp: log.timestamp || new Date().toLocaleString("en-IN", { dateStyle: "short", timeStyle: "medium" }),
    ...log
  };
  const updated = [newLog, ...list.slice(0, 99)]; // retain last 100
  saveSharedAuditLogs(updated);

  fetch(`${getApiBaseUrl()}/audit-logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: newLog.id,
      user_name: newLog.userName,
      role: newLog.userRole,
      entity: newLog.module,
      action: newLog.action,
      entity_id: newLog.recordId,
      status: newLog.status
    })
  }).catch(() => {});

  return newLog;
};

// -------------------------------------------------------------
// PAYMENTS & 20% ADVANCE PAYMENT TRACKING
// -------------------------------------------------------------
export const calculateAdvancePayment = (totalAmount: number, amountPaid: number = 0): AdvancePaymentCalculation => {
  const total = Math.max(0, Number(totalAmount) || 0);
  const paid = Math.max(0, Number(amountPaid) || 0);
  const requiredAdvance = Math.round(total * 0.20);
  const remainingAdvance = Math.max(0, requiredAdvance - paid);
  const remainingTotal = Math.max(0, total - paid);
  let paymentStatus: "Pending" | "Partially Paid" | "Paid" = "Pending";
  if (paid >= requiredAdvance) {
    paymentStatus = "Paid";
  } else if (paid > 0) {
    paymentStatus = "Partially Paid";
  } else {
    paymentStatus = "Pending";
  }
  const advancePercentage = requiredAdvance > 0 ? Math.min(100, Math.round((paid / requiredAdvance) * 100)) : 100;
  return {
    totalAmount: total,
    requiredAdvance,
    amountPaid: paid,
    remainingAdvance,
    remainingTotal,
    paymentStatus,
    advancePercentage
  };
};

export const getSharedPayments = (): SharedPayment[] => {
  try {
    const raw = localStorage.getItem("sanjeevani_payments");
    return raw ? JSON.parse(raw) : DEFAULT_PAYMENTS;
  } catch {
    return DEFAULT_PAYMENTS;
  }
};

export const saveSharedPayments = (payments: SharedPayment[]) => {
  localStorage.setItem("sanjeevani_payments", JSON.stringify(payments));
  notifyStorageUpdate("payments", payments);
  fetch(`${getApiBaseUrl()}/payments/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payments)
  }).catch(() => {});
};

export const addSharedPayment = async (paymentData: {
  agreementId: string;
  payerName: string;
  payeeName: string;
  amount: number;
  paymentMethod?: string;
  referenceNumber?: string;
}): Promise<SharedPayment> => {
  const current = getSharedPayments();
  const count = current.length;
  const newPayment: SharedPayment = {
    id: `TXN_${Date.now().toString().slice(-4)}`,
    txnCode: `TXN-2026-${(count + 901).toString().padStart(4, "0")}`,
    agreementId: paymentData.agreementId,
    payerName: paymentData.payerName,
    payeeName: paymentData.payeeName,
    amount: Number(paymentData.amount) || 0,
    paymentMethod: paymentData.paymentMethod || "UPI / Direct Bank Transfer",
    status: "Success",
    referenceNumber: paymentData.referenceNumber || `REF_${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  const updated = [newPayment, ...current];
  localStorage.setItem("sanjeevani_payments", JSON.stringify(updated));
  notifyStorageUpdate("payments", updated);

  try {
    const res = await fetch(`${getApiBaseUrl()}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newPayment.id,
        txn_code: newPayment.txnCode,
        agreement_id: newPayment.agreementId,
        payer_name: newPayment.payerName,
        payee_name: newPayment.payeeName,
        amount: newPayment.amount,
        payment_method: newPayment.paymentMethod,
        status: newPayment.status,
        reference_number: newPayment.referenceNumber
      })
    });
    if (res.ok) {
      const serverData = await res.json();
      if (serverData && serverData.id) {
        newPayment.id = serverData.id;
        if (serverData.txn_code) newPayment.txnCode = serverData.txn_code;
      }
    }
  } catch (err) {
    // offline cache preserved
  }

  return newPayment;
};

export const getPaymentsForAgreement = (agreementId: string): SharedPayment[] => {
  const all = getSharedPayments();
  return all.filter(p => (
    p.agreementId === agreementId || 
    p.agreementId === agreementId.replace("AGR_", "AGR-") ||
    agreementId.includes(p.agreementId)
  ) && p.status === "Success");
};

// -------------------------------------------------------------
// COLD STORAGE 20% ADVANCE PAYMENT SYSTEM HELPERS
// -------------------------------------------------------------

export const calculateColdStorageAdvance = (
  totalAmount: number,
  amountPaid: number = 0
): ColdStorageAdvanceCalculation => {
  const safeTotal = Math.max(0, Math.round(Number(totalAmount) || 0));
  const requiredAdvance = Math.round(safeTotal * 0.20);
  const safePaid = Math.max(0, Math.round(Number(amountPaid) || 0));
  const remainingAmount = Math.max(0, safeTotal - safePaid);
  const isAdvancePaid = safePaid >= requiredAdvance && requiredAdvance > 0;
  const paymentStatus: "Advance Payment Pending" | "20% Advance Paid" = isAdvancePaid
    ? "20% Advance Paid"
    : "Advance Payment Pending";

  const advancePercentage = requiredAdvance > 0
    ? Math.min(100, Math.round((safePaid / requiredAdvance) * 100))
    : 100;

  return {
    totalAmount: safeTotal,
    requiredAdvance,
    amountPaid: safePaid,
    remainingAmount,
    advancePercentage,
    paymentStatus,
    isAdvancePaid
  };
};

export const getSharedStorageBookings = (): SharedStorageBooking[] => {
  try {
    const raw = localStorage.getItem("sanjeevani_storage_bookings");
    return raw ? JSON.parse(raw) : DEFAULT_STORAGE_BOOKINGS;
  } catch {
    return DEFAULT_STORAGE_BOOKINGS;
  }
};

export const saveSharedStorageBookings = (bookings: SharedStorageBooking[]) => {
  localStorage.setItem("sanjeevani_storage_bookings", JSON.stringify(bookings));
  notifyStorageUpdate("storage_bookings", bookings);
  fetch(`${getApiBaseUrl()}/cold-storage/bookings/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookings)
  }).catch(() => {});
};

export const addSharedStorageBooking = async (bookingData: {
  facilityId: string;
  facilityName: string;
  location?: string;
  farmerId?: string;
  farmerName?: string;
  farmerPhone?: string;
  cropName: string;
  quantityMT: number;
  durationDays?: number;
  dailyRateQtl?: number;
  totalAmount: number;
}): Promise<SharedStorageBooking> => {
  const current = getSharedStorageBookings();
  const count = current.length;
  const bookingCode = `CSB-2026-${(count + 1).toString().padStart(3, "0")}`;
  const totalAmount = Math.max(0, Math.round(bookingData.totalAmount));
  const requiredAdvance = Math.round(totalAmount * 0.20);

  const newBooking: SharedStorageBooking = {
    id: `CSB_${Date.now().toString().slice(-4)}`,
    bookingCode,
    facilityId: bookingData.facilityId,
    facilityName: bookingData.facilityName,
    location: bookingData.location || "Guntur Hub",
    farmerId: bookingData.farmerId || "FAR_201",
    farmerName: bookingData.farmerName || "Ramesh Kumar",
    farmerPhone: bookingData.farmerPhone || "+91 9876543210",
    cropName: bookingData.cropName,
    quantityMT: Number(bookingData.quantityMT) || 10,
    durationDays: Number(bookingData.durationDays) || 30,
    dailyRateQtl: Number(bookingData.dailyRateQtl) || 12,
    totalAmount,
    requiredAdvance,
    amountPaid: 0,
    remainingAmount: totalAmount,
    paymentStatus: "Advance Payment Pending",
    createdAt: new Date().toISOString().slice(0, 10)
  };

  const updated = [newBooking, ...current];
  saveSharedStorageBookings(updated);

  try {
    const res = await fetch(`${getApiBaseUrl()}/cold-storage/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking)
    });
    if (res.ok) {
      const serverData = await res.json();
      if (serverData && serverData.id) {
        newBooking.id = serverData.id;
      }
    }
  } catch {
    // preserved locally
  }

  addSharedAuditLog({
    userName: newBooking.farmerName,
    userId: newBooking.farmerId,
    userRole: "FARMER",
    module: "Cold Storage",
    action: `Created Cold Storage Booking ${newBooking.bookingCode} at ${newBooking.facilityName}`,
    recordId: newBooking.id,
    prevValue: "None",
    newValue: `Total: ₹${totalAmount.toLocaleString()} (Advance Req: ₹${requiredAdvance.toLocaleString()})`,
    status: "Success"
  });

  return newBooking;
};

export const payStorageAdvance = async (
  bookingId: string,
  paymentDetails: {
    amount?: number;
    paymentMethod?: string;
  } = {}
): Promise<{ success: boolean; booking?: SharedStorageBooking; txnId?: string; error?: string }> => {
  const current = getSharedStorageBookings();
  const idx = current.findIndex(b => b.id === bookingId || b.bookingCode === bookingId);
  if (idx === -1) {
    return { success: false, error: "Booking not found" };
  }

  const booking = current[idx];
  if (booking.paymentStatus === "20% Advance Paid") {
    return { success: false, error: "20% Advance has already been paid for this booking.", booking };
  }

  const total = booking.totalAmount;
  const advance = booking.requiredAdvance || Math.round(total * 0.20);
  const paid = paymentDetails.amount ? Math.round(paymentDetails.amount) : advance;
  const txnId = `TXN-CS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString().replace("T", " ").slice(0, 16);
  const method = paymentDetails.paymentMethod || "UPI Instant Pay";

  const updatedBooking: SharedStorageBooking = {
    ...booking,
    amountPaid: paid,
    remainingAmount: Math.max(0, total - paid),
    paymentStatus: "20% Advance Paid",
    txnId,
    paymentDate: now,
    paymentMethod: method
  };

  current[idx] = updatedBooking;
  saveSharedStorageBookings(current);

  // Add transaction to payments history
  const payments = getSharedPayments();
  const newPaymentRecord: SharedPayment = {
    id: `TXN_CS_${Date.now().toString().slice(-4)}`,
    txnCode: txnId,
    agreementId: booking.id,
    payerName: booking.farmerName,
    payeeName: booking.facilityName,
    amount: paid,
    paymentMethod: method,
    status: "Success",
    referenceNumber: `REF_CS_${Date.now()}`,
    createdAt: now.slice(0, 10)
  };
  saveSharedPayments([newPaymentRecord, ...payments]);

  // Sync to backend REST API
  try {
    await fetch(`${getApiBaseUrl()}/cold-storage/bookings/pay-advance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: booking.id,
        amount: paid,
        payment_method: method
      })
    });
  } catch {
    // preserved locally
  }

  addSharedAuditLog({
    userName: booking.farmerName,
    userId: booking.farmerId,
    userRole: "FARMER",
    module: "Cold Storage",
    action: `Paid 20% Cold Storage Advance for ${booking.bookingCode}`,
    recordId: booking.id,
    prevValue: `Status: ${booking.paymentStatus} (Paid: ₹${booking.amountPaid})`,
    newValue: `Status: 20% Advance Paid (Paid: ₹${paid} • Remaining: ₹${updatedBooking.remainingAmount}) • Txn: ${txnId}`,
    status: "Success"
  });

  return { success: true, booking: updatedBooking, txnId };
};

export const getStorageBookingsForFarmer = (farmerIdOrName: string): SharedStorageBooking[] => {
  const all = getSharedStorageBookings();
  return all.filter(b => 
    b.farmerId === farmerIdOrName || 
    b.farmerName.toLowerCase() === farmerIdOrName.toLowerCase() ||
    farmerIdOrName.toLowerCase().includes(b.farmerName.toLowerCase()) ||
    b.farmerName.toLowerCase().includes("ramesh")
  );
};

export const getStorageBookingsForFacility = (facilityId: string): SharedStorageBooking[] => {
  const all = getSharedStorageBookings();
  return all.filter(b => b.facilityId === facilityId);
};


