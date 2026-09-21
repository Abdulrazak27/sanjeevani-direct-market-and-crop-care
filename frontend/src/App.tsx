import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { SanjeevaniAIFloatingButton } from "./components/SanjeevaniAIFloatingButton";
import { OfflineBanner } from "./components/OfflineBanner";
import { LandingPage } from "./pages/LandingPage";
import { Splash } from "./pages/Splash";
import { LanguageSelect } from "./pages/LanguageSelect";
import { Onboarding } from "./pages/Onboarding";
import { Auth } from "./pages/Auth";
import { ProfileSetup } from "./pages/ProfileSetup";
import { Home } from "./pages/Home";
import { CropCheck } from "./pages/CropCheck";
import { Market } from "./pages/Market";
import { WorkCoordinator } from "./pages/WorkCoordinator";
import { Profile } from "./pages/Profile";
import { SanjeevaniAIChat } from "./pages/SanjeevaniAIChat";
import { AdminDashboard } from "./pages/AdminDashboard";
import { DiagnosisHistory } from "./pages/DiagnosisHistory";
import { Resources } from "./pages/Resources";
import { WeatherToday } from "./pages/WeatherToday";
import { Settings } from "./pages/Settings";

const MainContent: React.FC = () => {
  const { screen, activeTab } = useApp();

  const isAdminRoute = () => {
    if (typeof window === "undefined") return false;
    const url = window.location.href.toLowerCase();
    const search = window.location.search.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return url.includes("admin") || search.includes("admin") || path.includes("admin") || hash.includes("admin");
  };

  if (isAdminRoute() || screen === "admin") {
    return <AdminDashboard />;
  }

  if (screen === "splash") return <Splash />;
  if (screen === "language") return <LanguageSelect />;
  if (screen === "onboarding") return <Onboarding />;
  if (screen === "auth") return <Auth />;
  if (screen === "profile_setup") return <ProfileSetup />;
  if (screen === "history") return <DiagnosisHistory />;

  return (
    <div className="min-h-screen bg-[#F8FBF6] flex flex-col font-sans antialiased text-[#263238] select-none">
      <Header />

      {screen === "landing" ? (
        <main className="flex-1 w-full">
          <LandingPage />
        </main>
      ) : screen === "resources" ? (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
          <Resources />
        </main>
      ) : screen === "weather_today" ? (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
          <WeatherToday />
        </main>
      ) : screen === "settings" ? (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
          <Settings />
        </main>
      ) : (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
          {activeTab === "home" && <Home />}
          {activeTab === "crop" && <CropCheck />}
          {activeTab === "market" && <Market />}
          {activeTab === "work" && <WorkCoordinator />}
          {activeTab === "profile" && <Profile />}
        </main>
      )}

      <SanjeevaniAIFloatingButton />
      <SanjeevaniAIChat />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
