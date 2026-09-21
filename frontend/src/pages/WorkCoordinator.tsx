import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Users, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  UserCheck, 
  PlusCircle, 
  ShieldCheck,
  Sparkles,
  MapPin,
  X
} from "lucide-react";
import { addSharedWorkerRequest, getSharedWorkerRequests } from "../services/sharedStore";

export const WorkCoordinator: React.FC = () => {
  const { farmer, language, t } = useApp();

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [workType, setWorkType] = useState("Harvesting");
  const [numWorkers, setNumWorkers] = useState("6");
  const [workDate, setWorkDate] = useState("Tomorrow");
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Available worker teams in Guntur region
  const availableWorkTeams = [
    {
      id: "w1",
      type: "Harvesting & Picking",
      type_te: "పంట కోత & ఎంపిక కూలీలు",
      type_hi: "कटाई और तुड़ाई मजदूर",
      workers_count: 8,
      status: "Available",
      status_te: "అందుబాటులో ఉంది",
      status_hi: "उपलब्ध",
      rate_per_day: 500,
      coordinator_contact: "+91 9876543210",
      description: "Trained in careful tomato & chilli crop harvesting, minimum bruising, grading at field."
    },
    {
      id: "w2",
      type: "Field Weeding & Cleaning",
      type_te: "కలుపు తీత & పొలం శుభ్రత",
      type_hi: "निराई और खेत सफाई",
      workers_count: 6,
      status: "Available",
      status_te: "అందుబాటులో ఉంది",
      status_hi: "उपलब्ध",
      rate_per_day: 450,
      coordinator_contact: "+91 9876543210",
      description: "Organic weed removal, bed maintenance, drip irrigation channel clearing."
    },
    {
      id: "w3",
      type: "Pesticide & Neem Oil Spraying",
      type_te: "మందు పిచికారీ నిపుణులు",
      type_hi: "कीटनाशक छिड़काव विशेषज्ञ",
      workers_count: 4,
      status: "Limited",
      status_te: "పరిమితం",
      status_hi: "सीमित",
      rate_per_day: 550,
      coordinator_contact: "+91 9876543210",
      description: "Equipped with battery & petrol knapsack sprayers, PPE safety kits."
    },
    {
      id: "w4",
      type: "Nursery Planting & Sowing",
      type_te: "నారు నాట్లు & విత్తనాలు నాటడం",
      type_hi: "पौध रोपाई और बुवाई",
      workers_count: 10,
      status: "Available",
      status_te: "అందుబాటులో ఉంది",
      status_hi: "उपलब्ध",
      rate_per_day: 450,
      coordinator_contact: "+91 9876543210",
      description: "Rapid transplanting, root alignment, initial organic fertilizing."
    }
  ];

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workType.trim()) return;

    // Save into shared data store for master admin sync
    addSharedWorkerRequest({
      farmerName: farmer.full_name || "Ramesh Kumar",
      phone: farmer.phone_number || "+91 9876543210",
      workType: workType.trim(),
      workersNeeded: parseInt(numWorkers) || 6,
      date: workDate.trim() || "Tomorrow",
      location: `${farmer.village || "Tadikonda"}, ${farmer.district || "Guntur"}`,
      status: "Requested"
    });

    setRequestSuccess(true);
    setTimeout(() => {
      setRequestSuccess(false);
      setShowRequestModal(false);
      setWorkType("Harvesting");
    }, 2200);
  };

  const getLocalizedWorkType = (team: typeof availableWorkTeams[0]) => {
    if (language === "te") return team.type_te;
    if (language === "hi") return team.type_hi;
    return team.type;
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto font-sans pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1B3B6F] via-[#21295C] to-[#1B3B6F] p-6 sm:p-7 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-500/30">
        <div>
          <span className="text-amber-300 font-bold text-[10px] uppercase tracking-wider bg-blue-950/40 px-3 py-1 rounded-full border border-blue-400/30">
            Labor & Farm Workers Hub
          </span>
          <h2 className="text-2xl font-extrabold flex items-center space-x-2.5 mt-1.5">
            <Users className="w-6 h-6 text-amber-300" />
            <span>Farm Workers & Central Coordinator</span>
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Book verified, experienced agricultural laborers for harvesting, planting, weeding, and farm maintenance.
          </p>
        </div>

        <button
          onClick={() => {
            setShowRequestModal(true);
            setRequestSuccess(false);
          }}
          className="px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-gray-900 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 shadow-md transition shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-gray-900" />
          <span>Request Workers</span>
        </button>
      </div>

      {/* Central Labor Coordinator Card */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center border border-blue-200 shrink-0">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                District Work Coordinator
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Official</span>
              </span>
            </div>
            <h3 className="text-lg font-black text-gray-900 mt-0.5">Srinivas Rao (Central Labor Officer)</h3>
            <p className="text-xs text-gray-500 font-medium">
              Managing 85+ verified labor teams across Guntur & Vijayawada agricultural belt
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <a
            href="tel:+919876543210"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition cursor-pointer"
          >
            <Phone className="w-4 h-4 text-white" />
            <span>Call Coordinator</span>
          </a>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Available Worker Categories Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
            Workers Available Today
          </h3>
          <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            28 Workers Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {availableWorkTeams.map((team) => (
            <div 
              key={team.id} 
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase ${
                    team.status === "Available" 
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}>
                    {team.status}
                  </span>
                  <span className="text-sm font-black text-gray-900">
                    ₹{team.rate_per_day}/day per worker
                  </span>
                </div>

                <h4 className="text-lg font-black text-gray-900 mb-1">{getLocalizedWorkType(team)}</h4>
                <p className="text-xs text-emerald-800 font-bold">Team Size: {team.workers_count} Workers Ready</p>
                <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{team.description}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => {
                    setWorkType(team.type);
                    setShowRequestModal(true);
                    setRequestSuccess(false);
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-2xs transition cursor-pointer"
                >
                  <Users className="w-4 h-4 text-white" />
                  <span>Request Workers</span>
                </button>
                <p className="text-[10px] text-gray-400 text-center">Labor Supervisor: Srinivas Rao ({team.coordinator_contact})</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Modal - Matching Screenshot Exactly */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 relative animate-scale-in">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-gray-900">Request Workers</h3>
            <p className="text-xs text-gray-500 font-medium">Submit labor request to Central Coordinator for farm work.</p>

            {requestSuccess ? (
              <div className="bg-emerald-50 p-6 rounded-2xl text-center space-y-2 border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-emerald-900">Worker Request Sent!</h4>
                <p className="text-xs text-emerald-700">The Work Coordinator will contact you shortly to confirm labor arrival.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Work Type</label>
                  <input
                    type="text"
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    placeholder="e.g. Harvesting, Sowing, Weeding..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-semibold bg-white text-gray-900 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Workers Needed</label>
                    <input
                      type="number"
                      value={numWorkers}
                      onChange={(e) => setNumWorkers(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-semibold bg-white text-gray-900 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Date</label>
                    <input
                      type="text"
                      value={workDate}
                      onChange={(e) => setWorkDate(e.target.value)}
                      placeholder="e.g. Tomorrow or 2026-09-22"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-semibold bg-white text-gray-900 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md transition cursor-pointer text-center"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
