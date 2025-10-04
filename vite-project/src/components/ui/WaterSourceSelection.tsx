import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Building2, Zap, Droplets, CircleDot, type LucideIcon } from "lucide-react";
import type { UserData } from "../../App";

interface WaterSourceSelectionProps {
  onNext: (data: Partial<UserData>) => void;
  isLoading: boolean;
  data: Partial<UserData>;
}

interface WaterSource {
  type: "municipality" | "submersible" | "tubewell" | "well";
  icon: LucideIcon;
  title: string;
  description: string;
  avgCost: string;
  reliability: string;
  quality: string;
  benefits: string[];
  challenges: string[];
  savingsPotential: string;
  color: "blue" | "purple" | "green" | "indigo";
}

export function WaterSourceSelection({ onNext, isLoading, data }: WaterSourceSelectionProps) {
  const [selectedSource, setSelectedSource] = useState<WaterSource["type"] | null>(
    data.waterSource || null
  );

  const handleSelect = (source: WaterSource["type"]) => {
    setSelectedSource(source);
    onNext({ waterSource: source });
  };

  const waterSources: WaterSource[] = [
    {
      type: "municipality",
      icon: Building2,
      title: "Municipal Water Supply",
      description: "City/town provided water through pipes",
      avgCost: "₹2-4 per 1000L",
      reliability: "Variable",
      quality: "Treated",
      benefits: ["No pumping costs", "Regulated quality", "Widespread availability", "Lower maintenance"],
      challenges: ["Supply interruptions", "Fixed billing", "Quality variations", "Limited control"],
      savingsPotential: "High (40-60%)",
      color: "blue",
    },
    {
      type: "submersible",
      icon: Zap,
      title: "Submersible Pump",
      description: "Deep groundwater extraction using electric pump",
      avgCost: "₹3-6 per 1000L",
      reliability: "High",
      quality: "Variable",
      benefits: ["Reliable supply", "User control", "Good water pressure", "Independent system"],
      challenges: ["High electricity costs", "Groundwater depletion", "Pump maintenance", "Water quality testing needed"],
      savingsPotential: "Very High (50-70%)",
      color: "purple",
    },
    {
      type: "tubewell",
      icon: Droplets,
      title: "Tube Well",
      description: "Shallow groundwater extraction using manual/motor pump",
      avgCost: "₹1-3 per 1000L",
      reliability: "Seasonal",
      quality: "Variable",
      benefits: ["Low operational cost", "Simple technology", "Local control", "Traditional method"],
      challenges: ["Seasonal availability", "Manual effort", "Limited capacity", "Water table dependency"],
      savingsPotential: "Medium (30-50%)",
      color: "green",
    },
    {
      type: "well",
      icon: CircleDot,
      title: "Open Well",
      description: "Traditional open well with rope/bucket or hand pump",
      avgCost: "₹0.5-2 per 1000L",
      reliability: "Seasonal",
      quality: "Needs Testing",
      benefits: ["Very low cost", "No electricity needed", "Traditional system", "Community resource"],
      challenges: ["Water quality concerns", "Seasonal availability", "Manual labor intensive", "Contamination risk"],
      savingsPotential: "Low (20-40%)",
      color: "indigo",
    },
  ];

  const getColorClasses = (color: WaterSource["color"], isSelected: boolean) => {
    const bg = isSelected ? `bg-${color}-50` : `bg-${color}-100`;
    const border = isSelected ? `border-${color}-500` : `border-gray-200 hover:border-gray-300`;
    const text = isSelected ? `text-${color}-500` : `text-${color}-600`;
    return `${bg} ${border} ${text}`;
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-blue-800">Current Water Source</CardTitle>
        <p className="text-gray-600">
          Tell us about your existing water supply to calculate potential savings
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {waterSources.map((source, index) => (
            <motion.div
              key={source.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg h-full`}
                onClick={() => handleSelect(source.type)}
              >
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="text-center mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${getColorClasses(source.color, selectedSource === source.type)}`}
                    >
                      <source.icon size={32} />
                    </motion.div>
                    <h3 className="text-gray-800 mb-2">{source.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <p className="text-gray-500">Avg. Cost</p>
                        <p className="font-medium text-gray-700">{source.avgCost}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <p className="text-gray-500">Reliability</p>
                        <p className="font-medium text-gray-700">{source.reliability}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-green-700 font-medium mb-1">Benefits:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {source.benefits.slice(0, 3).map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-green-500 rounded-full" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs text-amber-700 font-medium mb-1">Challenges:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {source.challenges.slice(0, 3).map((challenge, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-amber-500 rounded-full" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={`rounded-lg p-2 text-center ${selectedSource === source.type ? `bg-${source.color}-50 border border-${source.color}-200` : ''}`}>
                      <p className="text-xs text-gray-600">Rainwater Savings Potential</p>
                      <p className={`text-sm font-medium text-${source.color}-700`}>{source.savingsPotential}</p>
                    </div>
                  </div>

                  {selectedSource === source.type && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4"
                    >
                      <Button
                        className={`w-full bg-${source.color}-600 hover:bg-${source.color}-700`}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Complete Setup"}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {selectedSource && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-blue-800 mb-2">💰 Cost Comparison Preview</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-600">Current Annual Cost</p>
                  <p className="text-xl font-medium text-red-600">₹12,000 - ₹25,000</p>
                  <p className="text-xs text-gray-500">Based on typical usage</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">With Rainwater Harvesting</p>
                  <p className="text-xl font-medium text-green-600">₹5,000 - ₹12,000</p>
                  <p className="text-xs text-gray-500">Reduced dependency</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Annual Savings</p>
                  <p className="text-xl font-medium text-blue-600">₹7,000 - ₹13,000</p>
                  <p className="text-xs text-gray-500">Return on investment</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-green-800 mb-2">🌱 Environmental Impact</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
                <div>
                  <p className="font-medium">Water Conservation:</p>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Reduces groundwater extraction</li>
                    <li>• Prevents urban flooding</li>
                    <li>• Recharges local aquifers</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Sustainability Benefits:</p>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Lower carbon footprint</li>
                    <li>• Reduced energy consumption</li>
                    <li>• Community water security</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
