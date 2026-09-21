import { ApiClient } from "./apiClient";
import React, { useState, useEffect } from "react";
import {
  getSharedFarmers,
  saveSharedFarmers,
  getSharedBuyers,
  saveSharedBuyers,
  getSharedStorage,
  saveSharedStorage,
  getSharedAgreements,
  saveSharedAgreements,
  getSharedMandiPrices,
  saveSharedMandiPrices,
  updateSharedMandiPrice,
  getSharedCMS,
  saveSharedCMS,
  getSharedAuditLogs,
  saveSharedAuditLogs,
  SharedMandiPrice,
  getSharedPayments,
  saveSharedPayments,
  addSharedPayment,
  calculateAdvancePayment,
  SharedPayment,
  getSharedStorageBookings,
  saveSharedStorageBookings,
  payStorageAdvance,
  calculateColdStorageAdvance,
  SharedStorageBooking,
  getSharedDiagnoses,
  saveSharedDiagnoses,
  updateDiagnosisStatus,
  deleteSharedDiagnosis,
  SharedCropDiagnosis
} from "./sharedStore";
import { 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  Warehouse, 
  Sprout, 
  FileText, 
  FileCheck, 
  Activity, 
  Settings, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Camera,
  Lock, 
  CreditCard,
  Unlock, 
  ArrowRight, 
  RefreshCw, 
  Building, 
  Truck, 
  TrendingUp, 
  Database, 
  Layers, 
  UserCheck, 
  Clock, 
  CheckSquare, 
  Award,
  ChevronRight,
  Bell,
  LogOut,
  Globe,
  LayoutDashboard,
  Menu,
  X,
  Sliders,
  Maximize2,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";

// Types for Admin Master Control Panel
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userId: string;
  userRole: "ADMIN" | "FARMER" | "BUYER" | "COLD STORAGE OPERATOR";
  module: "Farmer" | "Buyer" | "Cold Storage" | "Crop" | "Agreement" | "User" | "CMS";
  action: string;
  recordId: string;
  prevValue: string;
  newValue: string;
  status: "Success" | "Warning" | "Denied";
}

export interface FarmerRecord {
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
}

export interface BuyerRecord {
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

export interface ColdStorageRecord {
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
  maintenanceStatus: "Optimal" | "Maintenance Required" | "Under Repair";
  accountStatus: "Active" | "Suspended" | "Deactivated";
  inventory: Array<{
    id: string;
    cropName: string;
    farmerName: string;
    batchSizeMT: number;
    entryDate: string;
    expiryDate: string;
  }>;
}

export interface AgreementRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  quantityQuintals: number;
  agreedPriceQtl: number;
  buyerId: string;
  buyerName: string;
  storageId: string;
  storageName: string;
  startDate: string;
  expiryDate: string;
  status: "Draft" | "Active" | "Expiring Soon" | "Completed" | "Terminated";
}

export interface UserAccount {
  id: string;
  name: string;
  contact: string;
  role: "ADMIN" | "FARMER" | "BUYER" | "COLD STORAGE OPERATOR";
  accountStatus: "Active" | "Suspended" | "Deactivated";
  verificationStatus: "Verified" | "Pending" | "Rejected";
  createdDate: string;
  lastLogin: string;
}

// Configured Admin Credentials
const CONFIGURED_ADMIN_USERNAME = "admin@sanjeevani.com";
const CONFIGURED_ADMIN_PASSWORD = "SANJEEVANI_ADMIN_2026";

