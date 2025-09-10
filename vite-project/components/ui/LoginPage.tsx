import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Droplets, Cloud, Leaf, Recycle, ArrowLeft } from "lucide-react";

interface LoginPageProps {
  language: string;
  onLogin: () => void;
  onBack: () => void;
}

interface Step {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const animationSteps: Step[] = [
  {
    icon: Cloud,
    title: "Rain Collection",
    description:
      "Rainwater is collected from your rooftop through gutters and downspouts",
    color: "text-blue-500",
  },
  {
    icon: Droplets,
    title: "Filtration",
    description: "Water passes through filters to remove debris and contaminants",
    color: "text-cyan-500",
  },
  {
    icon: Recycle,
    title: "Storage",
    description: "Clean water is stored in tanks for household or industrial use",
    color: "text-green-500",
  },
  {
    icon: Leaf,
    title: "Conservation",
    description: "Reduce groundwater depletion and save on water bills",
    color: "text-emerald-500",
  },
];

export function LoginPage({ language, onLogin, onBack }: LoginPageProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % animationSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Login Section */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <p className="text-sm text-gray-600">{language}</p>
              </div>
              <CardTitle className="text-center text-blue-800">
                Sign In to RainHarvest
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleLogin}
              >
                Sign In
              </Button>
              <div className="text-center">
                <Button variant="link" className="text-sm text-blue-600">
                  Create new account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Animated Guide Section */}
      <div className="hidden lg:flex lg:w-2/3 bg-gradient-to-br from-blue-100 to-green-100 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl"
        >
          <div className="text-center mb-12">
            <h2 className="mb-4 text-blue-800">How Rainwater Harvesting Works</h2>
            <p className="text-gray-600">
              Learn the simple steps to implement rainwater harvesting in your
              property
            </p>
          </div>

          <div className="relative">
            {/* Progress indicators */}
            <div className="flex justify-center mb-8">
              {animationSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full mx-2 ${
                    index === currentStep ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  animate={{
                    scale: index === currentStep ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            {/* Animated content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg ${animationSteps[currentStep].color}`}
                >
                  {React.createElement(animationSteps[currentStep].icon, {
                    size: 40,
                  })}
                </motion.div>
              </div>
              <h3 className="mb-4 text-gray-800">
                {animationSteps[currentStep].title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {animationSteps[currentStep].description}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <div className="bg-white/60 rounded-lg p-6 backdrop-blur">
              <h4 className="mb-2 text-green-700">Benefits</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>• Reduce water bills</div>
                <div>• Groundwater conservation</div>
                <div>• Sustainable living</div>
                <div>• Environmental impact</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
