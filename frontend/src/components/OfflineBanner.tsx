import React from "react";
import { useApp } from "../context/AppContext";
import { WifiOff, RefreshCw } from "lucide-react";

export const OfflineBanner: React.FC = () => {
  const { isOnline, isSyncing, triggerSync, t } = useApp();

  if (isOnline && !isSyncing) return null;

  return (
    <div className={`px-4 py-2 text-xs font-semibold flex items-center justify-between text-white transition-all ${
      !isOnline ? "bg-amber-600" : "bg-emerald-600"
    }`}>
      <div className="flex items-center space-x-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>{t("offline_notice")}</span>
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Syncing saved data with server...</span>
          </>
        )}
      </div>

      {!isOnline && (
        <button
          onClick={triggerSync}
          className="underline hover:text-amber-100 font-bold ml-2 text-[11px]"
        >
          Check Connection
        </button>
      )}
    </div>
  );
};
