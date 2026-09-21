import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Language } from "../types";
import { 
  ChevronDown, 
  Check, 
  Search, 
  Sparkles,
  TrendingUp,
  Warehouse,
  Users,
  ShieldCheck,
  Sprout,
  Bot
} from "lucide-react";

export const Header: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    activeTab, 
    setActiveTab, 
    marketSubTab, 
    setMarketSubTab, 
    farmer, 
    screen, 
    setScreen, 
    setIsAiModalOpen 
  } = useApp();
  
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Dynamic rotating placeholder for SEO Search Bar
  const searchPlaceholders = [
    "Search 'Guntur Mandi Prices'...",
    "Search 'Tomato Early Blight Cure'...",
    "Search 'Cold Storage near Guntur'...",
    "Search 'Farm Harvesting Workers'...",
    "Search 'Verified Chilli Buyers'..."
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const langLabels: Record<Language, string> = {
    en: "English",
    te: "తెలుగు",
    hi: "हिंदी"
  };

  // SEO Smart Search suggestions catalog
  const searchSuggestions = [
    { title: "Live Guntur Mandi Prices (Tomato, Chilli, Cotton)", target: () => { setScreen("main"); setActiveTab("market"); setMarketSubTab("prices"); window.scrollTo(0, 0); }, icon: "📈" },
    { title: "Direct Buyers & Exporters Directory", target: () => { setScreen("main"); setActiveTab("market"); setMarketSubTab("buyers"); window.scrollTo(0, 0); }, icon: "🤝" },
    { title: "Book Cold Storage & Transport Facilities", target: () => { setScreen("main"); setActiveTab("market"); setMarketSubTab("storage"); window.scrollTo(0, 0); }, icon: "🏬" },
    { title: "Check Crop Disease with AI Camera Scanner", target: () => { setScreen("main"); setActiveTab("crop"); window.scrollTo(0, 0); }, icon: "📸" },
    { title: "Weather Today & Rain Intelligence", target: () => { setScreen("weather_today"); window.scrollTo(0, 0); }, icon: "⛅" },
    { title: "Farmer Profile & Settings", target: () => { setScreen("main"); setActiveTab("profile"); window.scrollTo(0, 0); }, icon: "👤" },
    { title: "Hire Farm Workers & Harvesting Labor", target: () => { setScreen("main"); setActiveTab("work"); window.scrollTo(0, 0); }, icon: "👨‍🌾" }
  ];

  const filteredSuggestions = searchSuggestions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes("weather") || q.includes("rain") || q.includes("forecast")) {
      setScreen("weather_today");
    } else if (q.includes("buyer") || q.includes("fpo") || q.includes("sell") || q.includes("purchase")) {
      setScreen("main");
      setActiveTab("market");
      setMarketSubTab("buyers");
    } else if (q.includes("storage") || q.includes("cold") || q.includes("warehouse") || q.includes("transport") || q.includes("truck")) {
      setScreen("main");
      setActiveTab("market");
      setMarketSubTab("storage");
    } else if (q.includes("crop") || q.includes("leaf") || q.includes("disease") || q.includes("scan")) {
      setScreen("main");
      setActiveTab("crop");
    } else if (q.includes("worker") || q.includes("labor") || q.includes("contact") || q.includes("coordinator")) {
      setScreen("main");
      setActiveTab("work");
    } else if (q.includes("profile") || q.includes("setting")) {
      setScreen("main");
      setActiveTab("profile");
    } else if (q.includes("resource") || q.includes("guide")) {
      setScreen("resources");
    } else {
      setScreen("main");
      setActiveTab("market");
      setMarketSubTab("prices");
    }
    window.scrollTo(0, 0);
    setIsSearchFocused(false);
  };

  const navItems = [
    { id: "home", label: "Home", action: () => { setScreen("landing"); window.scrollTo(0, 0); } },
    { id: "crop", label: "Crop Care", action: () => { setScreen("main"); setActiveTab("crop"); window.scrollTo(0, 0); } },
    { id: "market_prices", label: "Market Prices", action: () => { setScreen("main"); setActiveTab("market"); setMarketSubTab("prices"); window.scrollTo(0, 0); } },
    { id: "buyers_fpos", label: "Buyers & FPOs", action: () => { setScreen("main"); setActiveTab("market"); setMarketSubTab("buyers"); window.scrollTo(0, 0); } },
    { id: "storage_logistics", label: "Storage & Logistics", action: () => { setScreen("main"); setActiveTab("market"); setMarketSubTab("storage"); window.scrollTo(0, 0); } },
    { id: "resources", label: "Resources", action: () => { setScreen("resources"); window.scrollTo(0, 0); } },
    { id: "contact", label: "Contact us", action: () => { setScreen("main"); setActiveTab("work"); window.scrollTo(0, 0); } },
    { id: "profile", label: "Profile", action: () => { setScreen("main"); setActiveTab("profile"); window.scrollTo(0, 0); } }
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-md select-none font-sans">
      {/* 1. TOP PASTEL GREEN BAR */}
      <div className="bg-gradient-to-r from-[#5B8C46] via-[#669850] to-[#4F7D3C] text-white py-2.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shadow-sm">
        {/* Left: Brand Logo & Title */}
        <div 
          className="flex items-center space-x-3 cursor-pointer shrink-0"
          onClick={() => {
            setScreen("landing");
            window.scrollTo(0, 0);
          }}
        >
          <img 
            src="/logo.png" 
            alt="SANJEEVANI Logo" 
            className="w-9 h-9 object-contain bg-white rounded-lg p-0.5 shadow-xs" 
          />
          <div>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight leading-none text-white">
              SANJEEVANI
            </h1>
            <p className="text-[10px] text-emerald-100 font-medium tracking-tight mt-0.5">
              Direct Market & Crop Care
            </p>
          </div>
        </div>

        {/* Center: Search Bar with Form Submit & SEO Dropdown */}
        <div className="flex-1 max-w-xl mx-2 hidden sm:block relative">
          <form onSubmit={handleGlobalSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder={searchPlaceholders[placeholderIndex]}
              className="w-full bg-white text-gray-900 text-xs px-4 py-2 rounded-full shadow-inner focus:outline-none placeholder-gray-400 font-semibold pr-10 transition-all duration-300"
            />
            <button 
              type="submit"
              className="absolute right-1 w-7 h-7 bg-[#2E4A23] text-white rounded-full flex items-center justify-center hover:bg-[#1E3316] transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* LIVE SEO SEARCH SUGGESTIONS DROPDOWN */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 p-2 text-xs space-y-1">
              <div className="flex items-center justify-between px-3 py-1 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 rounded-lg">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>SEO Search Suggestions</span>
                </span>
                <span>Instant Direct Results</span>
              </div>

              {filteredSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onMouseDown={() => {
                    setSearchQuery(item.title);
                    item.target();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 flex items-center space-x-2.5 transition group cursor-pointer"
                >
                  <span className="text-base shrink-0">{item.icon}</span>
                  <span className="font-bold text-gray-800 group-hover:text-[#5B8C46] truncate">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Status & Controls */}
        <div className="flex items-center space-x-3 shrink-0 text-xs">
          {/* Online Pill */}
          <div className="hidden md:flex items-center space-x-1.5 bg-[#487537] text-emerald-100 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-300/30">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>• Online</span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1.5 bg-white/90 hover:bg-white text-gray-800 px-3 py-1 rounded-full font-extrabold text-xs shadow-xs transition cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span>{langLabels[language]}</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 py-1 z-50 overflow-hidden text-xs">
                {(["en", "te", "hi"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 transition flex items-center justify-between cursor-pointer ${
                      language === lang ? "font-bold text-[#5B8C46] bg-emerald-50" : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span>{langLabels[lang]}</span>
                    {language === lang && <Check className="w-3.5 h-3.5 text-[#5B8C46]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <button
            onClick={() => {
              setActiveTab("profile");
              setScreen("main");
              window.scrollTo(0, 0);
            }}
            className="flex items-center space-x-1.5 bg-[#487537] hover:bg-[#3C632C] text-white px-3 py-1 rounded-full text-xs font-bold border border-emerald-300/30 transition cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-amber-300"></span>
            <span className="truncate max-w-[100px]">{farmer.full_name ? farmer.full_name.split(' ')[0] : "User"}</span>
            <span className="bg-[#335328] text-[9px] px-1.5 py-0.5 rounded text-amber-200 uppercase font-extrabold">
              {farmer.user_role === "storage" ? "COLD STORAGE" : (farmer.user_role || "farmer").toUpperCase()}
            </span>
          </button>

          {/* Admin Portal Quick Switch */}
          <button
            onClick={() => {
              setScreen("admin");
              window.scrollTo(0, 0);
            }}
            className="flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-gray-950 px-2.5 py-1 rounded-full text-xs font-black shadow-xs transition cursor-pointer"
            title="Open Master Admin Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gray-950" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>

      {/* 2. SECONDARY PASTEL FOREST NAV BAR */}
      <div className="bg-[#335328] text-gray-100 py-1.5 border-b border-[#29441F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center space-x-3 sm:space-x-5 text-xs sm:text-sm font-extrabold overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = 
              (item.id === "home" && screen === "landing") || 
              (item.id === "crop" && activeTab === "crop" && screen === "main") || 
              (item.id === "market_prices" && activeTab === "market" && marketSubTab === "prices" && screen === "main") ||
              (item.id === "buyers_fpos" && activeTab === "market" && (marketSubTab === "buyers" || marketSubTab === "fpo") && screen === "main") ||
              (item.id === "storage_logistics" && activeTab === "market" && (marketSubTab === "storage" || marketSubTab === "transport") && screen === "main") ||
              (item.id === "resources" && screen === "resources") ||
              (item.id === "contact" && activeTab === "work" && screen === "main") ||
              (item.id === "profile" && ((activeTab === "profile" && screen === "main") || screen === "weather_today" || screen === "settings"));

            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`py-1 px-3 rounded-xl transition whitespace-nowrap cursor-pointer flex items-center space-x-1 ${
                  isActive
                    ? "bg-white/20 text-white font-black border-b-2 border-amber-300 shadow-xs"
                    : "hover:text-amber-200 text-stone-200"
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
