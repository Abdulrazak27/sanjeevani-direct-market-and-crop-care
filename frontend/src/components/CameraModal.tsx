import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, X, Image as ImageIcon, Zap, CheckCircle2, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const { t } = useApp();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, capturedImage]);

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      setErrorMsg("Camera access is required to identify your crop leaf. You can also upload a photo from your gallery.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `crop_scan_${Date.now()}.jpg`, { type: "image/jpeg" });
          validateAndSetFile(file, canvas.toDataURL("image/jpeg"));
        }
      }, "image/jpeg", 0.9);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        validateAndSetFile(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAndSetFile = (file: File, dataUrl: string) => {
    // Basic browser side image quality checks
    if (file.size < 5000) {
      setErrorMsg("The image file is too small or invalid. Please retake.");
      return;
    }
    setErrorMsg(null);
    setCapturedImage(dataUrl);
    setCapturedFile(file);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    setErrorMsg(null);
    startCamera();
  };

  const handleConfirmAnalyze = () => {
    if (capturedFile) {
      onCapture(capturedFile);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between">
      {/* Top Controls */}
      <div className="flex items-center justify-between p-4 text-white z-10">
        <h2 className="text-base font-bold text-amber-300 flex items-center space-x-2">
          <Camera className="w-5 h-5 text-amber-400" />
          <span>{t("check_my_crop")}</span>
        </h2>

        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
        {capturedImage ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <img
              src={capturedImage}
              alt="Captured crop"
              className="max-h-[65vh] w-auto rounded-2xl border-4 border-emerald-500 shadow-2xl object-contain"
            />
            <div className="mt-3 bg-emerald-950/80 border border-emerald-600/60 px-4 py-2 rounded-xl text-center text-xs text-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Image captured clearly. Click Analyze Crop to run AI diagnosis.</span>
            </div>
          </div>
        ) : isCameraActive ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Target Frame Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
              <div className="w-72 h-72 border-2 border-dashed border-amber-400 rounded-3xl relative shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                {/* Corner markers */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-xl"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-xl"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-xl"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-xl"></div>
              </div>
              <p className="mt-4 bg-black/70 backdrop-blur-md text-amber-200 text-xs px-4 py-2 rounded-full font-medium text-center border border-amber-500/30">
                {t("camera_instruction")}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-300 max-w-xs">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-amber-200 mb-4">{errorMsg || "Camera access not started."}</p>
            <button
              onClick={startCamera}
              className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-emerald-500"
            >
              Retry Camera
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleGalleryUpload}
        className="hidden"
      />

      {/* Bottom Control Bar */}
      <div className="p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex items-center justify-around z-10">
        {capturedImage ? (
          <div className="flex items-center space-x-4 w-full max-w-xs justify-center">
            <button
              onClick={handleRetake}
              className="flex-1 py-3 bg-gray-800 border border-gray-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center space-x-2 hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t("retake")}</span>
            </button>

            <button
              onClick={handleConfirmAnalyze}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-2 hover:from-emerald-500 hover:to-green-400"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>{t("analyze_crop")}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full max-w-xs">
            {/* Gallery Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full flex flex-col items-center justify-center text-[10px]"
            >
              <ImageIcon className="w-6 h-6 text-emerald-300" />
              <span className="mt-1">Gallery</span>
            </button>

            {/* Main Shutter Camera Button */}
            <button
              onClick={handleCapturePhoto}
              disabled={!isCameraActive}
              className="w-20 h-20 rounded-full border-4 border-white bg-amber-400 p-1 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.6)] active:scale-90 transition transform disabled:opacity-50"
            >
              <div className="w-full h-full rounded-full border-2 border-gray-900 bg-amber-300 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-900" />
              </div>
            </button>

            {/* Flash Info */}
            <button
              onClick={() => alert("Flash mode depends on device hardware settings.")}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full flex flex-col items-center justify-center text-[10px]"
            >
              <Zap className="w-6 h-6 text-amber-300" />
              <span className="mt-1">Flash</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
