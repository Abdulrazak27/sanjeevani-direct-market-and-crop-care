import React from "react";
import { useApp } from "../context/AppContext";
import { Bot, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const SanjeevaniAIFloatingButton: React.FC = () => {
  const { setIsAiModalOpen, t } = useApp();

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-20 right-4 z-40"
    >
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="group relative flex items-center space-x-2 bg-gradient-to-r from-[#1E5128] via-[#2D733A] to-[#4E9F3D] text-white px-4 py-3 rounded-full shadow-2xl border-2 border-amber-300 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-amber-300" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
        </div>

        <span className="font-bold text-sm tracking-wide text-amber-100 flex items-center space-x-1">
          <span>{t("ask_saathi")}</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        </span>
      </button>
    </motion.div>
  );
};
