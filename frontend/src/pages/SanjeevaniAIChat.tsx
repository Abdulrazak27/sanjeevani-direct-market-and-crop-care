import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Bot, Mic, MicOff, Send, X, Sparkles, User } from "lucide-react";
import { askSanjeevaniAI } from "../services/api";
import { VoiceReader } from "../components/VoiceReader";

export const SanjeevaniAIChat: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, farmer, language } = useApp();
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const getGreeting = () => {
    if (language === "te") {
      return `నమస్కారం ${farmer.full_name}! నేను మీ సంజీవని AI వ్యవసాయ సహాయకుడిని. మీ పంటల సంరక్షణ, వాతావరణం, మండి ధరలు లేదా కొనుగోలుదారుల గురించి నన్ను అడగవచ్చు.`;
    }
    if (language === "hi") {
      return `नमस्ते ${farmer.full_name}! मैं आपका संजीवनी AI कृषि सहायक हूं। अपनी फसलों, मौसम, मंडी भाव या खरीदारों के बारे में मुझसे पूछें।`;
    }
    return `Hello ${farmer.full_name}! I am your Sanjeevani AI farming assistant. Ask me anything about crop care, weather, mandi rates, cold storage, or market buyers.`;
  };

  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: getGreeting()
    }
  ]);

  // Synchronize greeting when language changes or modal is opened
  useEffect(() => {
    if (isAiModalOpen) {
      setMessages((prev) => {
        if (prev.length <= 1) {
          return [{ sender: "ai", text: getGreeting() }];
        }
        return prev;
      });
    }
  }, [language, farmer.full_name, farmer.main_crop, isAiModalOpen]);

  if (!isAiModalOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg = { sender: "user" as const, text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    const reply = await askSanjeevaniAI(textToSend, language, farmer.main_crop);
    setLoading(false);
    setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const msg = language === "te"
        ? "ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ మద్దతు లేదు. దయచేసి టైప్ చేయండి."
        : language === "hi"
        ? "इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है। कृपया टाइप करें।"
        : "Voice input is not supported in this browser. Please type your question.";
      alert(msg);
      return;
    }

    const recognition = new SpeechRecognition();
    if (language === "te") recognition.lang = "te-IN";
    else if (language === "hi") recognition.lang = "hi-IN";
    else recognition.lang = "en-IN";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const suggestedQuestions = language === "te"
    ? ["పంటలు ఎక్కడ అమ్మాలి?", "నేడు వర్షపాతం ఉందా?", "కూలీలు అందుబాటులో ఉన్నారా?"]
    : language === "hi"
    ? ["फसल कहां बेचें?", "क्या आज बारिश होगी?", "मजदूर उपलब्ध हैं?"]
    : ["Where to sell crops?", "Is rain expected today?", "Worker availability?"];

  const placeholderText = language === "te"
    ? "సంజీవని AI ని ప్రశ్నించండి..."
    : language === "hi"
    ? "संजीवनी AI से प्रश्न पूछें..."
    : "Ask Sanjeevani AI a question...";

  const thinkingText = language === "te"
    ? "సంజీవని AI ఆలోచిస్తోంది..."
    : language === "hi"
    ? "संजीवनी AI सोच रहा है..."
    : "Sanjeevani is thinking...";

  const contextActiveText = language === "te"
    ? "సంజీవని వ్యవసాయ సహాయకుడు సక్రియంగా ఉన్నారు"
    : language === "hi"
    ? "संजीवनी कृषि सहायक सक्रिय है"
    : "SANJEEVANI Agri Saathi Active";

  const voiceLabel = language === "te"
    ? "వాయిస్ వినండి"
    : language === "hi"
    ? "आवाज़ सुनें"
    : "Listen Voice";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-gray-900 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Sanjeevani AI</h3>
              <p className="text-[11px] text-emerald-200">{contextActiveText}</p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2 ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === "user" ? "bg-amber-500 text-gray-900" : "bg-emerald-700 text-amber-300"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[80%] shadow-2xs ${
                  msg.sender === "user"
                    ? "bg-emerald-700 text-white rounded-tr-none font-medium"
                    : "bg-white border border-gray-200 text-gray-800 rounded-tl-none font-medium space-y-1.5"
                }`}
              >
                <p className="leading-relaxed text-xs">{msg.text}</p>
                {msg.sender === "ai" && <VoiceReader text={msg.text} label={voiceLabel} />}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs p-2">
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
              <span>{thinkingText}</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2 bg-emerald-50/70 border-t border-emerald-100 flex space-x-1.5 overflow-x-auto text-[11px] no-scrollbar">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-full bg-white border border-emerald-300 text-emerald-900 font-bold whitespace-nowrap shadow-2xs hover:bg-emerald-100 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar with Voice Mic */}
        <div className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2">
          <button
            onClick={startVoiceInput}
            className={`p-3 rounded-full text-white font-bold transition shadow-xs ${
              isListening ? "bg-red-600 animate-bounce" : "bg-amber-400 hover:bg-amber-300 text-gray-900"
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={placeholderText}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-xs font-semibold outline-none focus:border-emerald-600"
          />

          <button
            onClick={() => handleSend()}
            className="p-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-amber-300 shadow-xs transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
