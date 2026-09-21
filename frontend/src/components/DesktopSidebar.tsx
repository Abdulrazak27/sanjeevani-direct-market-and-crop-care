import React from "react";
import { useApp } from "../context/AppContext";
import { 
  Home, 
  Sprout, 
  TrendingUp, 
  Users, 
  User, 
  Camera,
  Bot, 
  History, 
  ShieldCheck, 
  Globe,
  Leaf
} from "lucide-react";

export const DesktopSidebar: React.FC = () => {
  const { activeTab, setActiveTab, setScreen, screen, t, setIsAiModalOpen, farmer } = useApp();

  const primaryItems = [
    { id: "home", label: t("home"), icon: Home },
    { id: "crop", label: t("crop"), icon: Sprout },
    { id: "market", label: t("market"), icon: TrendingUp },
    { id: "work", label: t("work"), icon: Users },
    { id: "profile", label: t("profile"), icon: User }
  ] as const;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white text-gray-800 border-r border-gray-200 shadow-sm min-h-screen fixed left-0 top-0 bottom-0 z-30">
      {/* Brand Header */}
      <div 
        className="p-5 border-b border-gray-100 flex items-center space-x-3 cursor-pointer hover:bg-gray-50/80 transition"
        onClick={() => setScreen("landing")}
      >
        <img 
          src="/logo.png" 
          alt="Sanjeevani Logo" 
          className="w-10 h-10 object-contain rounded-xl shadow-xs border border-emerald-100 bg-white p-0.5" 
        />
        <div>
          <h2 className="font-extrabold text-xl tracking-tight text-gray-900">SANJEEVANI</h2>
          <p className="text-[11px] text-gray-500 font-medium">AgriTech Farming Saathi</p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
          Main Dashboard
        </div>

        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = screen === "main" && activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "home") {
                  setScreen("landing");
                } else {
                  setScreen("main");
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-emerald-50 text-emerald-800 shadow-xs border-l-4 border-emerald-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-emerald-700" : "text-gray-500"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="pt-4 px-3 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase border-t border-gray-100 mt-4">
          Quick Modules
        </div>

        <button
          onClick={() => {
            setScreen("main");
            setActiveTab("crop");
          }}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition font-medium"
        >
          <Camera className="w-4 h-4 text-emerald-600" />
          <span>Check My Crop</span>
        </button>

        <button
          onClick={() => setScreen("history")}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition font-medium"
        >
          <History className="w-4 h-4 text-emerald-600" />
          <span>Diagnosis History</span>
        </button>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold transition border border-emerald-200 mt-2"
        >
          <Bot className="w-4 h-4 text-emerald-600" />
          <span>Ask Sanjeevani AI</span>
        </button>

        <div className="pt-4 px-3 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase border-t border-gray-100 mt-4">
          System Portals
        </div>

        <button
          onClick={() => setScreen("landing")}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition font-medium"
        >
          <Globe className="w-4 h-4 text-gray-500" />
          <span>Public Website</span>
        </button>
      </div>

      {/* Footer User Badge */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/80">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#23451B] text-amber-300 font-extrabold flex items-center justify-center text-sm shadow-xs border border-emerald-400">
            {farmer.full_name ? farmer.full_name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900 truncate">{farmer.full_name || "User Profile"}</p>
            <p className="text-[10px] font-extrabold text-emerald-800 truncate uppercase">
              {farmer.user_role === "storage" ? "COLD STORAGE" : (farmer.user_role || "farmer").toUpperCase()} • {farmer.district || "Guntur"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
