import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Calculator, Home, Map } from "lucide-react";
import { MapAreaCalculator } from "./MapAreaCalculator";
import type { UserData } from "../types";

interface RooftopDetailsProps {
  onNext: (data: Partial<UserData>) => void;
  isLoading: boolean;
  data: Partial<UserData>;
}

export function RooftopDetails({
  onNext,
  isLoading,
  data,
}: RooftopDetailsProps) {
  const [length, setLength] = useState(
    data.rooftop?.area ? Math.sqrt(data.rooftop.area).toString() : ""
  );
  const [width, setWidth] = useState(
    data.rooftop?.area ? Math.sqrt(data.rooftop.area).toString() : ""
  );
  const [area, setArea] = useState(data.rooftop?.area?.toString() || "");
  const [roofType, setRoofType] = useState<"flat" | "sloped" | "">(
    data.rooftop?.type || ""
  );
  const [useCalculator, setUseCalculator] = useState(false);
  const [useMapCalculator, setUseMapCalculator] = useState(false);

  useEffect(() => {
    if (length && width && useCalculator) {
      const calculatedArea = parseFloat(length) * parseFloat(width);
      setArea(calculatedArea.toString());
    }
  }, [length, width, useCalculator]);

  const handleSubmit = () => {
    const finalArea = parseFloat(area);
    if (finalArea > 0 && roofType) {
      onNext({
        rooftop: {
          area: finalArea,
          type: roofType as "flat" | "sloped",
        },
      });
    }
  };

  const isValid = area && parseFloat(area) > 0 && roofType;

  const roofTypes = [
    {
      value: "flat",
      title: "Flat Roof",
      description: "Horizontal or slightly sloped roof (less than 10° slope)",
      efficiency: "95-98%",
      advantages: [
        "Higher collection efficiency",
        "Easier installation",
        "Better water quality",
      ],
      image: "🏢",
    },
    {
      value: "sloped",
      title: "Sloped Roof",
      description: "Angled roof with significant slope (more than 10° slope)",
      efficiency: "85-90%",
      advantages: ["Natural drainage", "Self-cleaning", "Traditional design"],
      image: "🏠",
    },
  ];

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-blue-800">
          <Home className="w-6 h-6" />
          Rooftop Details
        </CardTitle>
        <p className="text-gray-600">
          Provide your rooftop area and type to calculate water collection
          potential
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Area Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={!useCalculator && !useMapCalculator ? "default" : "outline"}
              onClick={() => {
                setUseCalculator(false);
                setUseMapCalculator(false);
              }}
              className="flex-1"
            >
              Direct Area Input
            </Button>
            <Button
              variant={useCalculator ? "default" : "outline"}
              onClick={() => {
                setUseCalculator(true);
                setUseMapCalculator(false);
              }}
              className="flex-1"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Area
            </Button>
            <Button
              variant={useMapCalculator ? "default" : "outline"}
              onClick={() => {
                setUseCalculator(false);
                setUseMapCalculator(true);
              }}
              className="flex-1"
            >
              <Map className="w-4 h-4 mr-2" />
              Map Tool
            </Button>
          </div>

          {useCalculator ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">Length (meters)</Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="Enter length"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width (meters)</Label>
                <Input
                  id="width"
                  type="number"
                  placeholder="Enter width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </div>
            </div>
          ) : useMapCalculator ? (
            <MapAreaCalculator
              onAreaCalculated={(calculatedArea) => setArea(calculatedArea.toString())}
            />
          ) : (
            <div className="space-y-2">
              <Label htmlFor="area">Total Rooftop Area (square meters)</Label>
              <Input
                id="area"
                type="number"
                placeholder="Enter total area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
          )}

          {area && parseFloat(area) > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="text-center">
                <p className="text-green-800">
                  Total Rooftop Area: <span className="font-medium">{area} m²</span>
                </p>
                <p className="text-sm text-green-600 mt-1">
                  This is approximately {(parseFloat(area) * 10.764).toFixed(0)} square feet
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Roof Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <Label>Roof Type</Label>
          <div className="grid md:grid-cols-2 gap-4">
            {roofTypes.map((type) => (
              <Card
                key={type.value}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  roofType === type.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setRoofType(type.value as "flat" | "sloped")}
              >
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">{type.image}</div>
                    <h4 className="text-gray-800">{type.title}</h4>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-center">
                      <span className="text-sm font-medium text-green-600">
                        Collection Efficiency: {type.efficiency}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        Key advantages:
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {type.advantages.map((advantage, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-blue-500 rounded-full" />
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Calculation Preview */}
        {area && roofType && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h4 className="text-blue-800 mb-3">
              Estimated Water Collection Potential
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-medium text-blue-600">
                  {(
                    parseFloat(area) *
                    0.8 *
                    (roofType === "flat" ? 0.95 : 0.87)
                  ).toFixed(0)}
                  L
                </p>
                <p className="text-xs text-gray-600">Per mm of rainfall</p>
              </div>
              <div>
                <p className="text-2xl font-medium text-green-600">
                  {(
                    (parseFloat(area) *
                      0.8 *
                      800 *
                      (roofType === "flat" ? 0.95 : 0.87)) /
                    1000
                  ).toFixed(0)}
                  k L
                </p>
                <p className="text-xs text-gray-600">Annual potential*</p>
              </div>
              <div>
                <p className="text-2xl font-medium text-purple-600">
                  ₹
                  {(
                    parseFloat(area) *
                    0.8 *
                    800 *
                    (roofType === "flat" ? 0.95 : 0.87) *
                    0.003
                  ).toFixed(0)}
                </p>
                <p className="text-xs text-gray-600">Estimated savings*</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              *Based on average rainfall of 800mm/year and water cost of ₹3/L
            </p>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
