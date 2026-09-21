import React from "react";
import { useApp } from "../context/AppContext";
import { Language } from "../types";
import { Globe, ArrowRight, CheckCircle2 } from "lucide-react";

export const LanguageSelect: React.FC = () => {
  const { language, setLanguage, setScreen } = useApp();

  const languages: Array<{ id: Language; native: string; english: string; sub: string }> = [
    { id: "en", native: "English", english: "English", sub: "Use Sanjeevani in English language" },
    { id: "te", native: "తెలుగు", english: "Telugu", sub: "తెలుగు భాషలో యాప్‌ని ఉపయోగించండి" },
    { id: "hi", native: "हिन्दी", english: "Hindi", sub: "हिंदी भाषा में ऐप का उपयोग करें" }
  ];

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setScreen("onboarding");
  };

  return (
    <div className="min-h-screen bg-[#F8FBF6] p-6 flex flex-col justify-between max-w-lg mx-auto font-sans">
      <div className="pt-8">
        <div className="flex items-center space-x-2 text-[#2E7D32] mb-3">
          <Globe className="w-6 h-6 text-[#2E7D32]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">Select Language</span>
        </div>
        
        <h2 className="text-3xl font-extrabold text-[#263238] mb-2 leading-tight">
          Choose Your Preferred Language
        </h2>
        
        <p className="text-sm text-[#667085] mb-8 font-medium">
          Sanjeevani is customized to guide you in your native language with voice support.
        </p>

        {/* Large Language Cards */}
        <div className="space-y-4">
          {languages.map((item) => {
            const isSelected = language === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 shadow-xs flex items-center justify-between ${
                  isSelected
                    ? "bg-white border-[#2E7D32] shadow-md ring-2 ring-[#2E7D32]/20"
                    : "bg-white border-[#E6EDE5] hover:border-[#2E7D32]"
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-2xl font-extrabold text-[#263238]">{item.native}</span>
                    <span className="text-xs font-bold text-[#667085]">({item.english})</span>
                  </div>
                  <p className="text-xs text-[#667085] mt-1 font-medium">{item.sub}</p>
                </div>

                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? "bg-[#2E7D32] text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {isSelected ? <CheckCircle2 className="w-6 h-6" /> : <ArrowRight className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pb-8 pt-6">
        <button
          onClick={() => setScreen("onboarding")}
          className="w-full py-4 bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-extrabold text-base rounded-2xl shadow-md flex items-center justify-center space-x-2 transition"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};
