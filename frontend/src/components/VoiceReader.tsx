import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useApp } from "../context/AppContext";

interface VoiceReaderProps {
  text: string;
  label?: string;
  className?: string;
}

export const VoiceReader: React.FC<VoiceReaderProps> = ({ text, label, className }) => {
  const { language, t } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Voice playback is not supported on this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map language code for browser TTS
    if (language === "te") utterance.lang = "te-IN";
    else if (language === "hi") utterance.lang = "hi-IN";
    else utterance.lang = "en-IN";

    utterance.rate = 0.9;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleSpeak}
      className={className || `flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
        isPlaying ? "bg-amber-500 text-gray-900 animate-pulse" : "bg-emerald-100 text-[#1E5128] hover:bg-emerald-200"
      }`}
    >
      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
      <span>{isPlaying ? "Stop Voice" : label || t("listen_audio")}</span>
    </button>
  );
};
