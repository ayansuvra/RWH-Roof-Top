import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Users, Home, Building } from "lucide-react";
import type { UserData } from "../types";

interface TankCapacitySelectionProps {
  onNext: (data: Partial<UserData>) => void;
  isLoading: boolean;
  data: Partial<UserData>;
}

export function TankCapacitySelection({
  onNext,
  isLoading,
  data,
}: TankCapacitySelectionProps) {
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(
    data.tankCapacity || null
  );

  const handleSelect = (capacity: number) => {
    setSelectedCapacity(capacity);
    onNext({ tankCapacity: capacity });
  };

  const isHousehold = data.useType === "household";

  const householdTanks = [
    {
      capacity: 500,
      title: "500 Liters",
      suitableFor: "1-2 People",
      familySize: "Single/Couple",
      icon: Users,
      description: "Perfect for small apartments or starter homes",
      dailyUsage: "25-40L/day",
      benefits: ["Compact size", "Easy maintenance", "Lower initial cost"],
      price: "₹8,000 - ₹12,000",
    },
    {
      capacity: 1000,
      title: "1,000 Liters",
      suitableFor: "2-4 People",
      familySize: "Small Family",
      icon: Home,
      description: "Ideal for small to medium families",
      dailyUsage: "40-80L/day",
      benefits: ["Good storage capacity", "Family-friendly", "Balanced cost"],
      price: "₹12,000 - ₹18,000",
    },
    {
      capacity: 2000,
      title: "2,000 Liters",
      suitableFor: "4-6 People",
      familySize: "Medium Family",
      icon: Users,
      description: "Great for medium-sized families with garden",
      dailyUsage: "80-120L/day",
      benefits: ["Extended storage", "Garden irrigation", "Emergency backup"],
      price: "₹20,000 - ₹28,000",
    },
    {
      capacity: 5000,
      title: "5,000 Liters",
      suitableFor: "6+ People",
      familySize: "Large Family",
      icon: Building,
      description: "Perfect for large families or multi-generational homes",
      dailyUsage: "150+ L/day",
      benefits: ["Maximum storage", "Multiple uses", "Long-term savings"],
      price: "₹35,000 - ₹50,000",
    },
  ];

  const industrialTanks = [
    {
      capacity: 10000,
      title: "10,000 Liters",
      suitableFor: "Small Business",
      familySize: "Office/Shop",
      icon: Building,
      description: "Suitable for small offices, shops, or workshops",
      dailyUsage: "200-400L/day",
      benefits: ["Cost-effective", "Easy installation", "Quick ROI"],
      price: "₹60,000 - ₹80,000",
    },
    {
      capacity: 25000,
      title: "25,000 Liters",
      suitableFor: "Medium Business",
      familySize: "Small Factory",
      icon: Building,
      description: "Perfect for medium-scale operations",
      dailyUsage: "500-1000L/day",
      benefits: ["Higher capacity", "Process water", "Significant savings"],
      price: "₹1,20,000 - ₹1,80,000",
    },
    {
      capacity: 50000,
      title: "50,000 Liters",
      suitableFor: "Large Business",
      familySize: "Large Factory",
      icon: Building,
      description: "Ideal for large-scale industrial operations",
      dailyUsage: "1000+ L/day",
      benefits: ["Maximum capacity", "Multiple processes", "Corporate sustainability"],
      price: "₹2,50,000 - ₹4,00,000",
    },
  ];

  const tanks = isHousehold ? householdTanks : industrialTanks;

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-blue-800">Select Tank Capacity</CardTitle>
        <p className="text-gray-600">
          Choose the right tank size for your {isHousehold ? "household" : "industrial"} needs
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tanks.map((tank, index) => (
            <motion.div
              key={tank.capacity}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg h-full ${
                  selectedCapacity === tank.capacity
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleSelect(tank.capacity)}
              >
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="text-center mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                        selectedCapacity === tank.capacity
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <tank.icon size={24} />
                    </motion.div>
                    <h3 className="text-gray-800 mb-1">{tank.title}</h3>
                    <p className="text-sm text-blue-600 font-medium">{tank.suitableFor}</p>
                    <p className="text-xs text-gray-500">{tank.familySize}</p>
                  </div>

                  <div className="flex-1 space-y-3">
                    <p className="text-xs text-gray-600 text-center">{tank.description}</p>

                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-700 text-center">
                        <span className="font-medium">Daily Usage:</span> {tank.dailyUsage}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 mb-1">Key Benefits:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {tank.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-green-500 rounded-full" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-green-600 text-center font-medium">
                        {tank.price}
                      </p>
                    </div>
                  </div>

                  {selectedCapacity === tank.capacity && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4"
                    >
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Select This Tank"}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-4"
        >
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-yellow-800 mb-2">💡 Tank Selection Tips</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-700">
              <div>
                <p className="font-medium">Consider:</p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• Available space for installation</li>
                  <li>• Local rainfall patterns</li>
                  <li>• Family water consumption</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Remember:</p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• Larger tanks = better cost efficiency</li>
                  <li>• Quality materials ensure longevity</li>
                  <li>• Professional installation recommended</li>
                </ul>
              </div>
            </div>
          </div>

          {data.rooftop?.area && selectedCapacity && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-green-800 mb-2">🎯 Compatibility Check</h4>
              <div className="text-sm text-green-700">
                <p>
                  Your {data.rooftop.area}m² rooftop can collect approximately{" "}
                  <span className="font-medium">
                    {(data.rooftop.area * 0.8 * 800 * 0.9 / 1000).toFixed(0)}k liters
                  </span>{" "}
                  annually, which is{" "}
                  <span className="font-medium">
                    {((data.rooftop.area * 0.8 * 800 * 0.9) / selectedCapacity).toFixed(1)}x
                  </span>{" "}
                  your tank capacity.
                </p>
                <p className="text-xs mt-1 text-green-600">
                  ✅ This tank size is well-suited for your rooftop area.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