export const App: React.FC = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("sanjeevani_admin_auth") === "true";
  });

  // Admin Credential Challenge State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [adminAuthError, setAdminAuthError] = useState("");

  // Active Navigation Module in Left Sidebar
  const [activeTabModule, setActiveTabModule] = useState<
    "dashboard" | "farmers" | "buyers" | "storage" | "crops" | "agreements" | "audit" | "settings" | "cms" | "diagnoses"
  >("dashboard");

  // Live Crop Diagnoses & Leaf Pathology State
  const [diagnoses, setDiagnoses] = useState<SharedCropDiagnosis[]>(() => getSharedDiagnoses());
  const [selectedDiagnosisPreview, setSelectedDiagnosisPreview] = useState<SharedCropDiagnosis | null>(null);
  const [diagnosisFilterCrop, setDiagnosisFilterCrop] = useState<string>("All");
  const [diagnosisFilterSeverity, setDiagnosisFilterSeverity] = useState<string>("All");
  const [diagnosisFilterStatus, setDiagnosisFilterStatus] = useState<string>("All");
  const [agronomistNoteInput, setAgronomistNoteInput] = useState("");
  const [diagnosisSuccessMsg, setDiagnosisSuccessMsg] = useState<string>("");

  // Mobile Sidebar Drawer Toggle
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState("");
  const [isGlobalSearchFocused, setIsGlobalSearchFocused] = useState(false);

  // System Notifications Drawer Toggle
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);

  // Confirmation Modal Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionType: "danger" | "warning" | "info";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    actionType: "warning",
    onConfirm: () => {}
  });

  // Selected Detail Panels State (Slide-over Drawers)
  const [selectedFarmerDetail, setSelectedFarmerDetail] = useState<FarmerRecord | null>(null);
  const [farmerDetailTab, setFarmerDetailTab] = useState<"overview" | "kyc" | "farm" | "land" | "soil" | "crops" | "recommendations" | "buyers" | "agreements" | "storage" | "activity">("overview");

  const [selectedBuyerDetail, setSelectedBuyerDetail] = useState<BuyerRecord | null>(null);
  const [buyerDetailTab, setBuyerDetailTab] = useState<"overview" | "kyc" | "crops" | "requests" | "farmers" | "agreements" | "activity">("overview");

  const [selectedStorageDetail, setSelectedStorageDetail] = useState<ColdStorageRecord | null>(null);
  const [storageDetailTab, setStorageDetailTab] = useState<"overview" | "capacity" | "inventory" | "requests" | "environment" | "charges" | "maintenance" | "activity">("overview");

  const [selectedCropDetail, setSelectedCropDetail] = useState<any | null>(null);
  const [selectedAgreementDetail, setSelectedAgreementDetail] = useState<AgreementRecord | null>(null);

  // CMS Content State
  const [cmsBannerText, setCmsBannerText] = useState("🚨 Monsoon Mandi Special: Direct crop procurement active across AP & Telangana with 0% commission!");
  const [cmsBannerEnabled, setCmsBannerEnabled] = useState(true);
  const [cmsSupportPhone, setCmsSupportPhone] = useState("8977520059");
  const [cmsMandiRates, setCmsMandiRates] = useState({
    tomato: 2800,
    chilli: 18500,
    paddy: 2750,
    cotton: 7200,
    onion: 1950,
    maize: 2100
  });
  const [cmsPublishSuccess, setCmsPublishSuccess] = useState("");

  // Single Source of Truth Shared Store States
  const [mandiPrices, setMandiPrices] = useState<SharedMandiPrice[]>(() => getSharedMandiPrices());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => getSharedAuditLogs() as any);
  const [farmers, setFarmers] = useState<FarmerRecord[]>(() => getSharedFarmers() as any);
  const [buyers, setBuyers] = useState<BuyerRecord[]>(() => getSharedBuyers() as any);
  const [storages, setStorages] = useState<ColdStorageRecord[]>(() => getSharedStorage() as any);
  const [agreements, setAgreements] = useState<AgreementRecord[]>(() => getSharedAgreements() as any);
  const [payments, setPayments] = useState<SharedPayment[]>(() => getSharedPayments());
  const [storageBookings, setStorageBookings] = useState<SharedStorageBooking[]>(() => getSharedStorageBookings());

  // Admin Cold Storage Payment Update State
  const [showAdminStoragePayModal, setShowAdminStoragePayModal] = useState(false);
  const [adminStorageBooking, setAdminStorageBooking] = useState<SharedStorageBooking | null>(null);
  const [adminStoragePayAmount, setAdminStoragePayAmount] = useState("");
  const [adminStoragePayMethod, setAdminStoragePayMethod] = useState("Direct Bank NEFT / RTGS");
  const [adminStoragePaySuccessMsg, setAdminStoragePaySuccessMsg] = useState("");

  // Admin Payment Update Modal State
  const [showAdminPaymentModal, setShowAdminPaymentModal] = useState(false);
  const [adminPayAgreement, setAdminPayAgreement] = useState<AgreementRecord | null>(null);
  const [adminPayAmount, setAdminPayAmount] = useState("");
  const [adminPayMethod, setAdminPayMethod] = useState("Direct Bank NEFT");
  const [adminPaySuccessMsg, setAdminPaySuccessMsg] = useState("");

  // Real-time bidirectional cross-tab listener
  useEffect(() => {
    const handleSync = () => {
      setFarmers(getSharedFarmers() as any);
      setBuyers(getSharedBuyers() as any);
      setStorages(getSharedStorage() as any);
      setAgreements(getSharedAgreements() as any);
      setPayments(getSharedPayments());
      setStorageBookings(getSharedStorageBookings());
      setAuditLogs(getSharedAuditLogs() as any);
      setMandiPrices(getSharedMandiPrices());
      setDiagnoses(getSharedDiagnoses());
      const c = getSharedCMS();
      setCmsBannerText(c.bannerText);
      setCmsSupportPhone(c.supportPhone);
    };

    window.addEventListener("sanjeevani_storage_update", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("sanjeevani_storage_update", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Master User Accounts State (Under Settings)
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([
    { id: "USR_101", name: "Hitaishi Admin", contact: "admin@sanjeevani.com", role: "ADMIN", accountStatus: "Active", verificationStatus: "Verified", createdDate: "2026-01-01", lastLogin: "Just now" },
    { id: "USR_102", name: "Ramesh Kumar", contact: "+91 98765 43210", role: "FARMER", accountStatus: "Active", verificationStatus: "Verified", createdDate: "2026-01-15", lastLogin: "10 mins ago" },
    { id: "USR_103", name: "Sri Lakshmi Agri Buyers", contact: "+91 90000 11001", role: "BUYER", accountStatus: "Active", verificationStatus: "Verified", createdDate: "2026-01-10", lastLogin: "25 mins ago" },
    { id: "USR_104", name: "Subba Rao (Guntur Cold Care)", contact: "+91 90000 22001", role: "COLD STORAGE OPERATOR", accountStatus: "Active", verificationStatus: "Verified", createdDate: "2026-01-12", lastLogin: "2 hours ago" },
    { id: "USR_105", name: "Deepak Patel (Apex Grain)", contact: "+91 90000 11003", role: "BUYER", accountStatus: "Active", verificationStatus: "Pending", createdDate: "2026-09-15", lastLogin: "Yesterday" }
  ]);

  // Search & Filter Input States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modal States for Add / Edit
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<"farmer" | "buyer" | "storage" | "agreement" | "price">("farmer");
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form States
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("+91 98765 43210");
  const [formLocation, setFormLocation] = useState("Guntur Mandi Hub");
  const [formDistrict, setFormDistrict] = useState("Guntur");
  const [formCrop, setFormCrop] = useState("Tomato");
  const [formSize, setFormSize] = useState("3.5");
  const [formPrice, setFormPrice] = useState("2900");
  const [formCapacity, setFormCapacity] = useState("5000");

  const logAuditAction = (module: any, action: string, recordId: string, prevVal: string, newVal: string) => {
    const newLog: AuditLogEntry = {
      id: `LOG_${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      userName: "Hitaishi Admin",
      userId: "ADM_MASTER",
      userRole: "ADMIN",
      module,
      action,
      recordId,
      prevValue: prevVal,
      newValue: newVal,
      status: "Success"
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Farmer Action Handlers
  const handleToggleFarmerStatus = (farmerId: string) => {
    const f = farmers.find((item) => item.id === farmerId);
    if (!f) return;
    const nextStatus = f.accountStatus === "Active" ? "Suspended" : "Active";
    
    setConfirmDialog({
      isOpen: true,
      title: `${nextStatus === "Suspended" ? "Suspend" : "Activate"} Farmer Account`,
      message: `Are you sure you want to change account status for ${f.name} (${f.id}) to ${nextStatus}?`,
      actionType: nextStatus === "Suspended" ? "warning" : "info",
      onConfirm: () => {
        setFarmers((prev) =>
          prev.map((item) => (item.id === farmerId ? { ...item, accountStatus: nextStatus } : item))
        );
        logAuditAction("Farmer", `Account Status Changed to ${nextStatus}`, f.id, `Status: ${f.accountStatus}`, `Status: ${nextStatus}`);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleVerifyFarmer = (farmerId: string) => {
    setFarmers((prev) =>
      prev.map((f) => {
        if (f.id === farmerId) {
          logAuditAction("Farmer", "Verified Farmer KYC Information", f.id, `Kyc: ${f.verificationStatus}`, "Kyc: Verified");
          return { ...f, verificationStatus: "Verified" };
        }
        return f;
      })
    );
  };

  const handleDeleteFarmer = (farmerId: string) => {
    const f = farmers.find((item) => item.id === farmerId);
    if (!f) return;

    setConfirmDialog({
      isOpen: true,
      title: "Delete Farmer Record",
      message: `CAUTION: Are you sure you want to permanently delete farmer profile ${f.name} (${f.id})? Historical contracts and audit logs will be preserved.`,
      actionType: "danger",
      onConfirm: () => {
        setFarmers((prev) => prev.filter((item) => item.id !== farmerId));
        logAuditAction("Farmer", "Deleted Farmer Profile Record", farmerId, `Name: ${f.name}`, "Record Removed");
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleEditFarmer = (f: FarmerRecord) => {
    setEditingItem(f);
    setModalType("farmer");
    setFormName(f.name);
    setFormPhone(f.phone);
    setFormDistrict(f.district);
    setFormCrop(f.mainCrop);
    setFormSize(f.farmSizeAcres.toString());
    setShowAddModal(true);
  };

  // Buyer Action Handlers
  const handleApproveBuyerKyc = (buyerId: string) => {
    setBuyers((prev) =>
      prev.map((b) => {
        if (b.id === buyerId) {
          logAuditAction("Buyer", "Approved Buyer KYC & Legal Documents", b.id, `KYC: ${b.kycStatus}`, "KYC: Verified");
          return { ...b, kycStatus: "Verified" };
        }
        return b;
      })
    );
  };

  const handleRejectBuyerKyc = (buyerId: string) => {
    setBuyers((prev) =>
      prev.map((b) => {
        if (b.id === buyerId) {
          logAuditAction("Buyer", "Rejected Buyer KYC Submission", b.id, `KYC: ${b.kycStatus}`, "KYC: Rejected");
          return { ...b, kycStatus: "Rejected" };
        }
        return b;
      })
    );
  };

  const handleToggleBuyerStatus = (buyerId: string) => {
    const b = buyers.find((item) => item.id === buyerId);
    if (!b) return;
    const nextStatus = b.accountStatus === "Active" ? "Suspended" : "Active";

    setConfirmDialog({
      isOpen: true,
      title: `${nextStatus === "Suspended" ? "Suspend" : "Activate"} Buyer Account`,
      message: `Are you sure you want to update account status for ${b.companyName} (${b.id}) to ${nextStatus}?`,
      actionType: nextStatus === "Suspended" ? "warning" : "info",
      onConfirm: () => {
        setBuyers((prev) =>
          prev.map((item) => (item.id === buyerId ? { ...item, accountStatus: nextStatus } : item))
        );
        logAuditAction("Buyer", `Changed Buyer Account Status to ${nextStatus}`, b.id, `Status: ${b.accountStatus}`, `Status: ${nextStatus}`);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteBuyer = (buyerId: string) => {
    const b = buyers.find((item) => item.id === buyerId);
    if (!b) return;

    setConfirmDialog({
      isOpen: true,
      title: "Delete Buyer Account",
      message: `Are you sure you want to delete buyer company record ${b.companyName} (${b.id})?`,
      actionType: "danger",
      onConfirm: () => {
        setBuyers((prev) => prev.filter((item) => item.id !== buyerId));
        logAuditAction("Buyer", "Deleted Buyer Account Record", buyerId, `Company: ${b.companyName}`, "Record Removed");
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleEditBuyer = (b: BuyerRecord) => {
    setEditingItem(b);
    setModalType("buyer");
    setFormName(b.companyName);
    setFormPhone(b.phone);
    setFormDistrict(b.district);
    setFormCrop(b.interestedCrops[0] || "Tomato");
    setFormPrice(b.priceOfferedQtl.toString());
    setShowAddModal(true);
  };

  // Storage Action Handlers
  const handleToggleStorageStatus = (storageId: string) => {
    const s = storages.find((item) => item.id === storageId);
    if (!s) return;
    const nextStatus: "Active" | "Suspended" = s.accountStatus === "Active" ? "Suspended" : "Active";

    setConfirmDialog({
      isOpen: true,
      title: `${nextStatus === "Suspended" ? "Suspend" : "Activate"} Facility`,
      message: `Are you sure you want to update status for ${s.facilityName} to ${nextStatus}?`,
      actionType: "warning",
      onConfirm: () => {
        setStorages((prev) => {
          const updated = prev.map((item) => (item.id === storageId ? { ...item, accountStatus: nextStatus } : item));
          saveSharedStorage(updated as any);
          return updated;
        });
        logAuditAction("Cold Storage", `Updated Cold Storage Status to ${nextStatus}`, s.id, `Status: ${s.accountStatus}`, `Status: ${nextStatus}`);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteStorage = (storageId: string) => {
    const s = storages.find((item) => item.id === storageId);
    if (!s) return;

    setConfirmDialog({
      isOpen: true,
      title: "Delete Cold Storage Facility",
      message: `Are you sure you want to delete cold storage facility ${s.facilityName}?`,
      actionType: "danger",
      onConfirm: () => {
        setStorages((prev) => {
          const updated = prev.filter((item) => item.id !== storageId);
          saveSharedStorage(updated as any);
          return updated;
        });
        logAuditAction("Cold Storage", "Deleted Cold Storage Facility", storageId, `Facility: ${s.facilityName}`, "Record Removed");
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleEditStorage = (s: ColdStorageRecord) => {
    setEditingItem(s);
    setModalType("storage");
    setFormName(s.facilityName);
    setFormPhone(s.phone);
    setFormLocation(s.location || `${s.district} Mandi Hub`);
    setFormDistrict(s.district);
    setFormCapacity(s.totalCapacityMT.toString());
    setFormPrice((s.dailyRateQtl || 8).toString());
    setFormCrop((s.supportedCrops && s.supportedCrops[0]) || "Tomato");
    setShowAddModal(true);
  };

  // Agreement Action Handlers
  const handleDeleteAgreement = (agrId: string) => {
    const a = agreements.find((item) => item.id === agrId);
    if (!a) return;

    setConfirmDialog({
      isOpen: true,
      title: "Terminate Sale Contract",
      message: `Are you sure you want to terminate procurement contract ${a.id} (${a.cropName})?`,
      actionType: "danger",
      onConfirm: () => {
        setAgreements((prev) => prev.filter((item) => item.id !== agrId));
        logAuditAction("Agreement", "Terminated / Deleted Procurement Contract", agrId, `Crop: ${a.cropName}`, "Contract Terminated");
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // User Account Action Handlers (Settings)
  const handleToggleUserAccountStatus = (userId: string) => {
    setUserAccounts((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const next = u.accountStatus === "Active" ? "Suspended" : "Active";
          logAuditAction("User", `Updated User Account Status to ${next}`, u.id, `Status: ${u.accountStatus}`, `Status: ${next}`);
          return { ...u, accountStatus: next };
        }
        return u;
      })
    );
  };

  // Crop AI Scan Delete Handler (Admin Only)
  const handleDeleteDiagnosis = (diagId: string) => {
    if (!isAdminAuthenticated) return;
    const item = diagnoses.find((d) => d.id === diagId);
    if (!item) return;

    setConfirmDialog({
      isOpen: true,
      title: "Delete Crop AI Scan",
      message: `Are you sure you want to delete the Crop AI scan for "${item.crop}" (${item.condition}) submitted by ${item.farmerName}? This action will permanently remove it from the database.`,
      actionType: "danger",
      onConfirm: () => {
        deleteSharedDiagnosis(diagId);
        setDiagnoses((prev) => prev.filter((d) => d.id !== diagId));
        if (selectedDiagnosisPreview && selectedDiagnosisPreview.id === diagId) {
          setSelectedDiagnosisPreview(null);
        }
        setDiagnosisSuccessMsg(`Crop AI Scan for "${item.crop}" (${item.condition}) was permanently deleted from the database.`);
        setTimeout(() => setDiagnosisSuccessMsg(""), 4000);
        logAuditAction("Crop", `Deleted Crop AI Scan: ${item.crop} (${item.condition})`, diagId, `Record: ${diagId}`, "Permanently Removed");
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Modal Submit Handler
  const handleModalFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `${modalType.substring(0, 3).toUpperCase()}_${Date.now().toString().slice(-4)}`;

    if (modalType === "farmer") {
      const newFarmer: FarmerRecord = {
        id: editingItem ? editingItem.id : newId,
        name: formName || "New Farmer",
        phone: formPhone,
        village: "Guntur Rural",
        district: formDistrict,
        state: "Andhra Pradesh",
        mainCrop: formCrop,
        farmSizeAcres: parseFloat(formSize) || 3.0,
        soilType: "Red Sandy Loam",
        verificationStatus: "Verified",
        accountStatus: "Active",
        kycDocUrl: "Aadhaar Verified",
        landRecordNo: `PATTADAR_${Date.now().toString().slice(-4)}`,
        previousCrops: ["Pulses"],
        assignedBuyer: "Unassigned",
        assignedStorage: "Unassigned",
        createdDate: new Date().toISOString().slice(0, 10),
        lastActivity: "Just now"
      };

      if (editingItem) {
        setFarmers((prev) => prev.map((f) => (f.id === editingItem.id ? newFarmer : f)));
        logAuditAction("Farmer", "Admin Edited Farmer Profile", editingItem.id, `Old: ${editingItem.name}`, `New: ${formName}`);
      } else {
        setFarmers([newFarmer, ...farmers]);
        logAuditAction("Farmer", "Admin Added New Farmer Record", newId, "None", `Created Farmer: ${formName}`);
      }
    } else if (modalType === "buyer") {
      const newBuyer: BuyerRecord = {
        id: editingItem ? editingItem.id : newId,
        companyName: formName || "New Agri Buyer Ltd",
        repName: "Authorized Agent",
        phone: formPhone,
        email: "buyer@agritrade.com",
        location: `${formDistrict} Mandi`,
        district: formDistrict,
        buyerType: "Wholesaler & Exporter",
        interestedCrops: [formCrop],
        priceOfferedQtl: parseFloat(formPrice) || 3000,
        minQtyTons: 10,
        kycStatus: "Verified",
        accountStatus: "Active",
        kycDocName: "REGISTRATION_CERTIFICATE.pdf",
        totalAgreements: 0,
        createdDate: new Date().toISOString().slice(0, 10),
        lastActivity: "Just now"
      };

      if (editingItem) {
        setBuyers((prev) => prev.map((b) => (b.id === editingItem.id ? newBuyer : b)));
        logAuditAction("Buyer", "Admin Edited Buyer Profile", editingItem.id, `Old: ${editingItem.companyName}`, `New: ${formName}`);
      } else {
        setBuyers([newBuyer, ...buyers]);
        logAuditAction("Buyer", "Admin Created New Buyer Account", newId, "None", `Created Buyer: ${formName}`);
      }
    } else if (modalType === "storage") {
      const capVal = parseFloat(formCapacity) || 4000;
      const rateVal = parseFloat(formPrice) || 8;
      const newStorage: ColdStorageRecord = {
        id: editingItem ? editingItem.id : newId,
        facilityName: formName || "New Cold Storage Care",
        operatorName: editingItem?.operatorName || "Facility Manager",
        phone: formPhone,
        location: formLocation || `${formDistrict} Mandi Hub`,
        district: formDistrict,
        totalCapacityMT: capVal,
        occupiedCapacityMT: editingItem ? editingItem.occupiedCapacityMT : 0,
        availableCapacityMT: editingItem ? Math.max(0, capVal - editingItem.occupiedCapacityMT) : capVal,
        dailyRateQtl: rateVal,
        temperatureC: editingItem?.temperatureC || 4.0,
        humidityPct: editingItem?.humidityPct || 85,
        supportedCrops: [formCrop || "Tomato", "Chilli", "Fruits"],
        maintenanceStatus: "Optimal",
        accountStatus: "Active",
        inventory: editingItem?.inventory || []
      };

      if (editingItem) {
        setStorages((prev) => {
          const updated = prev.map((s) => (s.id === editingItem.id ? newStorage : s));
          saveSharedStorage(updated as any);
          return updated;
        });
        logAuditAction("Cold Storage", "Admin Edited Cold Storage Facility", editingItem.id, `Old: ${editingItem.facilityName}`, `New: ${formName}`);
      } else {
        setStorages((prev) => {
          const updated = [newStorage, ...prev];
          saveSharedStorage(updated as any);
          return updated;
        });
        logAuditAction("Cold Storage", "Admin Added Cold Storage Facility", newId, "None", `Facility: ${formName}`);
      }
    } else if (modalType === "price") {
      const priceNum = parseFloat(formPrice) || 2800;
      const newPrice: SharedMandiPrice = {
        id: editingItem ? editingItem.id : `CRP_${Date.now().toString().slice(-4)}`,
        crop: formName || "Tomato",
        cropTe: formCrop || formName || "టమోటా",
        cropHi: formName || "टमाटर",
        mandi: `${formDistrict} Mandi Yard`,
        price: priceNum,
        unit: "₹/Quintal",
        changePct: 2.5,
        trend: "up",
        updatedAt: "Just now by Admin"
      };

      if (editingItem) {
        setMandiPrices((prev) => {
          const updated = prev.map((p) => (p.id === editingItem.id ? newPrice : p));
          saveSharedMandiPrices(updated);
          return updated;
        });
        logAuditAction("Crop", "Admin Edited Market Price", editingItem.id, `Old: ₹${editingItem.price}`, `New: ₹${priceNum}`);
      } else {
        setMandiPrices((prev) => {
          const updated = [newPrice, ...prev];
          saveSharedMandiPrices(updated);
          return updated;
        });
        logAuditAction("Crop", "Admin Added Market Price Listing", newPrice.id, "None", `${newPrice.crop} - ₹${priceNum}`);
      }
    }

    setShowAddModal(false);
    setEditingItem(null);
  };

  // Calculated Dashboard KPI Aggregates
  const totalFarmersCount = farmers.length;
  const activeFarmersCount = farmers.filter((f) => f.accountStatus === "Active").length;
  const pendingFarmersCount = farmers.filter((f) => f.verificationStatus === "Pending Verification").length;
  const suspendedFarmersCount = farmers.filter((f) => f.accountStatus === "Suspended").length;

  const totalBuyersCount = buyers.length;
  const verifiedBuyersCount = buyers.filter((b) => b.kycStatus === "Verified").length;
  const pendingBuyersCount = buyers.filter((b) => b.kycStatus === "Pending" || b.kycStatus === "Under Review").length;
  const suspendedBuyersCount = buyers.filter((b) => b.accountStatus === "Suspended").length;

  const totalStorageCount = storages.length;
  const activeStorageCount = storages.filter((s) => s.accountStatus === "Active").length;
  const totalStorageCapacityMT = storages.reduce((sum, s) => sum + s.totalCapacityMT, 0);
  const occupiedStorageCapacityMT = storages.reduce((sum, s) => sum + s.occupiedCapacityMT, 0);
  const availableStorageCapacityMT = totalStorageCapacityMT - occupiedStorageCapacityMT;

  // Global Search Results Filter
  const globalSearchResults = globalSearch.trim() === "" ? [] : [
    ...farmers.filter(f => f.name.toLowerCase().includes(globalSearch.toLowerCase()) || f.id.toLowerCase().includes(globalSearch.toLowerCase())).map(f => ({ type: "Farmer", title: `${f.name} (${f.id})`, subtitle: `${f.district} • Crop: ${f.mainCrop}`, item: f, targetModule: "farmers" })),
    ...buyers.filter(b => b.companyName.toLowerCase().includes(globalSearch.toLowerCase()) || b.id.toLowerCase().includes(globalSearch.toLowerCase())).map(b => ({ type: "Buyer", title: `${b.companyName} (${b.id})`, subtitle: `${b.location} • Type: ${b.buyerType}`, item: b, targetModule: "buyers" })),
    ...storages.filter(s => s.facilityName.toLowerCase().includes(globalSearch.toLowerCase()) || s.id.toLowerCase().includes(globalSearch.toLowerCase())).map(s => ({ type: "Cold Storage", title: `${s.facilityName} (${s.id})`, subtitle: `${s.location} • Capacity: ${s.totalCapacityMT} MT`, item: s, targetModule: "storage" })),
    ...agreements.filter(a => a.id.toLowerCase().includes(globalSearch.toLowerCase()) || a.cropName.toLowerCase().includes(globalSearch.toLowerCase())).map(a => ({ type: "Agreement", title: `Contract ${a.id} (${a.cropName})`, subtitle: `Farmer: ${a.farmerName} ➔ Buyer: ${a.buyerName}`, item: a, targetModule: "agreements" }))
  ];

  // Render Admin Credential Login Gate if unauthenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] py-12 px-4 flex items-center justify-center font-sans select-none">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#1E3B18] text-white rounded-2xl flex items-center justify-center shadow-md mx-auto mb-3">
              <Lock className="w-8 h-8 text-amber-300" />
            </div>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Admin Master Access Control
            </span>
            <h2 className="text-2xl font-serif font-extrabold text-[#1E3B18]">
              SANJEEVANI Admin Web
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Strict Admin Authentication Required. Farmers, Buyers, and Cold Storage Operators are restricted from accessing this portal.
            </p>
          </div>

          {adminAuthError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold text-center">
              {adminAuthError}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const enteredUsername = adminEmail.trim();
              const enteredPassword = adminPasscode;

              if (
                enteredUsername.toLowerCase() === CONFIGURED_ADMIN_USERNAME.toLowerCase() &&
                enteredPassword === CONFIGURED_ADMIN_PASSWORD
              ) {
                setAdminAuthError("");
                setIsAdminAuthenticated(true);
              } else {
                setAdminAuthError("Invalid username or password");
              }
            }}
            className="space-y-4 text-xs font-semibold"
          >
            <div>
              <label className="block text-stone-700 font-bold mb-1">Admin Email / Username</label>
              <input
                type="text"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@sanjeevani.com"
                className="w-full p-3 bg-[#FAF9F6] border border-stone-300 rounded-2xl text-sm font-bold text-stone-900 outline-none focus:border-[#1E3B18]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Admin Security Passcode</label>
              <input
                type="password"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 bg-[#FAF9F6] border border-stone-300 rounded-2xl text-sm font-bold text-stone-900 outline-none focus:border-[#1E3B18]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1E3B18] hover:bg-[#142910] text-amber-300 font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition cursor-pointer active:scale-96"
            >
              <ShieldCheck className="w-5 h-5 text-amber-300" />
              <span>Authenticate & Enter Control Panel</span>
            </button>
          </form>

          <div className="pt-2 text-center border-t border-stone-100">
            <button
              onClick={() => window.location.href = "https://frontend-sand-alpha-31.vercel.app"}
              className="text-xs text-stone-500 font-bold hover:text-stone-800"
            >
              ← Return to Sanjeevani Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Nav Items Configuration for Left Sidebar
  const sidebarNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "farmers", label: "Farmers", icon: Sprout, badge: totalFarmersCount },
    { id: "buyers", label: "Buyers", icon: ShoppingBag, badge: totalBuyersCount },
    { id: "storage", label: "Cold Storage", icon: Warehouse, badge: totalStorageCount },
    { id: "crops", label: "Market Prices", icon: TrendingUp, badge: mandiPrices.length },
    { id: "agreements", label: "Agreements", icon: FileCheck, badge: agreements.length },
    { id: "audit", label: "Audit Logs", icon: Activity, badge: auditLogs.length },
    { id: "settings", label: "Settings & Users", icon: Settings, badge: userAccounts.length },
    { id: "cms", label: "Live Web CMS", icon: Globe, badge: "Live" },
    { id: "diagnoses", label: "Crop AI Scans", icon: Camera, badge: diagnoses.length }
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F0] flex font-sans select-none text-gray-900 overflow-hidden">
      
      {/* 1. LEFT SIDEBAR (DESKTOP FIXED & MOBILE DRAWER) */}
      <aside
        className={`w-64 bg-[#1B3B18] text-white shrink-0 flex-col justify-between border-r border-emerald-950 shadow-2xl transition-all duration-300 ${
          isMobileSidebarOpen ? "fixed inset-y-0 left-0 z-50 flex" : "hidden md:flex"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-emerald-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
                <img src="/logo.png" alt="Sanjeevani" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-white leading-none">
                  SANJEEVANI
                </h1>
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block mt-1">
                  Master Admin Web
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden text-emerald-300 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTabModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTabModule(item.id as any);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between transition cursor-pointer font-extrabold text-xs ${
                    isActive
                      ? "bg-amber-400 text-gray-950 shadow-lg font-black"
                      : "text-emerald-100 hover:bg-emerald-900/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-gray-950" : "text-amber-300"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        isActive ? "bg-gray-900 text-amber-300" : "bg-emerald-900 text-emerald-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-emerald-900/60 space-y-2">
          <button
            onClick={() => {
              localStorage.setItem("sanjeevani_authenticated", "true");
              window.location.href = "/";
            }}
            className="w-full py-2.5 bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 font-bold text-xs rounded-xl border border-emerald-700/50 flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <Globe className="w-4 h-4 text-amber-300" />
            <span>Main Web App</span>
          </button>

          <button
            onClick={() => {
              setIsAdminAuthenticated(false);
              sessionStorage.removeItem("sanjeevani_admin_auth");
            }}
            className="w-full py-2.5 bg-red-900/80 hover:bg-red-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-white" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between shadow-xs shrink-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden text-gray-700 p-2 rounded-xl hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg font-black text-gray-900 capitalize flex items-center space-x-2">
                <span>{activeTabModule.toUpperCase()} Module</span>
              </h2>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hidden sm:inline-block">
                👑 MASTER ADMIN OVERRIDE ACTIVE
              </span>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="relative flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onFocus={() => setIsGlobalSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsGlobalSearchFocused(false), 200)}
                placeholder="Global Search (Farmer ID, Buyer ID, Crop, Agreement)..."
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-full text-xs font-bold text-gray-900 outline-none focus:border-emerald-700"
              />
            </div>

            {/* Global Search Results Dropdown */}
            {isGlobalSearchFocused && globalSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 space-y-1 text-xs">
                <div className="px-3 py-1 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 rounded-lg">
                  Global Search Matches ({globalSearchResults.length})
                </div>
                {globalSearchResults.map((res, idx) => (
                  <button
                    key={idx}
                    onMouseDown={() => {
                      setActiveTabModule(res.targetModule as any);
                      if (res.targetModule === "farmers") setSelectedFarmerDetail(res.item as FarmerRecord);
                      if (res.targetModule === "buyers") setSelectedBuyerDetail(res.item as BuyerRecord);
                      if (res.targetModule === "storage") setSelectedStorageDetail(res.item as ColdStorageRecord);
                      setGlobalSearch("");
                    }}
                    className="w-full text-left p-2.5 hover:bg-emerald-50 rounded-xl transition flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-extrabold text-gray-900">{res.title}</div>
                      <div className="text-[10px] text-gray-500">{res.subtitle}</div>
                    </div>
                    <span className="text-[9px] font-extrabold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                      {res.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Top Right Header Badges */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsDrawer(!showNotificationsDrawer)}
                className="p-2 bg-stone-100 hover:bg-stone-200 text-gray-700 rounded-full relative cursor-pointer"
                title="Admin Alerts & Notifications"
              >
                <Bell className="w-4 h-4 text-gray-700" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
              </button>

              {showNotificationsDrawer && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-black text-gray-900 text-sm">System Alerts & Notifications</h3>
                    <span className="text-[10px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-full">
                      4 Urgent
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { type: "Buyer KYC", title: "Buyer KYC Pending Review", desc: "Apex Grain Mills submitted PAN documents.", target: "buyers" },
                      { type: "Farmer KYC", title: "Farmer Verification Required", desc: "Srinivasa Reddy submitted Pattadar passbook.", target: "farmers" },
                      { type: "Storage", title: "Storage Capacity Warning", desc: "Guntur Cold Care is at 76% capacity.", target: "storage" },
                      { type: "Contract", title: "Agreement Expiring Soon", desc: "Contract AGR_880 expires in 25 days.", target: "agreements" }
                    ].map((n, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setActiveTabModule(n.target as any);
                          setShowNotificationsDrawer(false);
                        }}
                        className="p-2.5 bg-stone-50 hover:bg-emerald-50 rounded-xl border border-stone-200 space-y-1 cursor-pointer transition"
                      >
                        <div className="flex justify-between items-center font-extrabold text-gray-900">
                          <span>{n.title}</span>
                          <span className="text-[9px] text-amber-700 font-bold">{n.type}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Badge */}
            <div className="flex items-center space-x-2 bg-emerald-900 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Hitaishi Admin</span>
              <span className="bg-amber-400 text-gray-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                ADMIN
              </span>
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT BODY */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#F4F6F0]">
          
          {/* MODULE 1: DASHBOARD */}
          {activeTabModule === "dashboard" && (
            <div className="space-y-6">
              
              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* Farmers Card */}
                <div 
                  onClick={() => setActiveTabModule("farmers")}
                  className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full uppercase border border-emerald-200">
                      Farmers
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-gray-900">{totalFarmersCount}</span>
                    <span className="text-xs text-gray-500 font-bold ml-1">Total Registered</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] pt-2 border-t border-gray-100 font-bold text-gray-600">
                    <div>Active: <strong className="text-emerald-700">{activeFarmersCount}</strong></div>
                    <div>Pending: <strong className="text-amber-600">{pendingFarmersCount}</strong></div>
                    <div>Suspended: <strong className="text-red-600">{suspendedFarmersCount}</strong></div>
                  </div>
                </div>

                {/* Buyers Card */}
                <div 
                  onClick={() => setActiveTabModule("buyers")}
                  className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm hover:shadow-md transition cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full uppercase border border-amber-200">
                      Buyers
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-gray-900">{totalBuyersCount}</span>
                    <span className="text-xs text-gray-500 font-bold ml-1">Total Registered</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] pt-2 border-t border-gray-100 font-bold text-gray-600">
                    <div>Verified: <strong className="text-emerald-700">{verifiedBuyersCount}</strong></div>
                    <div>Pending KYC: <strong className="text-amber-600">{pendingBuyersCount}</strong></div>
                    <div>Suspended: <strong className="text-red-600">{suspendedBuyersCount}</strong></div>
                  </div>
                </div>

                {/* Cold Storage Card */}
                <div 
                  onClick={() => setActiveTabModule("storage")}
                  className="bg-white p-5 rounded-3xl border border-teal-100 shadow-sm hover:shadow-md transition cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                      <Warehouse className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full uppercase border border-teal-200">
                      Cold Storage
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-gray-900">{totalStorageCount}</span>
                    <span className="text-xs text-gray-500 font-bold ml-1">Facilities</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] pt-2 border-t border-gray-100 font-bold text-gray-600">
                    <div>Active: <strong className="text-teal-700">{activeStorageCount}</strong></div>
                    <div>Used: <strong className="text-teal-800">{(occupiedStorageCapacityMT/1000).toFixed(1)}k MT</strong></div>
                    <div>Free: <strong className="text-emerald-700">{(availableStorageCapacityMT/1000).toFixed(1)}k MT</strong></div>
                  </div>
                </div>

                {/* Crops Card */}
                <div 
                  onClick={() => setActiveTabModule("crops")}
                  className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm hover:shadow-md transition cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-extrabold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full uppercase border border-indigo-200">
                      Crops
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-gray-900">6</span>
                    <span className="text-xs text-gray-500 font-bold ml-1">Active Varieties</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] pt-2 border-t border-gray-100 font-bold text-gray-600">
                    <div>Active: <strong className="text-emerald-700">6</strong></div>
                    <div>Harvest-ready: <strong className="text-amber-600">4</strong></div>
                  </div>
                </div>

                {/* Agreements Card */}
                <div 
                  onClick={() => setActiveTabModule("agreements")}
                  className="bg-white p-5 rounded-3xl border border-purple-100 shadow-sm hover:shadow-md transition cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-extrabold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full uppercase border border-purple-200">
                      Agreements
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-gray-900">{agreements.length}</span>
                    <span className="text-xs text-gray-500 font-bold ml-1">Contracts</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] pt-2 border-t border-gray-100 font-bold text-gray-600">
                    <div>Active: <strong className="text-emerald-700">{agreements.filter(a => a.status === "Active").length}</strong></div>
                    <div>Expiring: <strong className="text-amber-600">0</strong></div>
                  </div>
                </div>

              </div>

              {/* Dashboard Split: Recent Activities & System Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Activities Section */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-base font-extrabold text-gray-900 flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-emerald-700" />
                      <span>Recent Platform Activities</span>
                    </h3>
                    <button
                      onClick={() => setActiveTabModule("audit")}
                      className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      View All Audit Logs →
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {auditLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                        <div>
                          <div className="font-extrabold text-gray-900">{log.action}</div>
                          <span className="text-[10px] text-gray-500">By {log.userName} ({log.userRole}) • {log.timestamp}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important System Operational Alerts */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-base font-extrabold text-gray-900 flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span>Important Operational Alerts</span>
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    {[
                      { title: "Buyer KYC Pending Approval", desc: "Apex Grain Mills submitted legal PAN registration documents.", module: "buyers", type: "KYC" },
                      { title: "Farmer Verification Required", desc: "Srinivasa Reddy submitted Pattadar passbook.", module: "farmers", type: "KYC" },
                      { title: "Storage Capacity Warning", desc: "Guntur Cold Storage care is currently at 76% capacity.", module: "storage", type: "Storage" },
                      { title: "Sale Agreement Expiring Soon", desc: "Contract AGR_880 between Ramesh Kumar & Sri Lakshmi expires in 25 days.", module: "agreements", type: "Contract" }
                    ].map((alert, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveTabModule(alert.module as any)}
                        className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 flex items-center justify-between hover:bg-amber-100/80 transition cursor-pointer"
                      >
                        <div>
                          <div className="font-extrabold text-amber-950">{alert.title}</div>
                          <div className="text-[10px] text-amber-800 font-medium">{alert.desc}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-amber-700 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Live Mandi Market Prices Table on Dashboard */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-emerald-700" />
                      <span>Live APMC Market Prices & Mandi Rates</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">Real-time prices synchronized across Main Farmer Web & Admin Portal.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setModalType("price");
                        setFormName("");
                        setFormCrop("");
                        setFormDistrict("Guntur");
                        setFormPrice("2800");
                        setEditingItem(null);
                        setShowAddModal(true);
                      }}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>+ Add Market Price</span>
                    </button>
                    <button
                      onClick={() => setActiveTabModule("crops")}
                      className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Manage Rates →
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 uppercase text-[10px] font-black tracking-wider border-b border-gray-200">
                        <th className="p-3">Commodity & Local Name</th>
                        <th className="p-3">APMC Mandi Yard</th>
                        <th className="p-3 text-emerald-950 bg-emerald-50 font-black">Market Price</th>
                        <th className="p-3">24h Trend</th>
                        <th className="p-3 text-center">Quick Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {mandiPrices.map((mp) => (
                        <tr key={mp.id} className="hover:bg-emerald-50/40 transition">
                          <td className="p-3">
                            <div className="font-extrabold text-gray-900 text-sm">{mp.crop}</div>
                            <span className="text-[11px] text-emerald-800 font-semibold">{mp.cropTe}</span>
                          </td>
                          <td className="p-3 font-semibold text-gray-700">{mp.mandi}</td>
                          <td className="p-3 bg-emerald-50/30">
                            <span className="font-black text-emerald-950 text-sm">₹{mp.price.toLocaleString("en-IN")}</span>
                            <span className="text-[10px] text-gray-500 font-bold ml-1">/{mp.unit || "Qtl"}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              mp.trend === "up" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                            }`}>
                              {mp.trend === "up" ? "▲" : "▼"} {mp.changePct}%
                            </span>
                            <div className="text-[10px] text-gray-400 mt-0.5">{mp.updatedAt}</div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              <input
                                type="number"
                                defaultValue={mp.price}
                                id={`dash-price-${mp.id}`}
                                className="w-20 px-2 py-1 border border-gray-300 rounded-lg font-bold text-gray-900 text-xs focus:border-emerald-600 focus:outline-none text-right"
                              />
                              <button
                                onClick={() => {
                                  const input = document.getElementById(`dash-price-${mp.id}`) as HTMLInputElement;
                                  if (input) {
                                    const val = parseFloat(input.value);
                                    if (val > 0) {
                                      updateSharedMandiPrice(mp.id, val);
                                      setMandiPrices(getSharedMandiPrices());
                                      logAuditAction("Crop", `Admin updated price of ${mp.crop}`, mp.id, `₹${mp.price}`, `₹${val}`);
                                    }
                                  }
                                }}
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[10px] rounded-lg shadow-xs transition cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* MODULE 2: FARMERS MANAGEMENT */}
          {activeTabModule === "farmers" && (
            <div className="space-y-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 flex items-center space-x-2">
                    <Sprout className="w-5 h-5 text-emerald-700" />
                    <span>Farmer Management Panel</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    View, Add, Edit, Verify KYC, Suspend/Activate, and Inspect 11-Tab Farmer Profiles.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setModalType("farmer");
                    setFormName("");
                    setEditingItem(null);
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center space-x-1.5 self-start md:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Add New Farmer</span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Name, Phone, Village..."
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-emerald-700 font-semibold"
                  />
                </div>

                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="p-2.5 border border-gray-300 rounded-xl outline-none font-bold text-gray-800 bg-white"
                >
                  <option value="All">All Districts</option>
                  <option value="Guntur">Guntur District</option>
                  <option value="Krishna">Krishna District</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2.5 border border-gray-300 rounded-xl outline-none font-bold text-gray-800 bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Suspended">Suspended Only</option>
                </select>
              </div>

              {/* Farmers Data Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-[10px] font-black tracking-wider border-b border-gray-200">
                      <th className="p-3">Farmer ID & Name</th>
                      <th className="p-3">Contact & Location</th>
                      <th className="p-3">Farm & Soil</th>
                      <th className="p-3">Main Crop</th>
                      <th className="p-3 text-emerald-950 bg-emerald-50 font-black">Market Price</th>
                      <th className="p-3">KYC & Account</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                    {farmers.map((f) => (
                      <tr key={f.id} className="hover:bg-emerald-50/40 transition">
                        <td className="p-3">
                          <div className="font-extrabold text-gray-900 text-sm">{f.name}</div>
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                            {f.id}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-gray-900">{f.phone}</div>
                          <div className="text-[10px] text-gray-500">{f.village}, {f.district}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-gray-900">{f.farmSizeAcres} Acres</div>
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                            {f.soilType}
                          </span>
                        </td>
                        <td className="p-3 font-extrabold text-emerald-800">{f.mainCrop}</td>
                        <td className="p-3 bg-emerald-50/40">
                          {(() => {
                            const clean = (f.mainCrop || "").toLowerCase().trim();
                            const matched = mandiPrices.find(p => 
                              p.crop.toLowerCase().includes(clean) || clean.includes(p.crop.toLowerCase())
                            );
                            if (matched) {
                              return (
                                <div>
                                  <div className="font-black text-emerald-950 text-sm">
                                    ₹{matched.price.toLocaleString("en-IN")}
                                    <span className="text-[10px] font-bold text-emerald-700 ml-1">/{matched.unit || "Qtl"}</span>
                                  </div>
                                  <div className="text-[10px] font-semibold text-gray-500">{matched.mandi}</div>
                                </div>
                              );
                            }
                            return (
                              <div>
                                <span className="font-black text-emerald-900 text-sm">₹2,850</span>
                                <span className="text-[10px] text-gray-500 font-bold block">APMC Mandi</span>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="p-3 space-y-1">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            f.verificationStatus === "Verified" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
                          }`}>
                            {f.verificationStatus}
                          </span>
                          <span className={`block text-[10px] font-bold ${f.accountStatus === "Active" ? "text-emerald-600" : "text-red-600"}`}>
                            • {f.accountStatus}
                          </span>
                        </td>
                        <td className="p-3 text-center space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedFarmerDetail(f)}
                            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg cursor-pointer"
                            title="View 11-Tab Farmer Profile"
                          >
                            👁️ View Profile
                          </button>
                          <button
                            onClick={() => handleEditFarmer(f)}
                            className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleToggleFarmerStatus(f.id)}
                            className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg cursor-pointer ${
                              f.accountStatus === "Active" ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-emerald-700 hover:bg-emerald-800 text-white"
                            }`}
                          >
                            {f.accountStatus === "Active" ? "Suspend" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDeleteFarmer(f.id)}
                            className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE 3: BUYERS MANAGEMENT */}
          {activeTabModule === "buyers" && (
            <div className="space-y-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-amber-700" />
                    <span>Buyer Management & KYC Approvals</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Only Admin can approve or reject Buyer KYC documents, edit procurement rates, and manage buyer accounts.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setModalType("buyer");
                    setFormName("");
                    setEditingItem(null);
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center space-x-1.5 self-start md:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Add New Buyer</span>
                </button>
              </div>

              {/* Buyers Data Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-[10px] font-black tracking-wider border-b border-gray-200">
                      <th className="p-3">Buyer / Company Name</th>
                      <th className="p-3">Contact & Location</th>
                      <th className="p-3">Crops & Offered Rate</th>
                      <th className="p-3">KYC Status</th>
                      <th className="p-3">Agreements</th>
                      <th className="p-3 text-center">KYC & Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                    {buyers.map((b) => (
                      <tr key={b.id} className="hover:bg-amber-50/40 transition">
                        <td className="p-3">
                          <div className="font-extrabold text-gray-900 text-sm">{b.companyName}</div>
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                            {b.buyerType}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-gray-900">{b.repName}</div>
                          <div className="text-[10px] text-gray-500">{b.phone} • {b.location}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-extrabold text-emerald-800">₹{b.priceOfferedQtl} / Quintal</div>
                          <div className="text-[10px] text-gray-500">{b.interestedCrops.join(", ")}</div>
                        </td>
                        <td className="p-3 space-y-1">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            b.kycStatus === "Verified"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : b.kycStatus === "Rejected"
                              ? "bg-red-100 text-red-800 border border-red-300"
                              : "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                          }`}>
                            KYC: {b.kycStatus}
                          </span>
                        </td>
                        <td className="p-3 font-extrabold text-gray-900">{b.totalAgreements} Active</td>
                        <td className="p-3 text-center space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedBuyerDetail(b)}
                            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            👁️ View Details
                          </button>
                          {b.kycStatus !== "Verified" && (
                            <button
                              onClick={() => handleApproveBuyerKyc(b.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold rounded-lg cursor-pointer"
                            >
                              Approve KYC
                            </button>
                          )}
                          {b.kycStatus !== "Rejected" && b.kycStatus !== "Verified" && (
                            <button
                              onClick={() => handleRejectBuyerKyc(b.id)}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-extrabold rounded-lg cursor-pointer"
                            >
                              Reject KYC
                            </button>
                          )}
                          <button
                            onClick={() => handleEditBuyer(b)}
                            className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBuyer(b.id)}
                            className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE 4: COLD STORAGE MANAGEMENT */}
          {activeTabModule === "storage" && (
            <div className="space-y-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 flex items-center space-x-2">
                    <Warehouse className="w-5 h-5 text-teal-700" />
                    <span>Cold Storage & Inventory Management</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Complete control over MT capacity indicators, stored inventory batches, climate controls & daily rental rates.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setModalType("storage");
                    setFormName("");
                    setFormLocation("Guntur Mandi Hub");
                    setFormDistrict("Guntur");
                    setFormCapacity("4000");
                    setFormPrice("8");
                    setFormCrop("Tomato");
                    setFormPhone("+91 98765 43210");
                    setEditingItem(null);
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center space-x-1.5 self-start md:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Add Storage Facility</span>
                </button>
              </div>

              {/* Cold Storage Master Data Table with Place/Location and Space Columns */}
              <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-[10px] font-black tracking-wider border-b border-gray-200">
                      <th className="p-3">Facility Name & ID</th>
                      <th className="p-3 text-teal-950 bg-teal-50 font-black">Place / Location</th>
                      <th className="p-3 text-emerald-950 bg-emerald-50 font-black">Amount of Space (Total MT)</th>
                      <th className="p-3">Available Space</th>
                      <th className="p-3">Occupied Space</th>
                      <th className="p-3">Daily Rate</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                    {storages.map((s) => (
                      <tr key={s.id} className="hover:bg-teal-50/40 transition">
                        <td className="p-3">
                          <div className="font-extrabold text-gray-900 text-sm">{s.facilityName}</div>
                          <span className="text-[10px] font-mono text-teal-800 bg-teal-100 px-2 py-0.5 rounded font-bold">
                            {s.id}
                          </span>
                        </td>
                        <td className="p-3 bg-teal-50/30">
                          <div className="font-extrabold text-gray-900 text-xs flex items-center space-x-1">
                            <span className="text-teal-700">📍</span>
                            <span>{s.location}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-semibold">{s.district} District</span>
                        </td>
                        <td className="p-3 bg-emerald-50/30">
                          <span className="font-black text-emerald-950 text-sm">{s.totalCapacityMT.toLocaleString()} MT</span>
                          <span className="text-[10px] text-gray-500 font-semibold block">Total Warehouse Space</span>
                        </td>
                        <td className="p-3 font-extrabold text-emerald-700 text-sm">
                          {s.availableCapacityMT.toLocaleString()} MT
                        </td>
                        <td className="p-3 font-extrabold text-teal-800 text-sm">
                          {s.occupiedCapacityMT.toLocaleString()} MT
                        </td>
                        <td className="p-3 font-extrabold text-gray-900">
                          ₹{s.dailyRateQtl}/Qtl/day
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-[10px] font-extrabold">
                            {s.maintenanceStatus}
                          </span>
                        </td>
                        <td className="p-3 text-center space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedStorageDetail(s)}
                            className="px-2.5 py-1 bg-teal-100 hover:bg-teal-200 text-teal-900 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            👁️ View Details
                          </button>
                          <button
                            onClick={() => handleEditStorage(s)}
                            className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStorage(s.id)}
                            className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Storage Facilities Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storages.map((s) => (
                  <div key={s.id} className="p-5 rounded-3xl border border-teal-100 bg-stone-50/50 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-base">{s.facilityName}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center text-[10px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            📍 Place: {s.location}
                          </span>
                          <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            📦 Space: {s.totalCapacityMT} MT
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-900 text-[10px] font-extrabold">
                        {s.maintenanceStatus}
                      </span>
                    </div>

                    {/* Capacity Indicator Bar */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Occupied: <strong className="text-teal-800">{s.occupiedCapacityMT} MT</strong></span>
                        <span>Available: <strong className="text-emerald-700">{s.availableCapacityMT} MT</strong></span>
                        <span>Total: {s.totalCapacityMT} MT</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-600 h-full rounded-full"
                          style={{ width: `${(s.occupiedCapacityMT / s.totalCapacityMT) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedStorageDetail(s)}
                        className="px-3 py-1.5 bg-teal-100 hover:bg-teal-200 text-teal-900 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        👁️ View Details
                      </button>
                      <button
                        onClick={() => handleEditStorage(s)}
                        className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStorage(s.id)}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ======================================================== */}
              {/* COLD STORAGE BOOKINGS & 20% ADVANCE PAYMENT TRACKER     */}
              {/* ======================================================== */}
              <div className="space-y-4 pt-6 border-t border-teal-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-teal-700" />
                      <h3 className="font-extrabold text-gray-900 text-base">
                        Cold Storage Bookings & Mandatory 20% Advance Payment Tracker
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Real-time bidirectional tracking of cold storage space reservations & 20% advance compliance
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-teal-100 text-teal-900 font-extrabold px-3 py-1 rounded-full border border-teal-200">
                      Total Bookings: {storageBookings.length}
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-900 font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                      20% Paid: {storageBookings.filter(b => b.paymentStatus === "20% Advance Paid").length}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-teal-900 text-teal-50 uppercase text-[10px] font-black tracking-wider">
                        <th className="p-3">Booking ID & Date</th>
                        <th className="p-3">Farmer Name & ID</th>
                        <th className="p-3">Cold Storage Facility</th>
                        <th className="p-3">Produce & Quantity</th>
                        <th className="p-3 text-right">Total Amount</th>
                        <th className="p-3 text-right text-teal-200 font-black">20% Advance Req.</th>
                        <th className="p-3 text-right text-emerald-300 font-black">Amount Paid</th>
                        <th className="p-3 text-right text-amber-200 font-black">Remaining</th>
                        <th className="p-3 text-center">Payment Status</th>
                        <th className="p-3">Txn ID / Payment Date</th>
                        <th className="p-3 text-center">Admin Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800 bg-white">
                      {storageBookings.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="p-8 text-center text-gray-400">
                            No cold storage bookings found.
                          </td>
                        </tr>
                      ) : (
                        storageBookings.map((b) => {
                          const calc = calculateColdStorageAdvance(b.totalAmount, b.amountPaid);
                          const isPaid = b.paymentStatus === "20% Advance Paid";

                          return (
                            <tr key={b.id} className="hover:bg-teal-50/30 transition">
                              <td className="p-3 font-mono">
                                <span className="font-extrabold text-teal-950 bg-teal-100 px-2 py-0.5 rounded text-[11px]">
                                  {b.bookingCode || b.id}
                                </span>
                                <div className="text-[10px] text-gray-400 mt-0.5">{b.createdAt || "2026-09-20"}</div>
                              </td>

                              <td className="p-3">
                                <div className="font-extrabold text-gray-900">{b.farmerName}</div>
                                <span className="text-[10px] font-mono text-gray-500">{b.farmerId || "FAR_201"}</span>
                              </td>

                              <td className="p-3">
                                <div className="font-bold text-gray-900">{b.facilityName}</div>
                                <span className="text-[10px] text-gray-500">📍 {b.location || "Guntur"}</span>
                              </td>

                              <td className="p-3">
                                <span className="font-extrabold text-gray-800">{b.cropName}</span>
                                <div className="text-[10px] text-teal-800 font-bold">{b.quantityMT} MT ({b.durationDays || 30} Days)</div>
                              </td>

                              <td className="p-3 text-right font-black text-gray-900">
                                ₹{calc.totalAmount.toLocaleString()}
                              </td>

                              <td className="p-3 text-right font-black text-teal-900 bg-teal-50/40">
                                ₹{calc.requiredAdvance.toLocaleString()}
                              </td>

                              <td className="p-3 text-right font-black text-emerald-700 bg-emerald-50/40">
                                ₹{calc.amountPaid.toLocaleString()}
                              </td>

                              <td className="p-3 text-right font-black text-amber-800 bg-amber-50/30">
                                ₹{calc.remainingAmount.toLocaleString()}
                              </td>

                              <td className="p-3 text-center">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-black inline-block ${
                                    isPaid
                                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                      : "bg-amber-100 text-amber-900 border border-amber-300"
                                  }`}
                                >
                                  {isPaid ? "✓ 20% Advance Paid" : "⚠️ Advance Pending"}
                                </span>
                              </td>

                              <td className="p-3">
                                {isPaid ? (
                                  <div>
                                    <span className="font-mono font-bold text-emerald-900 text-[11px] block">
                                      {b.txnId || "TXN-CS-2026-0902"}
                                    </span>
                                    <span className="text-[10px] text-gray-500">{b.paymentDate || "2026-09-20"}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 italic text-[11px]">Unpaid</span>
                                )}
                              </td>

                              <td className="p-3 text-center whitespace-nowrap">
                                {isPaid ? (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                                    ✓ Verified
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setAdminStorageBooking(b);
                                      setAdminStoragePayAmount(calc.requiredAdvance.toString());
                                      setAdminStoragePaySuccessMsg("");
                                      setShowAdminStoragePayModal(true);
                                    }}
                                    className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-[11px] shadow-xs cursor-pointer active:scale-95"
                                  >
                                    + Mark 20% Paid
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 5: CROPS MANAGEMENT & MANDI PRICE CONTROLLER */}
          {activeTabModule === "crops" && (
            <div className="space-y-6">
              {/* Live Mandi Rate Master Controller */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-emerald-700" />
                      <span>Live Mandi Market Rate Controller</span>
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Changes published here update live rates instantly across the Main Farmer Website & APMC ticker.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold rounded-full self-start sm:self-auto">
                      🟢 Real-time Broadcast Active
                    </span>
                    <button
                      onClick={() => {
                        setModalType("price");
                        setFormName("");
                        setFormCrop("");
                        setFormDistrict("Guntur");
                        setFormPrice("2800");
                        setEditingItem(null);
                        setShowAddModal(true);
                      }}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>+ Add Market Price</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 uppercase text-[10px] font-black tracking-wider border-b border-gray-200">
                        <th className="p-3">Commodity & Telugu Name</th>
                        <th className="p-3">APMC Mandi Yard</th>
                        <th className="p-3 text-emerald-950 bg-emerald-50 font-black">Market Price (₹/Quintal)</th>
                        <th className="p-3">24h Trend</th>
                        <th className="p-3">Edit Live Price</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {mandiPrices.map((mp) => (
                        <tr key={mp.id} className="hover:bg-emerald-50/40 transition">
                          <td className="p-3">
                            <div className="font-extrabold text-gray-900 text-sm">{mp.crop}</div>
                            <span className="text-[11px] text-emerald-800 font-semibold">{mp.cropTe}</span>
                          </td>
                          <td className="p-3 font-semibold text-gray-700">{mp.mandi}</td>
                          <td className="p-3 bg-emerald-50/30">
                            <span className="font-black text-emerald-950 text-sm">₹{mp.price.toLocaleString("en-IN")}</span>
                            <span className="text-[10px] font-normal text-gray-500 ml-1">/{mp.unit || "Quintal"}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              mp.trend === "up" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                            }`}>
                              {mp.trend === "up" ? "▲" : "▼"} {mp.changePct}%
                            </span>
                            <div className="text-[10px] text-gray-400 mt-0.5">{mp.updatedAt}</div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500 font-bold">₹</span>
                              <input
                                type="number"
                                defaultValue={mp.price}
                                id={`price-input-${mp.id}`}
                                className="w-24 px-2 py-1 border border-gray-300 rounded-lg font-bold text-gray-900 text-xs focus:border-emerald-600 focus:outline-none"
                              />
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button
                                onClick={() => {
                                  const input = document.getElementById(`price-input-${mp.id}`) as HTMLInputElement;
                                  if (input) {
                                    const val = parseFloat(input.value);
                                    if (val > 0) {
                                      updateSharedMandiPrice(mp.id, val);
                                      setMandiPrices(getSharedMandiPrices());
                                      logAuditAction("Crop", `Admin updated price of ${mp.crop}`, mp.id, `₹${mp.price}`, `₹${val}`);
                                    }
                                  }
                                }}
                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => {
                                  const filtered = mandiPrices.filter(p => p.id !== mp.id);
                                  setMandiPrices(filtered);
                                  saveSharedMandiPrices(filtered);
                                  logAuditAction("Crop", `Admin deleted market price for ${mp.crop}`, mp.id, `₹${mp.price}`, "Removed");
                                }}
                                className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-lg cursor-pointer"
                                title="Delete Price"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Crop Management & Seasonal Rules */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-indigo-700" />
                    <span>Crop Management & Seasonal Recommendation Rules</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Manage crop varieties, NPK fertilizer rules, regional suitability, and crop lifecycle chains.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { crop: "Tomato 🍅", soil: "Red Sandy Loam", npk: "120:60:60 NPK", season: "Kharif & Rabi", yieldStr: "25-30 Tons/Acre" },
                  { crop: "Rice / Paddy 🌾", soil: "Clay Loam & Alluvial", npk: "100:50:50 NPK", season: "Kharif Season", yieldStr: "30-35 Quintals/Acre" },
                  { crop: "Chilli 🌶️", soil: "Black Cotton & Loam", npk: "150:75:75 NPK", season: "Kharif Season", yieldStr: "15-20 Quintals/Acre" },
                  { crop: "Cotton ☁️", soil: "Deep Black Cotton Soil", npk: "120:60:60 NPK", season: "Kharif Season", yieldStr: "12-15 Quintals/Acre" },
                  { crop: "Maize 🌽", soil: "Well Drained Sandy Loam", npk: "120:60:40 NPK", season: "Rabi & Kharif", yieldStr: "35-40 Quintals/Acre" },
                  { crop: "Groundnut 🥜", soil: "Light Sandy Soil", npk: "25:50:0 NPK", season: "Kharif Season", yieldStr: "18-22 Quintals/Acre" }
                ].map((c, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-indigo-950 text-base">{c.crop}</h4>
                      <span className="text-[10px] font-bold bg-white text-indigo-800 px-2 py-0.5 rounded border border-indigo-300">
                        Rule Active
                      </span>
                    </div>
                    <div className="space-y-1 text-gray-700 font-medium">
                      <div><strong>Suitable Soil:</strong> {c.soil}</div>
                      <div><strong>NPK Ratio:</strong> {c.npk}</div>
                      <div><strong>Target Yield:</strong> {c.yieldStr}</div>
                      <div><strong>Season:</strong> {c.season}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

          {/* MODULE 6: AGREEMENTS & RELATIONAL CONTRACTS */}
          {activeTabModule === "agreements" && (
            <div className="space-y-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 flex items-center space-x-2">
                    <FileCheck className="w-5 h-5 text-purple-700" />
                    <span>Relational Lifecycle & Procurement Contracts</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Connected chain: Farmer ➔ Crop ➔ Buyer ➔ Agreement ➔ Harvest ➔ Cold Storage.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {agreements.map((a) => {
                  const agrPayments = payments.filter(
                    (p) =>
                      (p.agreementId === a.id ||
                        p.agreementId === a.id.replace("AGR_", "AGR-") ||
                        a.id.includes(p.agreementId)) &&
                      p.status === "Success"
                  );
                  const totalAmount = a.quantityQuintals && a.agreedPriceQtl
                    ? a.quantityQuintals * a.agreedPriceQtl
                    : ((a as any).totalValue || 285000);
                  const amountPaid = agrPayments.reduce((sum, p) => sum + p.amount, 0);
                  const calc = calculateAdvancePayment(totalAmount, amountPaid);

                  return (
                    <div key={a.id} className="p-5 rounded-3xl border border-purple-100 bg-purple-50/30 space-y-4 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                        <div>
                          <span className="text-[10px] font-mono font-extrabold bg-purple-200 text-purple-900 px-2 py-0.5 rounded">
                            {a.id}
                          </span>
                          <h4 className="text-base font-extrabold text-gray-900 mt-1">
                            {a.cropName} Direct Procurement ({a.quantityQuintals || (a as any).quantityQtl || 50} Quintals)
                          </h4>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black shadow-2xs ${
                              calc.paymentStatus === "Paid"
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                : calc.paymentStatus === "Partially Paid"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-red-100 text-red-900 border border-red-300"
                            }`}
                          >
                            Advance: {calc.paymentStatus}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                            Contract: {a.status}
                          </span>
                        </div>
                      </div>

                      {/* Connected Chain Visualizer */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-4 rounded-2xl border border-purple-100">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold block uppercase">Farmer Producer</span>
                          <span className="font-extrabold text-emerald-900 text-sm">{a.farmerName}</span>
                          <span className="text-[10px] text-gray-500 block">ID: {a.farmerId}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-400 font-bold block uppercase">Contracted Buyer</span>
                          <span className="font-extrabold text-amber-900 text-sm">{a.buyerName}</span>
                          <span className="text-[10px] text-emerald-800 font-bold block">₹{a.agreedPriceQtl} / Quintal</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-400 font-bold block uppercase">Assigned Cold Storage</span>
                          <span className="font-extrabold text-teal-900 text-sm">{a.storageName}</span>
                          <span className="text-[10px] text-gray-500 block">Facility ID: {a.storageId}</span>
                        </div>
                      </div>

                      {/* MANDATORY 20% ADVANCE PAYMENT TRACKING BOX */}
                      <div className="p-4 bg-white rounded-2xl border-2 border-purple-200 shadow-2xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-5 h-5 text-purple-700 shrink-0" />
                            <div>
                              <h5 className="font-black text-gray-900 text-xs uppercase tracking-wider">
                                Mandatory 20% Advance Payment Tracking
                              </h5>
                              <p className="text-[11px] text-gray-500 font-medium">
                                Advance Rule: 20% of contract amount required before produce dispatch.
                              </p>
                            </div>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-xl text-xs font-black self-start sm:self-auto ${
                              calc.paymentStatus === "Paid"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : calc.paymentStatus === "Partially Paid"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                          >
                            {calc.paymentStatus === "Paid"
                              ? "✓ Required 20% Advance Fully Paid"
                              : calc.paymentStatus === "Partially Paid"
                              ? `⏳ ₹${calc.amountPaid.toLocaleString()} Paid — ₹${calc.remainingAdvance.toLocaleString()} Advance Still Required`
                              : `⚠️ ₹0 Paid — ₹${calc.requiredAdvance.toLocaleString()} Advance Required`}
                          </span>
                        </div>

                        {/* Advance Progress Bar */}
                        <div>
                          <div className="flex justify-between text-[11px] font-bold text-gray-600 mb-1">
                            <span>Paid: ₹{calc.amountPaid.toLocaleString()}</span>
                            <span>{calc.advancePercentage}% of Required Advance</span>
                            <span>Required 20%: ₹{calc.requiredAdvance.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                calc.paymentStatus === "Paid" ? "bg-emerald-600" : "bg-purple-600"
                              }`}
                              style={{ width: `${calc.advancePercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* 5 Required Display Fields */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                          <div className="p-2.5 bg-purple-50/40 rounded-xl border border-purple-100">
                            <span className="text-[10px] text-gray-500 font-bold block">CONTRACT TOTAL</span>
                            <span className="font-black text-gray-900 text-xs">
                              ₹{calc.totalAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="p-2.5 bg-purple-50/40 rounded-xl border border-purple-100">
                            <span className="text-[10px] text-purple-700 font-bold block">20% ADVANCE (REQ)</span>
                            <span className="font-black text-purple-900 text-xs">
                              ₹{calc.requiredAdvance.toLocaleString()}
                            </span>
                          </div>
                          <div className="p-2.5 bg-purple-50/40 rounded-xl border border-purple-100">
                            <span className="text-[10px] text-emerald-700 font-bold block">AMOUNT PAID</span>
                            <span className="font-black text-emerald-700 text-xs">
                              ₹{calc.amountPaid.toLocaleString()}
                            </span>
                          </div>
                          <div className="p-2.5 bg-purple-50/40 rounded-xl border border-purple-100">
                            <span className="text-[10px] text-amber-700 font-bold block">REMAINING ADVANCE</span>
                            <span className="font-black text-amber-800 text-xs">
                              ₹{calc.remainingAdvance.toLocaleString()}
                            </span>
                          </div>
                          <div className="p-2.5 bg-purple-50/40 rounded-xl border border-purple-100 col-span-2 sm:col-span-1">
                            <span className="text-[10px] text-gray-500 font-bold block">PAYMENT STATUS</span>
                            <span
                              className={`font-black text-xs ${
                                calc.paymentStatus === "Paid"
                                  ? "text-emerald-700"
                                  : calc.paymentStatus === "Partially Paid"
                                  ? "text-amber-700"
                                  : "text-red-700"
                              }`}
                            >
                              {calc.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Receipts History */}
                        {agrPayments.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              Verified Payments ({agrPayments.length}):
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {agrPayments.map((p) => (
                                <span
                                  key={p.id}
                                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-[11px] font-bold text-gray-800"
                                >
                                  <span className="font-mono text-purple-800">{p.txnCode}</span>
                                  <span className="text-emerald-700">₹{p.amount.toLocaleString()}</span>
                                  <span className="text-gray-400 font-normal">({p.createdAt || "Recent"})</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end space-x-2 pt-1">
                        <button
                          onClick={() => {
                            setAdminPayAgreement(a);
                            setAdminPayAmount(calc.remainingAdvance > 0 ? calc.remainingAdvance.toString() : "");
                            setAdminPaySuccessMsg("");
                            setShowAdminPaymentModal(true);
                          }}
                          className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center space-x-1.5 active:scale-95"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-purple-200" />
                          <span>+ Record / Update Payment</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAgreement(a.id)}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          🗑️ Terminate / Delete Contract
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODULE 7: AUDIT LOG SYSTEM (READ-ONLY) */}
          {activeTabModule === "audit" && (
            <div className="space-y-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-700" />
                    <span>Immutable System Audit History</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Read-only append-only log recording every Admin, Farmer, Buyer, and Storage action with previous and new values.
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-extrabold rounded-full">
                  🔒 Append-Only Log Enforced
                </span>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-[10px] font-black tracking-wider border-b border-gray-200">
                      <th className="p-3">Log ID & Date</th>
                      <th className="p-3">User & Role</th>
                      <th className="p-3">Module</th>
                      <th className="p-3">Action Description</th>
                      <th className="p-3">Prev ➔ New Value</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-blue-50/30 transition">
                        <td className="p-3">
                          <span className="font-bold text-gray-900 block">{log.id}</span>
                          <span className="text-[10px] text-gray-400">{log.timestamp}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-extrabold text-gray-900">{log.userName}</div>
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                            {log.userRole}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-emerald-800">{log.module}</td>
                        <td className="p-3">
                          <div className="font-extrabold text-gray-900">{log.action}</div>
                          <span className="text-[10px] text-gray-400">Rec ID: {log.recordId}</span>
                        </td>
                        <td className="p-3 text-[11px]">
                          <span className="text-gray-500 line-through mr-1">{log.prevValue}</span>
                          <span className="text-emerald-800 font-extrabold">➔ {log.newValue}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE 8: SETTINGS & USER MANAGEMENT */}
          {activeTabModule === "settings" && (
            <div className="space-y-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-gray-700" />
                    <span>Admin User Accounts & Security Settings</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Manage system user roles, account activation/suspension, and server-side RBAC security settings.
                  </p>
                </div>
              </div>

              {/* User Accounts Management Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-gray-900">User Account Privileges & Access Control</h4>
                <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 uppercase text-[10px] font-black tracking-wider border-b border-gray-200">
                        <th className="p-3">User ID & Name</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Account Status</th>
                        <th className="p-3">Last Login</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {userAccounts.map((u) => (
                        <tr key={u.id} className="hover:bg-stone-50 transition">
                          <td className="p-3">
                            <div className="font-extrabold text-gray-900">{u.name}</div>
                            <span className="text-[10px] text-gray-400 font-mono">{u.id}</span>
                          </td>
                          <td className="p-3 font-bold text-gray-800">{u.contact}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                              u.role === "ADMIN" ? "bg-amber-400 text-gray-950" : "bg-stone-100 text-stone-800"
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3 font-extrabold text-emerald-700">{u.accountStatus}</td>
                          <td className="p-3 text-[10px] text-gray-500">{u.lastLogin}</td>
                          <td className="p-3 text-center space-x-1">
                            {u.role !== "ADMIN" && (
                              <button
                                onClick={() => handleToggleUserAccountStatus(u.id)}
                                className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-gray-800 text-[10px] font-bold rounded-lg cursor-pointer"
                              >
                                {u.accountStatus === "Active" ? "Suspend Account" : "Activate Account"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 9: LIVE MAIN WEB CMS CONTROL */}
          {activeTabModule === "cms" && (
            <div className="space-y-6 bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-emerald-700" />
                    <span>Live Main Web Content Manager (CMS)</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Directly update banner alerts, support numbers, and Mandi rates live on the main platform.
                  </p>
                </div>

                <button
                  onClick={() => {
                    logAuditAction("CMS", "Published Live Main Web Updates", "CMS_LIVE", "Previous Site Config", "New Site Config Published");
                    setCmsPublishSuccess("✅ Success: All CMS updates are published live to the Main Web Platform!");
                    setTimeout(() => setCmsPublishSuccess(""), 4000);
                  }}
                  className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-amber-300 font-black text-xs rounded-2xl shadow-xl transition active:scale-95 cursor-pointer flex items-center space-x-2 shrink-0"
                >
                  <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Publish Changes Live</span>
                </button>
              </div>

              {cmsPublishSuccess && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-emerald-900 text-xs font-black text-center animate-bounce">
                  {cmsPublishSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                    <h4 className="font-extrabold text-amber-950 text-sm">📢 Main Web Announcement Banner</h4>
                    <input
                      type="text"
                      value={cmsBannerText}
                      onChange={(e) => setCmsBannerText(e.target.value)}
                      className="w-full p-3 border border-amber-300 rounded-xl bg-white font-bold text-gray-900"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                    <h4 className="font-extrabold text-blue-950 text-sm">📞 Call & WhatsApp Helpline Number</h4>
                    <input
                      type="text"
                      value={cmsSupportPhone}
                      onChange={(e) => setCmsSupportPhone(e.target.value)}
                      className="w-full p-3 border border-blue-300 rounded-xl bg-white font-extrabold text-gray-900 text-sm"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-stone-900 text-white space-y-3 shadow-xl border border-stone-800">
                  <h4 className="font-bold text-amber-300 text-sm">Main Web Live Broadcast Preview</h4>
                  <div className="p-3 bg-amber-400 text-gray-900 rounded-xl text-xs font-black">
                    {cmsBannerText}
                  </div>
                  <div className="p-3 bg-stone-800 rounded-xl text-xs font-mono text-emerald-400">
                    Hotline: {cmsSupportPhone}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 10: CROP AI SCANS & PATHOLOGY DETECTION HISTORY */}
          {activeTabModule === "diagnoses" && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 flex items-center space-x-2">
                      <Camera className="w-5 h-5 text-emerald-700" />
                      <span>Crop AI Scans & Leaf Pathology History</span>
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Live neural network leaf disease scans submitted by farmers. Review images, verify diagnoses, and manage scan records.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full self-start sm:self-auto">
                    {diagnoses.length} Scans Synchronized
                  </span>
                </div>

                {/* Metrics Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase block">Total Leaf Scans</span>
                    <span className="text-2xl font-black text-emerald-950">{diagnoses.length}</span>
                  </div>
                  <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200">
                    <span className="text-[10px] text-red-800 font-bold uppercase block">Severe Invasions</span>
                    <span className="text-2xl font-black text-red-950">
                      {diagnoses.filter((d) => d.severity === "severe").length}
                    </span>
                  </div>
                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
                    <span className="text-[10px] text-amber-800 font-bold uppercase block">Pending Agronomist Review</span>
                    <span className="text-2xl font-black text-amber-950">
                      {diagnoses.filter((d) => d.status === "New").length}
                    </span>
                  </div>
                  <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200">
                    <span className="text-[10px] text-blue-800 font-bold uppercase block">Agronomist Verified</span>
                    <span className="text-2xl font-black text-blue-950">
                      {diagnoses.filter((d) => d.status === "Agronomist Verified").length}
                    </span>
                  </div>
                </div>

                {/* Deletion Success Banner */}
                {diagnosisSuccessMsg && (
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{diagnosisSuccessMsg}</span>
                    </div>
                    <button
                      onClick={() => setDiagnosisSuccessMsg("")}
                      className="text-emerald-700 hover:text-emerald-900 font-extrabold text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2 pt-2 text-xs">
                  <select
                    value={diagnosisFilterCrop}
                    onChange={(e) => setDiagnosisFilterCrop(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-xl font-bold text-gray-800 bg-white"
                  >
                    <option value="All">All Crops</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Chilli">Chilli</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Rice">Rice / Paddy</option>
                  </select>

                  <select
                    value={diagnosisFilterSeverity}
                    onChange={(e) => setDiagnosisFilterSeverity(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-xl font-bold text-gray-800 bg-white"
                  >
                    <option value="All">All Severities</option>
                    <option value="severe">Severe</option>
                    <option value="moderate">Moderate</option>
                    <option value="mild">Mild</option>
                    <option value="healthy">Healthy</option>
                  </select>

                  <select
                    value={diagnosisFilterStatus}
                    onChange={(e) => setDiagnosisFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-xl font-bold text-gray-800 bg-white"
                  >
                    <option value="All">All Review Statuses</option>
                    <option value="New">New Scans</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Agronomist Verified">Agronomist Verified</option>
                  </select>
                </div>
              </div>

              {/* Scans List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {diagnoses
                  .filter((d) => diagnosisFilterCrop === "All" || d.crop.toLowerCase().includes(diagnosisFilterCrop.toLowerCase()))
                  .filter((d) => diagnosisFilterSeverity === "All" || d.severity === diagnosisFilterSeverity)
                  .filter((d) => diagnosisFilterStatus === "All" || d.status === diagnosisFilterStatus)
                  .map((diag) => (
                    <div
                      key={diag.id}
                      className="bg-white rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {/* Leaf Photo Preview */}
                        <div
                          onClick={() => setSelectedDiagnosisPreview(diag)}
                          className="relative h-44 bg-gray-100 cursor-pointer group overflow-hidden"
                        >
                          <img
                            src={diag.image}
                            alt={diag.crop}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs">
                            🔍 Click to Inspect Leaf & Advise
                          </div>
                          <span
                            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              diag.severity === "severe"
                                ? "bg-red-600 text-white"
                                : diag.severity === "healthy"
                                ? "bg-emerald-600 text-white"
                                : "bg-amber-500 text-gray-950"
                            }`}
                          >
                            {diag.severity}
                          </span>
                          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 font-mono text-[10px] font-bold">
                            {(diag.confidence * 100).toFixed(0)}% AI Match
                          </span>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-3">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-extrabold text-base text-gray-900">{diag.crop}</h4>
                              <span className="text-[10px] font-bold text-gray-400">{diag.date}</span>
                            </div>
                            <p className="text-xs font-bold text-red-700 mt-0.5">{diag.condition}</p>
                          </div>

                          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                            <div className="text-gray-700">
                              <strong>Farmer:</strong> {diag.farmerName}
                            </div>
                            <div className="text-gray-600">
                              <strong>Contact:</strong> {diag.farmerPhone}
                            </div>
                            <div className="text-gray-500 text-[11px]">
                              <strong>Location:</strong> {diag.location}
                            </div>
                          </div>

                          {diag.agronomistNotes && (
                            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-semibold">
                              <strong>Agronomist:</strong> {diag.agronomistNotes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                            diag.status === "Agronomist Verified"
                              ? "bg-emerald-100 text-emerald-800"
                              : diag.status === "Reviewed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {diag.status}
                        </span>

                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => setSelectedDiagnosisPreview(diag)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                          >
                            Review & Verify
                          </button>
                          {isAdminAuthenticated && (
                            <button
                              onClick={() => handleDeleteDiagnosis(diag.id)}
                              className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer active:scale-95"
                              title="Delete this Crop AI scan from database"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. FARMER 11-TAB DETAIL SLIDE-OVER DRAWER */}
      {selectedFarmerDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-end z-50 p-0">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="p-5 bg-emerald-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-300 bg-emerald-950 px-2 py-0.5 rounded font-bold">
                  {selectedFarmerDetail.id}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{selectedFarmerDetail.name}</h3>
                <p className="text-xs text-emerald-200 font-medium">{selectedFarmerDetail.village}, {selectedFarmerDetail.district}</p>
              </div>

              <button
                onClick={() => setSelectedFarmerDetail(null)}
                className="text-white hover:text-amber-300 font-bold p-2 text-lg"
              >
                ✕
              </button>
            </div>

            {/* 11 Tabs Selector */}
            <div className="flex border-b border-gray-200 bg-stone-50 overflow-x-auto text-xs font-bold no-scrollbar p-2 space-x-1">
              {[
                { id: "overview", label: "Overview" },
                { id: "kyc", label: "KYC" },
                { id: "farm", label: "Farm" },
                { id: "land", label: "Land" },
                { id: "soil", label: "Soil" },
                { id: "crops", label: "Crops" },
                { id: "recommendations", label: "Rules" },
                { id: "buyers", label: "Buyers" },
                { id: "agreements", label: "Contracts" },
                { id: "storage", label: "Storage" },
                { id: "activity", label: "Activity" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFarmerDetailTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                    farmerDetailTab === t.id ? "bg-emerald-700 text-white font-black" : "text-gray-600 hover:bg-stone-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Detail Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              {farmerDetailTab === "overview" && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-gray-900">Basic Farmer Information</h4>
                  <div className="grid grid-cols-2 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <div><strong>Phone:</strong> {selectedFarmerDetail.phone}</div>
                    <div><strong>Main Crop:</strong> {selectedFarmerDetail.mainCrop}</div>
                    <div><strong>Farm Size:</strong> {selectedFarmerDetail.farmSizeAcres} Acres</div>
                    <div><strong>Soil Type:</strong> {selectedFarmerDetail.soilType}</div>
                  </div>
                </div>
              )}

              {farmerDetailTab === "kyc" && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-gray-900">KYC Legal Documents</h4>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                    <div><strong>Status:</strong> {selectedFarmerDetail.verificationStatus}</div>
                    <div><strong>Document:</strong> {selectedFarmerDetail.kycDocUrl}</div>
                    <div><strong>Land Record No:</strong> {selectedFarmerDetail.landRecordNo}</div>
                  </div>
                </div>
              )}

              {farmerDetailTab === "crops" && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-gray-900">Crop History & Current Production</h4>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                    <div><strong>Current Crop:</strong> {selectedFarmerDetail.mainCrop}</div>
                    <div><strong>Previous Crops:</strong> {selectedFarmerDetail.previousCrops.join(", ")}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedFarmerDetail(null)}
                className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-gray-800 font-bold rounded-xl text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COLD STORAGE DETAIL SLIDE-OVER DRAWER */}
      {selectedStorageDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-end z-50 p-0">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="p-5 bg-teal-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-300 bg-teal-950 px-2 py-0.5 rounded font-bold">
                  {selectedStorageDetail.id}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{selectedStorageDetail.facilityName}</h3>
                <p className="text-xs text-teal-200 font-medium">
                  {selectedStorageDetail.location}, {selectedStorageDetail.district} • Operator: {selectedStorageDetail.operatorName}
                </p>
              </div>

              <button
                onClick={() => setSelectedStorageDetail(null)}
                className="text-white hover:text-amber-300 font-bold p-2 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tabs Selector */}
            <div className="flex border-b border-gray-200 bg-stone-50 overflow-x-auto text-xs font-bold no-scrollbar p-2 space-x-1">
              {[
                { id: "overview", label: "Overview" },
                { id: "capacity", label: "Capacity & Space" },
                { id: "inventory", label: "Stock Inventory" },
                { id: "environment", label: "Climate Controls" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setStorageDetailTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                    storageDetailTab === t.id ? "bg-teal-700 text-white font-black" : "text-gray-600 hover:bg-stone-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Detail Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              {storageDetailTab === "overview" && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-gray-900">Facility & Operator Details</h4>
                  <div className="grid grid-cols-2 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <div><strong>Operator Name:</strong> {selectedStorageDetail.operatorName}</div>
                    <div><strong>Contact Phone:</strong> {selectedStorageDetail.phone}</div>
                    <div><strong>Location:</strong> {selectedStorageDetail.location}</div>
                    <div><strong>District:</strong> {selectedStorageDetail.district}</div>
                    <div><strong>Daily Storage Charge:</strong> ₹{selectedStorageDetail.dailyRateQtl} / Quintal / Day</div>
                    <div><strong>Maintenance Status:</strong> <span className="font-bold text-teal-700">{selectedStorageDetail.maintenanceStatus}</span></div>
                    <div><strong>Account Status:</strong> <span className="font-bold text-emerald-700">{selectedStorageDetail.accountStatus}</span></div>
                    <div><strong>Facility ID:</strong> {selectedStorageDetail.id}</div>
                  </div>

                  <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200">
                    <strong className="block text-teal-900 mb-1">Supported Crop Types:</strong>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedStorageDetail.supportedCrops && selectedStorageDetail.supportedCrops.length > 0 ? (
                        selectedStorageDetail.supportedCrops.map((c, idx) => (
                          <span key={idx} className="bg-teal-200 text-teal-900 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                            🌾 {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">General Agricultural Produce</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {storageDetailTab === "capacity" && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-sm text-gray-900">Storage Capacity Metrics</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                      <span className="text-[10px] text-gray-500 font-bold block">TOTAL CAPACITY</span>
                      <span className="text-lg font-black text-gray-900">{selectedStorageDetail.totalCapacityMT} MT</span>
                    </div>
                    <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-center">
                      <span className="text-[10px] text-teal-700 font-bold block">OCCUPIED</span>
                      <span className="text-lg font-black text-teal-800">{selectedStorageDetail.occupiedCapacityMT} MT</span>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                      <span className="text-[10px] text-emerald-700 font-bold block">AVAILABLE</span>
                      <span className="text-lg font-black text-emerald-700">{selectedStorageDetail.availableCapacityMT} MT</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                    <div className="flex justify-between font-bold text-gray-700">
                      <span>Capacity Utilization</span>
                      <span>
                        {selectedStorageDetail.totalCapacityMT > 0
                          ? ((selectedStorageDetail.occupiedCapacityMT / selectedStorageDetail.totalCapacityMT) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            selectedStorageDetail.totalCapacityMT > 0
                              ? (selectedStorageDetail.occupiedCapacityMT / selectedStorageDetail.totalCapacityMT) * 100
                              : 0
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {storageDetailTab === "inventory" && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-gray-900">Active Crop Inventory Batches</h4>
                  {selectedStorageDetail.inventory && selectedStorageDetail.inventory.length > 0 ? (
                    <div className="space-y-2">
                      {selectedStorageDetail.inventory.map((item) => (
                        <div key={item.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                          <div>
                            <div className="font-bold text-gray-900 text-xs">{item.cropName} ({item.batchSizeMT} MT)</div>
                            <div className="text-[11px] text-gray-500">Depositor: {item.farmerName} • ID: {item.id}</div>
                          </div>
                          <div className="text-right text-[11px] font-bold text-teal-800">
                            <div>In: {item.entryDate}</div>
                            <div className="text-gray-500 font-normal">Exp: {item.expiryDate}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-center text-gray-500">
                      No inventory batches currently logged for this facility.
                    </div>
                  )}
                </div>
              )}

              {storageDetailTab === "environment" && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-gray-900">Environmental Sensors & Atmosphere</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
                      <span className="text-[10px] text-sky-700 font-bold block">CHAMBER TEMPERATURE</span>
                      <span className="text-2xl font-black text-sky-900">{selectedStorageDetail.temperatureC} °C</span>
                      <p className="text-[11px] text-sky-600 mt-1">Chilled Preservation Range</p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                      <span className="text-[10px] text-indigo-700 font-bold block">CHAMBER HUMIDITY</span>
                      <span className="text-2xl font-black text-indigo-900">{selectedStorageDetail.humidityPct} %</span>
                      <p className="text-[11px] text-indigo-600 mt-1">Controlled Atmospheric Moisture</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedStorageDetail(null)}
                className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-gray-800 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONFIRMATION MODAL DIALOG FOR DESTRUCTIVE ACTIONS */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-stone-200 text-center">
            <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center ${
              confirmDialog.actionType === "danger" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
            }`}>
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-extrabold text-gray-900">{confirmDialog.title}</h3>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">{confirmDialog.message}</p>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="w-1/2 py-3 bg-stone-200 hover:bg-stone-300 text-gray-800 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className={`w-1/2 py-3 text-white font-extrabold rounded-xl text-xs shadow-md cursor-pointer active:scale-95 ${
                  confirmDialog.actionType === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADD / EDIT RECORD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-emerald-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xl font-extrabold text-gray-900">
                Admin {editingItem ? "Edit" : "Add"} {modalType.toUpperCase()} Record
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModalFormSubmit} className="space-y-3.5 text-xs font-semibold">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  {modalType === "farmer" ? "Farmer Full Name" : modalType === "buyer" ? "Buyer / Company Name" : modalType === "price" ? "Commodity / Crop Name" : "Storage Facility Name"}
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={modalType === "price" ? "e.g. Tomato, Onion, Chilli" : "Enter full title"}
                  className="w-full p-3 border border-gray-300 rounded-xl font-bold text-gray-900 outline-none focus:border-emerald-700"
                  required
                />
              </div>

              {modalType === "storage" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Place / Location / Mandi Hub</label>
                      <input
                        type="text"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="e.g. Guntur APMC Market Yard"
                        className="w-full p-2.5 border border-teal-300 bg-teal-50/20 rounded-xl font-bold text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">District</label>
                      <input
                        type="text"
                        value={formDistrict}
                        onChange={(e) => setFormDistrict(e.target.value)}
                        placeholder="e.g. Guntur"
                        className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-teal-950 font-black mb-1">Amount of Space / Total Capacity (MT)</label>
                      <input
                        type="number"
                        value={formCapacity}
                        onChange={(e) => setFormCapacity(e.target.value)}
                        placeholder="e.g. 5000"
                        className="w-full p-2.5 border border-teal-300 bg-teal-50/20 rounded-xl font-bold text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Daily Rental Rate (₹ / Quintal / Day)</label>
                      <input
                        type="number"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="e.g. 8"
                        className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Supported Produce / Crops</label>
                      <input
                        type="text"
                        value={formCrop}
                        onChange={(e) => setFormCrop(e.target.value)}
                        placeholder="e.g. Tomato, Chilli, Fruits"
                        className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Direct Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : modalType === "price" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Regional / Telugu Name</label>
                      <input
                        type="text"
                        value={formCrop}
                        onChange={(e) => setFormCrop(e.target.value)}
                        placeholder="e.g. టమోటా"
                        className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">APMC Mandi Yard</label>
                      <input
                        type="text"
                        value={formDistrict}
                        onChange={(e) => setFormDistrict(e.target.value)}
                        placeholder="e.g. Guntur Market Yard"
                        className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Market Price (₹ / Quintal)</label>
                    <input
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="e.g. 3200"
                      className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">District</label>
                      <input
                        type="text"
                        value={formDistrict}
                        onChange={(e) => setFormDistrict(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Main Crop / Product</label>
                    <input
                      type="text"
                      value={formCrop}
                      onChange={(e) => setFormCrop(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/3 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 bg-[#1B3B18] hover:bg-[#142910] text-white font-extrabold rounded-xl shadow cursor-pointer active:scale-95"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Payment Update Modal */}
      {showAdminPaymentModal && adminPayAgreement && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border border-purple-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-purple-700" />
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    Admin Payment Record / Update
                  </h3>
                  <p className="text-xs text-gray-500">
                    Mandatory 20% Advance Payment Management
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAdminPaymentModal(false);
                  setAdminPayAgreement(null);
                  setAdminPaySuccessMsg("");
                }}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const agrPayments = payments.filter(
                (p) =>
                  (p.agreementId === adminPayAgreement.id ||
                    p.agreementId === adminPayAgreement.id.replace("AGR_", "AGR-") ||
                    adminPayAgreement.id.includes(p.agreementId)) &&
                  p.status === "Success"
              );
              const totalAmount =
                adminPayAgreement.quantityQuintals && adminPayAgreement.agreedPriceQtl
                  ? adminPayAgreement.quantityQuintals * adminPayAgreement.agreedPriceQtl
                  : ((adminPayAgreement as any).totalValue || 285000);
              const amountPaid = agrPayments.reduce((sum, p) => sum + p.amount, 0);
              const calc = calculateAdvancePayment(totalAmount, amountPaid);

              return (
                <div className="space-y-4 text-xs">
                  {/* Advance Calculation Box */}
                  <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-purple-900 bg-purple-200 px-2 py-0.5 rounded font-extrabold">
                          {adminPayAgreement.id}
                        </span>
                        <div className="font-extrabold text-gray-900 text-sm mt-1">
                          {adminPayAgreement.cropName} Direct Contract
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Farmer: <span className="font-bold text-gray-700">{adminPayAgreement.farmerName}</span> | Buyer: <span className="font-bold text-gray-700">{adminPayAgreement.buyerName}</span>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black shadow-2xs ${
                          calc.paymentStatus === "Paid"
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                            : calc.paymentStatus === "Partially Paid"
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-red-100 text-red-900 border border-red-300"
                        }`}
                      >
                        Advance: {calc.paymentStatus}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-gray-600 mb-1">
                        <span>Paid: ₹{calc.amountPaid.toLocaleString()}</span>
                        <span>{calc.advancePercentage}% of 20% Advance</span>
                        <span>Required 20%: ₹{calc.requiredAdvance.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-purple-200/60 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            calc.paymentStatus === "Paid" ? "bg-emerald-600" : "bg-purple-600"
                          }`}
                          style={{ width: `${calc.advancePercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* 5 Required Display Fields */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                      <div className="p-2.5 bg-white rounded-xl border border-purple-100">
                        <span className="text-[10px] text-gray-500 font-bold block">CONTRACT TOTAL</span>
                        <span className="font-black text-gray-900 text-xs">
                          ₹{calc.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-purple-100">
                        <span className="text-[10px] text-purple-700 font-bold block">20% ADVANCE</span>
                        <span className="font-black text-purple-900 text-xs">
                          ₹{calc.requiredAdvance.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-purple-100">
                        <span className="text-[10px] text-emerald-700 font-bold block">AMOUNT PAID</span>
                        <span className="font-black text-emerald-700 text-xs">
                          ₹{calc.amountPaid.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-purple-100">
                        <span className="text-[10px] text-amber-700 font-bold block">REMAINING ADV.</span>
                        <span className="font-black text-amber-800 text-xs">
                          ₹{calc.remainingAdvance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Success Message Banner */}
                  {adminPaySuccessMsg && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 font-bold text-xs flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>{adminPaySuccessMsg}</div>
                    </div>
                  )}

                  {/* Payment Record Form */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const amt = parseFloat(adminPayAmount);
                      if (!amt || amt <= 0) return;
                      const newTxn = await addSharedPayment({
                        agreementId: adminPayAgreement.id,
                        payerName: adminPayAgreement.buyerName,
                        payeeName: adminPayAgreement.farmerName,
                        amount: amt,
                        paymentMethod: adminPayMethod
                      });
                      const freshPayments = getSharedPayments();
                      setPayments(freshPayments);
                      logAuditAction(
                        "Agreement",
                        "Admin Recorded / Updated Contract Payment",
                        adminPayAgreement.id,
                        `Previous Paid: ₹${amountPaid}`,
                        `Recorded ₹${amt} via ${adminPayMethod} (Txn: ${newTxn.txnCode})`
                      );
                      setAdminPaySuccessMsg(
                        `Payment of ₹${amt.toLocaleString()} recorded successfully! Transaction: ${newTxn.txnCode}`
                      );
                      setAdminPayAmount("");
                    }}
                    className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3"
                  >
                    <h4 className="font-black text-gray-900 text-xs uppercase tracking-wider">
                      Record Transaction Details
                    </h4>

                    {/* Quick Preset Buttons */}
                    {calc.remainingAdvance > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setAdminPayAmount(calc.remainingAdvance.toString())}
                          className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 text-[11px] font-extrabold rounded-lg transition cursor-pointer"
                        >
                          Pay Full Advance: ₹{calc.remainingAdvance.toLocaleString()}
                        </button>
                        {calc.remainingAdvance >= 5000 && (
                          <button
                            type="button"
                            onClick={() => setAdminPayAmount("5000")}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold rounded-lg transition cursor-pointer"
                          >
                            ₹5,000
                          </button>
                        )}
                        {calc.remainingAdvance >= 10000 && (
                          <button
                            type="button"
                            onClick={() => setAdminPayAmount("10000")}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold rounded-lg transition cursor-pointer"
                          >
                            ₹10,000
                          </button>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">
                          Payment Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={adminPayAmount}
                          onChange={(e) => setAdminPayAmount(e.target.value)}
                          placeholder={`e.g. ${calc.remainingAdvance || 5000}`}
                          className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">
                          Payment Mode
                        </label>
                        <select
                          value={adminPayMethod}
                          onChange={(e) => setAdminPayMethod(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 text-xs bg-white"
                        >
                          <option value="Direct Bank NEFT">Direct Bank NEFT</option>
                          <option value="RTGS / IMPS">RTGS / IMPS Real-time</option>
                          <option value="UPI Instant Pay">UPI Instant Pay (BHIM / PhonePe / GPay)</option>
                          <option value="Cheque / DD">Bank Demand Draft / Cheque</option>
                          <option value="Escrow Settlement">Sanjeevani Escrow Settlement</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAdminPaymentModal(false);
                          setAdminPayAgreement(null);
                          setAdminPaySuccessMsg("");
                        }}
                        className="w-1/3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-black rounded-xl text-xs shadow cursor-pointer transition active:scale-95"
                      >
                        Confirm & Record Payment
                      </button>
                    </div>
                  </form>

                  {/* Transaction Receipts in Modal */}
                  {agrPayments.length > 0 && (
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Verified Contract Transactions ({agrPayments.length})
                      </span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {agrPayments.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-100 text-[11px]"
                          >
                            <div>
                              <span className="font-mono font-bold text-purple-700">{p.txnCode}</span>
                              <span className="text-gray-400 text-[10px] ml-2">{p.createdAt}</span>
                              <div className="text-gray-500 text-[10px]">{p.paymentMethod}</div>
                            </div>
                            <div className="font-black text-emerald-700 text-xs">
                              ₹{p.amount.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
      {/* ADMIN COLD STORAGE PAYMENT RECORD MODAL */}
      {showAdminStoragePayModal && adminStorageBooking && (() => {
        const calc = calculateColdStorageAdvance(adminStorageBooking.totalAmount, adminStorageBooking.amountPaid);

        return (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-teal-200">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-[10px] font-black text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full uppercase">
                    Admin Master Action
                  </span>
                  <h3 className="text-lg font-extrabold text-gray-900 mt-1">
                    Record Offline / Direct 20% Advance Payment
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowAdminStoragePayModal(false);
                    setAdminStoragePaySuccessMsg("");
                  }}
                  className="text-gray-400 hover:text-gray-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-gray-700">
                  <span>Booking ID:</span>
                  <span className="font-mono text-teal-900 font-extrabold">{adminStorageBooking.bookingCode || adminStorageBooking.id}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-700">
                  <span>Farmer:</span>
                  <span className="text-gray-900">{adminStorageBooking.farmerName} ({adminStorageBooking.farmerId})</span>
                </div>
                <div className="flex justify-between font-bold text-gray-700">
                  <span>Facility:</span>
                  <span className="text-gray-900">{adminStorageBooking.facilityName}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-700">
                  <span>Total Amount:</span>
                  <span className="font-black text-gray-900">₹{calc.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-black text-teal-900">
                  <span>Required 20% Advance:</span>
                  <span>₹{calc.requiredAdvance.toLocaleString()}</span>
                </div>
              </div>

              {adminStoragePaySuccessMsg ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>{adminStoragePaySuccessMsg}</div>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const amt = parseFloat(adminStoragePayAmount) || calc.requiredAdvance;
                    const res = await payStorageAdvance(adminStorageBooking.id, {
                      amount: amt,
                      paymentMethod: adminStoragePayMethod
                    });
                    if (res.success && res.booking) {
                      setStorageBookings(getSharedStorageBookings());
                      setAdminStoragePaySuccessMsg(`Successfully marked 20% Advance as Paid! Ref: ${res.txnId}`);
                      setTimeout(() => {
                        setShowAdminStoragePayModal(false);
                        setAdminStoragePaySuccessMsg("");
                      }, 1200);
                    } else {
                      alert(res.error || "Failed to record payment");
                    }
                  }}
                  className="space-y-3 text-xs"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Amount Paid (₹)</label>
                      <input
                        type="number"
                        value={adminStoragePayAmount}
                        onChange={(e) => setAdminStoragePayAmount(e.target.value)}
                        placeholder={`e.g. ${calc.requiredAdvance}`}
                        className="w-full p-2.5 border border-teal-200 rounded-xl font-black text-teal-950 bg-teal-50/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Payment Method</label>
                      <select
                        value={adminStoragePayMethod}
                        onChange={(e) => setAdminStoragePayMethod(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 bg-white"
                      >
                        <option value="Direct Bank NEFT / RTGS">Direct Bank NEFT / RTGS</option>
                        <option value="UPI Instant Pay">UPI Direct Transfer</option>
                        <option value="Mandi Yard Cash Escrow">Mandi Yard Cash Escrow</option>
                        <option value="AP State Warehouse Challan">Warehouse Bank Challan</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer active:scale-95"
                  >
                    Confirm & Record 20% Advance Payment
                  </button>
                </form>
              )}
            </div>
          </div>
        );
      })()}

      {/* CROP DIAGNOSIS FULL INSPECTION MODAL */}
      {selectedDiagnosisPreview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-4 relative border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Plant Leaf Pathology Diagnostic
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                  🔬 {selectedDiagnosisPreview.crop} — {selectedDiagnosisPreview.condition}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDiagnosisPreview(null)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-black/5 flex items-center justify-center">
                <img
                  src={selectedDiagnosisPreview.image}
                  alt={selectedDiagnosisPreview.crop}
                  className="w-full max-h-72 object-contain"
                />
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <div><strong>Farmer Name:</strong> {selectedDiagnosisPreview.farmerName}</div>
                  <div><strong>Phone:</strong> {selectedDiagnosisPreview.farmerPhone}</div>
                  <div><strong>Location:</strong> {selectedDiagnosisPreview.location}</div>
                  <div><strong>Scan Date:</strong> {selectedDiagnosisPreview.date}</div>
                  <div><strong>AI Confidence:</strong> {(selectedDiagnosisPreview.confidence * 100).toFixed(1)}%</div>
                  <div><strong>Severity Level:</strong> <span className="uppercase font-bold text-red-600">{selectedDiagnosisPreview.severity}</span></div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-700 mb-1">Recommended Treatments:</h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-600 text-[11px]">
                    {selectedDiagnosisPreview.treatment?.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Agronomist Advisory Note:</label>
                  <input
                    type="text"
                    defaultValue={selectedDiagnosisPreview.agronomistNotes || ""}
                    id="agronomist-note-input"
                    placeholder="Enter expert note or prescription for farmer"
                    className="w-full p-2 border border-gray-300 rounded-xl font-medium text-gray-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t flex flex-wrap gap-2 justify-between items-center">
              <div>
                {isAdminAuthenticated && (
                  <button
                    onClick={() => handleDeleteDiagnosis(selectedDiagnosisPreview.id)}
                    className="px-3.5 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Scan</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedDiagnosisPreview(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById("agronomist-note-input") as HTMLInputElement;
                    const note = input?.value || "Verified by District Agronomist";
                    updateDiagnosisStatus(selectedDiagnosisPreview.id, "Agronomist Verified", note);
                    setDiagnoses(getSharedDiagnoses());
                    setSelectedDiagnosisPreview(null);
                  }}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md"
                >
                  Save & Verify Diagnosis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
