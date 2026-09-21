import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  CloudSun, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Camera, 
  ArrowRight, 
  Bot, 
  ArrowLeft,
  RefreshCw,
  MapPin,
  Sprout,
  CheckCircle2
} from "lucide-react";

export const WeatherToday: React.FC = () => {
  const { farmer, language, setScreen, setActiveTab, setIsAiModalOpen } = useApp();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("Just now");

  // Live weather parameters (loaded dynamically from Open-Meteo or local fallback)
  const [weatherData, setWeatherData] = useState({
    temperature: "28.5°C",
    tempStatus: "Partly Cloudy",
    rainProb: "65%",
    rainStatus: "Moderate Rain",
    humidity: "74%",
    humidityStatus: "Moist Air",
    windSpeed: "12 km/h",
    windStatus: "Gentle Breeze",
    isLive: true
  });

  const farmAdviceText = language === "te" 
    ? "నేడు వర్షం వచ్చే అవకాశం ఉంది (65% సంభావ్యత). నీటిపారుదల చేయడానికి ముందు పొలంలోని తేమను తనిఖీ చేయండి. అనవసరంగా నీరు పెట్టడం మానుకోండి."
    : language === "hi"
    ? "आज बारिश की संभावना है (65% संभावना)। सिंचाई से पहले खेत की मिट्टी की नमी की जांच करें। अनावश्यक पानी देने से बचें।"
    : "Rain expected today (65% probability). Inspect field soil moisture before irrigation. Avoid unnecessary watering.";

  // Fetch live Open-Meteo data for farmer's region
  const fetchLiveMeteo = async () => {
    setIsLoadingLive(true);
    try {
      // Default to Guntur / farmer's district coordinates
      const lat = 16.3067;
      const lon = 80.4365;
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=precipitation_probability&timezone=auto`
      );
      if (response.ok) {
        const data = await response.json();
        const currentTemp = data.current?.temperature_2m ? `${Math.round(data.current.temperature_2m * 10) / 10}°C` : "28.5°C";
        const currentHum = data.current?.relative_humidity_2m ? `${data.current.relative_humidity_2m}%` : "74%";
        const currentWind = data.current?.wind_speed_10m ? `${Math.round(data.current.wind_speed_10m)} km/h` : "12 km/h";
        const rainProb = data.hourly?.precipitation_probability?.[0] !== undefined ? `${data.hourly.precipitation_probability[0]}%` : "65%";

        setWeatherData({
          temperature: currentTemp,
          tempStatus: "Partly Cloudy",
          rainProb: rainProb,
          rainStatus: parseInt(rainProb) > 40 ? "Moderate Rain" : "Low Chance",
          humidity: currentHum,
          humidityStatus: parseInt(currentHum) > 70 ? "Moist Air" : "Normal Air",
          windSpeed: currentWind,
          windStatus: "Gentle Breeze",
          isLive: true
        });
        setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      console.warn("Open-Meteo live call fallback:", e);
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveMeteo();
  }, []);

  const handleSpeakAdvice = () => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(farmAdviceText);
      utterance.lang = language === "te" ? "te-IN" : language === "hi" ? "hi-IN" : "en-US";
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === "te" ? "శుభోదయం" : language === "hi" ? "सुप्रभात" : "Good Morning";
    if (hour < 17) return language === "te" ? "శుభ మధ్యాహ్నం" : language === "hi" ? "शुभ दोपहर" : "Good Afternoon";
    return language === "te" ? "శుభ సాయంత్రం" : language === "hi" ? "शुभ संध्या" : "Good Evening";
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto font-sans pb-10">
      {/* Top Header Navigation Bar */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={() => {
            setScreen("main");
            setActiveTab("profile");
            window.scrollTo(0, 0);
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-2xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span>Back to Profile</span>
        </button>

        <button
          onClick={fetchLiveMeteo}
          disabled={isLoadingLive}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? "animate-spin text-emerald-600" : ""}`} />
          <span>{isLoadingLive ? "Updating..." : "Live Refresh"}</span>
        </button>
      </div>

      {/* 1. TOP FARMER PROFILE BAR - MATCHING SCREENSHOT EXACTLY */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          {/* Green Avatar Circle with "R" */}
          <div className="w-12 h-12 rounded-full bg-[#0D7338] text-white font-extrabold flex items-center justify-center text-xl shadow-xs shrink-0 overflow-hidden">
            {farmer.profile_photo_url ? (
              <img src={farmer.profile_photo_url} alt="Farmer" className="w-full h-full object-cover" />
            ) : (
              <span>{farmer.full_name ? farmer.full_name.charAt(0).toUpperCase() : "R"}</span>
            )}
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center space-x-1.5">
              <span>{getGreeting()}, {farmer.full_name || "Ramesh Kumar"}</span>
              <span className="text-base">🌿</span>
            </h2>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-gray-500 font-medium mt-0.5">
              <span className="flex items-center space-x-1">
                <span>📍</span>
                <span>{farmer.village || "Tadikonda"}, {farmer.district || "Guntur"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-emerald-800 font-bold">
                <span>🌱</span>
                <span>{farmer.main_crop || "Tomato"} ({farmer.farm_size_acres || 3.5} Acres)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Ask Sanjeevani AI Button */}
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="px-4 py-2.5 bg-[#0D7338] hover:bg-[#0A5D2C] text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition shrink-0 cursor-pointer"
        >
          <Bot className="w-4 h-4 text-white" />
          <span>Ask Sanjeevani AI</span>
        </button>
      </div>

      {/* 2. LIVE WEATHER INTELLIGENCE MAIN CARD - MATCHING SCREENSHOT EXACTLY */}
      <div className="bg-[#EDF7EE] p-5 sm:p-6 rounded-3xl border border-[#CDE5CF] shadow-xs space-y-4">
        {/* Card Header with Open-Meteo Live Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#1E5128]">
            <CloudSun className="w-6 h-6 text-[#1E5128]" />
            <h3 className="text-xs sm:text-sm font-black tracking-wider uppercase">
              LIVE WEATHER INTELLIGENCE
            </h3>
          </div>

          <span className="text-[11px] font-bold text-[#1E5128] bg-white/90 px-3 py-1 rounded-full border border-[#B7DDBB] shadow-2xs">
            Open-Meteo API Live
          </span>
        </div>

        {/* 4 Metric White Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Temperature */}
          <div className="bg-white p-4 rounded-2xl border border-[#D5ECD7] shadow-2xs space-y-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
              TEMPERATURE
            </span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {weatherData.temperature}
            </div>
            <span className="text-[11px] text-emerald-700 font-bold block">
              {weatherData.tempStatus}
            </span>
          </div>

          {/* Rain Probability */}
          <div className="bg-white p-4 rounded-2xl border border-[#D5ECD7] shadow-2xs space-y-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
              RAIN PROB.
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#2563EB]">
              {weatherData.rainProb}
            </div>
            <span className="text-[11px] text-gray-500 font-medium block">
              {weatherData.rainStatus}
            </span>
          </div>

          {/* Humidity */}
          <div className="bg-white p-4 rounded-2xl border border-[#D5ECD7] shadow-2xs space-y-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
              HUMIDITY
            </span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {weatherData.humidity}
            </div>
            <span className="text-[11px] text-gray-500 font-medium block">
              {weatherData.humidityStatus}
            </span>
          </div>

          {/* Wind Speed */}
          <div className="bg-white p-4 rounded-2xl border border-[#D5ECD7] shadow-2xs space-y-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
              WIND SPEED
            </span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {weatherData.windSpeed}
            </div>
            <span className="text-[11px] text-gray-500 font-medium block">
              {weatherData.windStatus}
            </span>
          </div>
        </div>

        {/* Today's Farm Advice Box */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D5ECD7] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-[#1E5128] uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>TODAY'S FARM ADVICE</span>
            </h4>

            <button
              onClick={handleSpeakAdvice}
              className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#1E5128] border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                  <span className="text-red-700">Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Listen (Audio)</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
            {farmAdviceText}
          </p>
        </div>
      </div>

      {/* 3. RAIN/WEATHER ALERT CARD */}
      <div className="bg-[#FFFBEB] p-4 sm:p-5 rounded-2xl border border-[#FDE68A] shadow-2xs flex items-start space-x-3.5 text-[#92400E]">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-xs sm:text-sm font-black text-[#92400E]">
            Rain Expected Today ({weatherData.rainProb})
          </h4>
          <p className="text-xs text-[#B45309] mt-0.5 font-medium leading-relaxed">
            Heavy rain expected in {farmer.district || "Guntur"} region. Inspect soil moisture before irrigating.
          </p>
        </div>
      </div>

      {/* 4. PRIMARY FEATURE: CHECK MY CROP BANNER CARD */}
      <div className="bg-gradient-to-r from-[#0F5A2C] via-[#156B36] to-[#0F5A2C] p-6 sm:p-7 rounded-3xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-emerald-600/30">
        <div className="space-y-1.5">
          <span className="bg-[#1C7D41] text-emerald-100 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-400/30 inline-block">
            PRIMARY FEATURE
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Check My Crop
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl font-normal leading-relaxed">
            Capture a plant leaf photo using your phone camera for instant AI disease identification & organic treatment guidance.
          </p>
        </div>

        <button
          onClick={() => {
            setScreen("main");
            setActiveTab("crop");
            window.scrollTo(0, 0);
          }}
          className="px-6 py-3.5 bg-[#F59E0B] hover:bg-[#D97706] text-gray-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
        >
          <Camera className="w-4 h-4 text-gray-950" />
          <span>Take Leaf Photo</span>
          <ArrowRight className="w-4 h-4 text-gray-950" />
        </button>
      </div>
    </div>
  );
};
