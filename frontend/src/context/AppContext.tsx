import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, FarmerProfile, NotificationItem } from "../types";
import { translations } from "../i18n/translations";
import { getSyncQueue, clearSyncQueue } from "../services/offlineDb";
import { getSharedFarmers, saveSharedFarmers, upsertSharedFarmer } from "../services/sharedStore";

export type ScreenType = 
  | "landing" 
  | "splash" 
  | "language" 
  | "onboarding" 
  | "auth" 
  | "profile_setup" 
  | "main" 
  | "admin" 
  | "history" 
  | "resources"
  | "weather_today"
  | "settings";

export type TabType = "home" | "crop" | "market" | "work" | "profile";
export type MarketSubTabType = "prices" | "buyers" | "fpo" | "storage" | "transport" | "schemes" | "machinery" | "quality";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations["en"]) => string;
  screen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  marketSubTab: MarketSubTabType;
  setMarketSubTab: (subTab: MarketSubTabType) => void;
  farmer: FarmerProfile;
  setFarmer: React.Dispatch<React.SetStateAction<FarmerProfile>>;
  isOnline: boolean;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  triggerSync: () => Promise<void>;
  isSyncing: boolean;
  selectedDiagnosis: any;
  setSelectedDiagnosis: (diag: any) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

const defaultFarmer: FarmerProfile = {
  full_name: "Ramesh Kumar",
  phone_number: "+91 9876543210",
  village: "Tadikonda",
  district: "Guntur",
  state: "Andhra Pradesh",
  main_crop: "Tomato",
  farm_size_acres: 3.5,
  language: "en",
  profile_photo_url: null,
  user_role: "farmer"
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("sanjeevani_lang") as Language) || "en";
  });

  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => {
    return localStorage.getItem("sanjeevani_authenticated") === "true";
  });

  const setIsAuthenticated = (auth: boolean) => {
    setIsAuthenticatedState(auth);
    if (auth) {
      localStorage.setItem("sanjeevani_authenticated", "true");
    } else {
      localStorage.removeItem("sanjeevani_authenticated");
    }
  };

  const [screen, setScreenState] = useState<ScreenType>(() => {
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (search.includes("admin") || hash.includes("admin") || path.includes("admin")) {
      return "admin";
    }
    const isAuth = localStorage.getItem("sanjeevani_authenticated") === "true";
    if (!isAuth) {
      return "splash"; // Plays Intro Video for visitors/unauthenticated users!
    }
    return "landing";
  });

  const setScreen = (newScreen: ScreenType) => {
    setScreenState(newScreen);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  const [activeTab, setActiveTabState] = useState<TabType>("home");
  const [marketSubTab, setMarketSubTabState] = useState<MarketSubTabType>("prices");

  const setActiveTab = (newTab: TabType) => {
    setActiveTabState(newTab);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  const setMarketSubTab = (newSubTab: MarketSubTabType) => {
    setMarketSubTabState(newSubTab);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  // Scroll to top automatically whenever screen, activeTab, or marketSubTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [screen, activeTab, marketSubTab]);

  useEffect(() => {
    const checkRoute = () => {
      const url = window.location.href.toLowerCase();
      if (url.includes("admin") || url.includes("screen=admin")) {
        setScreen("admin");
      }
    };
    checkRoute();
    window.addEventListener("popstate", checkRoute);
    window.addEventListener("hashchange", checkRoute);
    return () => {
      window.removeEventListener("popstate", checkRoute);
      window.removeEventListener("hashchange", checkRoute);
    };
  }, []);

  const [farmer, setFarmer] = useState<FarmerProfile>(() => {
    try {
      const saved = localStorage.getItem("sanjeevani_farmer_profile");
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultFarmer;
  });

  useEffect(() => {
    try {
      localStorage.setItem("sanjeevani_farmer_profile", JSON.stringify(farmer));
      upsertSharedFarmer({
        name: farmer.full_name,
        phone: farmer.phone_number,
        village: farmer.village,
        district: farmer.district,
        state: farmer.state,
        mainCrop: farmer.main_crop,
        farmSizeAcres: farmer.farm_size_acres,
        verificationStatus: (farmer.kyc_status as any) || "Verified",
        accountStatus: (farmer.account_status as any) || "Active",
        profilePhoto: farmer.profile_photo_url
      });
    } catch (e) {
      console.error(e);
    }
  }, [farmer]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const farmersList = getSharedFarmers();
        const cleanCurrentPhone = farmer.phone_number.replace(/\s+/g, "");
        const matched = farmersList.find(
          f => f.phone.replace(/\s+/g, "") === cleanCurrentPhone || f.name === farmer.full_name
        );
        if (matched) {
          const matchedKyc = matched.verificationStatus === "Verified" ? "Verified" : matched.verificationStatus === "Rejected" ? "Rejected" : "Pending";
          if (farmer.kyc_status !== matchedKyc || farmer.account_status !== matched.accountStatus) {
            setFarmer(prev => ({
              ...prev,
              kyc_status: matchedKyc,
              account_status: matched.accountStatus
            }));
          }
        }
      } catch (err) {
        console.error("Sync error in AppContext:", err);
      }
    };

    window.addEventListener("sanjeevani_storage_update", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("sanjeevani_storage_update", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [farmer.phone_number, farmer.full_name, farmer.kyc_status, farmer.account_status]);

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<any>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticatedState] = useState<boolean>(() => {
    return sessionStorage.getItem("sanjeevani_admin_auth") === "true";
  });

  const setIsAdminAuthenticated = (auth: boolean) => {
    setIsAdminAuthenticatedState(auth);
    if (auth) {
      sessionStorage.setItem("sanjeevani_admin_auth", "true");
    } else {
      sessionStorage.removeItem("sanjeevani_admin_auth");
    }
  };

  const [notifications] = useState<NotificationItem[]>([
    {
      id: "n1",
      type: "weather",
      title: "Rain Expected Today (65%)",
      title_te: "నేడు వర్షపాతం సూచన",
      title_hi: "आज बारिश की संभावना",
      message: "Heavy rain expected in Guntur region. Inspect soil moisture before irrigating.",
      time: "10m ago",
      is_read: false
    },
    {
      id: "n2",
      type: "market",
      title: "Tomato Prices Increased +5.2%",
      title_te: "టమోటా ధరలు +5.2% పెరిగాయి",
      title_hi: "टमाटर के भाव में +5.2% की वृद्धि",
      message: "Current rate in Guntur Mandi is ₹2,800/quintal.",
      time: "1h ago",
      is_read: false
    },
    {
      id: "n3",
      type: "worker",
      title: "Farm Workers Available",
      title_te: "కూలీల బృందం అందుబాటులో ఉంది",
      title_hi: "मजदूर टीम उपलब्ध",
      message: "Work coordinator has 6 experienced workers ready for tomato harvesting tomorrow.",
      time: "3h ago",
      is_read: true
    }
  ]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("sanjeevani_lang", lang);
  };

  const t = (key: keyof typeof translations["en"]): string => {
    const dict = translations[language] || translations["en"];
    return dict[key] || translations["en"][key] || key;
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const triggerSync = async () => {
    setIsSyncing(true);
    try {
      const queue = await getSyncQueue();
      if (queue && queue.length > 0) {
        console.log("Synchronizing offline queue items:", queue);
        await new Promise((r) => setTimeout(r, 1200));
        await clearSyncQueue();
      }
    } catch (e) {
      console.error("Sync error:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        screen,
        setScreen,
        activeTab,
        setActiveTab,
        marketSubTab,
        setMarketSubTab,
        farmer,
        setFarmer,
        isOnline,
        isAiModalOpen,
        setIsAiModalOpen,
        notifications,
        unreadCount,
        triggerSync,
        isSyncing,
        selectedDiagnosis,
        setSelectedDiagnosis,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        isAuthenticated,
        setIsAuthenticated
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
