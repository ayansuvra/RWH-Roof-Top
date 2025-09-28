import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Home, Factory, type LucideIcon } from "lucide-react";
import type { UserData } from "../../types";

interface UseTypeSelectionProps {
  onNext: (data: Partial<UserData>) => void;
  isLoading: boolean;
  data: Partial<UserData>;
}

interface UsageType {
  type: "household" | "industrial";
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  capacity: string;
}

export function UseTypeSelection({
  onNext,
  isLoading,
  data,
}: UseTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<"household" | "industrial" | null>(
    data.useType || null
  );

  const handleSelect = (type: "household" | "industrial") => {
    setSelectedType(type);
    onNext({ useType: type });
  };

  const usageTypes: UsageType[] = [
    {
      type: "household",
      icon: Home,
      title: "Household Use",
      description: "Perfect for residential homes, apartments, and small-scale water needs",
      features: [
        "Drinking water (with proper filtration)",
        "Gardening and irrigation",
        "Washing and cleaning",
        "Emergency water backup",
      ],
      capacity: "Typically 500L - 5,000L storage",
    },
    {
      type: "industrial",
      icon: Factory,
      title: "Industrial Use",
      description: "Designed for businesses, factories, and large-scale operations",
      features: [
        "Process water for manufacturing",
        "Cooling systems",
        "Landscaping maintenance",
        "Fire safety systems",
      ],
      capacity: "Typically 10,000L+ storage",
    },
  ];

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-blue-800">How will you use rainwater?</CardTitle>
        <p className="text-gray-600">
          Choose your primary use case to get personalized recommendations
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {usageTypes.map((usage, index) => (
            <motion.div
              key={usage.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
                  selectedType === usage.type
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleSelect(usage.type)}
              >
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                        selectedType === usage.type
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <usage.icon size={32} />
                    </motion.div>
                    <h3 className="text-gray-800 mb-2">{usage.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{usage.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm text-gray-700 mb-2">Typical Applications:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {usage.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">{usage.capacity}</p>
                    </div>
                  </div>

                  {selectedType === usage.type && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 text-center"
                    >
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading
                          ? "Processing..."
                          : `Continue with ${usage.title}`}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-green-800 mb-2">Environmental Impact</h4>
            <p className="text-sm text-green-700">
              Rainwater harvesting can reduce your water consumption by 30-50% and
              significantly decrease strain on local water resources.
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
