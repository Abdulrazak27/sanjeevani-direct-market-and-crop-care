import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Language } from "../types";
import { upsertSharedFarmer, addSharedAuditLog } from "../services/sharedStore";
import { 
  Sprout, 
  ShoppingBag, 
  Warehouse, 
  Truck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Globe, 
  ShieldCheck, 
  Leaf, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2,
  Sparkles
} from "lucide-react";

export const Auth: React.FC = () => {
  const { setScreen, farmer, setFarmer, language, setLanguage, setIsAdminAuthenticated, setIsAuthenticated } = useApp();

  // Mode: login or register
  const [mode, setMode] = useState<"login" | "register">("login");

  // Selected Role
  const [selectedRole, setSelectedRole] = useState<"farmer" | "buyer" | "storage" | "transport">(
    (farmer.user_role as any) || "farmer"
  );

  // Authentication method: password or otp
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");

  // Input States
  const [identifier, setIdentifier] = useState("9876543210");
  const [password, setPassword] = useState("sanjeevani2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Flow States
  const [step, setStep] = useState<"input" | "otp">("input");
  const [otp, setOtp] = useState(["1", "2", "3", "4", "5", "6"]);
  const [timer, setTimer] = useState(28);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: any;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const roleConfigs = [
    {
      id: "farmer",
      title: "Farmer",
      sub: "రైతు / किसान",
      icon: Sprout,
      badge: "Crop Care & Selling",
      activeBg: "bg-[#23451B] text-white border-[#23451B]"
    },
    {
      id: "buyer",
      title: "Crop Buyer",
      sub: "కొనుగోలుదారు / खरीददार",
      icon: ShoppingBag,
      badge: "Procurement Hub",
      activeBg: "bg-amber-700 text-white border-amber-700"
    },
    {
      id: "storage",
      title: "Cold Storage",
      sub: "కోల్డ్ స్టోరేజ్ / भंडारण",
      icon: Warehouse,
      badge: "Space Hire",
      activeBg: "bg-teal-700 text-white border-teal-700"
    },
    {
      id: "transport",
      title: "Transport",
      sub: "రవాణా / परिवहन",
      icon: Truck,
      badge: "Agri Logistics",
      activeBg: "bg-emerald-700 text-white border-emerald-700"
    }
  ];

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter your Email or Phone Number.");
      return;
    }
    setError("");

    if (authMethod === "otp" && step === "input") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep("otp");
        setTimer(28);
      }, 600);
      return;
    }

    setLoading(true);

    // Update global user context with selected role
    const updatedPhone = identifier.includes("@") ? farmer.phone_number : `+91 ${identifier.replace(/\D/g, "")}`;
    setFarmer((prev) => ({
      ...prev,
      user_role: selectedRole,
      phone_number: updatedPhone
    }));

    // Register / update in shared store for master admin view
    upsertSharedFarmer({
      name: farmer.full_name || (mode === "register" ? "New Farmer" : "Registered User"),
      phone: updatedPhone,
      village: farmer.village || "Guntur Region",
      district: farmer.district || "Guntur",
      state: farmer.state || "Andhra Pradesh",
      mainCrop: farmer.main_crop || "Tomato",
      farmSizeAcres: farmer.farm_size_acres || 3.0,
      verificationStatus: mode === "register" ? "Pending Verification" : "Verified",
      accountStatus: "Active"
    });

    addSharedAuditLog({
      userName: farmer.full_name || updatedPhone,
      userId: "USER_AUTH",
      userRole: "FARMER",
      module: "User",
      action: mode === "register" ? `New Farmer Registered via ${authMethod.toUpperCase()}` : `Farmer Authenticated (${authMethod.toUpperCase()})`,
      recordId: updatedPhone,
      prevValue: "Logged Out",
      newValue: `Active Session (${selectedRole.toUpperCase()})`,
      status: "Success"
    });

    setIsAuthenticated(true);
    localStorage.setItem("sanjeevani_authenticated", "true");

    setTimeout(() => {
      setLoading(false);
      if (mode === "register") {
        setScreen("profile_setup");
      } else {
        setScreen("landing");
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 700);
  };

  const handleOtpChange = (val: string, index: number) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-4 px-3 md:py-8 md:px-6 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200/80 grid grid-cols-1 lg:grid-cols-2 overflow-hidden my-auto">
        
        {/* LEFT PANEL: High Quality Agricultural Visual Card */}
        <div className="relative bg-[#1A3815] text-white min-h-[420px] lg:min-h-[650px] flex flex-col justify-between p-6 md:p-10 lg:p-12 overflow-hidden">
          {/* Background Image with Gradient Overlays */}
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
            alt="Agri Farmland Landscape"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-emerald-950/85" />

          {/* Top Leaf Icon Pill */}
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-emerald-100/90 text-emerald-800 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/40">
              <Sprout className="w-6 h-6" />
            </div>
          </div>

          {/* Center Main Headlines */}
          <div className="relative z-10 my-auto py-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              Growing a<br />better tomorrow
            </h1>
            <div className="w-14 h-1 bg-[#568235] my-4 rounded-full" />
            <p className="text-xs sm:text-sm lg:text-base text-stone-100 font-medium max-w-md leading-relaxed drop-shadow">
              Smart solutions for modern farming. Manage, Monitor and Maximize your yield with technology.
            </p>
          </div>

          {/* Bottom Translucent Stats Badges */}
          <div className="relative z-10 grid grid-cols-3 gap-2.5 pt-4">
            <div className="bg-black/25 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center shadow-lg hover:bg-black/35 transition">
              <Leaf className="w-5 h-5 mx-auto text-emerald-300 mb-1" />
              <div className="text-[11px] font-extrabold text-white leading-tight">Smart Farming</div>
              <div className="text-[9px] text-stone-200 mt-0.5 font-medium">Data driven decisions</div>
            </div>

            <div className="bg-black/25 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center shadow-lg hover:bg-black/35 transition">
              <Sprout className="w-5 h-5 mx-auto text-amber-300 mb-1" />
              <div className="text-[11px] font-extrabold text-white leading-tight">Crop Health</div>
              <div className="text-[9px] text-stone-200 mt-0.5 font-medium">Monitor & protect crops</div>
            </div>

            <div className="bg-black/25 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center shadow-lg hover:bg-black/35 transition">
              <TrendingUp className="w-5 h-5 mx-auto text-teal-300 mb-1" />
              <div className="text-[11px] font-extrabold text-white leading-tight">Better Yield</div>
              <div className="text-[9px] text-stone-200 mt-0.5 font-medium">Increase productivity</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Authentication Form & Role Selector */}
        <div className="bg-[#FAF9F6] p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-y-auto">
          
          {/* Top Bar: Language Dropdown Selector */}
          <div className="flex justify-end mb-2">
            <div className="relative inline-flex items-center space-x-1.5 bg-white border border-stone-200 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700 shadow-sm hover:border-emerald-600 transition cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs font-bold text-stone-800 outline-none cursor-pointer pr-1"
              >
                <option value="en">English 🇬🇧</option>
                <option value="te">తెలుగు 🇮🇳</option>
                <option value="hi">हिंदी 🇮🇳</option>
              </select>
            </div>
          </div>

          <div>
            {/* Logo & Brand Header */}
            <div className="text-center mb-5">
              <img 
                src="/logo.png" 
                alt="Sanjeevani Logo" 
                className="w-16 h-16 object-contain mx-auto mb-2 drop-shadow-md" 
              />
              <h2 className="text-2xl font-serif font-extrabold text-[#1E3E17] tracking-tight">
                Sanjeevani
              </h2>
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest mt-0.5">
                Connect. Cultivate. Thrive.
              </p>
              <div className="w-8 h-1 bg-[#568235] mx-auto my-2.5 rounded-full" />

              <h3 className="text-xl font-extrabold text-stone-900 mt-3">
                {mode === "login" ? "Welcome Back!" : "Create New Account"}
              </h3>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                {mode === "login" ? "Login to continue your journey" : "Register to access specialized agri services & buyers"}
              </p>
            </div>

            {/* Login / Register Toggle Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-stone-200/75 p-1 rounded-2xl text-xs font-extrabold mb-4">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`py-2 rounded-xl transition ${
                  mode === "login"
                    ? "bg-white text-[#1E3E17] shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`py-2 rounded-xl transition ${
                  mode === "register"
                    ? "bg-white text-[#1E3E17] shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Register
              </button>
            </div>

            {/* Role Selection Grid (4 Distinct Roles) */}
            <div className="mb-5">
              <label className="block text-[11px] font-extrabold text-stone-700 uppercase tracking-wider mb-2">
                Select Your Category:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {roleConfigs.map((cfg) => {
                  const Icon = cfg.icon;
                  const isSelected = selectedRole === cfg.id;
                  return (
                    <button
                      key={cfg.id}
                      type="button"
                      onClick={() => setSelectedRole(cfg.id as any)}
                      className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? `${cfg.activeBg} shadow-md ring-2 ring-emerald-600/30`
                          : "bg-white text-stone-700 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1 ${isSelected ? "text-amber-300" : "text-[#23451B]"}`} />
                      <span className="text-xs font-extrabold block leading-tight">{cfg.title}</span>
                      <span className={`text-[9px] block mt-0.5 ${isSelected ? "text-stone-100" : "text-stone-400"}`}>
                        {cfg.sub.split("/")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Main Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {step === "input" ? (
                <>
                  {/* Email or Phone Input */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email or Phone Number
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-stone-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. 9876543210 or farmer@agri.com"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-2xl text-sm font-semibold text-stone-900 outline-none focus:border-[#23451B] focus:ring-2 focus:ring-emerald-200 shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Password or OTP Auth Method Toggle */}
                  {authMethod === "password" ? (
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 text-stone-400">
                          <Lock className="w-5 h-5" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-10 py-3 bg-white border border-stone-300 rounded-2xl text-sm font-semibold text-stone-900 outline-none focus:border-[#23451B] focus:ring-2 focus:ring-emerald-200 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 text-stone-400 hover:text-stone-700"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Remember me & Forgot password */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center space-x-2 text-stone-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-stone-300 text-[#23451B] focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setError("Password reset link sent to your registered contact.")}
                      className="font-bold text-[#23451B] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#23451B] hover:bg-[#1A3414] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition cursor-pointer mt-2 active:scale-96"
                  >
                    <span>
                      {loading
                        ? "Processing..."
                        : mode === "login"
                        ? "Login"
                        : "Register Account"}
                    </span>
                    <Sprout className="w-4 h-4 text-amber-300" />
                  </button>
                </>
              ) : (
                /* OTP Verification Step */
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs font-bold text-stone-700">Enter 6-digit OTP code sent to:</p>
                    <p className="text-sm font-extrabold text-[#23451B]">{identifier}</p>
                  </div>

                  <div className="flex justify-between space-x-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        className="w-10 h-12 text-center text-lg font-extrabold text-[#23451B] bg-white border-2 border-emerald-600/40 rounded-xl shadow-xs outline-none focus:border-[#23451B]"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#23451B] hover:bg-[#1A3414] text-white font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition cursor-pointer active:scale-96"
                  >
                    <span>{loading ? "Verifying..." : "Verify OTP & Continue"}</span>
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  </button>

                  <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                    <button
                      type="button"
                      disabled={timer > 0}
                      onClick={() => setTimer(28)}
                      className={`font-bold ${timer > 0 ? "text-stone-400" : "text-[#23451B] underline"}`}
                    >
                      Resend OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep("input")}
                      className="font-bold text-stone-500 hover:text-stone-800"
                    >
                      Change Number
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Alternative Login Method Buttons */}
            {step === "input" && (
              <div className="mt-4 pt-4 border-t border-stone-200/70 text-center space-y-2">
                <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-2">or</div>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod(authMethod === "password" ? "otp" : "password");
                    setError("");
                  }}
                  className="w-full py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs rounded-2xl shadow-xs flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>
                    {authMethod === "password"
                      ? "Continue with Phone / Email OTP"
                      : "Continue with Password"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFarmer((prev) => ({ ...prev, user_role: selectedRole }));
                    setScreen("profile_setup");
                  }}
                  className="w-full py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs rounded-2xl shadow-xs flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Security Badge */}
          <div className="mt-6 p-3.5 rounded-2xl bg-[#F2F5EF] border border-emerald-100 flex items-center space-x-3 text-xs text-stone-700 shadow-xs relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-[#23451B] text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="font-extrabold text-[#1E3E17]">Your data is secure with us</div>
              <div className="text-[10px] text-stone-500 font-medium leading-tight">
                We use advanced encryption to protect your information.
              </div>
            </div>
            <Sprout className="absolute -right-3 -bottom-3 w-14 h-14 text-emerald-800/10 pointer-events-none" />
          </div>

        </div>
      </div>
    </div>
  );
};
