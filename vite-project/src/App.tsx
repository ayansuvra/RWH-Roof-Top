import  { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ corrected import
import { LanguageSelection } from "./components/ui/LanguageSelection";
import { LoginPage } from "./components/ui/LoginPage";
import { OnboardingFlow } from "./components/ui/OnboardingFlow";
import { ResultsPage } from "./components/ui/ResultsPage";
import SurveyorApp from "./components/surveyor-app";
import { resolveGoogleMapsApiKey } from "../lib/utils";

export type AppState = "language" | "login" | "surveyor" | "onboarding" | "results";

export interface UserData {
  language: string;
  location: {
    name: string;
    coordinates: { lat: number; lng: number };
  };
  useType: "household" | "industrial";
  hasTank: boolean;
  rooftop: {
    area: number;
    type: "flat" | "sloped";
  };
  tankCapacity: number;
  waterSource: "municipality" | "submersible" | "tubewell" | "well";
}

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>("language");
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [, setIsLoggedIn] = useState(false);
  const apiKey = resolveGoogleMapsApiKey();

  const handleLanguageSelect = (language: string) => {
    setUserData((prev) => ({ ...prev, language }));
    setCurrentState("login");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentState("surveyor");
  };

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setCurrentState("results");
  };

  const handleBack = () => {
    if (currentState === "login") {
      setCurrentState("language");
    } else if (currentState === "surveyor") {
      setCurrentState("login");
    } else if (currentState === "onboarding") {
      setCurrentState("surveyor");
    } else if (currentState === "results") {
      setCurrentState("onboarding");
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 },
  };


  if (!apiKey) {
    return (
      <div style={{ minHeight: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 600, padding: 16, textAlign: "center" }}>
          <p style={{ fontWeight: 600 }}>Google Maps API key is missing.</p>
          <p>Add VITE_GOOGLE_MAPS_API_KEY to a .env in vite-project and restart the dev server.</p>
          <p style={{ marginTop: 8 }}>Or provide it via one of these fallbacks:</p>
          <ul style={{ textAlign: "left", marginTop: 8 }}>
            <li>localStorage.setItem("VITE_GOOGLE_MAPS_KEY", "YOUR_KEY")</li>
            <li>window.__GMAPS_KEY__ = "YOUR_KEY"</li>
            <li>?gmaps=YOUR_KEY in the URL</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {currentState === "language" && (
          <motion.div
            key="language"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="w-full"
          >
            <LanguageSelection onLanguageSelect={handleLanguageSelect} />
          </motion.div>
        )}

        {currentState === "login" && (
          <motion.div
            key="login"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="w-full"
          >
            <LoginPage
              language={userData.language || "English"}
              onLogin={handleLogin}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {currentState === "surveyor" && (
          <motion.div
            key="surveyor"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="w-full"
          >
            <div className="relative w-full">
              <SurveyorApp apiKey={apiKey} />
              <div className="absolute right-4 bottom-4 z-50">
                <button
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground shadow"
                  onClick={() => setCurrentState("onboarding")}
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentState === "onboarding" && (
          <motion.div
            key="onboarding"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="w-full"
          >
            <OnboardingFlow
              onComplete={handleOnboardingComplete}
              initialData={userData}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {currentState === "results" && (
          <motion.div
            key="results"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="w-full"
          >
            <ResultsPage userData={userData as UserData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
