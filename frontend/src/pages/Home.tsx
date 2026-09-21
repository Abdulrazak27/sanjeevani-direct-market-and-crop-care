import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  CloudSun, 
  Camera, 
  TrendingUp, 
  Users, 
  Building2, 
  Warehouse, 
  Truck, 
  Sparkles, 
  ArrowRight,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Sprout,
  Bot,
  CreditCard,
  CheckCircle2
} from "lucide-react";
import { VoiceReader } from "../components/VoiceReader";
import {
  getSharedStorageBookings,
  payStorageAdvance,
  calculateColdStorageAdvance,
  SharedStorageBooking
} from "../services/sharedStore";

export const Home: React.FC = () => {
  const { farmer, setActiveTab, setMarketSubTab, t, setIsAiModalOpen, notifications } = useApp();

  const [storageBookings, setStorageBookings] = useState<SharedStorageBooking[]>(() => getSharedStorageBookings());
  const [activePayModalBooking, setActivePayModalBooking] = useState<SharedStorageBooking | null>(null);
  const [payAmountInput, setPayAmountInput] = useState<string>("");
  const [payMethod, setPayMethod] = useState<string>("UPI Instant Pay");
  const [paySuccessMsg, setPaySuccessMsg] = useState<string>("");

  useEffect(() => {
    const handleUpdate = () => {
      setStorageBookings(getSharedStorageBookings());
    };
    window.addEventListener("sanjeevani_storage_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("sanjeevani_storage_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const mandiPrices = [
    { crop: "Tomato", mandi: "Guntur Mandi", price: "₹2,800", unit: "/quintal", change: "+5.2%", status: "up" },
    { crop: "Chilli", mandi: "Guntur Yard", price: "₹18,500", unit: "/quintal", change: "+2.1%", status: "up" },
    { crop: "Cotton", mandi: "Warangal Mandi", price: "₹7,200", unit: "/quintal", change: "-1.0%", status: "down" },
    { crop: "Onion", mandi: "Kurnool Market", price: "₹1,950", unit: "/quintal", change: "+3.4%", status: "up" },
    { crop: "Maize", mandi: "Eluru Mandi", price: "₹2,100", unit: "/quintal", change: "0.0%", status: "stable" }
  ];

  const quickActions = [
    {
      id: "crop",
      title: t("check_my_crop"),
      desc: "AI plant disease identification & treatment",
      icon: Camera,
      color: "bg-[#E8F5E9] text-[#15803D] border-[#C8E6C9]",
      action: () => setActiveTab("crop")
    },
    {
      id: "market",
      title: t("market_prices"),
      desc: "Live mandi rates & direct buyers",
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-700 border-amber-200",
      action: () => { setActiveTab("market"); setMarketSubTab("prices"); }
    },
    {
      id: "work",
      title: t("farm_workers"),
      desc: "Book harvesting & planting labor team",
      icon: Users,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      action: () => setActiveTab("work")
    },
    {
      id: "fpo",
      title: t("fpo"),
      desc: "District Farmer Producer Organizations",
      icon: Building2,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      action: () => { setActiveTab("market"); setMarketSubTab("fpo"); }
    },
    {
      id: "storage",
      title: t("cold_storage"),
      desc: "Nearby cold storage availability & rates",
      icon: Warehouse,
      color: "bg-teal-50 text-teal-700 border-teal-200",
      action: () => { setActiveTab("market"); setMarketSubTab("storage"); }
    },
    {
      id: "transport",
      title: t("transport"),
      desc: "Book transport vehicle for produce",
      icon: Truck,
      color: "bg-rose-50 text-rose-700 border-rose-200",
      action: () => { setActiveTab("market"); setMarketSubTab("transport"); }
    }
  ];

  const weatherAdvice = "Rain expected today (65% probability). Inspect field soil moisture before irrigation. Avoid unnecessary watering.";

  return (
    <div className="space-y-6 pb-8 max-w-4xl mx-auto">
      {/* Farmer Welcome Banner */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
            {farmer.full_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-gray-900">
                {t("good_morning")}, {farmer.full_name} 🌱
              </h2>
            </div>
            <p className="text-xs text-gray-500 flex items-center space-x-1 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{farmer.village}, {farmer.district} • </span>
              <Sprout className="w-3.5 h-3.5 text-emerald-600 ml-1" />
              <span>{farmer.main_crop} ({farmer.farm_size_acres} Acres)</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-sm flex items-center justify-center space-x-2 transition"
        >
          <Bot className="w-4 h-4 text-amber-300" />
          <span>{t("ask_saathi")}</span>
        </button>
      </div>

      {/* Light Weather Intelligence Widget */}
      <div className="bg-gradient-to-br from-emerald-50/90 via-white to-green-50/60 p-6 rounded-3xl border border-emerald-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
          <div className="flex items-center space-x-2">
            <CloudSun className="w-6 h-6 text-emerald-700" />
            <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
              Live Weather Intelligence
            </span>
          </div>

          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
            Open-Meteo API Live
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Temperature</span>
            <span className="text-2xl font-extrabold text-gray-900">28.5°C</span>
            <span className="text-[11px] text-emerald-700 font-medium block">Partly Cloudy</span>
          </div>

          <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Rain Prob.</span>
            <span className="text-2xl font-extrabold text-blue-600">65%</span>
            <span className="text-[11px] text-gray-500 font-medium block">Moderate Rain</span>
          </div>

          <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Humidity</span>
            <span className="text-2xl font-extrabold text-gray-900">74%</span>
            <span className="text-[11px] text-gray-500 font-medium block">Moist Air</span>
          </div>

          <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Wind Speed</span>
            <span className="text-2xl font-extrabold text-gray-900">12 km/h</span>
            <span className="text-[11px] text-gray-500 font-medium block">Gentle Breeze</span>
          </div>
        </div>

        {/* Farm Advice Block */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Today's Farm Advice</span>
            </h4>
            <VoiceReader text={weatherAdvice} />
          </div>
          <p className="text-xs text-gray-700 leading-relaxed font-medium">
            {weatherAdvice}
          </p>
        </div>
      </div>

      {/* Weather Alert Notification Banner */}
      {notifications.length > 0 && (
        <div className="bg-amber-50/90 p-4 rounded-2xl border border-amber-200/80 shadow-2xs flex items-start space-x-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-amber-900">{notifications[0].title}</h4>
            <p className="text-xs text-amber-800 mt-0.5 font-medium">{notifications[0].message}</p>
          </div>
        </div>
      )}

      {/* Primary Crop Check CTA Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 rounded-3xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="bg-emerald-500/40 text-emerald-100 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-400/30">
            Primary Feature
          </span>
          <h3 className="text-xl font-extrabold text-white">{t("check_my_crop")}</h3>
          <p className="text-xs text-emerald-100/90 max-w-sm">
            Capture a plant leaf photo using your phone camera for instant AI disease identification & organic treatment guidance.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("crop")}
          className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-gray-900 font-extrabold text-xs rounded-2xl shadow-md transition flex items-center justify-center space-x-2 shrink-0"
        >
          <Camera className="w-4 h-4 text-gray-900" />
          <span>Take Leaf Photo</span>
          <ArrowRight className="w-4 h-4 text-gray-900" />
        </button>
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Quick Actions & Services
          </h3>
          <span className="text-xs text-gray-500 font-medium">Farmer Control Hub</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={act.action}
                className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-emerald-400 hover:shadow-md transition text-left flex flex-col justify-between group"
              >
                <div className={"w-10 h-10 rounded-xl flex items-center justify-center mb-3 " + act.color}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition">{act.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2">{act.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mandi Rates Summary Section */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-extrabold text-gray-900">{t("live_mandi")}</h3>
          </div>

          <button
            onClick={() => setActiveTab("market")}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>View All Mandis</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {mandiPrices.map((row, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 text-sm">{row.crop}</span>
                <span className="text-[11px] text-gray-500 block">{row.mandi}</span>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-gray-900 text-sm">{row.price}</span>
                <span className="text-[10px] text-gray-400">{row.unit}</span>
                <span className={`text-[10px] font-bold ml-2 px-1.5 py-0.5 rounded ${
                  row.status === "up" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                }`}>
                  {row.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COLD STORAGE PRESERVATIONS & 20% ADVANCE PAYMENTS TRACKER */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2">
            <Warehouse className="w-5 h-5 text-teal-700" />
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">
                Cold Storage Preservations & 20% Advance Payments
              </h3>
              <p className="text-[11px] text-gray-500 font-medium">
                Mandatory 20% advance payment tracking for cold preservation hubs
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab("market");
              setMarketSubTab("storage");
            }}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>Explore Facilities</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {storageBookings.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-xs">
            No cold storage bookings yet. Explore facilities to preserve your harvest.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storageBookings.map((b) => {
              const calc = calculateColdStorageAdvance(b.totalAmount, b.amountPaid);
              const isPaid = b.paymentStatus === "20% Advance Paid";

              return (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl border border-teal-100 bg-stone-50/60 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] font-black bg-teal-100 text-teal-900 px-2 py-0.5 rounded">
                          {b.bookingCode || b.id}
                        </span>
                        <span className="text-xs font-bold text-gray-700">
                          {b.cropName} ({b.quantityMT} MT)
                        </span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-sm mt-1">{b.facilityName}</h4>
                      <p className="text-[11px] text-gray-500 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-teal-600" />
                        <span>{b.location || "Guntur Hub"}</span>
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isPaid
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {isPaid ? "✓ 20% Advance Paid" : "⚠️ Advance Pending"}
                    </span>
                  </div>

                  {/* 4 Financial Metric Boxes */}
                  <div className="grid grid-cols-4 gap-1.5 text-center text-xs bg-white p-2 rounded-xl border border-teal-50">
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase">TOTAL COST</span>
                      <span className="font-black text-gray-900 text-xs">₹{calc.totalAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-teal-700 font-bold block uppercase">20% ADVANCE</span>
                      <span className="font-black text-teal-800 text-xs">₹{calc.requiredAdvance.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-emerald-700 font-bold block uppercase">PAID</span>
                      <span className="font-black text-emerald-700 text-xs">₹{calc.amountPaid.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-amber-700 font-bold block uppercase">REMAINING</span>
                      <span className="font-black text-amber-800 text-xs">₹{calc.remainingAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action / Paid Receipt Details */}
                  {isPaid ? (
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-emerald-900 font-extrabold text-[11px]">
                        <span>✓ Advance Completed</span>
                        <span className="font-mono text-[10px]">{b.txnId || "TXN-CS-2026-0902"}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-emerald-700">
                        <span>Paid: ₹{calc.amountPaid.toLocaleString()} ({b.paymentDate || "2026-09-20"})</span>
                        <span className="font-bold text-gray-600">Remaining Due: ₹{calc.remainingAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActivePayModalBooking(b);
                        setPayAmountInput(calc.requiredAdvance.toString());
                        setPaySuccessMsg("");
                      }}
                      className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-extrabold text-xs shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-teal-200" />
                      <span>💳 Pay 20% Advance (₹{calc.requiredAdvance.toLocaleString()})</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DIRECT COLD STORAGE ADVANCE PAYMENT MODAL ON HOME */}
      {activePayModalBooking && (() => {
        const currentBooking = storageBookings.find(b => b.id === activePayModalBooking.id) || activePayModalBooking;
        const calc = calculateColdStorageAdvance(currentBooking.totalAmount, currentBooking.amountPaid);
        const isPaid = currentBooking.paymentStatus === "20% Advance Paid";

        return (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-teal-100 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-[10px] font-black text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full uppercase">
                    Mandatory 20% Advance
                  </span>
                  <h3 className="text-lg font-extrabold text-gray-900 mt-1">
                    ❄️ Pay Cold Storage 20% Advance
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setActivePayModalBooking(null);
                    setPaySuccessMsg("");
                  }}
                  className="text-gray-400 hover:text-gray-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-mono text-[10px] bg-teal-200 px-2 py-0.5 rounded font-black text-teal-900">
                      {currentBooking.bookingCode}
                    </span>
                    <h4 className="font-extrabold text-gray-900 text-sm mt-0.5">{currentBooking.facilityName}</h4>
                  </div>
                  <span className="font-extrabold text-teal-900">{currentBooking.cropName} ({currentBooking.quantityMT} MT)</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center pt-1 bg-white p-2 rounded-xl border border-teal-100">
                  <div>
                    <span className="text-[9px] text-gray-500 font-bold block">TOTAL</span>
                    <span className="font-black text-gray-900 text-xs">₹{calc.totalAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-teal-700 font-bold block">20% ADVANCE</span>
                    <span className="font-black text-teal-900 text-xs">₹{calc.requiredAdvance.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-700 font-bold block">PAID</span>
                    <span className="font-black text-emerald-700 text-xs">₹{calc.amountPaid.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-amber-700 font-bold block">REMAINING</span>
                    <span className="font-black text-amber-800 text-xs">₹{calc.remainingAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {paySuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>{paySuccessMsg}</div>
                </div>
              )}

              {isPaid ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                  <div className="font-extrabold text-emerald-900 text-sm flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>✓ 20% Advance Already Paid</span>
                  </div>
                  <p className="text-emerald-800">
                    Duplicate payment prevented. Ref: <strong>{currentBooking.txnId}</strong> on {currentBooking.paymentDate}.
                  </p>
                  <p className="text-gray-600 font-bold">
                    Remaining 80% balance of ₹{calc.remainingAmount.toLocaleString()} due at produce release.
                  </p>
                  <button
                    onClick={() => setActivePayModalBooking(null)}
                    className="w-full py-2.5 bg-emerald-700 text-white rounded-xl font-bold cursor-pointer mt-2"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const amt = parseFloat(payAmountInput) || calc.requiredAdvance;
                    const res = await payStorageAdvance(currentBooking.id, {
                      amount: amt,
                      paymentMethod: payMethod
                    });
                    if (res.success && res.booking) {
                      setStorageBookings(getSharedStorageBookings());
                      setActivePayModalBooking(res.booking);
                      setPaySuccessMsg(`20% Advance Payment of ₹${amt.toLocaleString()} recorded! Receipt: ${res.txnId}`);
                    } else {
                      alert(res.error || "Payment failed");
                    }
                  }}
                  className="space-y-3 text-xs"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Advance Amount (₹)</label>
                      <input
                        type="number"
                        value={payAmountInput}
                        onChange={(e) => setPayAmountInput(e.target.value)}
                        placeholder={`e.g. ${calc.requiredAdvance}`}
                        className="w-full p-2.5 border border-teal-200 rounded-xl font-black text-teal-950 text-xs bg-teal-50/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Payment Method</label>
                      <select
                        value={payMethod}
                        onChange={(e) => setPayMethod(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 bg-white"
                      >
                        <option value="UPI Instant Pay">UPI (BHIM / PhonePe / GPay)</option>
                        <option value="Net Banking">Net Banking</option>
                        <option value="Debit / Credit Card">Debit / Credit Card</option>
                        <option value="Mandi Cash Escrow">Mandi Cash Escrow</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                  >
                    <CreditCard className="w-4 h-4 text-teal-200" />
                    <span>Confirm & Pay 20% Advance (₹{parseFloat(payAmountInput || calc.requiredAdvance.toString()).toLocaleString()})</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
