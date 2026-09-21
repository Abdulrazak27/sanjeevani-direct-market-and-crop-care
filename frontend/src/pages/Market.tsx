import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { fetchMarketPrices, fetchBuyers, fetchFPOs, fetchColdStorage } from "../services/api";
import { MarketPrice, Buyer, FPO, ColdStorageFacility } from "../types";
import { 
  getSharedMandiPrices, 
  saveSharedMandiPrices,
  getSharedBuyers, 
  getSharedStorage, 
  addSharedBuyer, 
  addSharedAgreement, 
  getSharedAgreements,
  getSharedPayments,
  addSharedPayment,
  calculateAdvancePayment,
  SharedAgreement,
  SharedPayment,
  getSharedStorageBookings,
  saveSharedStorageBookings,
  addSharedStorageBooking,
  payStorageAdvance,
  calculateColdStorageAdvance,
  SharedStorageBooking,
  saveSharedStorage, 
  updateSharedMandiPrice,
  addSharedAuditLog 
} from "../services/sharedStore";
import { triggerPhoneCall } from "../utils/phone";
import { 
  checkCommunicationAllowed, 
  isCategoryAccessible, 
  sanitizeFarmerPayload, 
  ActorRole 
} from "../utils/privacyEngine";
import { 
  TrendingUp, 
  Users, 
  Building, 
  Warehouse, 
  Truck, 
  PlusCircle, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  ShieldCheck, 
  Landmark, 
  Wrench, 
  Award,
  FileText,
  Tag,
  MessageSquare,
  ShoppingBag,
  Plus,
  Edit3,
  Trash2,
  CreditCard
} from "lucide-react";

