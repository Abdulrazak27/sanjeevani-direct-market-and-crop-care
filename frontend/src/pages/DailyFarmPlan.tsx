import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Sun, Sunset, Moon, CheckSquare, Square, Calendar } from "lucide-react";

export const DailyFarmPlan: React.FC = () => {
  const { farmer, t } = useApp();

  const [morningTasks, setMorningTasks] = useState([
    { id: "m1", text: "Check live weather and soil moisture before irrigation", done: true },
    { id: "m2", text: `Inspect ${farmer.main_crop} crop leaves for early pest signs`, done: false },
    { id: "m3", text: "Clean field drainage channels if rain is expected", done: false }
  ]);

  const [afternoonTasks, setAfternoonTasks] = useState([
    { id: "a1", text: "Check crop foliage for heat stress during peak sun", done: false },
    { id: "a2", text: "Ensure sticky yellow traps are clean and active", done: true }
  ]);

  const [eveningTasks, setEveningTasks] = useState([
    { id: "e1", text: "Check live Guntur Mandi produce prices for tomorrow", done: false },
    { id: "e2", text: "Confirm tomorrow's farm worker booking with Coordinator", done: false }
  ]);

  const toggleTask = (section: "morning" | "afternoon" | "evening", id: string) => {
    if (section === "morning") {
      setMorningTasks(morningTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    } else if (section === "afternoon") {
      setAfternoonTasks(afternoonTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    } else {
      setEveningTasks(eveningTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    }
  };

  return (
    <div className="space-y-5 pb-8 max-w-md mx-auto">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#1E5128] to-[#2E6B3A] p-4 rounded-2xl text-white shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-amber-300" />
            <span>My Day (కూలీలు సంజీవని సంజీవని?)</span>
          </h2>
          <p className="text-xs text-emerald-200 mt-1">Smart farm routine tailored for {farmer.main_crop}.</p>
        </div>
      </div>

      {/* Morning Section */}
      <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-amber-700 font-extrabold text-sm border-b pb-2 border-amber-100">
          <Sun className="w-5 h-5 text-amber-500" />
          <span>Morning Routine (కూలీలు సంజీవని?)</span>
        </div>

        <div className="space-y-2 text-xs">
          {morningTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask("morning", task.id)}
              className={`flex items-start space-x-2.5 p-2.5 rounded-xl cursor-pointer transition ${
                task.done ? "bg-emerald-50 text-gray-500 line-through" : "bg-gray-50 text-gray-800 hover:bg-emerald-50/50"
              }`}
            >
              {task.done ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              )}
              <span className="font-semibold leading-snug">{task.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Afternoon Section */}
      <div className="bg-white p-4 rounded-3xl border border-orange-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-orange-700 font-extrabold text-sm border-b pb-2 border-orange-100">
          <Sunset className="w-5 h-5 text-orange-500" />
          <span>Afternoon Routine (సంజీవనిధర సంజీవని?)</span>
        </div>

        <div className="space-y-2 text-xs">
          {afternoonTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask("afternoon", task.id)}
              className={`flex items-start space-x-2.5 p-2.5 rounded-xl cursor-pointer transition ${
                task.done ? "bg-emerald-50 text-gray-500 line-through" : "bg-gray-50 text-gray-800 hover:bg-emerald-50/50"
              }`}
            >
              {task.done ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              )}
              <span className="font-semibold leading-snug">{task.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Evening Section */}
      <div className="bg-white p-4 rounded-3xl border border-indigo-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-indigo-800 font-extrabold text-sm border-b pb-2 border-indigo-100">
          <Moon className="w-5 h-5 text-indigo-600" />
          <span>Evening Routine (సంజీవని? సంజీవని?)</span>
        </div>

        <div className="space-y-2 text-xs">
          {eveningTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask("evening", task.id)}
              className={`flex items-start space-x-2.5 p-2.5 rounded-xl cursor-pointer transition ${
                task.done ? "bg-emerald-50 text-gray-500 line-through" : "bg-gray-50 text-gray-800 hover:bg-emerald-50/50"
              }`}
            >
              {task.done ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              )}
              <span className="font-semibold leading-snug">{task.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
