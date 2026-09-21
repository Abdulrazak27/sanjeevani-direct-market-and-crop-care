import React from "react";
import { useApp } from "../context/AppContext";
import { Bell, CloudRain, TrendingUp, Users, CheckCircle2 } from "lucide-react";

export const NotificationsPage: React.FC = () => {
  const { notifications, t, setActiveTab } = useApp();

  return (
    <div className="space-y-4 pb-8 max-w-md mx-auto">
      <div className="bg-gradient-to-r from-[#1E5128] to-[#2E6B3A] p-4 rounded-2xl text-white shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-300" />
            <span>Notification Center</span>
          </h2>
          <p className="text-xs text-emerald-200 mt-0.5">Weather alerts, Mandi rate updates, & booking status.</p>
        </div>
      </div>

      <div className="space-y-2.5 text-xs">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (item.target_screen === "market") setActiveTab("market");
              if (item.target_screen === "work") setActiveTab("work");
              if (item.target_screen === "home") setActiveTab("home");
            }}
            className="p-3.5 bg-white border border-emerald-100 rounded-2xl shadow-sm hover:border-emerald-300 transition cursor-pointer flex items-start space-x-3"
          >
            <div className="p-2 bg-emerald-100 text-[#1E5128] rounded-xl shrink-0">
              {item.type === "weather" && <CloudRain className="w-5 h-5 text-sky-600" />}
              {item.type === "market" && <TrendingUp className="w-5 h-5 text-emerald-700" />}
              {item.type === "worker" && <Users className="w-5 h-5 text-blue-700" />}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-extrabold text-gray-900">{item.title_te || item.title}</h4>
                <span className="text-[10px] text-gray-400">{item.time}</span>
              </div>
              <p className="text-gray-600 mt-0.5 leading-snug">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
