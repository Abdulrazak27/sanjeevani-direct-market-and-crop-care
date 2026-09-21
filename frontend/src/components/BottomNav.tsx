import React from "react";
import { useApp } from "../context/AppContext";
import { Home, Sprout, TrendingUp, Users, User } from "lucide-react";
import { motion } from "framer-motion";

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const navItems = [
    { id: "home", label: t("home"), icon: Home },
    { id: "crop", label: t("crop"), icon: Sprout },
    { id: "market", label: t("market"), icon: TrendingUp },
    { id: "work", label: t("work"), icon: Users },
    { id: "profile", label: t("profile"), icon: User },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center min-w-[64px] min-h-[52px] py-1 px-2 rounded-xl transition-all duration-200"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute inset-0 bg-emerald-100/80 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <div className={`relative z-10 p-1 transition-transform ${isActive ? "scale-110 text-[#1E5128]" : "text-gray-500 hover:text-gray-700"}`}>
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              </div>

              <span
                className={`relative z-10 text-[11px] font-semibold transition-colors mt-0.5 ${
                  isActive ? "text-[#1E5128] font-bold" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
