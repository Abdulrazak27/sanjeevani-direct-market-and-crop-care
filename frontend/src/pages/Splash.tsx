import React, { useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { ArrowRight } from "lucide-react";

export const Splash: React.FC = () => {
  const { setScreen } = useApp();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, []);

  const handleFinishIntro = () => {
    setScreen("auth");
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center overflow-hidden select-none font-sans">
      {/* Background Full-Screen Intro Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={false}
        onEnded={handleFinishIntro}
        className="absolute inset-0 w-full h-full object-cover sm:object-contain bg-black"
      >
        <source src="/intro.mp4" type="video/mp4" />
        <source src="/intro.mov" type="video/quicktime" />
        <source src="/WhatsApp%20Video%202026-09-19%20at%204.04.59%20PM.mov" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      {/* ONLY Skip Intro & Login Action Button at Bottom Right */}
      <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 z-50">
        <button
          onClick={handleFinishIntro}
          className="px-6 py-3.5 bg-[#0D7338] hover:bg-[#0A5D2C] text-white font-black text-xs sm:text-sm rounded-full shadow-2xl border-2 border-amber-400 flex items-center space-x-2 backdrop-blur-md cursor-pointer transition active:scale-95 group hover:shadow-emerald-500/50"
        >
          <span>Skip Intro & Login</span>
          <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Splash;
