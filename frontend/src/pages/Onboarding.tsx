import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Camera, CloudSun, TrendingUp, Bot, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Onboarding: React.FC = () => {
  const { setScreen } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Know Your Crop Health",
      title_te: "ధర పంట సంజీవనికూలీలు సంజీవనికూలీలు",
      title_hi: "కూలీలు పంట ధర సంజీవనిధర సలహా",
      desc: "Use your phone camera to identify supported crops and detect diseases with AI confidence scoring.",
      desc_te: "ధర కూలీలు సంజీవని? పంట కూలీలు కూలీలు AI సంజీవని సంజీవని? సలహా సంజీవని సంజీవని సంజీవని.",
      icon: Camera,
      color: "from-emerald-500 to-green-600"
    },
    {
      title: "Know What To Do Today",
      title_te: "సలహా మండి ధరలు ధర మండి ధరలు సంజీవనికూలీలు",
      title_hi: "ధర పంట పంట కూలీలు కూలీలు ధర సలహా",
      desc: "Get real weather intelligence, rain warnings, and customized crop-care guidance.",
      desc_te: "కూలీలు సంజీవని సంజీవని, కూలీలు మండి ధరలు సలహా పంట సంజీవనిపంట సంజీవని సంజీవని.",
      icon: CloudSun,
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Find Better Market Prices",
      title_te: "సంజీవని సంజీవని? కూలీలు పంట మండి ధరలు",
      title_hi: "సంజీవని? కూలీలు పంట ధర పంట సలహా",
      desc: "Check live mandi rates, connect directly with verified buyers, FPOs, cold storage, and transport drivers.",
      desc_te: "కూలీలు సంజీవని? కూలీలు, సంజీవనిసంజీవని, FPO ధర, మండి ధరలు సంజీవని? సలహా కూలీలు సంజీవనిసంజీవని? సంజీవని సంజీవని.",
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Your 24/7 Farming Companion",
      title_te: "ధర 24/7 సంజీవని సంజీవని సంజీవని?",
      title_hi: "కూలీలు 24/7 మండి ధరలు కూలీలు కూలీలు",
      desc: "Ask Sanjeevani AI questions in Telugu, Hindi, or English using text or natural voice speech.",
      desc_te: "మండి ధరలు కూలీలు మండి ధరలు మండి ధరలు సంజీవని AI సంజీవనిమండి ధరలు సంజీవనిపంట మండి ధరలు సంజీవని.",
      icon: Bot,
      color: "from-teal-500 to-emerald-700"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setScreen("auth");
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] via-emerald-50/40 to-emerald-100/50 p-6 flex flex-col justify-between max-w-md mx-auto select-none">
      {/* Top Header: Skip */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex space-x-1.5">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep ? "w-8 bg-[#1E5128]" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setScreen("auth")}
          className="text-xs font-bold text-gray-500 hover:text-gray-800 px-3 py-1 rounded-full border border-gray-300 bg-white"
        >
          Skip
        </button>
      </div>

      {/* Main Animated Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="my-auto text-center px-4 flex flex-col items-center"
        >
          <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl text-white mb-8 border-4 border-white`}>
            <Icon className="w-14 h-14" />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-3 leading-tight">
            {step.title_te}
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
            {step.desc_te}
          </p>

          <p className="text-xs text-gray-400 mt-3 font-medium">
            {step.desc}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Button */}
      <div className="pb-6">
        <button
          onClick={handleNext}
          className="w-full py-4 bg-[#1E5128] hover:bg-[#16421F] text-white font-extrabold text-base rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition active:scale-98"
        >
          <span>{currentStep === steps.length - 1 ? "Get Started / సంజీవనిమండి ధరలు" : "Next / సంజీవని"}</span>
          {currentStep === steps.length - 1 ? <Check className="w-5 h-5 text-amber-300" /> : <ArrowRight className="w-5 h-5 text-amber-300" />}
        </button>
      </div>
    </div>
  );
};
