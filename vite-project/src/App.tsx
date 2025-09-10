import  { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ corrected import
import { LanguageSelection } from "../components/ui/LanguageSelection";
import { LoginPage } from "../components/ui/LoginPage";
import { OnboardingFlow } from "../components/ui/OnboardingFlow";
import { ResultsPage } from "../components/ui/ResultsPage";

export type AppState = "language" | "login" | "onboarding" | "results";

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

  const handleLanguageSelect = (language: string) => {
    setUserData((prev) => ({ ...prev, language }));
    setCurrentState("login");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentState("onboarding");
  };

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setCurrentState("results");
  };

  const handleBack = () => {
    if (currentState === "login") {
      setCurrentState("language");
    } else if (currentState === "onboarding") {
      setCurrentState("login");
    } else if (currentState === "results") {
      setCurrentState("onboarding");
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 },
  };


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
