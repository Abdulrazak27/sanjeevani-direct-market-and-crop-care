import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { triggerPhoneCall } from "../utils/phone";
import { downloadAgriResourcePDF } from "../utils/pdfDownloader";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  Search, 
  Calculator, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles,
  Award,
  HelpCircle,
  ExternalLink,
  Sprout,
  Filter
} from "lucide-react";

export const Resources: React.FC = () => {
  const { t, language } = useApp();
  const [activeCategory, setActiveCategory] = useState<"all" | "guides" | "calculator" | "videos" | "schemes">("all");
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fertilizer Calculator State
  const [cropType, setCropType] = useState("Tomato");
  const [acres, setAcres] = useState("2.5");
  const [calculatedDosage, setCalculatedDosage] = useState<string | null>(null);

  const calculateFertilizer = (e: React.FormEvent) => {
    e.preventDefault();
    const acreNum = parseFloat(acres) || 1;
    setCalculatedDosage(`For ${acreNum} Acres of ${cropType}:
• Urea (Nitrogen): ${(acreNum * 45).toFixed(1)} kg
• DAP (Phosphorus): ${(acreNum * 30).toFixed(1)} kg
• MOP (Potassium): ${(acreNum * 25).toFixed(1)} kg
• Neem Oil Spray: ${(acreNum * 2.5).toFixed(1)} Liters in 500L water`);
  };

  const resourceItems = [
    // Rice / Paddy Resources
    {
      id: "r_rice_1",
      cropTag: "rice",
      category: "guides",
      title: "ICAR Rice Production & Blast Pathology Control Manual",
      type: "PDF Guide",
      size: "3.2 MB",
      desc: "Complete step-by-step ICAR nursery management, Paddy blast control, and brown plant hopper prevention protocol.",
      readTime: "10 min read",
      author: "ICAR Indian Institute of Rice Research (IIRR), Hyderabad",
      downloadUrl: "https://www.icar.org.in/"
    },
    {
      id: "r_rice_2",
      cropTag: "rice",
      category: "guides",
      title: "Paddy Direct Seeding (DSR) & Water Conservation Guide",
      type: "Field Manual",
      size: "1.9 MB",
      desc: "Water-saving Paddy cultivation methods, seed treatment, weed management, and micro-nutrient zinc application.",
      readTime: "7 min read",
      author: "AP Rice Research Station, Maruteru",
      downloadUrl: "https://angrau.ac.in/"
    },
    {
      id: "r_rice_3",
      cropTag: "rice",
      category: "schemes",
      title: "Paddy Minimum Support Price (MSP) & APMC Procurement Form",
      type: "Govt Form",
      size: "1.1 MB",
      desc: "Government MSP (₹2,183/quintal) registration form, grain moisture % limits, and direct bank transfer instructions.",
      readTime: "4 min read",
      author: "AP Civil Supplies Corporation & Agriculture Dept",
      downloadUrl: "https://ap.gov.in/"
    },
    {
      id: "r_rice_4",
      cropTag: "rice",
      category: "videos",
      title: "System of Rice Intensification (SRI) High-Yield Video Tutorial",
      type: "Video Guide",
      size: "HD Video",
      desc: "Visual video demonstration of single seedling transplantation, organic weeding, and 30% yield enhancement.",
      readTime: "14 mins video",
      author: "National Biodiversity Board & KVK",
      downloadUrl: "#"
    },

    // Chilli Resources
    {
      id: "r_chilli_1",
      cropTag: "chilli",
      category: "guides",
      title: "Chilli Black Thrips & Leaf Curl Virus Management Protocol",
      type: "Field Manual",
      size: "1.8 MB",
      desc: "Proven biological control strategies, blue sticky trap placement, and biopesticide spraying schedules for Chilli crops.",
      readTime: "6 min read",
      author: "AP Horticulture Department, Guntur",
      downloadUrl: "#"
    },
    {
      id: "r_chilli_2",
      cropTag: "chilli",
      category: "guides",
      title: "Guntur Red Chilli Harvest & Agmark Export Quality Guidelines",
      type: "PDF Guide",
      size: "2.4 MB",
      desc: "Sun-drying techniques, moisture testing, Teja & Sannam variety classification and export quality standards.",
      readTime: "8 min read",
      author: "Spices Board India, Ministry of Commerce",
      downloadUrl: "#"
    },

    // Tomato Resources
    {
      id: "r_tomato_1",
      cropTag: "tomato",
      category: "guides",
      title: "Comprehensive Tomato Crop Protection & Organic Care Manual",
      type: "PDF Guide",
      size: "2.4 MB",
      desc: "Complete step-by-step identification, fungal control, and organic neem oil dosage charts for Tomato farming.",
      readTime: "8 min read",
      author: "ICAR Krishi Vigyan Kendra, Guntur",
      downloadUrl: "#"
    },
    {
      id: "r_tomato_2",
      cropTag: "tomato",
      category: "guides",
      title: "Tomato Staking, Drip Irrigation & Yield Optimization Guide",
      type: "Field Manual",
      size: "2.1 MB",
      desc: "Trellising methods, fertigation schedules, and fruit borer organic control for high quality tomato yield.",
      readTime: "7 min read",
      author: "IIHR Bengaluru Horticulture Board",
      downloadUrl: "#"
    },

    // Cotton Resources
    {
      id: "r_cotton_1",
      cropTag: "cotton",
      category: "guides",
      title: "Bt-Cotton Pink Bollworm Integrated Pest Management Protocol",
      type: "PDF Guide",
      size: "2.8 MB",
      desc: "Pheromone trap placement, ETL thresholds, neem bio-spray schedule, and crop refuge planting guidelines.",
      readTime: "9 min read",
      author: "Central Institute for Cotton Research (CICR), Nagpur",
      downloadUrl: "#"
    },

    // Maize Resources
    {
      id: "r_maize_1",
      cropTag: "maize",
      category: "guides",
      title: "Fall Armyworm (FAW) Organic Control in Maize Crops",
      type: "PDF Guide",
      size: "1.7 MB",
      desc: "Early whorl scouting, Metarhizium bio-fungicide control, and recommended organic spray schedules.",
      readTime: "5 min read",
      author: "ICAR Indian Institute of Maize Research",
      downloadUrl: "#"
    },

    // Schemes & Forms
    {
      id: "r_scheme_1",
      cropTag: "schemes",
      category: "schemes",
      title: "PM-Kisan Samman Nidhi Scheme Application Form & Instructions",
      type: "Govt Form",
      size: "1.2 MB",
      desc: "Official application document and land record registration guidelines for ₹6,000 annual direct benefit transfer.",
      readTime: "4 min read",
      author: "Ministry of Agriculture & Farmers Welfare",
      downloadUrl: "#"
    },
    {
      id: "r_scheme_2",
      cropTag: "schemes",
      category: "schemes",
      title: "Kisan Credit Card (KCC) 4% Subsidized Crop Loan Application",
      type: "Bank Form",
      size: "950 KB",
      desc: "How to apply for low-interest short-term crop loans up to ₹3 Lakhs through NABARD and regional rural banks.",
      readTime: "5 min read",
      author: "NABARD Agri Banking Division",
      downloadUrl: "#"
    },
    {
      id: "r_storage_1",
      cropTag: "schemes",
      category: "guides",
      title: "Cold Storage Preservation & Humidity Control Manual",
      type: "PDF Guide",
      size: "3.1 MB",
      desc: "Ideal humidity and temperature storage conditions for Tomatoes, Chillies, Rice, Onions, and Mangoes to extend shelf life.",
      readTime: "10 min read",
      author: "National Cold Chain Development Board",
      downloadUrl: "#"
    }
  ];

  const cropFilterPills = [
    { id: "all", label: "All Crops", icon: Sprout },
    { id: "rice", label: "Rice / Paddy 🌾", icon: Sprout },
    { id: "chilli", label: "Chilli 🌶️", icon: Sprout },
    { id: "tomato", label: "Tomato 🍅", icon: Sprout },
    { id: "cotton", label: "Cotton ☁️", icon: Sprout },
    { id: "maize", label: "Maize 🌽", icon: Sprout },
    { id: "schemes", label: "Govt Schemes 🏛️", icon: Download }
  ];

  const filteredResources = resourceItems.filter((r) => {
    const matchesCategory = activeCategory === "all" || r.category === activeCategory;
    
    // Crop Filter Logic
    const matchesCrop = selectedCrop === "all" || 
      r.cropTag === selectedCrop || 
      r.title.toLowerCase().includes(selectedCrop.toLowerCase()) || 
      r.desc.toLowerCase().includes(selectedCrop.toLowerCase());

    // Search Query Logic
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = q === "" || 
      r.title.toLowerCase().includes(q) || 
      r.desc.toLowerCase().includes(q) || 
      r.author.toLowerCase().includes(q);

    return matchesCategory && matchesCrop && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto font-sans text-gray-900">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1B4D3E] via-[#2E7D32] to-[#12382c] p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-500/30">
        <div>
          <span className="text-amber-300 font-bold text-[10px] uppercase tracking-wider bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/30">
            Official Knowledge Hub & Learning Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-black flex items-center space-x-2.5 mt-2">
            <BookOpen className="w-7 h-7 text-amber-300" />
            <span>Agriculture Resources & Guides</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl">
            Access ICAR farming manuals, video tutorials, dosage calculators, government scheme forms, and direct PDF downloads.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <a
            href="tel:+918977520059"
            onClick={(e) => {
              e.preventDefault();
              triggerPhoneCall("+918977520059");
            }}
            className="px-4 py-3 bg-amber-400 hover:bg-amber-300 text-gray-900 rounded-2xl font-extrabold text-xs flex items-center space-x-2 shadow-md transition cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Call Agronomist</span>
          </a>
          <a
            href="https://wa.me/918977520059"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-extrabold text-xs flex items-center space-x-2 shadow-md transition cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {[
              { id: "all", label: "All Resources", icon: BookOpen },
              { id: "guides", label: "Crop Guides & Manuals", icon: FileText },
              { id: "calculator", label: "Fertilizer Calculator", icon: Calculator },
              { id: "videos", label: "Video Tutorials", icon: Video },
              { id: "schemes", label: "Govt Forms & Downloads", icon: Download }
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#2E7D32] text-white shadow-sm ring-2 ring-emerald-600/20"
                      : "bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 'Rice', 'Chilli', 'PM-Kisan'..."
              className="w-full bg-gray-50 border border-gray-300 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-900"
            />
            <Search className="w-4 h-4 text-emerald-700 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Live Crop Specific Filter Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1 text-xs">
          <span className="font-extrabold text-gray-700 uppercase tracking-wider text-[10px] flex items-center space-x-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filter by Crop:</span>
          </span>

          {cropFilterPills.map((pill) => {
            const isSelected = selectedCrop === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setSelectedCrop(pill.id)}
                className={`px-3.5 py-1.5 rounded-full font-extrabold text-xs transition whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-amber-400 text-gray-900 shadow-sm border border-amber-500"
                    : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* FERTILIZER CALCULATOR MODULE */}
      {(activeCategory === "all" || activeCategory === "calculator") && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center font-bold shadow-xs">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Interactive Tool</span>
              <h3 className="text-lg font-extrabold text-gray-900">Crop Fertilizer & Bio-Spray Dosage Calculator</h3>
            </div>
          </div>

          <form onSubmit={calculateFertilizer} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Select Crop Name</label>
              <input
                type="text"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                placeholder="Type crop name (e.g. Rice, Tomato, Chilli...)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Farm Land Size (Acres)</label>
              <input
                type="number"
                step="0.5"
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-white text-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              className="py-2.5 bg-[#2E7D32] hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Calculate Required Dosage</span>
            </button>
          </form>

          {calculatedDosage && (
            <div className="bg-white p-4 rounded-2xl border border-emerald-300 shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Recommended Organic & NPK Plan</span>
              <pre className="text-xs font-bold text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                {calculatedDosage}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* RESOURCE ITEMS GRID */}
      {filteredResources.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto" />
          <h4 className="text-base font-extrabold text-gray-900">No Resources Found</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto font-medium">
            No document matching "{searchQuery || selectedCrop}" is available. Try selecting "All Crops" or searching "Rice", "Chilli", "Tomato".
          </p>
          <button
            onClick={() => { setSelectedCrop("all"); setSearchQuery(""); setActiveCategory("all"); }}
            className="px-4 py-2 bg-[#2E7D32] text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:shadow-lg transition space-y-4 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md uppercase border border-emerald-200">
                    {item.type} ({item.size})
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400">{item.readTime}</span>
                </div>

                <h4 className="text-base font-extrabold text-gray-900 group-hover:text-[#2E7D32] transition leading-snug mb-2">
                  {item.title}
                </h4>
                
                <p className="text-xs text-gray-600 font-medium leading-relaxed mb-3">
                  {item.desc}
                </p>

                <p className="text-[11px] text-gray-400 font-bold">Source: {item.author}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center space-x-2">
                <button
                  onClick={() => downloadAgriResourcePDF(item.title, item.author, item.desc, item.cropTag)}
                  className="flex-1 py-2.5 bg-[#2E7D32] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-xs transition cursor-pointer"
                  title="Download PDF Document"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Download Resource</span>
                </button>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center transition cursor-pointer"
                  title="Ask Expert on WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
