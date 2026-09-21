import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Camera, User, MapPin, Sprout, ArrowRight, Check, ShoppingBag, Warehouse, Truck, ShieldCheck, FileCheck } from "lucide-react";
import { CameraModal } from "../components/CameraModal";
import { upsertSharedFarmer, addSharedBuyer, addSharedAuditLog } from "../services/sharedStore";

export const ProfileSetup: React.FC = () => {
  const { farmer, setFarmer, setScreen, setActiveTab } = useApp();

  const [activeRole, setActiveRole] = useState<"farmer" | "buyer" | "storage" | "transport" | "coordinator">(
    (farmer.user_role as any) || "farmer"
  );

  // Common Profile State
  const [fullName, setFullName] = useState(farmer.full_name || "Ramesh Kumar");
  const [village, setVillage] = useState(farmer.village || "Tadikonda");
  const [district, setDistrict] = useState(farmer.district || "Guntur");
  const [state, setState] = useState(farmer.state || "Andhra Pradesh");
  const [photoUrl, setPhotoUrl] = useState<string | null>(farmer.profile_photo_url || null);

  // Farmer specific fields
  const [mainCrop, setMainCrop] = useState(farmer.main_crop || "Tomato");
  const [farmSize, setFarmSize] = useState<number>(farmer.farm_size_acres || 3.5);

  // Buyer specific fields
  const [companyName, setCompanyName] = useState(farmer.company_name || "Sri Lakshmi Agri Buyers");
  const [buyerType, setBuyerType] = useState(farmer.buyer_type || "Wholesaler & Processor");
  const [cropRequired, setCropRequired] = useState(farmer.crop_required || "Tomato");
  const [minQty, setMinQty] = useState<number>(farmer.min_quantity_tons || 15);
  const [priceOffered, setPriceOffered] = useState<number>(farmer.price_offered || 2900);

  // Buyer KYC Verification Fields
  const [buyerKycDocType, setBuyerKycDocType] = useState("GSTIN Certificate");
  const [buyerKycNumber, setBuyerKycNumber] = useState("28AABCU9012K1Z9");
  const [buyerKycFileName, setBuyerKycFileName] = useState("GSTIN_28AABCU9012K1Z9_CERT.pdf");
  const kycDocInputRef = useRef<HTMLInputElement | null>(null);

  const handleKycFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBuyerKycFileName(e.target.files[0].name);
    }
  };

  // Storage specific fields
  const [facilityName, setFacilityName] = useState(farmer.facility_name || "Guntur Central Cold Care");
  const [capacityMt, setCapacityMt] = useState<number>(farmer.capacity_mt || 5000);
  const [availableSpaceMt, setAvailableSpaceMt] = useState<number>(farmer.available_space_mt || 1200);
  const [ratePerDay, setRatePerDay] = useState<number>(farmer.rate_per_day_quintal || 8);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoCaptured = (file: File) => {
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotoUrl(url);
    }
  };

  const handleSaveProfile = () => {
    const updatedFarmer = {
      ...farmer,
      user_role: activeRole,
      full_name: fullName,
      village,
      district,
      state,
      main_crop: mainCrop,
      farm_size_acres: farmSize,
      profile_photo_url: photoUrl,
      company_name: companyName,
      buyer_type: buyerType,
      crop_required: cropRequired,
      min_quantity_tons: minQty,
      price_offered: priceOffered,
      facility_name: facilityName,
      capacity_mt: capacityMt,
      available_space_mt: availableSpaceMt,
      rate_per_day_quintal: ratePerDay
    };
    setFarmer(updatedFarmer);

    if (activeRole === "farmer") {
      upsertSharedFarmer({
        name: fullName,
        phone: farmer.phone_number,
        village,
        district,
        state,
        mainCrop,
        farmSizeAcres: farmSize,
        verificationStatus: (farmer.kyc_status as any) || "Pending Verification",
        profilePhoto: photoUrl
      });
    } else if (activeRole === "buyer") {
      addSharedBuyer({
        companyName: companyName || fullName,
        repName: fullName,
        phone: farmer.phone_number,
        location: `${village}, ${district}`,
        district,
        buyerType,
        interestedCrops: [cropRequired || "Tomato"],
        priceOfferedQtl: priceOffered,
        minQtyTons: minQty,
        kycStatus: "Pending"
      });
    }

    addSharedAuditLog({
      userName: fullName,
      userId: "FARMER_CLIENT",
      userRole: activeRole === "buyer" ? "BUYER" : "FARMER",
      module: activeRole === "buyer" ? "Buyer" : "Farmer",
      action: `Profile Configured (${activeRole.toUpperCase()})`,
      recordId: farmer.phone_number,
      prevValue: "Incomplete Profile",
      newValue: `${fullName} - ${village}, ${district} (${mainCrop})`,
      status: "Success"
    });

    if (activeRole === "buyer" || activeRole === "storage") {
      setActiveTab("market");
    } else {
      setActiveTab("home");
    }

    setScreen("main");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] via-emerald-50/40 to-emerald-100/50 p-6 flex flex-col justify-between max-w-md mx-auto">
      <div className="pt-4 space-y-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Complete Profile Details</h2>
          <p className="text-xs text-gray-600 mt-0.5">Enter your details to access localized marketplace & agri tools.</p>
        </div>

        {/* Dynamic Role Switcher Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-gray-200/70 p-1 rounded-2xl text-xs">
          <button
            type="button"
            onClick={() => setActiveRole("farmer")}
            className={`py-2 px-1 rounded-xl font-extrabold flex items-center justify-center space-x-1 transition ${
              activeRole === "farmer" ? "bg-emerald-700 text-white shadow-xs" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span className="text-[11px]">Farmer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("buyer")}
            className={`py-2 px-1 rounded-xl font-extrabold flex items-center justify-center space-x-1 transition ${
              activeRole === "buyer" ? "bg-amber-600 text-white shadow-xs" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="text-[11px]">Buyer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("storage")}
            className={`py-2 px-1 rounded-xl font-extrabold flex items-center justify-center space-x-1 transition ${
              activeRole === "storage" ? "bg-teal-700 text-white shadow-xs" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <Warehouse className="w-3.5 h-3.5" />
            <span className="text-[11px]">Storage</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("transport")}
            className={`py-2 px-1 rounded-xl font-extrabold flex items-center justify-center space-x-1 transition ${
              activeRole === "transport" ? "bg-emerald-800 text-white shadow-xs" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span className="text-[11px]">Transport</span>
          </button>
        </div>

        {/* Profile Photo Section */}
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full border-4 border-[#1E5128] bg-emerald-100 overflow-hidden shadow-lg flex items-center justify-center">
            {photoUrl ? (
              <img src={photoUrl} alt="User Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-[#1E5128]" />
            )}
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="px-3 py-1 bg-[#1E5128] text-white text-[11px] font-bold rounded-xl shadow flex items-center space-x-1 hover:bg-[#16421F]"
            >
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span>Camera</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-[11px] font-bold rounded-xl shadow-sm hover:bg-gray-50"
            >
              Upload Photo
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleGalleryUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Form Fields Container */}
        <div className="space-y-3.5 bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 text-xs">
          {/* Common Fields */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              {activeRole === "buyer" ? "Contact Representative Name" : activeRole === "storage" ? "Manager / Operator Name" : "Full Name"}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 outline-none focus:border-[#1E5128]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Village / City</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900"
                required
              />
            </div>
          </div>

          {/* Role-Specific Fields */}
          {activeRole === "farmer" && (
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-100">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Main Crop Name</label>
                <input
                  type="text"
                  value={mainCrop}
                  onChange={(e) => setMainCrop(e.target.value)}
                  placeholder="e.g. Tomato, Chilli, Cotton"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Farm Size (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  value={farmSize}
                  onChange={(e) => setFarmSize(parseFloat(e.target.value) || 1)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                  required
                />
              </div>
            </div>
          )}

          {activeRole === "buyer" && (
            <div className="space-y-3 pt-1 border-t border-gray-100">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Company / Business Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Sri Lakshmi Food Exporters"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Crop Required</label>
                  <input
                    type="text"
                    value={cropRequired}
                    onChange={(e) => setCropRequired(e.target.value)}
                    placeholder="e.g. Tomato"
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Offered Price (₹/qtl)</label>
                  <input
                    type="number"
                    value={priceOffered}
                    onChange={(e) => setPriceOffered(parseFloat(e.target.value) || 2800)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* BUYER KYC VERIFICATION SECTION */}
              <div className="bg-amber-50/90 border border-amber-300 p-3.5 rounded-xl space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div className="flex items-center space-x-1.5 text-amber-900 font-extrabold text-xs">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Buyer Business KYC Verification</span>
                  </div>
                  <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    PENDING ADMIN REVIEW ⏳
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-amber-950 mb-1">KYC Document Type</label>
                  <select
                    value={buyerKycDocType}
                    onChange={(e) => setBuyerKycDocType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-gray-900 outline-none focus:border-amber-600"
                  >
                    <option value="GSTIN Certificate">GSTIN Certificate (Goods & Services Tax)</option>
                    <option value="APMC Trade License">APMC Trade License / Mandi Trader Pass</option>
                    <option value="FSSAI License">FSSAI Food Safety License Certificate</option>
                    <option value="Company PAN">Company PAN Card & Certificate of Incorporation</option>
                    <option value="Import-Export Code (IEC)">Import-Export Code (IEC Certificate)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-amber-950 mb-1">KYC / Registration Number</label>
                  <input
                    type="text"
                    value={buyerKycNumber}
                    onChange={(e) => setBuyerKycNumber(e.target.value)}
                    placeholder="e.g. 28AABCU9012K1Z9 or APMC-GNT-8810"
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-gray-900 outline-none focus:border-amber-600"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-amber-950 mb-1">Upload KYC Certificate / Document PDF/Image</label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => kycDocInputRef.current?.click()}
                      className="flex-1 py-2.5 px-3 bg-white border border-amber-400 text-amber-950 text-xs font-extrabold rounded-xl shadow-xs hover:bg-amber-100 flex items-center justify-center space-x-2 transition cursor-pointer"
                    >
                      <FileCheck className="w-4 h-4 text-amber-700" />
                      <span className="truncate">{buyerKycFileName ? `📄 ${buyerKycFileName}` : "Upload KYC Document File"}</span>
                    </button>
                    <input
                      type="file"
                      ref={kycDocInputRef}
                      accept="image/*,application/pdf"
                      onChange={handleKycFileSelected}
                      className="hidden"
                    />
                  </div>
                  <p className="text-[10px] text-amber-800 mt-1 font-semibold leading-tight">
                    * Master Admin will review and verify your submitted business KYC document before bulk trade contract activation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeRole === "storage" && (
            <div className="space-y-3 pt-1 border-t border-gray-100">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Cold Storage Facility Name</label>
                <input
                  type="text"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  placeholder="e.g. Guntur Central Cold Care"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Capacity (MT)</label>
                  <input
                    type="number"
                    value={capacityMt}
                    onChange={(e) => setCapacityMt(parseFloat(e.target.value) || 1000)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Daily Rate (₹/qtl/day)</label>
                  <input
                    type="number"
                    value={ratePerDay}
                    onChange={(e) => setRatePerDay(parseFloat(e.target.value) || 8)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pb-6 mt-6">
        <button
          onClick={handleSaveProfile}
          className="w-full py-4 bg-[#1E5128] hover:bg-[#16421F] text-white font-extrabold text-base rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition cursor-pointer"
        >
          <span>Save Details & Enter App</span>
          <Check className="w-5 h-5 text-amber-300" />
        </button>
      </div>

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handlePhotoCaptured}
      />
    </div>
  );
};
