import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Language } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { triggerPhoneCall } from "../utils/phone";
import { 
  Camera, 
  ShieldAlert, 
  CloudSun, 
  TrendingUp, 
  Users, 
  Building2, 
  Warehouse, 
  Truck, 
  Bot, 
  Globe, 
  WifiOff, 
  ArrowRight,
  Sparkles,
  Leaf,
  ChevronRight,
  Check,
  Phone,
  FileText,
  ShieldCheck,
  ExternalLink,
  MapPin
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const { setScreen, language, setLanguage, t, setActiveTab, setMarketSubTab } = useApp();

  const heroSlides = [
    {
      title: "SMART CROP CARE, DIRECT MARKET ACCESS",
      subtitle: "AI-driven insights for healthier crops and a better market for farmers.",
      image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "INSTANT CROP DISEASE DIAGNOSIS",
      subtitle: "Upload leaf photos to get instant organic treatment guidance in English, Hindi & Telugu.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "LIVE MANDI RATES & DIRECT BUYERS",
      subtitle: "Connect directly with verified buyers, FPOs, logistics drivers and cold storage near you.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "PADDY & RICE ORGANIC CULTIVATION",
      subtitle: "Access official ICAR manuals, nursery care protocols and direct procurement forms.",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "COLD STORAGE & FARM MACHINERY RENTAL",
      subtitle: "Book nearby refrigerated warehouses and hire tractors & combine harvesters on hourly rates.",
      image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-gray-900 font-sans">

      {/* HERO SECTION BANNER - 2 SECOND AUTO SLIDER */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-emerald-950 text-white p-6 sm:p-10 lg:p-14 border-4 border-white aspect-[16/7] sm:aspect-[16/5] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={heroSlides[currentSlide].image}
                alt="Agriculture & Farmer Banner"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Subtle text readability gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent z-0" />

          {/* Banner Text Content */}
          <div className="relative z-10 max-w-xl space-y-2.5 bg-black/35 backdrop-blur-[2px] p-5 sm:p-7 rounded-2xl border border-white/20 shadow-xl">
            <motion.h1 
              key={`title-${currentSlide}`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase leading-tight font-sans"
            >
              {heroSlides[currentSlide].title}
            </motion.h1>
            <motion.p 
              key={`sub-${currentSlide}`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs sm:text-sm text-amber-200 font-bold leading-relaxed"
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>
          </div>

          {/* 5 Pagination Dots - Auto Slides Every 2 Seconds */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? "w-8 bg-amber-400 shadow-md" : "w-2.5 bg-white/60 hover:bg-white"
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6 FEATURE ACTION CARDS GRID (2 rows x 3 columns) */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Crop Diagnosis",
              sub: "(AI-Driven)",
              icon: "🔬",
              bgIcon: "bg-emerald-50 text-emerald-700 border-emerald-200",
              action: () => { setScreen("main"); setActiveTab("crop"); }
            },
            {
              title: "Market Prices",
              sub: "(Live Mandi)",
              icon: "🛒",
              bgIcon: "bg-emerald-50 text-emerald-700 border-emerald-200",
              action: () => { setScreen("main"); setActiveTab("market"); setMarketSubTab("prices"); }
            },
            {
              title: "Find Buyers & FPOs",
              sub: "(Direct Sales)",
              icon: "🏷️",
              bgIcon: "bg-emerald-50 text-emerald-700 border-emerald-200",
              action: () => { setScreen("main"); setActiveTab("market"); setMarketSubTab("buyers"); }
            },
            {
              title: "Cold Storage",
              sub: "(Nearby)",
              icon: "🏢",
              bgIcon: "bg-emerald-50 text-emerald-700 border-emerald-200",
              action: () => { setScreen("main"); setActiveTab("market"); setMarketSubTab("storage"); }
            },
            {
              title: "Logistics",
              sub: "(Book Transport)",
              icon: "🚚",
              bgIcon: "bg-emerald-50 text-emerald-700 border-emerald-200",
              action: () => { setScreen("main"); setActiveTab("market"); setMarketSubTab("transport"); }
            },
            {
              title: "Resources & Training",
              sub: "(AI Guides)",
              icon: "📖",
              bgIcon: "bg-emerald-50 text-emerald-700 border-emerald-200",
              action: () => { setScreen("main"); setActiveTab("crop"); }
            }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={card.action}
              className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center space-y-3 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#EAF5EA] flex items-center justify-center text-3xl group-hover:scale-110 transition border border-[#CDE5CD]">
                {card.icon}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900 group-hover:text-[#2E7D32] transition">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  {card.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DUAL QUICK INFO CARDS ROW */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Detect Disease */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌱</span>
              <div>
                <h4 className="font-extrabold text-sm text-gray-900">Detect Disease. Get Instant Helps</h4>
                <p className="text-[11px] text-gray-500 font-medium">Identify plant illnesses in seconds</p>
              </div>
            </div>
            <button
              onClick={() => { setScreen("main"); setActiveTab("crop"); }}
              className="text-xs font-bold text-[#2E7D32] hover:underline shrink-0"
            >
              Open Full Doctor Page →
            </button>
          </div>

          {/* Card 2: Latest Market Prices */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-extrabold text-sm text-gray-900">Latest Market Prices</h4>
                <p className="text-[11px] text-gray-500 font-medium">Real-time Mandi rates near you</p>
              </div>
            </div>
            <button
              onClick={() => { setScreen("main"); setActiveTab("market"); }}
              className="text-xs font-bold text-[#2E7D32] hover:underline shrink-0"
            >
              View All →
            </button>
          </div>
        </div>
      </section>

      {/* 7. LATEST UPDATES & TECHNOLOGY SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-[#E6EDE5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Helpful Information */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider block">LATEST UPDATES & RESOURCES</span>
                <h3 className="text-2xl font-extrabold text-[#263238]">News, Tips & Helpful Information</h3>
              </div>
              <button onClick={() => { setScreen("main"); setActiveTab("home"); }} className="text-xs font-bold text-[#2E7D32]">View All ➔</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                {
                  id: "tomato-diseases",
                  title: "How to Identify Common Tomato Diseases",
                  date: "12 Sep 2026",
                  image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
                  author: "Dr. K. Swaminathan (ICAR Senior Agronomist)",
                  summary: "Learn how to spot Early Blight, Bacterial Spot, and Leaf Curl Virus early with organic treatment steps.",
                  content: [
                    {
                      heading: "1. Early Blight (Alternaria solani)",
                      body: "Early blight creates dark target-like concentric rings on mature leaves, starting from the lower canopy. Leaves turn yellow and drop prematurely."
                    },
                    {
                      heading: "Organic Treatment & Control",
                      body: "• Spray Neem Oil (5ml per liter water) every 7 days.\n• Apply Trichoderma viride bio-fungicide to soil.\n• Prune lower infected leaves and dispose away from the field.\n• Use drip irrigation to prevent soil splash on leaves."
                    },
                    {
                      heading: "2. Tomato Leaf Curl Virus (TYLCV)",
                      body: "Transmitted by whiteflies. Leaf margins curl upwards, leaves become thick and rubbery, and plant growth halts."
                    },
                    {
                      heading: "Prevention Strategy",
                      body: "• Install 10-12 yellow sticky traps per acre.\n• Spray Panchagavya or Sour buttermilk solution to strengthen leaf immunity.\n• Remove infected plants immediately to prevent whitefly transmission."
                    }
                  ]
                },
                {
                  id: "market-prices",
                  title: "Today's Market Prices for Major Crops",
                  date: "11 Sep 2026",
                  image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
                  author: "AgriMarket Intelligence Cell, Guntur APMC",
                  summary: "Real-time Mandi price analysis, arrival trends, and price forecasts for Guntur & Vijayawada region.",
                  content: [
                    {
                      heading: "1. Mandi Price Report (Today)",
                      body: "• Tomato: ₹2,800 / quintal (Guntur) — Up +4.2% due to festival demand.\n• Chilli (Teja): ₹15,500 / quintal — Strong export demand from Asia.\n• Maize: ₹2,150 / quintal — Stable market arrivals.\n• Paddy (BPT 5204): ₹2,350 / quintal."
                    },
                    {
                      heading: "2. Selling Guidance for Farmers",
                      body: "• Direct Selling to FPO Pools yields ₹150 - ₹250 higher per quintal compared to local brokers.\n• Check daily prices on Sanjeevani Market tab before harvesting to lock in peak prices."
                    }
                  ]
                },
                {
                  id: "cold-storage",
                  title: "Benefits of Cold Storage for Farmers",
                  date: "10 Sep 2026",
                  image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
                  author: "National Horticulture Board (NHB)",
                  summary: "Prevent post-harvest distress sales and increase profits by 25-35% using cold storage facilities.",
                  content: [
                    {
                      heading: "1. Why Use Cold Storage?",
                      body: "During peak harvest weeks, market gluts lower crop prices. Storing produce for 2-3 weeks lets farmers sell when prices recover."
                    },
                    {
                      heading: "2. Govt Subsidies & Rates",
                      body: "• Government offers up to 50% subsidy on cold storage rental for small farmers.\n• Average cold storage fee: ₹12 per quintal / day.\n• Controlled temperature (10°C - 12°C) preserves freshness and extends shelf life up to 21 days."
                    }
                  ]
                }
              ].map((article) => (
                <div 
                  key={article.id} 
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-lg transition cursor-pointer space-y-2 group"
                >
                  <div className="overflow-hidden rounded-xl h-28">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                  </div>
                  <h4 className="font-extrabold text-xs text-[#263238] group-hover:text-[#2E7D32] transition leading-snug">
                    {article.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 block">{article.date}</span>
                  <button className="text-[11px] font-extrabold text-[#2E7D32] group-hover:underline flex items-center space-x-1">
                    <span>Read More</span>
                    <span>➔</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Technology Image Card */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xl font-extrabold text-[#263238] mb-1">Built for Farmers. Powered by Technology.</h3>
              <p className="text-xs text-gray-500 font-medium mb-4">Combining local agricultural knowledge with AI intelligence.</p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#F1F8F1] rounded-xl border border-[#C8E6C9] flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-[#2E7D32]" />
                  <span className="font-bold text-gray-800">AI Computer Vision</span>
                </div>
                <div className="p-3 bg-[#F1F8F1] rounded-xl border border-[#C8E6C9] flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-[#2E7D32]" />
                  <span className="font-bold text-gray-800">Reliable Data</span>
                </div>
                <div className="p-3 bg-[#F1F8F1] rounded-xl border border-[#C8E6C9] flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span className="font-bold text-gray-800">Secure & Scalable</span>
                </div>
                <div className="p-3 bg-[#F1F8F1] rounded-xl border border-[#C8E6C9] flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-[#2E7D32]" />
                  <span className="font-bold text-gray-800">Designed for Rural India</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden h-36 border border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80"
                alt="Happy Farmer Couple using smartphone"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* LIVE AGRICULTURAL MARKET INTELLIGENCE & DIRECT FARMER NETWORK BANNER */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-white via-[#F4F9F4] to-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-200/80 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#15803D] bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300 inline-block mb-1.5">
                🌾 Live Agri Ecosystem & Market Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center space-x-2">
                <span>Direct Crop Care to Market Connectivity</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                Empowering farmers with AI plant disease diagnostics, daily Mandi price updates, direct verified buyer procurement, and nearby cold storage booking.
              </p>
            </div>
            <div className="shrink-0 flex items-center space-x-3">
              <button 
                onClick={() => { setScreen("main"); setActiveTab("crop"); }}
                className="px-5 py-2.5 bg-[#15803D] hover:bg-[#11632F] text-white font-extrabold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center space-x-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-amber-300" />
                <span>Diagnose Crop Free</span>
              </button>
              <button 
                onClick={() => { setScreen("main"); setActiveTab("market"); }}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-gray-900 font-extrabold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center space-x-2 cursor-pointer border border-amber-300"
              >
                <TrendingUp className="w-4 h-4 text-gray-900" />
                <span>Check Mandi Rates</span>
              </button>
            </div>
          </div>

          {/* 4 ECOSYSTEM HIGHLIGHT PILLARS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-xs space-y-1">
              <div className="text-xl">🔬</div>
              <h4 className="font-extrabold text-xs text-gray-900">AI Plant Doctor</h4>
              <p className="text-[11px] text-gray-500 leading-snug">Instant leaf photo analysis for early blight, leaf curl & pests with organic remedies.</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-xs space-y-1">
              <div className="text-xl">📈</div>
              <h4 className="font-extrabold text-xs text-gray-900">Real-Time Mandi Rates</h4>
              <p className="text-[11px] text-gray-500 leading-snug">Track daily crop market prices for Tomato, Chilli, Paddy, Cotton & Onion across Mandi yards.</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-xs space-y-1">
              <div className="text-xl">🏢</div>
              <h4 className="font-extrabold text-xs text-gray-900">Direct Buyer Sales</h4>
              <p className="text-[11px] text-gray-500 leading-snug">Connect directly with verified business buyers & FPOs with 0% middleman brokerage.</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-xs space-y-1">
              <div className="text-xl">❄️</div>
              <h4 className="font-extrabold text-xs text-gray-900">Cold Storage & Logistics</h4>
              <p className="text-[11px] text-gray-500 leading-snug">Locate climate-controlled warehouses & book harvesting labor and transport trucks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTINUOUS LEFT-TO-RIGHT SCROLLING FARMER & BUYER REVIEWS MARQUEE */}
      <section className="py-12 bg-gradient-to-r from-[#EBF5EA] via-[#E4F0E3] to-[#EBF5EA] text-gray-900 overflow-hidden my-6 border-y-4 border-[#5B8C46]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <span className="text-[10px] font-extrabold text-[#2D5021] bg-[#5B8C46]/20 px-3 py-1 rounded-full uppercase tracking-widest border border-[#5B8C46]/40">
            Verified Testimonials & Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A15] mt-2">
            🌟 Real Reviews from Farmers & Buyers Across India
          </h2>
          <p className="text-xs text-[#3E652E] font-medium max-w-xl mx-auto mt-1">
            See what verified agricultural producers, direct grain buyers, cold storage operators and logistics drivers say about SANJEEVANI.
          </p>
        </div>

        {/* Infinite Left-to-Right Scrolling Container */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex space-x-5 py-2">
            {[
              {
                id: "r1",
                name: "K. Venkateswara Rao",
                role: "Farmer • Rice & Tomato",
                location: "Guntur, AP",
                rating: 5,
                tag: "Verified Farmer 🌾",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                review: "Sold 50 Quintals of Tomato to Sri Lakshmi Buyers directly through Sanjeevani within 20 mins. Direct cash settlement with 0% commission!"
              },
              {
                id: "r2",
                name: "Rajesh Patel",
                role: "Crop Buyer & Exporter",
                location: "Ahmedabad, Gujarat",
                rating: 5,
                tag: "Verified Buyer 🛒",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
                review: "Connected directly to 40+ Paddy farmers in AP & Telangana. The app transparently listed Mandi prices and allowed direct bulk deals."
              },
              {
                id: "r3",
                name: "Siva Rama Krishna",
                role: "Farmer • Chilli & Maize",
                location: "Tenali, AP",
                rating: 5,
                tag: "Verified Farmer 🌾",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
                review: "Uploaded a leaf photo of my Chilli crop. AI identified Leaf Curl Virus immediately & gave organic neem oil remedy in Telugu!"
              },
              {
                id: "r4",
                name: "Kavitha Reddy",
                role: "Cold Storage Operator",
                location: "Vijayawada, AP",
                rating: 5,
                tag: "Warehouse Partner 🧊",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
                review: "Our 1,200 MT cold storage capacity gets booked faster. Local farmers directly check available space and book through Sanjeevani."
              },
              {
                id: "r5",
                name: "M. Nageswara Rao",
                role: "Farmer • Paddy",
                location: "Krishna District, AP",
                rating: 5,
                tag: "Verified Farmer 🌾",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
                review: "The Paddy resource guide PDF and direct driver phone connect allowed me to transport 10 Tons of grain safely."
              },
              {
                id: "r6",
                name: "Anil Kumar",
                role: "Agri Logistics Driver",
                location: "Guntur Mandi Hub",
                rating: 5,
                tag: "Transport Partner 🚚",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
                review: "Got 8 trip bookings this week for Paddy and Tomato cargo transport. Direct farmer phone number connection!"
              },
              // Duplicate set for seamless infinite loop animation
              {
                id: "r1-dup",
                name: "K. Venkateswara Rao",
                role: "Farmer • Rice & Tomato",
                location: "Guntur, AP",
                rating: 5,
                tag: "Verified Farmer 🌾",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                review: "Sold 50 Quintals of Tomato to Sri Lakshmi Buyers directly through Sanjeevani within 20 mins. Direct cash settlement with 0% commission!"
              },
              {
                id: "r2-dup",
                name: "Rajesh Patel",
                role: "Crop Buyer & Exporter",
                location: "Ahmedabad, Gujarat",
                rating: 5,
                tag: "Verified Buyer 🛒",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
                review: "Connected directly to 40+ Paddy farmers in AP & Telangana. The app transparently listed Mandi prices and allowed direct bulk deals."
              },
              {
                id: "r3-dup",
                name: "Siva Rama Krishna",
                role: "Farmer • Chilli & Maize",
                location: "Tenali, AP",
                rating: 5,
                tag: "Verified Farmer 🌾",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
                review: "Uploaded a leaf photo of my Chilli crop. AI identified Leaf Curl Virus immediately & gave organic neem oil remedy in Telugu!"
              },
              {
                id: "r4-dup",
                name: "Kavitha Reddy",
                role: "Cold Storage Operator",
                location: "Vijayawada, AP",
                rating: 5,
                tag: "Warehouse Partner 🧊",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
                review: "Our 1,200 MT cold storage capacity gets booked faster. Local farmers directly check available space and book through Sanjeevani."
              }
            ].map((rev, idx) => (
              <div
                key={idx}
                className="w-80 sm:w-96 bg-white border-2 border-[#5B8C46]/25 rounded-3xl p-5 shadow-lg shrink-0 flex flex-col justify-between hover:border-[#5B8C46] transition duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold bg-[#EBF5EA] text-[#2D5021] px-2.5 py-0.5 rounded-full border border-[#5B8C46]/40">
                      {rev.tag}
                    </span>
                    <div className="flex text-amber-500 text-xs font-bold">
                      {"★".repeat(rev.rating)}
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 font-medium leading-relaxed italic mb-4">
                    "{rev.review}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-3 border-t border-[#5B8C46]/20">
                  <img
                    src={rev.image}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#5B8C46]/40 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-[#1E3A15] leading-tight">{rev.name}</h4>
                    <span className="text-[10px] text-[#3E652E] font-semibold block">{rev.role}</span>
                    <span className="text-[9px] text-[#5B8C46] block font-medium">{rev.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2E7D32] text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              From Healthy Crops to Better Markets
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Join thousands of farmers already using Sanjeevani for healthier crops, better prices and a brighter future.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={() => { setScreen("main"); setActiveTab("crop"); }}
              className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-gray-900 font-extrabold text-sm rounded-2xl shadow-lg transition active:scale-95 flex items-center space-x-2"
            >
              <span>Start with Your Crop</span>
              <ArrowRight className="w-5 h-5 text-gray-900" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-[#1B4D3E] text-white text-xs py-12 border-t border-[#12382c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-extrabold text-lg">
              <img 
                src="/logo.png" 
                alt="Sanjeevani Logo" 
                className="w-10 h-10 object-contain rounded-xl bg-white p-0.5 border border-emerald-300 shadow-xs" 
              />
              <span>SANJEEVANI</span>
            </div>
            <p className="text-xs text-emerald-200 leading-relaxed">
              Empowering small and marginal farmers with technology, crop care and direct market access for a sustainable future.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-emerald-200 text-xs">
              <li><button onClick={() => setScreen("landing")} className="hover:text-white">Home</button></li>
              <li><button onClick={() => { setScreen("main"); setActiveTab("crop"); }} className="hover:text-white font-bold text-amber-300">Crop Diagnosis</button></li>
              <li><button onClick={() => { setScreen("main"); setActiveTab("market"); }} className="hover:text-white">Market Prices</button></li>
              <li><button onClick={() => { setScreen("main"); setActiveTab("market"); }} className="hover:text-white">Cold Storage</button></li>
              <li><button onClick={() => { setScreen("main"); setActiveTab("work"); }} className="hover:text-white">Farm Workers</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm mb-3">Resources</h4>
            <ul className="space-y-2 text-emerald-200 text-xs">
              <li><span className="hover:text-white cursor-pointer">Crop Guide</span></li>
              <li><span className="hover:text-white cursor-pointer">Market Trends</span></li>
              <li><span className="hover:text-white cursor-pointer">Help & Support</span></li>
              <li><span className="hover:text-white cursor-pointer">FAQs</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm mb-3">Get in Touch</h4>
            <ul className="space-y-2 text-emerald-200 text-xs">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Guntur, Andhra Pradesh, India</span>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  onClick={(e) => {
                    e.preventDefault();
                    triggerPhoneCall("+919876543210");
                  }}
                  className="flex items-center space-x-2 text-emerald-200 hover:text-white font-bold transition cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>+91 98765 43210 (Call Support)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-emerald-800/60 text-center text-emerald-300 text-[11px] flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 SANJEEVANI AgriTech — "From Crop Care to Market — Your Farming Saathi." All rights reserved.</p>
          <div className="flex space-x-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Use</span>
          </div>
        </div>
      </footer>

      {/* Full Interactive Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md uppercase border border-emerald-200">
                  {selectedArticle.author}
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-2">{selectedArticle.title}</h3>
                <span className="text-xs text-gray-400 block mt-0.5">{selectedArticle.date}</span>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden h-52 border border-gray-200">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 text-xs font-semibold text-emerald-950">
              <p>{selectedArticle.summary}</p>
            </div>

            <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
              {selectedArticle.content?.map((sec: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <h4 className="font-extrabold text-gray-900 text-sm">{sec.heading}</h4>
                  <p className="whitespace-pre-line font-medium text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
