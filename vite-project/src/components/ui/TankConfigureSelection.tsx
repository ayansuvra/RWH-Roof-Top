import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { CheckCircle, XCircle, Info, type LucideIcon } from "lucide-react";
<<<<<<< HEAD
import type { UserData } from "../../App";
=======
import type { UserData } from "../../types";
>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f

interface TankConfigurationProps {
  onNext: (data: Partial<UserData>) => void;
  isLoading: boolean;
  data: Partial<UserData>;
}

interface TankOption {
  value: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  considerations: string[];
}

export function TankConfiguration({
  onNext,
  isLoading,
  data,
}: TankConfigurationProps) {
  const [hasTank, setHasTank] = useState<boolean | null>(data.hasTank ?? null);

  const handleSelect = (hasExistingTank: boolean) => {
    setHasTank(hasExistingTank);
    onNext({ hasTank: hasExistingTank });
  };

  const options: TankOption[] = [
    {
      value: true,
      icon: CheckCircle,
      title: "Yes, I have a tank",
      description:
        "I already have a water storage tank that can be used for rainwater harvesting",
      benefits: [
        "Lower installation cost",
        "Faster setup process",
        "Existing infrastructure utilization",
        "Immediate implementation possible",
      ],
      considerations: [
        "Tank condition assessment needed",
        "May require cleaning/modification",
        "Capacity evaluation required",
      ],
    },
    {
      value: false,
      icon: XCircle,
      title: "No, I need a new tank",
      description:
        "I need to install a new water storage tank for rainwater harvesting",
      benefits: [
        "Custom-sized for your needs",
        "Latest tank technology",
        "Optimal placement design",
        "Modern filtration integration",
      ],
      considerations: [
        "Higher initial investment",
        "Site preparation required",
        "Installation time needed",
      ],
    },
  ];

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-blue-800">
          Do you have an existing water tank?
        </CardTitle>
        <p className="text-gray-600">
          This helps us determine the best approach for your rainwater
          harvesting system
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {options.map((option, index) => (
            <motion.div
              key={option.value.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
                  hasTank === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleSelect(option.value)}
              >
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                        hasTank === option.value
                          ? option.value
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <option.icon size={32} />
                    </motion.div>
                    <h3 className="text-gray-800 mb-2">{option.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {option.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm text-green-700 mb-2 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Benefits:
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {option.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm text-amber-700 mb-2 flex items-center gap-1">
                        <Info className="w-4 h-4" />
                        Considerations:
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {option.considerations.map((consideration, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                            {consideration}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {hasTank === option.value && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 text-center"
                    >
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Continue"}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Extra Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-800 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Tank Requirements
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p className="font-medium">For Household Use:</p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• Minimum 500L capacity</li>
                  <li>• Food-grade material</li>
                  <li>• Covered to prevent contamination</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">For Industrial Use:</p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• Minimum 10,000L capacity</li>
                  <li>• Durable construction material</li>
                  <li>• Multiple inlet/outlet options</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