export const Market: React.FC = () => {
  const { t, farmer, language, marketSubTab, setMarketSubTab } = useApp();
  const subTab = marketSubTab;
  const setSubTab = setMarketSubTab;
  
  // Dynamic Lists State
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [fpos, setFpos] = useState<FPO[]>([]);
  const [facilities, setFacilities] = useState<ColdStorageFacility[]>([]);
  const [transports, setTransports] = useState<Array<any>>([
    { id: "t1", name: "Sri Krishna Agri Logistics", vehicle: "Eicher 14 ft (5 Ton)", location: "Guntur Mandi Hub", rate: "₹18 / km", driver_name: "Raju", phone: "+91 90000 44001" },
    { id: "t2", name: "Kisan Express Transport", vehicle: "Tata Ace Mini Truck (1.5 Ton)", location: "Vijayawada Rural", rate: "₹14 / km", driver_name: "Venkatesh", phone: "+91 90000 44002" }
  ]);
  const [schemes, setSchemes] = useState<Array<any>>([
    { id: "s1", title: "PM Kisan Samman Nidhi", dept: "Ministry of Agriculture", desc: "Financial benefit of ₹6,000 per year in 3 equal installments to small farmers.", phone: "1800115526" },
    { id: "s2", title: "Pradhan Mantri Fasal Bima Yojana", dept: "Crop Insurance", desc: "Comprehensive risk insurance for crop loss due to non-preventable natural risks.", phone: "18001801551" }
  ]);
  const [machineries, setMachineries] = useState<Array<any>>([
    { id: "m1", title: "Mahindra 575 DI Tractor (45 HP)", location: "Tadikonda Center", rate: "₹600 / hour", owner: "Siva Kumar", phone: "+91 90000 55001" },
    { id: "m2", title: "Paddy & Maize Combine Harvester", location: "Guntur Rural", rate: "₹1,800 / hour", owner: "Ramanjaneyulu", phone: "+91 90000 55002" }
  ]);
  const [qualityLabs, setQualityLabs] = useState<Array<any>>([
    { id: "q1", name: "Agmark District Quality Testing Lab", location: "Market Yard Complex, Guntur", tests: "Pesticide Residue, Moisture % & Moisture Grade", phone: "+91 90000 66001" },
    { id: "q2", name: "Regional Soil & Produce Moisture Testing Center", location: "Vijayawada Agri Complex", tests: "NPK Soil Quality, Grain Density & Ripeness", phone: "+91 90000 66002" }
  ]);
  
  // Universal Add Details Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addCategory, setAddCategory] = useState<"prices" | "buyers" | "fpo" | "storage" | "transport" | "schemes" | "machinery" | "quality">("buyers");
  const [addSuccess, setAddSuccess] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [locationStr, setLocationStr] = useState("Guntur Market Yard");
  const [rateStr, setRateStr] = useState("3000");
  const [capacityStr, setCapacityStr] = useState("25");
  const [phoneStr, setPhoneStr] = useState("+91 98765 43210");
  const [extraStr, setExtraStr] = useState("Tomato");

  // Farmer Produce Listing modal & Direct Crop Sale to Assigned Buyer
  const [showListingModal, setShowListingModal] = useState(false);
  const [listingSuccess, setListingSuccess] = useState(false);
  const [showDirectSellModal, setShowDirectSellModal] = useState(false);
  const [selectedAssignedBuyer, setSelectedAssignedBuyer] = useState("AgriProcure South Exporters");
  const [sellCropName, setSellCropName] = useState("Rice / Paddy 🌾");
  const [sellQtyQuintals, setSellQtyQuintals] = useState("50");
  const [sellPriceQuintal, setSellPriceQuintal] = useState("2650");
  const [sellSuccessMsg, setSellSuccessMsg] = useState("");

  // Buyer 20% Advance Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAgreementForPay, setSelectedAgreementForPay] = useState<SharedAgreement | null>(null);
  const [payAmountInput, setPayAmountInput] = useState<string>("");
  const [payMethod, setPayMethod] = useState<string>("UPI Instant Pay");
  const [paySuccessMsg, setPaySuccessMsg] = useState<string>("");
  const [sharedAgreementsList, setSharedAgreementsList] = useState<SharedAgreement[]>(() => getSharedAgreements());
  const [sharedPaymentsList, setSharedPaymentsList] = useState<SharedPayment[]>(() => getSharedPayments());

  // Cold Storage 20% Advance Payment System State
  const [showStoragePayModal, setShowStoragePayModal] = useState(false);
  const [selectedStorageBooking, setSelectedStorageBooking] = useState<SharedStorageBooking | null>(null);
  const [storagePayAmountInput, setStoragePayAmountInput] = useState<string>("");
  const [storagePayMethod, setStoragePayMethod] = useState<string>("UPI Instant Pay");
  const [storagePaySuccessMsg, setStoragePaySuccessMsg] = useState<string>("");
  const [storageBookingsList, setStorageBookingsList] = useState<SharedStorageBooking[]>(() => getSharedStorageBookings());

  // Storage Space Reservation Modal State
  const [showBookStorageModal, setShowBookStorageModal] = useState(false);
  const [targetFacilityForBooking, setTargetFacilityForBooking] = useState<ColdStorageFacility | null>(null);
  const [bookCropName, setBookCropName] = useState("Tomato (Hybrid Grade A)");
  const [bookQuantityMT, setBookQuantityMT] = useState("10");
  const [bookDurationDays, setBookDurationDays] = useState("30");

  const syncFromShared = () => {
    setSharedAgreementsList(getSharedAgreements());
    setSharedPaymentsList(getSharedPayments());
    setStorageBookingsList(getSharedStorageBookings());
    const sharedP = getSharedMandiPrices();
    if (sharedP && sharedP.length > 0) {
      setPrices(sharedP.map(p => ({
        id: p.id,
        crop: p.crop,
        crop_te: p.cropTe,
        crop_hi: p.cropHi,
        mandi: p.mandi,
        price: p.price,
        unit: p.unit || "Quintal",
        change_pct: p.changePct,
        trend: p.trend,
        is_live: true,
        data_source: "Live Mandi Sync",
        updated_at: p.updatedAt
      })));
    }
    const sharedB = getSharedBuyers();
    if (sharedB && sharedB.length > 0) {
      setBuyers(sharedB.map(b => ({
        id: b.id,
        name: b.companyName,
        buyer_type: b.buyerType,
        crop_required: b.interestedCrops?.join(", ") || "Tomato",
        min_quantity_tons: b.minQtyTons,
        price_offered: b.priceOfferedQtl,
        location: `${b.location}, ${b.district}`,
        phone_number: b.phone,
        verified: b.kycStatus === "Verified",
        is_demo: false
      })));
    }
    const sharedS = getSharedStorage();
    if (sharedS && sharedS.length > 0) {
      setFacilities(sharedS.map(s => ({
        id: s.id,
        facility_name: s.facilityName,
        location: `${s.location}, ${s.district}`,
        latitude: 16.3,
        longitude: 80.4,
        distance_km: 6.5,
        capacity_mt: s.totalCapacityMT,
        available_space_mt: s.availableCapacityMT,
        supported_produce: s.supportedCrops,
        rate_per_day_quintal: s.dailyRateQtl,
        contact_phone: s.phone,
        is_demo: false
      })));
    }
  };

  useEffect(() => {
    async function loadData() {
      syncFromShared();
      try {
        const f = await fetchFPOs();
        setFpos(f);
      } catch (e) {}
    }
    loadData();

    const handleUpdate = () => {
      syncFromShared();
    };
    window.addEventListener("sanjeevani_storage_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("sanjeevani_storage_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const openAddForCategory = (cat: "prices" | "buyers" | "fpo" | "storage" | "transport" | "schemes" | "machinery" | "quality") => {
    setAddCategory(cat);
    setTitle("");
    setCategoryType("");
    setLocationStr("Guntur");
    setRateStr("2500");
    setCapacityStr("10");
    setPhoneStr("+91 98765 43210");
    setExtraStr("Tomato");
    setShowAddModal(true);
  };

  const handleUniversalAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `item_${Date.now()}`;

    if (addCategory === "prices") {
      const priceNum = parseFloat(rateStr.replace(/[^0-9.]/g, "")) || 2800;
      const cropName = title || extraStr || "Tomato";
      const newPrice: MarketPrice = {
        id,
        crop: cropName,
        crop_te: extraStr || cropName,
        crop_hi: cropName,
        mandi: locationStr,
        price: priceNum,
        unit: "Quintal",
        change_pct: 2.5,
        trend: "up",
        is_live: true,
        data_source: "User Registered Rate",
        updated_at: "Just now"
      };
      setPrices((prev) => [newPrice, ...prev]);
      const curPrices = getSharedMandiPrices();
      curPrices.unshift({
        id,
        crop: cropName,
        cropTe: extraStr || cropName,
        cropHi: cropName,
        mandi: locationStr,
        price: priceNum,
        unit: "₹/Quintal",
        changePct: 2.5,
        trend: "up",
        updatedAt: "Just now"
      });
      saveSharedMandiPrices(curPrices);

      addSharedAuditLog({
        userName: farmer?.full_name || "Farmer",
        userId: "FARMER_CLIENT",
        userRole: "FARMER",
        module: "Crop",
        action: `Added Live Market Price: ${cropName} (₹${priceNum}/Qtl)`,
        recordId: id,
        prevValue: "None",
        newValue: `Rate: ₹${priceNum} / Quintal at ${locationStr}`,
        status: "Success"
      });
    } else if (addCategory === "buyers") {
      const newBuyer: Buyer = {
        id,
        name: title || "Sanjeevani Direct Buyer",
        buyer_type: categoryType || "Wholesaler & Exporter",
        crop_required: extraStr || "Tomato",
        min_quantity_tons: parseFloat(capacityStr) || 10,
        price_offered: parseFloat(rateStr) || 3000,
        location: locationStr,
        phone_number: phoneStr,
        verified: true,
        is_demo: false
      };
      setBuyers((prev) => [newBuyer, ...prev]);
      addSharedBuyer({
        id,
        companyName: title || "Sanjeevani Direct Buyer",
        repName: extraStr || "Company Rep",
        phone: phoneStr,
        location: locationStr,
        district: locationStr.includes(",") ? locationStr.split(",")[1].trim() : "Guntur",
        buyerType: categoryType || "Wholesaler & Exporter",
        interestedCrops: [extraStr || "Tomato"],
        priceOfferedQtl: parseFloat(rateStr) || 3000,
        minQtyTons: parseFloat(capacityStr) || 10,
        kycStatus: "Verified"
      });
    } else if (addCategory === "fpo") {
      const newFpo: FPO = {
        id,
        name: title || "Kisan Swaraj FPO Ltd",
        location: locationStr,
        supported_crops: [extraStr || "Tomato", "Chilli"],
        member_count: parseInt(capacityStr) || 250,
        contact_phone: phoneStr,
        benefits: ["Direct Seeds", "Bulk Subsidy"],
        verified: true,
        is_demo: false
      };
      setFpos((prev) => [newFpo, ...prev]);
    } else if (addCategory === "storage") {
      const capVal = parseFloat(capacityStr) || 1000;
      const rateVal = parseFloat(rateStr) || 10;
      const newStorage: ColdStorageFacility = {
        id,
        facility_name: title || "Green Cold Storage & Logistics",
        location: locationStr || "Guntur Mandi Hub",
        latitude: 16.3,
        longitude: 80.4,
        distance_km: 4.5,
        capacity_mt: capVal,
        available_space_mt: capVal,
        supported_produce: [extraStr || "Tomato", "Chilli", "Fruits"],
        rate_per_day_quintal: rateVal,
        contact_phone: phoneStr,
        is_demo: false
      };
      setFacilities((prev) => [newStorage, ...prev]);
      const currentStorage = getSharedStorage();
      currentStorage.unshift({
        id: `STO_${Date.now().toString().slice(-4)}`,
        facilityName: title || "Green Cold Storage & Logistics",
        operatorName: extraStr || "Facility Operator",
        phone: phoneStr,
        location: locationStr || "Guntur Mandi Hub",
        district: locationStr.includes(",") ? locationStr.split(",")[1].trim() : "Guntur",
        totalCapacityMT: capVal,
        occupiedCapacityMT: 0,
        availableCapacityMT: capVal,
        dailyRateQtl: rateVal,
        temperatureC: 4.0,
        humidityPct: 85,
        supportedCrops: [extraStr || "Tomato", "Chilli"],
        maintenanceStatus: "Optimal",
        accountStatus: "Active",
        inventory: []
      });
      saveSharedStorage(currentStorage);

      addSharedAuditLog({
        userName: farmer?.full_name || "Cold Storage Operator",
        userId: "OPERATOR_CLIENT",
        userRole: "COLD STORAGE OPERATOR",
        module: "Cold Storage",
        action: `Added Cold Storage: ${title || "Storage Facility"} (${capVal} MT)`,
        recordId: id,
        prevValue: "None",
        newValue: `Place: ${locationStr}, Space: ${capVal} MT, Rate: ₹${rateVal}/Qtl`,
        status: "Success"
      });
    } else if (addCategory === "transport") {
      setTransports((prev) => [
        {
          id,
          name: title || "Agri Cargo Express",
          vehicle: categoryType || "Eicher 14 ft (5 Ton)",
          location: locationStr,
          rate: `₹${rateStr} / km`,
          driver_name: extraStr || "Driver Representative",
          phone: phoneStr
        },
        ...prev
      ]);
    } else if (addCategory === "schemes") {
      setSchemes((prev) => [
        {
          id,
          title: title || "Agri Infrastructure Subsidy",
          dept: categoryType || "State Agri Dept",
          desc: extraStr || "Government subsidy scheme for farmers and cold storage operators.",
          phone: phoneStr
        },
        ...prev
      ]);
    } else if (addCategory === "machinery") {
      setMachineries((prev) => [
        {
          id,
          title: title || "Tractor & Harvester Hire",
          location: locationStr,
          rate: `₹${rateStr} / hour`,
          owner: extraStr || "Machinery Owner",
          phone: phoneStr
        },
        ...prev
      ]);
    } else if (addCategory === "quality") {
      setQualityLabs((prev) => [
        {
          id,
          name: title || "Certified Produce Quality Lab",
          location: locationStr,
          tests: extraStr || "NPK Soil Testing, Moisture % & Pesticide Residue Analysis",
          phone: phoneStr
        },
        ...prev
      ]);
    }

    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setShowAddModal(false);
      setSubTab(addCategory);
    }, 1500);
  };

  const getLocalizedCrop = (item: MarketPrice) => {
    if (language === "te") return item.crop_te || item.crop;
    if (language === "hi") return item.crop_hi || item.crop;
    return item.crop;
  };

  const renderContactButtons = (phone: string, targetName: string) => {
    const rawDigits = phone.replace(/[^\d]/g, '');
    const waNumber = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;

    return (
      <div className="grid grid-cols-2 gap-2 w-full pt-1">
        <a
          href={`tel:${phone.replace(/[^\d+]/g, '')}`}
          onClick={(e) => {
            e.preventDefault();
            triggerPhoneCall(phone);
          }}
          className="py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-xs transition cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-white" />
          <span>Call</span>
        </a>

        <a
          href={`https://wa.me/${waNumber}?text=Hello%20${encodeURIComponent(targetName)}%2C%20I%20found%20your%20details%20on%20SANJEEVANI%20Agri%20Platform.`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-xs transition cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-white" />
          <span>WhatsApp</span>
        </a>
      </div>
    );
  };

  const subTabsConfig = [
    { 
      id: "prices", 
      label: language === "te" ? "మార్కెట్ ధరలు" : language === "hi" ? "मंडी भाव" : t("market_prices"), 
      icon: TrendingUp 
    },
    { 
      id: "buyers", 
      label: language === "te" ? "కొనుగోలుదారులు" : language === "hi" ? "खरीददार खोजें" : t("find_buyers"), 
      icon: Users 
    },
    { 
      id: "fpo", 
      label: language === "te" ? "FPO నెట్‌వర్క్" : language === "hi" ? "FPO नेटवर्क" : t("fpo"), 
      icon: Building 
    },
    { 
      id: "storage", 
      label: language === "te" ? "కోల్డ్ స్టోరేజ్" : language === "hi" ? "కోల్డ్ స్టోరేజ్" : t("cold_storage"), 
      icon: Warehouse 
    },
    { 
      id: "transport", 
      label: language === "te" ? "రవాణా & లాజిస్టిక్స్" : language === "hi" ? "परिवहन और रसद" : "Transport & Logistics", 
      icon: Truck 
    },
    { 
      id: "schemes", 
      label: language === "te" ? "ప్రభుత్వ పథకాలు & రాయితీలు" : language === "hi" ? "सरकारी योजनाएं" : "Govt Schemes & Subsidies", 
      icon: Landmark 
    },
    { 
      id: "machinery", 
      label: language === "te" ? "వ్యవసాయ యంత్రాల అద్దె" : language === "hi" ? "कृषि उपकरण किराया" : "Farm Machinery Hire", 
      icon: Wrench 
    },
    { 
      id: "quality", 
      label: language === "te" ? "నాణ్యతా పరీక్షలు & గ్రేడింగ్" : language === "hi" ? "गुणवत्ता परीक्षण" : "Quality Testing & Grade", 
      icon: Award 
    }
  ];

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto">
      {/* Top Banner - Full Width */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 p-6 rounded-3xl text-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-amber-300 font-bold text-[10px] uppercase tracking-wider bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
            Marketplace & Open Direct Add
          </span>
          <h2 className="text-2xl font-extrabold flex items-center space-x-2.5 mt-1.5">
            <TrendingUp className="w-6 h-6 text-amber-300" />
            <span>SANJEEVANI Market & Directory</span>
          </h2>
          <p className="text-xs text-emerald-100 mt-1">Direct Mandi Rates, Buyer Registration, Cold Storage, FPO & Logistics Directory.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setShowDirectSellModal(true);
              setSellSuccessMsg("");
            }}
            className="px-4 py-3 bg-[#1E5128] hover:bg-[#16421F] text-amber-300 border border-amber-400/50 rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md transition cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>🌾 Sell Crop to Assigned Buyer</span>
          </button>

          <button
            onClick={() => {
              const currentBookings = getSharedStorageBookings();
              setStorageBookingsList(currentBookings);
              const target = currentBookings.find(b => b.paymentStatus === "Advance Payment Pending") || currentBookings[0];
              if (target) {
                setSelectedStorageBooking(target);
                const calc = calculateColdStorageAdvance(target.totalAmount, target.amountPaid);
                setStoragePayAmountInput(calc.requiredAdvance.toString());
              }
              setStoragePaySuccessMsg("");
              setShowStoragePayModal(true);
            }}
            className="px-4 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md transition cursor-pointer active:scale-95"
            title="Cold Storage 20% Mandatory Advance Payment"
          >
            <CreditCard className="w-4 h-4 text-teal-200" />
            <span>💳 20% Advance Payment</span>
          </button>

          <button
            onClick={() => openAddForCategory(subTab)}
            className="px-4 py-3 bg-amber-400 hover:bg-amber-300 text-gray-900 rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md transition cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-gray-900 stroke-[3]" />
            <span>+ Add Details (for {subTabsConfig.find(s=>s.id===subTab)?.label})</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs Bar with + Add Button */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 gap-2 overflow-x-auto no-scrollbar">
        <div className="flex space-x-2 overflow-x-auto text-xs no-scrollbar">
          {subTabsConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap ${
                  isActive 
                    ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20" 
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => openAddForCategory(subTab)}
          className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shrink-0 shadow-sm cursor-pointer"
          title="Add entry to this category"
        >
        </button>
      </div>

      {/* PRIVACY ENFORCEMENT FIREWALL BANNER */}
      {((farmer.user_role === "buyer" && subTab === "storage") ||
        (farmer.user_role === "storage" && subTab === "buyers")) && (
        <div className="p-5 bg-red-50 border-2 border-red-300 rounded-3xl text-red-950 space-y-2 shadow-md">
          <div className="flex items-center space-x-2.5 font-extrabold text-sm text-red-900">
            <ShieldCheck className="w-6 h-6 text-red-700 shrink-0" />
            <span>🔒 SYSTEM PRIVACY FIREWALL BLOCK ACTIVE</span>
          </div>
          <p className="text-xs text-red-800 font-medium">
            {farmer.user_role === "buyer"
              ? "Buyers are strictly isolated from Cold Storage Facilities. Communication & access channels between Buyers and Cold Storage are dropped per System Security Matrix."
              : "Cold Storage Providers are strictly isolated from Buyer Procurement lists. Communication & access channels between Cold Storage and Buyers are dropped per System Security Matrix."}
          </p>
        </div>
      )}

      {/* SubTab 1: Mandi Prices */}
      {subTab === "prices" && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs flex items-center justify-between">
            <span className="font-extrabold text-emerald-950 uppercase tracking-wider">
              {language === "te" ? "లైవ్ మార్కెట్ ధరలు" : language === "hi" ? "लाइव मंडी भाव" : "Live Mandi Rates"}
            </span>
            <button
              onClick={() => openAddForCategory("prices")}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300 stroke-[3]" />
              <span>+ Add Market Price</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prices.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition space-y-3 relative group">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-extrabold text-gray-900">{getLocalizedCrop(item)}</h4>
                    <p className="text-xs font-semibold text-emerald-700 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.mandi}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-1 mb-1">
                      <button
                        onClick={() => openAddForCategory("prices")}
                        className="p-1 rounded-lg bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-800 transition"
                        title="Edit Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPrices(prices.filter(p => p.id !== item.id))}
                        className="p-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xl font-extrabold text-emerald-800 block">₹{item.price.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-500 font-medium">per {item.unit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                  <span className="text-[11px] text-gray-500 font-medium">Source: {item.data_source}</span>
                  <span className={`font-extrabold px-2.5 py-0.5 rounded-full ${
                    item.trend === "up" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                  }`}>
                    {item.trend === "up" ? "▲ +" : "▼ "}{item.change_pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 2: Direct Buyers */}
      {subTab === "buyers" && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-amber-950 text-sm">
                {language === "te" ? "నేరుగా కొనుగోలుదారులు" : language === "hi" ? "प्रत्यक्ष खरीददार" : "Verified Direct Procurement Buyers"}
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">Connect directly with buyers via Call & WhatsApp, or add your buying requirements.</p>
            </div>

            <button
              onClick={() => openAddForCategory("buyers")}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition shrink-0 flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300 stroke-[3]" />
              <span>+ Add Buyer Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {buyers.map((buyer) => (
              <div key={buyer.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between relative group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider border border-emerald-200">
                      {buyer.buyer_type}
                    </span>

                    <div className="flex items-center space-x-2">
                      <span className="text-base font-extrabold text-emerald-800">
                        ₹{buyer.price_offered.toLocaleString()}/qtl
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => openAddForCategory("buyers")}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-800 transition"
                          title="Edit Buyer Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setBuyers(buyers.filter(b => b.id !== buyer.id))}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                          title="Delete Buyer Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-base font-extrabold text-gray-900 mb-1">{buyer.name}</h4>
                  <p className="text-xs text-gray-500 flex items-center space-x-1 font-medium mb-3">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{buyer.location}</span>
                  </p>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1">
                    <div className="flex justify-between text-gray-600">
                      <span>Required Crop:</span>
                      <span className="font-bold text-gray-900">{buyer.crop_required}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Min Order Quantity:</span>
                      <span className="font-bold text-gray-900">{buyer.min_quantity_tons} Tons</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  {renderContactButtons(buyer.phone_number, buyer.name)}
                  <button
                    onClick={() => {
                      const agrs = getSharedAgreements();
                      const matchingAgr = agrs.find(a => 
                        a.buyerName.toLowerCase().includes(buyer.name.toLowerCase()) || 
                        buyer.name.toLowerCase().includes(a.buyerName.toLowerCase())
                      ) || agrs[0];
                      setSelectedAgreementForPay(matchingAgr || null);
                      setPaySuccessMsg("");
                      setPayAmountInput("");
                      setShowPaymentModal(true);
                    }}
                    className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-purple-700" />
                    <span>Pay 20% Contract Advance</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 3: FPO Network */}
      {subTab === "fpo" && (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs flex items-center justify-between">
            <span className="font-extrabold text-indigo-950 text-sm">Farmer Producer Organizations (FPOs)</span>
            <button
              onClick={() => openAddForCategory("fpo")}
              className="px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300 stroke-[3]" />
              <span>+ Add FPO Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {fpos.map((fpo) => (
              <div key={fpo.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md uppercase border border-indigo-200">
                      Registered FPO
                    </span>
                    <span className="text-xs font-bold text-gray-600">{fpo.member_count} Members</span>
                  </div>

                  <h4 className="text-base font-extrabold text-gray-900 mb-1">{fpo.name}</h4>
                  <p className="text-xs text-gray-500 flex items-center space-x-1 font-medium mb-3">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{fpo.location}</span>
                  </p>

                  <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block">Crops Supported</span>
                    <div className="flex flex-wrap gap-1">
                      {fpo.supported_crops.map((c, idx) => (
                        <span key={idx} className="bg-white px-2 py-0.5 rounded text-[11px] font-bold text-gray-800 border border-indigo-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {renderContactButtons(fpo.contact_phone, fpo.name)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 4: Cold Storage Facilities */}
      {subTab === "storage" && (
        <div className="space-y-4">
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-teal-950 text-sm">Cold Storage Facilities & Preservation Hubs</h4>
              <p className="text-xs text-teal-800 mt-0.5">Cold storage operators can add their available space & daily rates here.</p>
            </div>
            <button
              onClick={() => openAddForCategory("storage")}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300 stroke-[3]" />
              <span>+ Add Cold Storage Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.map((fac) => {
              const matchedBooking = storageBookingsList.find(
                b => b.facilityId === fac.id || b.facilityName === fac.facility_name
              );
              const bookingCalc = matchedBooking
                ? calculateColdStorageAdvance(matchedBooking.totalAmount, matchedBooking.amountPaid)
                : null;

              return (
                <div key={fac.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md uppercase border border-teal-200">
                        Cold Facility ({fac.distance_km} km away)
                      </span>
                      <span className="text-xs font-bold text-teal-700">₹{fac.rate_per_day_quintal}/day/qtl</span>
                    </div>

                    <h4 className="text-base font-extrabold text-gray-900 mb-1">{fac.facility_name}</h4>
                    <p className="text-xs text-gray-500 flex items-center space-x-1 font-medium mb-3">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      <span>{fac.location}</span>
                    </p>

                    <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-100 text-xs space-y-1 mb-3">
                      <div className="flex justify-between text-gray-700">
                        <span>Total Capacity:</span>
                        <span className="font-bold text-gray-900">{fac.capacity_mt} MT</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Available Free Space:</span>
                        <span className="font-extrabold text-teal-700">{fac.available_space_mt} MT</span>
                      </div>
                    </div>

                    {/* Cold Storage Booking & Mandatory 20% Advance Status */}
                    {matchedBooking && bookingCalc ? (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] bg-teal-100 text-teal-900 px-2 py-0.5 rounded font-bold">
                            {matchedBooking.bookingCode}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            matchedBooking.paymentStatus === "20% Advance Paid"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}>
                            {matchedBooking.paymentStatus === "20% Advance Paid" ? "✓ 20% Advance Paid" : "⚠️ Advance Pending"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 text-center py-1 bg-white rounded-lg border border-gray-100">
                          <div>
                            <span className="text-[9px] text-gray-500 font-bold block">TOTAL COST</span>
                            <span className="font-black text-gray-900 text-xs">₹{bookingCalc.totalAmount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-teal-700 font-bold block">20% ADVANCE</span>
                            <span className="font-black text-teal-800 text-xs">₹{bookingCalc.requiredAdvance.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 font-bold block">REMAINING</span>
                            <span className="font-black text-gray-800 text-xs">₹{bookingCalc.remainingAmount.toLocaleString()}</span>
                          </div>
                        </div>

                        {matchedBooking.paymentStatus === "20% Advance Paid" ? (
                          <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-800 font-bold flex items-center justify-between">
                            <span>✓ Advance Paid: ₹{bookingCalc.amountPaid.toLocaleString()}</span>
                            <span className="font-mono text-[10px] text-emerald-900">{matchedBooking.txnId}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedStorageBooking(matchedBooking);
                              setStoragePayAmountInput(bookingCalc.requiredAdvance.toString());
                              setStoragePaySuccessMsg("");
                              setShowStoragePayModal(true);
                            }}
                            className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-extrabold text-xs shadow-xs transition flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-teal-200" />
                            <span>💳 Pay 20% Advance (₹{bookingCalc.requiredAdvance.toLocaleString()})</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs mb-3 space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-amber-900">
                          <span>Standard Storage (10 MT / 30 Days)</span>
                          <span>Est: ₹10,000</span>
                        </div>
                        <button
                          onClick={() => {
                            setTargetFacilityForBooking(fac);
                            setBookCropName(farmer.main_crop || "Tomato");
                            setBookQuantityMT("10");
                            setBookDurationDays("30");
                            setShowBookStorageModal(true);
                          }}
                          className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs transition flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Warehouse className="w-3.5 h-3.5 text-teal-200" />
                          <span>📦 Reserve Space & Pay 20% Advance</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {renderContactButtons(fac.contact_phone, fac.facility_name)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SubTab 5: Transport & Logistics */}
      {subTab === "transport" && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs flex items-center justify-between">
            <span className="font-extrabold text-blue-950 text-sm">Agritech Transport & Logistics Directory</span>
            <button
              onClick={() => openAddForCategory("transport")}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300 stroke-[3]" />
              <span>+ Add Transport / Vehicle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {transports.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md uppercase border border-blue-200">
                      {t.vehicle}
                    </span>
                    <span className="text-xs font-bold text-blue-700">{t.rate}</span>
                  </div>

                  <h4 className="text-base font-extrabold text-gray-900 mb-1">{t.name}</h4>
                  <p className="text-xs text-gray-500 flex items-center space-x-1 font-medium mb-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t.location}</span>
                  </p>
                  <p className="text-xs text-gray-600 font-semibold">Driver: {t.driver_name}</p>
                </div>

                {renderContactButtons(t.phone, t.name)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 6: Govt Schemes & Subsidies */}
      {subTab === "schemes" && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs flex items-center justify-between">
            <span className="font-extrabold text-emerald-950 text-sm">Government Subsidy Schemes & Nodal Lines</span>
            <button
              onClick={() => openAddForCategory("schemes")}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300 stroke-[3]" />
              <span>+ Add Govt Scheme Info</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {schemes.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md uppercase border border-emerald-200">
                    {s.dept}
                  </span>
                  <h4 className="text-base font-extrabold text-gray-900 mt-2">{s.title}</h4>
                  <p className="text-xs text-gray-600 font-medium mt-1 leading-relaxed">{s.desc}</p>
                </div>

                {renderContactButtons(s.phone, s.title)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 7: Farm Machinery Hire */}
      {subTab === "machinery" && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs flex items-center justify-between">
            <span className="font-extrabold text-amber-950 text-sm">Farm Machinery & Equipment Rental</span>
            <button
              onClick={() => openAddForCategory("machinery")}
              className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300 stroke-[3]" />
              <span>+ Add Machinery for Rental</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {machineries.map((m) => (
              <div key={m.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md uppercase border border-amber-200">
                      Farm Rental
                    </span>
                    <span className="text-xs font-bold text-amber-700">{m.rate}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-gray-900 mb-1">{m.title}</h4>
                  <p className="text-xs text-gray-500 font-medium mb-1">{m.location}</p>
                  <p className="text-xs text-gray-600 font-semibold">Owner: {m.owner}</p>
                </div>

                {renderContactButtons(m.phone, m.title)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 8: Quality Testing & Grading */}
      {subTab === "quality" && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs flex items-center justify-between">
            <span className="font-extrabold text-purple-950 text-sm">Certified Soil & Produce Quality Testing Labs</span>
            <button
              onClick={() => openAddForCategory("quality")}
              className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300 stroke-[3]" />
              <span>+ Add Quality Testing Center</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {qualityLabs.map((q) => (
              <div key={q.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md uppercase border border-purple-200">
                    Certified Lab Center
                  </span>
                  <h4 className="text-base font-extrabold text-gray-900 mt-2">{q.name}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{q.location}</p>
                  <p className="text-xs text-gray-700 font-semibold mt-2">Services: {q.tests}</p>
                </div>

                {renderContactButtons(q.phone, q.name)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Universal Multi-Category Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">
                  + Add Listing / Service Details
                </h3>
                <p className="text-xs text-gray-500">Add your entry directly to SANJEEVANI Agri Network.</p>
              </div>
              <PlusCircle className="w-7 h-7 text-emerald-700" />
            </div>

            {/* Category Selector Tabs in Modal */}
            <div className="grid grid-cols-4 gap-1 bg-gray-100 p-1.5 rounded-xl text-[10px] font-bold text-center">
              <button
                type="button"
                onClick={() => setAddCategory("buyers")}
                className={`py-1.5 rounded-lg transition ${addCategory === "buyers" ? "bg-emerald-700 text-white" : "text-gray-700 hover:bg-gray-200"}`}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => setAddCategory("storage")}
                className={`py-1.5 rounded-lg transition ${addCategory === "storage" ? "bg-emerald-700 text-white" : "text-gray-700 hover:bg-gray-200"}`}
              >
                Cold Storage
              </button>
              <button
                type="button"
                onClick={() => setAddCategory("transport")}
                className={`py-1.5 rounded-lg transition ${addCategory === "transport" ? "bg-emerald-700 text-white" : "text-gray-700 hover:bg-gray-200"}`}
              >
                Transport
              </button>
              <button
                type="button"
                onClick={() => setAddCategory("machinery")}
                className={`py-1.5 rounded-lg transition ${addCategory === "machinery" ? "bg-emerald-700 text-white" : "text-gray-700 hover:bg-gray-200"}`}
              >
                Machinery
              </button>
            </div>

            {addSuccess ? (
              <div className="bg-emerald-50 p-6 rounded-2xl text-center space-y-2 border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-emerald-900">Details Added Successfully!</h4>
                <p className="text-xs text-emerald-700">Your entry is now published live on SANJEEVANI.</p>
              </div>
            ) : (
              <form onSubmit={handleUniversalAdd} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {addCategory === "buyers" ? "Company / Buyer Name" : addCategory === "storage" ? "Cold Storage Facility Name" : addCategory === "transport" ? "Agri Logistics / Transport Name" : addCategory === "machinery" ? "Equipment Title" : addCategory === "quality" ? "Quality Lab Name" : "Title / Entity Name"}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter name / title"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-900"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Category / Type</label>
                    <input
                      type="text"
                      value={categoryType}
                      onChange={(e) => setCategoryType(e.target.value)}
                      placeholder="e.g. Wholesaler / 5-Ton Truck"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Location / Mandi Hub</label>
                    <input
                      type="text"
                      value={locationStr}
                      onChange={(e) => setLocationStr(e.target.value)}
                      placeholder="e.g. Guntur Market Yard"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Rate / Price Offered</label>
                    <input
                      type="text"
                      value={rateStr}
                      onChange={(e) => setRateStr(e.target.value)}
                      placeholder="e.g. ₹3,000/qtl or ₹18/km"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Capacity / Min Quantity</label>
                    <input
                      type="text"
                      value={capacityStr}
                      onChange={(e) => setCapacityStr(e.target.value)}
                      placeholder="e.g. 20 Tons or 1500 MT"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Crop / Details / Services Provided</label>
                  <input
                    type="text"
                    value={extraStr}
                    onChange={(e) => setExtraStr(e.target.value)}
                    placeholder="e.g. Tomato, Chilli, NPK Soil Testing"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Direct Phone / WhatsApp Number</label>
                  <input
                    type="text"
                    value={phoneStr}
                    onChange={(e) => setPhoneStr(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-900"
                    required
                  />
                </div>

                <div className="flex space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-md"
                  >
                    Publish Entry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* DIRECT CROP SALE TO ASSIGNED BUYER MODAL */}
      {showDirectSellModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 relative border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Direct Farmer Procurement
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-1">🌾 Sell Crop to Assigned Buyer</h3>
              </div>
              <button 
                onClick={() => setShowDirectSellModal(false)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {sellSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-900 space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <span className="font-extrabold text-sm">{sellSuccessMsg}</span>
                </div>
                <p className="text-xs text-emerald-700 font-medium">
                  Your sale order has been registered and dispatched directly to your assigned buyer.
                </p>
                <div className="pt-2 flex space-x-2">
                  <a
                    href={`https://wa.me/918977520059?text=Hello%20Assigned%20Buyer%2C%20I%20am%20a%20Farmer%20wanting%20to%20sell%20${encodeURIComponent(sellQtyQuintals)}%20Quintals%20of%20${encodeURIComponent(sellCropName)}%20at%20%E2%82%B9${encodeURIComponent(sellPriceQuintal)}%2FQuintal.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow transition cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Contact Buyer WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setShowDirectSellModal(false)}
                    className="px-4 py-3 bg-gray-200 text-gray-800 font-bold text-xs rounded-xl hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const qtl = parseFloat(sellQtyQuintals) || 50;
                  const prc = parseFloat(sellPriceQuintal) || 2650;
                  addSharedAgreement({
                    farmerName: farmer.full_name || "Ramesh Kumar",
                    buyerName: selectedAssignedBuyer,
                    cropName: sellCropName,
                    quantityQtl: qtl,
                    agreedPriceQtl: prc,
                    totalValue: qtl * prc,
                    startDate: new Date().toISOString().slice(0, 10),
                    endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
                    status: "Active",
                    coldStorageAssigned: "Direct Mandi Delivery"
                  });
                  setSellSuccessMsg(`Successfully created crop sale order for ${sellQtyQuintals} Quintals of ${sellCropName} to ${selectedAssignedBuyer}!`);
                }}
                className="space-y-4 text-xs font-semibold"
              >
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Select Crop to Sell</label>
                  <select
                    value={sellCropName}
                    onChange={(e) => setSellCropName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
                  >
                    <option value="Rice / Paddy 🌾">Rice / Paddy 🌾</option>
                    <option value="Chilli 🌶️">Chilli 🌶️</option>
                    <option value="Tomato 🍅">Tomato 🍅</option>
                    <option value="Cotton ☁️">Cotton ☁️</option>
                    <option value="Maize 🌽">Maize 🌽</option>
                    <option value="Groundnut 🥜">Groundnut 🥜</option>
                    <option value="Pulses 🫘">Pulses 🫘</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Harvested Quantity (Quintals)</label>
                    <input
                      type="number"
                      value={sellQtyQuintals}
                      onChange={(e) => setSellQtyQuintals(e.target.value)}
                      placeholder="50"
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Target Price (₹ / Quintal)</label>
                    <input
                      type="number"
                      value={sellPriceQuintal}
                      onChange={(e) => setSellPriceQuintal(e.target.value)}
                      placeholder="2650"
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Select Assigned Buyer</label>
                  <select
                    value={selectedAssignedBuyer}
                    onChange={(e) => setSelectedAssignedBuyer(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
                  >
                    <option value="AgriProcure South Exporters">AgriProcure South Exporters (Rating 4.9 ★ - Fast Mandi Settlement)</option>
                    <option value="Venkata Rice & Grain Mills">Venkata Rice & Grain Mills (Rating 4.8 ★ - Instant Cash Payment)</option>
                    <option value="Apex Food Processing Co.">Apex Food Processing Co. (Rating 4.7 ★ - Direct Factory Bulk Buyer)</option>
                    <option value="Guntur Mandi Wholesale Traders">Guntur Mandi Wholesale Traders (Rating 4.9 ★ - High Volume Procurement)</option>
                  </select>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                  <span className="font-bold">Direct Sale Guarantee:</span> Your produce request will be dispatched directly to the selected verified buyer with immediate contact links.
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDirectSellModal(false)}
                    className="w-1/3 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 bg-[#1E5128] hover:bg-[#16421F] text-amber-300 font-extrabold rounded-xl shadow flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>Direct Sell to Buyer</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Universal Buyer 20% Advance Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-purple-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Mandatory 20% Advance Payment Rule
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                  💳 Contract Advance Payment
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaySuccessMsg("");
                }}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Select Contract Dropdown */}
            <div>
              <label className="block text-gray-700 font-bold mb-1 text-xs">
                Select Procurement Contract / Order:
              </label>
              <select
                value={selectedAgreementForPay?.id || ""}
                onChange={(e) => {
                  const found = sharedAgreementsList.find((a) => a.id === e.target.value);
                  setSelectedAgreementForPay(found || null);
                  setPaySuccessMsg("");
                  setPayAmountInput("");
                }}
                className="w-full p-3 border border-purple-200 rounded-xl text-xs font-bold text-gray-900 bg-purple-50/20"
              >
                {sharedAgreementsList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id} • {a.cropName} ({a.quantityQtl} Qtl) — Buyer: {a.buyerName}
                  </option>
                ))}
              </select>
            </div>

            {selectedAgreementForPay && (() => {
              const agrPayments = sharedPaymentsList.filter(
                (p) =>
                  (p.agreementId === selectedAgreementForPay.id ||
                    p.agreementId === selectedAgreementForPay.id.replace("AGR_", "AGR-") ||
                    selectedAgreementForPay.id.includes(p.agreementId)) &&
                  p.status === "Success"
              );
              const totalPaid = agrPayments.reduce((sum, p) => sum + p.amount, 0);
              const calc = calculateAdvancePayment(selectedAgreementForPay.totalValue, totalPaid);

              return (
                <div className="space-y-4 text-xs">
                  {/* Advance Rule Calculation Summary Box */}
                  <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-purple-900 bg-purple-200 px-2 py-0.5 rounded font-extrabold">
                          {selectedAgreementForPay.agreementCode || selectedAgreementForPay.id}
                        </span>
                        <div className="font-extrabold text-gray-900 text-sm mt-1">
                          {selectedAgreementForPay.cropName}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Farmer: {selectedAgreementForPay.farmerName} ➔ Buyer: {selectedAgreementForPay.buyerName}
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
                        {calc.paymentStatus === "Paid"
                          ? "✓ 20% Advance Paid"
                          : calc.paymentStatus === "Partially Paid"
                          ? "⏳ Partially Paid"
                          : "⚠️ Advance Pending"}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-gray-600 mb-1">
                        <span>Advance Paid: ₹{calc.amountPaid.toLocaleString()}</span>
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
                  {paySuccessMsg && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 font-bold text-xs flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>{paySuccessMsg}</div>
                    </div>
                  )}

                  {/* Payment Form (if not yet fully paid or making additional payment) */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const amt = parseFloat(payAmountInput);
                      if (!amt || amt <= 0) return;
                      const newTxn = await addSharedPayment({
                        agreementId: selectedAgreementForPay.id,
                        payerName: selectedAgreementForPay.buyerName,
                        payeeName: selectedAgreementForPay.farmerName,
                        amount: amt,
                        paymentMethod: payMethod
                      });
                      setSharedPaymentsList(getSharedPayments());
                      setPaySuccessMsg(
                        `Payment of ₹${amt.toLocaleString()} recorded successfully! (Receipt: ${newTxn.txnCode})`
                      );
                      setPayAmountInput("");
                    }}
                    className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3"
                  >
                    <h4 className="font-black text-gray-900 text-xs uppercase tracking-wider">
                      Make / Record Buyer Advance Payment
                    </h4>

                    {/* Quick Preset Buttons */}
                    {calc.remainingAdvance > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPayAmountInput(calc.remainingAdvance.toString())}
                          className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 text-[11px] font-extrabold rounded-lg transition"
                        >
                          Pay Full Advance: ₹{calc.remainingAdvance.toLocaleString()}
                        </button>
                        {calc.remainingAdvance >= 5000 && (
                          <button
                            type="button"
                            onClick={() => setPayAmountInput("5000")}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold rounded-lg transition"
                          >
                            Pay ₹5,000
                          </button>
                        )}
                        {calc.remainingAdvance >= 10000 && (
                          <button
                            type="button"
                            onClick={() => setPayAmountInput("10000")}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold rounded-lg transition"
                          >
                            Pay ₹10,000
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
                          value={payAmountInput}
                          onChange={(e) => setPayAmountInput(e.target.value)}
                          placeholder={`e.g. ${calc.remainingAdvance || 5000}`}
                          className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">
                          Payment Method
                        </label>
                        <select
                          value={payMethod}
                          onChange={(e) => setPayMethod(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 text-xs bg-white"
                        >
                          <option value="UPI Instant Pay">UPI Instant Pay (BHIM / PhonePe / GPay)</option>
                          <option value="NEFT Direct Bank">NEFT Bank Transfer</option>
                          <option value="RTGS Bank Transfer">RTGS Corporate Transfer</option>
                          <option value="Escrow Mandi Direct">Agri Mandi Escrow</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer active:scale-95 flex items-center justify-center space-x-1.5"
                    >
                      <CreditCard className="w-4 h-4 text-purple-200" />
                      <span>Confirm & Record Advance Payment</span>
                    </button>
                  </form>

                  {/* Past Transactions for this Contract */}
                  {agrPayments.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h5 className="font-extrabold text-gray-800 text-[11px] uppercase tracking-wider">
                        Payment Receipts for this Contract ({agrPayments.length})
                      </h5>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {agrPayments.map((p) => (
                          <div
                            key={p.id}
                            className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center text-[11px]"
                          >
                            <div>
                              <span className="font-mono font-bold text-purple-900">{p.txnCode}</span>
                              <span className="text-gray-500 ml-2">via {p.paymentMethod}</span>
                              <div className="text-[10px] text-gray-400">{p.createdAt}</div>
                            </div>
                            <span className="font-black text-emerald-800 text-xs">
                              +₹{p.amount.toLocaleString()}
                            </span>
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
      {/* ======================================================== */}
      {/* COLD STORAGE 20% ADVANCE PAYMENT MODAL                   */}
      {/* ======================================================== */}
      {showStoragePayModal && selectedStorageBooking && (() => {
        const currentBooking = storageBookingsList.find(b => b.id === selectedStorageBooking.id) || selectedStorageBooking;
        const calc = calculateColdStorageAdvance(currentBooking.totalAmount, currentBooking.amountPaid);
        const isPaid = currentBooking.paymentStatus === "20% Advance Paid";

        return (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-teal-100 max-h-[92vh] overflow-y-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-black text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Mandatory 20% Cold Storage Advance Payment
                  </span>
                  <h3 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center space-x-2">
                    <span>❄️ Cold Storage Advance Payment</span>
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowStoragePayModal(false);
                    setStoragePaySuccessMsg("");
                  }}
                  className="text-gray-400 hover:text-gray-700 text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Booking Selector Dropdown if multiple exist */}
              {storageBookingsList.length > 1 && (
                <div>
                  <label className="block text-gray-700 font-bold mb-1 text-xs">
                    Select Cold Storage Booking Order:
                  </label>
                  <select
                    value={currentBooking.id}
                    onChange={(e) => {
                      const found = storageBookingsList.find(b => b.id === e.target.value);
                      if (found) {
                        setSelectedStorageBooking(found);
                        const c = calculateColdStorageAdvance(found.totalAmount, found.amountPaid);
                        setStoragePayAmountInput(c.requiredAdvance.toString());
                        setStoragePaySuccessMsg("");
                      }
                    }}
                    className="w-full p-2.5 border border-teal-200 rounded-xl text-xs font-bold text-gray-900 bg-teal-50/30"
                  >
                    {storageBookingsList.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.bookingCode || b.id} • {b.facilityName} ({b.cropName} - {b.quantityMT} MT) — {b.paymentStatus}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Booking Details Card */}
              <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-black text-teal-900 bg-teal-200/80 px-2 py-0.5 rounded">
                      {currentBooking.bookingCode || currentBooking.id}
                    </span>
                    <h4 className="text-base font-extrabold text-gray-900 mt-1">
                      {currentBooking.facilityName}
                    </h4>
                    <p className="text-xs text-gray-600 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      <span>{currentBooking.location || "Guntur Hub"}</span>
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black shadow-2xs ${
                      isPaid
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-amber-100 text-amber-900 border border-amber-300"
                    }`}
                  >
                    {isPaid ? "✓ 20% Advance Paid" : "⚠️ Advance Payment Pending"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white/80 p-3 rounded-xl border border-teal-100">
                  <div>
                    <span className="text-gray-500 font-bold block text-[10px]">FARMER NAME</span>
                    <span className="font-extrabold text-gray-900">{currentBooking.farmerName || farmer.full_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold block text-[10px]">CROP & QUANTITY</span>
                    <span className="font-extrabold text-teal-900">{currentBooking.cropName} ({currentBooking.quantityMT} MT)</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold block text-[10px]">PRESERVATION DURATION</span>
                    <span className="font-extrabold text-gray-900">{currentBooking.durationDays || 30} Days</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold block text-[10px]">FACILITY RATE</span>
                    <span className="font-extrabold text-gray-900">₹{currentBooking.dailyRateQtl || 12}/day/qtl</span>
                  </div>
                </div>

                {/* Dynamic 20% Advance Calculation Box */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-extrabold text-gray-700">
                    <span>Mandatory Advance Progress (20%)</span>
                    <span>{calc.advancePercentage}% Satisfied</span>
                  </div>
                  <div className="w-full bg-teal-200/60 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isPaid ? "bg-emerald-600" : "bg-teal-600"
                      }`}
                      style={{ width: `${calc.advancePercentage}%` }}
                    />
                  </div>
                </div>

                {/* 4 Required Calculation Grid Elements */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100">
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">TOTAL AMOUNT</span>
                    <span className="font-black text-gray-900 text-xs">
                      ₹{calc.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-teal-200">
                    <span className="text-[10px] text-teal-700 font-bold block uppercase">20% ADVANCE REQ.</span>
                    <span className="font-black text-teal-900 text-xs">
                      ₹{calc.requiredAdvance.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">AMOUNT PAID</span>
                    <span className="font-black text-emerald-700 text-xs">
                      ₹{calc.amountPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100">
                    <span className="text-[10px] text-amber-700 font-bold block uppercase">REMAINING (80%)</span>
                    <span className="font-black text-amber-800 text-xs">
                      ₹{calc.remainingAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Success Notification Banner */}
              {storagePaySuccessMsg && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-950 font-bold text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>{storagePaySuccessMsg}</div>
                </div>
              )}

              {/* Payment Section / Duplicate Prevention */}
              {isPaid ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-900 font-black text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>✓ 20% Advance Payment Completed</span>
                  </div>
                  <p className="text-xs text-emerald-800 font-medium">
                    The mandatory 20% advance payment has been successfully recorded. Duplicate advance payments are disabled. The remaining balance of <strong>₹{calc.remainingAmount.toLocaleString()}</strong> (80%) will be settled at produce checkout.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-emerald-200">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block">TRANSACTION REF ID</span>
                      <span className="font-mono font-extrabold text-emerald-900">{currentBooking.txnId || "TXN-CS-2026-0902"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block">PAYMENT DATE & TIME</span>
                      <span className="font-extrabold text-gray-800">{currentBooking.paymentDate || "2026-09-20 14:30"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block">METHOD</span>
                      <span className="font-extrabold text-gray-800">{currentBooking.paymentMethod || "UPI Instant Pay"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block">ADVANCE AMOUNT</span>
                      <span className="font-black text-emerald-700">₹{calc.amountPaid.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStoragePayModal(false)}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const amt = parseFloat(storagePayAmountInput) || calc.requiredAdvance;
                    const res = await payStorageAdvance(currentBooking.id, {
                      amount: amt,
                      paymentMethod: storagePayMethod
                    });
                    if (res.success && res.booking) {
                      setStorageBookingsList(getSharedStorageBookings());
                      setSelectedStorageBooking(res.booking);
                      setStoragePaySuccessMsg(
                        `20% Advance Payment of ₹${amt.toLocaleString()} completed successfully! Transaction ID: ${res.txnId}`
                      );
                    } else {
                      alert(res.error || "Payment failed");
                    }
                  }}
                  className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3"
                >
                  <h4 className="font-black text-gray-900 text-xs uppercase tracking-wider">
                    Make 20% Advance Payment
                  </h4>

                  {/* Payment Breakdown Card */}
                  <div className="p-3 bg-teal-50/40 rounded-xl border border-teal-100 text-xs space-y-1">
                    <div className="flex justify-between text-gray-700">
                      <span>Total Cold Storage Cost:</span>
                      <span className="font-bold text-gray-900">₹{calc.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-teal-900 font-black">
                      <span>20% Advance Payment:</span>
                      <span>₹{calc.requiredAdvance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Remaining Amount (Due at exit):</span>
                      <span className="font-bold text-gray-900">₹{(calc.totalAmount - calc.requiredAdvance).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1 text-xs">
                        Amount to Pay (₹)
                      </label>
                      <input
                        type="number"
                        value={storagePayAmountInput}
                        onChange={(e) => setStoragePayAmountInput(e.target.value)}
                        placeholder={`e.g. ${calc.requiredAdvance}`}
                        className="w-full p-2.5 border border-teal-200 rounded-xl font-black text-teal-950 text-xs bg-teal-50/20"
                        required
                      />
                      <span className="text-[10px] text-gray-500 font-medium mt-0.5 block">
                        Auto-calculated as 20% of ₹{calc.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1 text-xs">
                        Select Payment Option
                      </label>
                      <select
                        value={storagePayMethod}
                        onChange={(e) => setStoragePayMethod(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 text-xs bg-white"
                      >
                        <option value="UPI Instant Pay">UPI (BHIM / PhonePe / Google Pay / Paytm)</option>
                        <option value="Net Banking">Net Banking (SBI / HDFC / ICICI / Andhra Bank)</option>
                        <option value="Debit / Credit Card">Debit / Credit Card (RuPay / Visa / Mastercard)</option>
                        <option value="Mandi Cash Escrow">Mandi Yard Cash / Direct Counter</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer active:scale-95 flex items-center justify-center space-x-1.5"
                  >
                    <CreditCard className="w-4 h-4 text-teal-200" />
                    <span>Confirm & Pay ₹{parseFloat(storagePayAmountInput || calc.requiredAdvance.toString()).toLocaleString()} (20% Advance)</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* COLD STORAGE SPACE RESERVATION MODAL                     */}
      {/* ======================================================== */}
      {showBookStorageModal && targetFacilityForBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-teal-100">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-black text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full uppercase">
                  Space Reservation
                </span>
                <h3 className="text-lg font-extrabold text-gray-900 mt-1">
                  📦 Reserve Cold Storage Space
                </h3>
              </div>
              <button
                onClick={() => setShowBookStorageModal(false)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {(() => {
              const qtyMT = parseFloat(bookQuantityMT) || 10;
              const days = parseInt(bookDurationDays) || 30;
              const rate = targetFacilityForBooking.rate_per_day_quintal || 12;
              const calculatedTotal = Math.round(qtyMT * 1000); 
              const calc = calculateColdStorageAdvance(calculatedTotal, 0);

              return (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const newBooking = await addSharedStorageBooking({
                      facilityId: targetFacilityForBooking.id,
                      facilityName: targetFacilityForBooking.facility_name,
                      location: targetFacilityForBooking.location,
                      farmerId: (farmer as any).id || "FAR_201",
                      farmerName: farmer.full_name || "Ramesh Kumar",
                      farmerPhone: farmer.phone_number || "+91 9876543210",
                      cropName: bookCropName,
                      quantityMT: qtyMT,
                      durationDays: days,
                      dailyRateQtl: rate,
                      totalAmount: calculatedTotal
                    });
                    setStorageBookingsList(getSharedStorageBookings());
                    setSelectedStorageBooking(newBooking);
                    setStoragePayAmountInput(calc.requiredAdvance.toString());
                    setShowBookStorageModal(false);
                    setShowStoragePayModal(true);
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Facility Name</label>
                    <input
                      type="text"
                      disabled
                      value={targetFacilityForBooking.facility_name}
                      className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl font-bold text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Produce / Crop to Store</label>
                    <input
                      type="text"
                      value={bookCropName}
                      onChange={(e) => setBookCropName(e.target.value)}
                      placeholder="e.g. Tomato (Grade A)"
                      className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Quantity (MT)</label>
                      <input
                        type="number"
                        value={bookQuantityMT}
                        onChange={(e) => setBookQuantityMT(e.target.value)}
                        placeholder="10"
                        className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Duration (Days)</label>
                      <input
                        type="number"
                        value={bookDurationDays}
                        onChange={(e) => setBookDurationDays(e.target.value)}
                        placeholder="30"
                        className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 space-y-1">
                    <div className="flex justify-between font-bold text-gray-700">
                      <span>Total Cold Storage Cost:</span>
                      <span className="text-gray-900 font-black">₹{calculatedTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-black text-teal-900">
                      <span>20% Advance Payment:</span>
                      <span>₹{calc.requiredAdvance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-600">
                      <span>Remaining Balance:</span>
                      <span>₹{calc.remainingAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBookStorageModal(false)}
                      className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-black rounded-xl shadow-xs"
                    >
                      Proceed to 20% Advance
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
