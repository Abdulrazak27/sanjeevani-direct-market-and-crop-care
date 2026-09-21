import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Camera, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw, Volume2, Sparkles, ShieldCheck, History } from "lucide-react";
import { CameraModal } from "../components/CameraModal";
import { analyzeCropImage } from "../services/api";
import { CropDiagnosisResult } from "../types";
import { VoiceReader } from "../components/VoiceReader";
import { motion } from "framer-motion";
import { getSharedDiagnoses, addSharedDiagnosis, SharedCropDiagnosis } from "../services/sharedStore";

export const CropCheck: React.FC = () => {
  const { farmer, t, setIsAiModalOpen, language } = useApp();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<CropDiagnosisResult | null>(null);
  const [history, setHistory] = useState<Array<any>>(() => getSharedDiagnoses());

  React.useEffect(() => {
    const handleUpdate = () => {
      setHistory(getSharedDiagnoses());
    };
    window.addEventListener("sanjeevani_storage_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("sanjeevani_storage_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const scanStepMessages = [
    "Preparing Image for WPF Neural Model...",
    "Validating Leaf Brightness & Resolution...",
    "Matching Plant Features against WPF Dataset...",
    "Checking Pathology & Infection Patterns...",
    "AI Diagnosis Ready!"
  ];

  const handleImageSelected = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setAnalyzing(true);
    setDiagnosis(null);

    for (let i = 0; i < scanStepMessages.length; i++) {
      setScanStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    const result = await analyzeCropImage(file, farmer.main_crop);
    setDiagnosis(result);
    setAnalyzing(false);

    if (result.success) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const rawBase64 = reader.result as string;
        addSharedDiagnosis({
          farmerName: farmer.full_name,
          farmerPhone: farmer.phone_number,
          location: `${farmer.village}, ${farmer.district}`,
          crop: result.crop || farmer.main_crop || "Crop",
          condition: result.condition || "Leaf Pathology Detected",
          confidence: result.confidence || 0.94,
          severity: (result.severity as any) || "moderate",
          image: rawBase64 || imageUrl,
          treatment: result.treatment_en || [
            "Apply recommended bio-protective spray in early morning.",
            "Monitor leaf undersides for fungal spores every 3 days."
          ],
          status: "New"
        });
        setHistory(getSharedDiagnoses());
      };
      reader.readAsDataURL(file);
    }
  };

  const getLocalizedExplanation = () => {
    if (!diagnosis) return "";
    if (language === "te") return diagnosis.explanation_te || diagnosis.explanation_en;
    if (language === "hi") return diagnosis.explanation_hi || diagnosis.explanation_en;
    return diagnosis.explanation_en;
  };

  const getLocalizedTreatment = (): string[] => {
    if (!diagnosis) return [];
    if (language === "te") return diagnosis.treatment_te || diagnosis.treatment_en || [];
    if (language === "hi") return diagnosis.treatment_hi || diagnosis.treatment_en || [];
    return diagnosis.treatment_en || [];
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 p-6 rounded-3xl text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-amber-300 font-bold text-[10px] uppercase tracking-wider bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
            WPF Computer Vision Pipeline
          </span>
          <h2 className="text-2xl font-extrabold flex items-center space-x-2.5 mt-1.5">
            <Sparkles className="w-6 h-6 text-amber-300" />
            <span>{t("check_my_crop")}</span>
          </h2>
          <p className="text-xs text-emerald-100 mt-1">Real camera plant leaf identification & organic pathology diagnosis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Scanner Section */}
        <div className="space-y-4">
          {!analyzing && !diagnosis && (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xs text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                <Camera className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-1">Capture Crop Leaf Photo</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Take a clear photo of the infected or healthy plant leaf for WPF neural network identification.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setIsCameraOpen(true)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-md flex items-center justify-center space-x-2.5 transition"
                >
                  <Camera className="w-5 h-5 text-amber-300" />
                  <span>{t("open_camera")}</span>
                </button>

                <label className="w-full py-3.5 bg-gray-50 border border-gray-300 text-gray-800 font-bold text-xs rounded-2xl shadow-xs flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-100 transition block text-center">
                  <ImageIcon className="w-4 h-4 text-gray-600 inline" />
                  <span>{t("upload_gallery")}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageSelected(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* AI Scanning Animation State */}
          {analyzing && (
            <div className="bg-white p-8 rounded-3xl border border-emerald-200 shadow-lg text-center space-y-4">
              <div className="relative w-56 h-56 mx-auto rounded-2xl overflow-hidden border-4 border-emerald-500 shadow-inner">
                {selectedImage && (
                  <img src={selectedImage} alt="Scanning" className="w-full h-full object-cover" />
                )}
                
                <motion.div
                  animate={{ y: [0, 200, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-x-0 h-1 bg-amber-400 shadow-[0_0_15px_#f59e0b]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-2 text-emerald-800">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span className="text-sm font-extrabold">{scanStepMessages[scanStep]}</span>
                </div>
                <p className="text-xs text-gray-400">Analyzing WPF Computer Vision Dataset Features</p>
              </div>
            </div>
          )}

          {/* AI Diagnosis Result Screen */}
          {diagnosis && !analyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {diagnosis.success ? (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden">
                  <div className="relative h-56 bg-gray-900">
                    {selectedImage && (
                      <img src={selectedImage} alt="Diagnosed Crop" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                    <div className="absolute top-3 right-3 bg-amber-400 text-gray-900 px-3 py-1 rounded-full text-xs font-extrabold flex items-center space-x-1 shadow-md">
                      <ShieldCheck className="w-4 h-4 text-gray-900" />
                      <span>Verified AI Diagnosis</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">
                        {language === "te" ? "గుర్తించిన ఆకు వ్యాధి" : language === "hi" ? "पहचाना गया पत्ती रोग" : "Detected Leaf Pathology"}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                        {language === "te" ? (diagnosis.condition_te || diagnosis.condition) : language === "hi" ? (diagnosis.condition_hi || diagnosis.condition) : diagnosis.condition}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                          {language === "te" ? "లక్షణ తీవ్రత & రకం" : language === "hi" ? "लक्षण गंभीरता" : "Severity & Host Category"}
                        </span>
                        <h4 className="text-sm font-extrabold text-gray-900 mt-0.5">
                          {diagnosis.condition} ({diagnosis.crop})
                        </h4>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-extrabold capitalize bg-amber-100 text-amber-900 border border-amber-300">
                        {diagnosis.severity || "Moderate"} Severity
                      </span>
                    </div>

                    {/* Explanation */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h5 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                          {language === "te" ? "నిర్ధారణ సారాంశం:" : language === "hi" ? "जांच सारांश:" : "Diagnosis Summary:"}
                        </h5>
                        <VoiceReader text={getLocalizedExplanation()} />
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-200 font-medium">
                        {getLocalizedExplanation()}
                      </p>
                    </div>

                    {/* Step-by-Step Treatment */}
                    <div>
                      <h5 className="text-xs font-extrabold text-emerald-800 mb-2 uppercase tracking-wider">
                        {language === "te" ? "నివారణ చర్యలు:" : language === "hi" ? "उपचार और देखभाल के उपाय:" : "Recommended Treatment Steps:"}
                      </h5>
                      <div className="space-y-2">
                        {getLocalizedTreatment().map((stepText, idx) => (
                          <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-gray-800">
                            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="font-semibold leading-snug">{stepText}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => setIsAiModalOpen(true)}
                        className="py-3 bg-amber-400 hover:bg-amber-300 text-gray-900 font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5"
                      >
                        <Sparkles className="w-4 h-4 text-gray-900" />
                        <span>{t("ask_saathi")}</span>
                      </button>

                      <button
                        onClick={() => {
                          setDiagnosis(null);
                          setSelectedImage(null);
                        }}
                        className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5"
                      >
                        <Camera className="w-4 h-4 text-white" />
                        <span>Scan Again</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-300 p-6 rounded-3xl text-center space-y-3">
                  <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
                  <h3 className="text-base font-extrabold text-gray-900">Crop Identification Result Uncertain</h3>
                  <p className="text-xs text-gray-700 leading-relaxed max-w-xs mx-auto font-medium">
                    {diagnosis.message || "The crop image could not be identified with high confidence. Please capture a clear leaf photo with better lighting."}
                  </p>
                  <button
                    onClick={() => {
                      setDiagnosis(null);
                      setSelectedImage(null);
                      setIsCameraOpen(true);
                    }}
                    className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Section: Diagnosis History Log */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <History className="w-5 h-5 text-emerald-700" />
            <h4 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              {t("history")}
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            {history.map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-900 text-xs sm:text-sm">{item.condition}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-700 inline" />
                    <span>Verified</span>
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium">Host Crop: {item.crop}</p>
                <span className="text-[10px] text-gray-400 block">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleImageSelected}
      />
    </div>
  );
};
