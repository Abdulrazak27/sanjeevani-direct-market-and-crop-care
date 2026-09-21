import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { ArrowLeft, Calendar, ShieldCheck, Sprout, Sparkles, CheckCircle2, User, AlertCircle } from "lucide-react";
import { getSharedDiagnoses, SharedCropDiagnosis } from "../services/sharedStore";

export const DiagnosisHistory: React.FC = () => {
  const { setScreen, setActiveTab, t } = useApp();
  const [historyRecords, setHistoryRecords] = useState<SharedCropDiagnosis[]>(() => getSharedDiagnoses());

  useEffect(() => {
    const handleUpdate = () => {
      setHistoryRecords(getSharedDiagnoses());
    };
    window.addEventListener("sanjeevani_storage_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("sanjeevani_storage_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 font-sans">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-emerald-100">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setScreen("main")}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-gray-700 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t("history")}</h1>
            <p className="text-xs text-gray-500">Past AI crop scanning records & treatment guidance</p>
          </div>
        </div>

        <button
          onClick={() => {
            setScreen("main");
            setActiveTab("crop");
          }}
          className="bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1 hover:bg-emerald-700 cursor-pointer transition"
        >
          <Sprout className="w-4 h-4" />
          <span>New Scan</span>
        </button>
      </div>

      {historyRecords.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center space-y-3">
          <Sprout className="w-12 h-12 text-emerald-600 mx-auto" />
          <p className="text-gray-600 text-sm font-semibold">No crop diagnoses recorded yet.</p>
          <button
            onClick={() => {
              setScreen("main");
              setActiveTab("crop");
            }}
            className="text-xs bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-800 transition"
          >
            Scan Your First Crop Leaf
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {historyRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={rec.image}
                    alt={rec.crop}
                    className="w-16 h-16 rounded-xl object-cover border border-emerald-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-gray-900 text-base">{rec.crop}</h3>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        rec.severity === "severe" ? "bg-red-50 text-red-700 border-red-200" :
                        rec.severity === "healthy" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {rec.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center space-x-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{rec.date}</span>
                      <span className="text-gray-300">•</span>
                      <span>{rec.location}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-emerald-50 font-mono text-emerald-800 font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                    {(rec.confidence * 100).toFixed(0)}% AI Match
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 ${
                    rec.status === "Agronomist Verified"
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      : rec.status === "Reviewed"
                      ? "bg-blue-100 text-blue-900 border border-blue-200"
                      : "bg-amber-100 text-amber-900 border border-amber-200"
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{rec.status}</span>
                  </span>
                </div>
              </div>

              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pathology Finding</span>
                  </span>
                  <span className="text-xs text-amber-800 font-semibold">{rec.condition}</span>
                </div>
                {rec.agronomistNotes && (
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-300 text-xs text-emerald-900 font-medium">
                    <span className="font-bold">Agronomist Note:</span> {rec.agronomistNotes}
                  </div>
                )}
              </div>

              {rec.treatment && rec.treatment.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    {t("treatment_steps")}
                  </h4>
                  <ul className="space-y-1">
                    {rec.treatment.map((step, sIdx) => (
                      <li key={sIdx} className="text-xs text-gray-600 flex items-start space-x-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
