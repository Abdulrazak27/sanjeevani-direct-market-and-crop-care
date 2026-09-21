import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Language } from "../types";
import { 
  ArrowLeft, 
  Globe, 
  Bell, 
  Volume2, 
  MapPin, 
  Shield, 
  Trash2, 
  Check, 
  LogOut, 
  Smartphone,
  CloudSun,
  Database,
  User,
  Sliders,
  CheckCircle2
} from "lucide-react";

export const Settings: React.FC = () => {
  const { farmer, setFarmer, language, setLanguage, setScreen, setActiveTab, setIsAuthenticated, t } = useApp();

  // Notification toggles
  const [notifyWeather, setNotifyWeather] = useState(true);
  const [notifyMarket, setNotifyMarket] = useState(true);
  const [notifyWorkers, setNotifyWorkers] = useState(true);
  const [notifyBuyers, setNotifyBuyers] = useState(true);

  // Audio / Speech settings
  const [autoAudioRead, setAutoAudioRead] = useState(true);
  const [speechFeedback, setSpeechFeedback] = useState(true);

  // Location / Weather Preferences
  const [autoDetectGps, setAutoDetectGps] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearCache = async () => {
    if (window.confirm("Do you want to reset offline cached data? This will re-synchronize live data upon reload.")) {
      try {
        localStorage.removeItem("sanjeevani_weather_cache");
        localStorage.removeItem("sanjeevani_cached_history");
        alert("Offline cache cleared successfully!");
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto font-sans pb-12 text-xs sm:text-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <button
          onClick={() => {
            setScreen("main");
            setActiveTab("profile");
            window.scrollTo(0, 0);
          }}
          className="flex items-center space-x-2 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-2xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span>Back to Profile</span>
        </button>

        <h2 className="text-base sm:text-lg font-black text-gray-900">
          App Settings
        </h2>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-2xl flex items-center space-x-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* 1. Language Preference */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 text-gray-900 font-extrabold text-sm pb-1 border-b border-gray-100">
          <Globe className="w-4 h-4 text-emerald-700" />
          <span>Language / భాష / भाषा</span>
        </div>

        <p className="text-xs text-gray-500 font-medium">
          Choose your primary language for Voice Assistant, Crop Diagnosis, and Market information:
        </p>

        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {[
            { code: "en", label: "English", sub: "Default" },
            { code: "te", label: "తెలుగు", sub: "Telugu" },
            { code: "hi", label: "हिंदी", sub: "Hindi" }
          ].map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => {
                  setLanguage(item.code as Language);
                  handleSavePreferences();
                }}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-2xs"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold"
                }`}
              >
                <span className="text-sm font-extrabold">{item.label}</span>
                <span className="text-[10px] text-gray-400">{item.sub}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 mt-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Notifications Settings */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 text-gray-900 font-extrabold text-sm pb-1 border-b border-gray-100">
          <Bell className="w-4 h-4 text-amber-600" />
          <span>Notification Preferences</span>
        </div>

        <div className="divide-y divide-gray-100 space-y-1">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-800 block text-xs sm:text-sm">Weather & Rain Alerts</span>
              <span className="text-[11px] text-gray-500">Live forecast updates, rain notifications, and frost warnings</span>
            </div>
            <input
              type="checkbox"
              checked={notifyWeather}
              onChange={(e) => setNotifyWeather(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-800 block text-xs sm:text-sm">Mandi Price Surge Alerts</span>
              <span className="text-[11px] text-gray-500">Instant notification when your crop price rises (+5%)</span>
            </div>
            <input
              type="checkbox"
              checked={notifyMarket}
              onChange={(e) => setNotifyMarket(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-800 block text-xs sm:text-sm">Farm Worker Updates</span>
              <span className="text-[11px] text-gray-500">Coordinator labor confirmations and arrival alerts</span>
            </div>
            <input
              type="checkbox"
              checked={notifyWorkers}
              onChange={(e) => setNotifyWorkers(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-800 block text-xs sm:text-sm">Buyer Inquiries</span>
              <span className="text-[11px] text-gray-500">Direct purchase offers from verified wholesale buyers</span>
            </div>
            <input
              type="checkbox"
              checked={notifyBuyers}
              onChange={(e) => setNotifyBuyers(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Audio & Voice Read-Aloud Settings */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 text-gray-900 font-extrabold text-sm pb-1 border-b border-gray-100">
          <Volume2 className="w-4 h-4 text-blue-600" />
          <span>Audio & Voice Assistant</span>
        </div>

        <div className="divide-y divide-gray-100 space-y-1">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-800 block text-xs sm:text-sm">Voice Read-Aloud (Text-To-Speech)</span>
              <span className="text-[11px] text-gray-500">Automatically enable speaker for treatment steps & farm advice</span>
            </div>
            <input
              type="checkbox"
              checked={autoAudioRead}
              onChange={(e) => setAutoAudioRead(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-800 block text-xs sm:text-sm">Interactive Voice Responses</span>
              <span className="text-[11px] text-gray-500">Audio playback during Sanjeevani AI chat discussions</span>
            </div>
            <input
              type="checkbox"
              checked={speechFeedback}
              onChange={(e) => setSpeechFeedback(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. Location & Weather Preferences */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 text-gray-900 font-extrabold text-sm pb-1 border-b border-gray-100">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span>Location & Farm Preferences</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-gray-600 block mb-1">Village / Town</label>
            <input
              type="text"
              value={farmer.village}
              onChange={(e) => setFarmer({ ...farmer, village: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800"
            />
          </div>
          <div>
            <label className="font-bold text-gray-600 block mb-1">District</label>
            <input
              type="text"
              value={farmer.district}
              onChange={(e) => setFarmer({ ...farmer, district: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-gray-600 block mb-1">Primary Crop</label>
            <input
              type="text"
              value={farmer.main_crop}
              onChange={(e) => setFarmer({ ...farmer, main_crop: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800"
            />
          </div>
          <div>
            <label className="font-bold text-gray-600 block mb-1">Land Size (Acres)</label>
            <input
              type="number"
              value={farmer.farm_size_acres}
              onChange={(e) => setFarmer({ ...farmer, farm_size_acres: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-gray-100">
          <span className="text-[11px] text-gray-500 font-medium">Auto-detect GPS coordinates for local weather</span>
          <input
            type="checkbox"
            checked={autoDetectGps}
            onChange={(e) => setAutoDetectGps(e.target.checked)}
            className="w-4 h-4 accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>

      {/* 5. Account & Data Management */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 text-gray-900 font-extrabold text-sm pb-1 border-b border-gray-100">
          <Shield className="w-4 h-4 text-purple-600" />
          <span>Account & Offline Sync</span>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleClearCache}
            className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-bold text-gray-700 flex items-center justify-between transition cursor-pointer text-xs"
          >
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-gray-500" />
              <span>Clear Offline Cache & Reload</span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Free Storage</span>
          </button>

          <button
            onClick={() => {
              setIsAuthenticated(false);
              localStorage.removeItem("sanjeevani_authenticated");
              setScreen("auth");
              window.scrollTo(0, 0);
            }}
            className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl font-bold text-red-700 flex items-center justify-center space-x-2 transition cursor-pointer text-xs"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>Log Out of Sanjeevani</span>
          </button>
        </div>
      </div>
    </div>
  );
};
