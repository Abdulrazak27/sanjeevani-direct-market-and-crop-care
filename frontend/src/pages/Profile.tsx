import React, { useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  User, 
  MapPin, 
  Sprout, 
  Globe, 
  HelpCircle, 
  LogOut, 
  Settings as SettingsIcon, 
  Camera, 
  CloudSun, 
  ChevronRight, 
  ShieldCheck, 
  Check, 
  Upload,
  Sparkles,
  Phone,
  FileCheck
} from "lucide-react";

export const Profile: React.FC = () => {
  const { farmer, setFarmer, language, setScreen, setActiveTab, setIsAuthenticated, t } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUpdated, setPhotoUpdated] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFarmer((prev) => ({
          ...prev,
          profile_photo_url: result
        }));
        setPhotoUpdated(true);
        setTimeout(() => setPhotoUpdated(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 pb-12 max-w-xl mx-auto text-xs sm:text-sm font-sans">
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {photoUpdated && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-2xl flex items-center space-x-2 text-xs font-bold animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile photo updated successfully!</span>
        </div>
      )}

      {/* 1. Farmer Profile Card */}
      <div className="bg-gradient-to-br from-[#1E5128] via-[#2E6B3A] to-[#1E5128] p-5 sm:p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 border border-emerald-600/50 relative overflow-hidden">
        {/* Avatar with Upload Badge */}
        <div className="relative group shrink-0">
          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-3 border-amber-400 bg-amber-200 overflow-hidden flex items-center justify-center text-gray-900 shadow-md">
            {farmer.profile_photo_url ? (
              <img src={farmer.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-extrabold text-[#1E5128]">
                {farmer.full_name ? farmer.full_name.charAt(0).toUpperCase() : "R"}
              </span>
            )}
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload/Change Photo"
            className="absolute bottom-0 right-0 w-7 h-7 bg-amber-400 hover:bg-amber-300 text-gray-950 rounded-full flex items-center justify-center shadow-md border-2 border-white transition cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Profile Info Details */}
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">{farmer.full_name || "Ramesh Kumar"}</h2>
            <span className="inline-block bg-amber-400 text-gray-950 font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider self-center sm:self-auto">
              {farmer.user_role === "storage" ? "Cold Storage" : (farmer.user_role || "Farmer").toUpperCase()}
            </span>
          </div>

          <p className="text-emerald-200 font-semibold text-xs">{farmer.phone_number || "+91 9876543210"}</p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-amber-200">
            <span className="bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-amber-300" />
              <span>{farmer.village || "Tadikonda"}, {farmer.district || "Guntur"}</span>
            </span>

            <span className="bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center space-x-1">
              <Sprout className="w-3 h-3 text-amber-300" />
              <span>{farmer.main_crop || "Tomato"} ({farmer.farm_size_acres || 3.5} Acres)</span>
            </span>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 text-[11px] text-emerald-100 hover:text-white underline font-bold inline-flex items-center space-x-1 cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>Change Profile Photo</span>
          </button>
        </div>
      </div>

      {/* 2. Core Profile Navigation Menu: Weather Today & Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Weather Today Option - Opens Weather Intelligence Page */}
        <button
          onClick={() => {
            setScreen("weather_today");
            window.scrollTo(0, 0);
          }}
          className="bg-white hover:bg-emerald-50/70 p-4.5 rounded-3xl border border-emerald-200 shadow-xs flex items-center justify-between text-left transition group cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shadow-2xs group-hover:bg-emerald-200 transition">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm text-gray-900 group-hover:text-emerald-800">Weather Today</span>
                <span className="bg-emerald-100 text-[#1E5128] text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Live</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">Forecast, Rain alerts & Farm advice</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-700 transition" />
        </button>

        {/* Settings Option - Opens Settings Page */}
        <button
          onClick={() => {
            setScreen("settings");
            window.scrollTo(0, 0);
          }}
          className="bg-white hover:bg-emerald-50/70 p-4.5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between text-left transition group cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shadow-2xs group-hover:bg-purple-200 transition">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-gray-900 group-hover:text-purple-900">App Settings</span>
              <p className="text-[11px] text-gray-500 mt-0.5">Language, Audio, Alerts & Account</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-700 transition" />
        </button>
      </div>

      {/* 3. Account Actions List */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden divide-y divide-gray-100">
        <button
          onClick={() => {
            setScreen("profile_setup");
            window.scrollTo(0, 0);
          }}
          className="w-full p-4 flex items-center justify-between hover:bg-emerald-50/60 transition cursor-pointer"
        >
          <div className="flex items-center space-x-3 text-gray-800">
            <User className="w-5 h-5 text-emerald-700" />
            <span className="font-bold">Edit Farmer Profile Details</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button
          onClick={() => {
            setScreen("language");
            window.scrollTo(0, 0);
          }}
          className="w-full p-4 flex items-center justify-between hover:bg-emerald-50/60 transition cursor-pointer"
        >
          <div className="flex items-center space-x-3 text-gray-800">
            <Globe className="w-5 h-5 text-amber-600" />
            <span className="font-bold">Change Language / భాషను మార్చుకోండి</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button
          onClick={() => {
            setScreen("history");
            window.scrollTo(0, 0);
          }}
          className="w-full p-4 flex items-center justify-between hover:bg-emerald-50/60 transition cursor-pointer"
        >
          <div className="flex items-center space-x-3 text-gray-800">
            <FileCheck className="w-5 h-5 text-sky-600" />
            <span className="font-bold">Crop Disease Diagnosis History</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* 4. Help & Support Card */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
        <h4 className="font-extrabold text-gray-900 uppercase tracking-wider text-xs flex items-center space-x-1.5">
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span>Help & Farming Assistance (సలహా & సహాయం)</span>
        </h4>

        <div className="space-y-2 text-gray-600 text-xs">
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="font-bold text-gray-900 block mb-0.5">How to scan crop leaves?</span>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Tap "Crop Care" or "Take Leaf Photo", point your camera at the affected leaf inside the boundary guide, and tap Capture.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="font-bold text-gray-900 block mb-0.5">How offline mode works?</span>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              All scans, price checks, and worker requests save directly on your smartphone and synchronize automatically when network is restored.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Logout Button */}
      <button
        onClick={() => {
          setIsAuthenticated(false);
          localStorage.removeItem("sanjeevani_authenticated");
          setScreen("auth");
          window.scrollTo(0, 0);
        }}
        className="w-full py-3.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold rounded-2xl flex items-center justify-center space-x-2 transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout / లాగ్ అవుట్</span>
      </button>
    </div>
  );
};
