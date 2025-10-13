import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSelection } from "./components/ui/LanguageSelection";
import { LoginPage } from "./components/ui/LoginPage";
import { OnboardingFlow } from "./components/ui/OnboardingFlow";
import { ResultsPage } from "./components/ui/ResultsPage";
import ImageAreaSelector from "./components/ui/ImageAreaSelector";

export type AppState = "language" | "login" | "onboarding" | "surveyor" | "results";

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

  const handleLanguageSelect = (language: string) => {
    setUserData(prev => ({ ...prev, language }));
    setCurrentState("login");
  };

  const handleSkip = () => {
    setCurrentState("login");
  };

  const handleLogin = () => {
    setCurrentState("surveyor");
  };

  const handleBack = () => {
    setCurrentState("language");
  };

  const handleAreaCalculated = (area: number) => {
    setUserData(prev => ({ 
      ...prev, 
      rooftop: { area, type: "flat" as const }
    }));
    setCurrentState("onboarding");
  };

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setCurrentState("results");
  };

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <AnimatePresence mode="wait">
        {currentState === "language" && (
          <motion.div
            key="language"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
          >
            <LanguageSelection 
              onLanguageSelect={handleLanguageSelect}
              onSkip={handleSkip}
            />
          </motion.div>
        )}

        {currentState === "login" && (
          <motion.div
            key="login"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
          >
            <LoginPage onLogin={handleLogin} onBack={handleBack} />
          </motion.div>
        )}

        {currentState === "surveyor" && (
          <motion.div
            key="surveyor"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="h-screen"
          >
            <ImageAreaSelector onAreaCalculated={handleAreaCalculated} />
          </motion.div>
        )}

        {currentState === "onboarding" && (
          <motion.div
            key="onboarding"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
          >
            <OnboardingFlow
              onComplete={handleOnboardingComplete}
              initialData={userData}
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
          >
            <ResultsPage userData={userData as UserData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
