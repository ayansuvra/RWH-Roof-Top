
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Cloud, Droplets, ThermometerSun, Wind, MapPin, Leaf, type LucideIcon } from "lucide-react";

interface WeatherDetailsProps {
  location: {
    name: string;
    coordinates: { lat: number; lng: number };
  };
}

interface MonthlyRainData {
  month: string;
  rainfall: number;
  collection: number;
}

export function WeatherDetails({ location }: WeatherDetailsProps) {
  // Mock data
  const weatherData = {
    annualRainfall: 847,
    groundWaterLevel: 15,
    climateZone: "Tropical Monsoon",
    monsoonSeason: "June - September",
    averageTemperature: 28,
    humidity: 65,
    windSpeed: 12,
    minerals: ["Calcium", "Magnesium", "Iron traces"],
    carbonFootprint: { current: 2.5, withRWH: 1.8, reduction: 28 },
    monthlyRainfall: [
      { month: "Jan", rainfall: 15, collection: 12 },
      { month: "Feb", rainfall: 22, collection: 18 },
      { month: "Mar", rainfall: 35, collection: 28 },
      { month: "Apr", rainfall: 45, collection: 36 },
      { month: "May", rainfall: 85, collection: 68 },
      { month: "Jun", rainfall: 165, collection: 132 },
      { month: "Jul", rainfall: 195, collection: 156 },
      { month: "Aug", rainfall: 180, collection: 144 },
      { month: "Sep", rainfall: 145, collection: 116 },
      { month: "Oct", rainfall: 75, collection: 60 },
      { month: "Nov", rainfall: 35, collection: 28 },
      { month: "Dec", rainfall: 18, collection: 14 },
    ] as MonthlyRainData[],
  };

  const overviewCards = [
    { icon: Cloud, value: `${weatherData.annualRainfall}mm`, label: "Annual Rainfall", color: "blue" },
    { icon: Droplets, value: `${weatherData.groundWaterLevel}m`, label: "Ground Water Level", color: "cyan" },
    { icon: ThermometerSun, value: `${weatherData.averageTemperature}°C`, label: "Avg Temperature", color: "orange" },
    { icon: Wind, value: `${weatherData.humidity}%`, label: "Avg Humidity", color: "gray" },
  ];

  const renderCard = (Icon: LucideIcon, value: string | number, label: string, color: string, delay: number) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card>
        <CardContent className="p-4 text-center">
          <Icon className={`w-8 h-8 mx-auto mb-2 text-${color}-500`} />
          <p className={`text-2xl font-medium text-${color}-600`}>{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {overviewCards.map((card, idx) => renderCard(card.icon, card.value, card.label, card.color, 0.1 * (idx + 1)))}
      </div>

      {/* Location & Carbon Footprint */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Location */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Location Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Location", value: location.name },
                { label: "Climate Zone", value: weatherData.climateZone },
                { label: "Monsoon Season", value: weatherData.monsoonSeason },
                { label: "Wind Speed", value: `${weatherData.windSpeed} km/h` },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-600">{item.label}:</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-blue-800 mb-2">Water Quality Minerals</h4>
                <div className="flex flex-wrap gap-2">
                  {weatherData.minerals.map((mineral, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {mineral}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Carbon Footprint */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-500" />
                Carbon Footprint Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Current Footprint", value: `${weatherData.carbonFootprint.current} tons CO₂/year`, color: "red" },
                { label: "With RWH System", value: `${weatherData.carbonFootprint.withRWH} tons CO₂/year`, color: "green" },
                { label: "Reduction", value: `${weatherData.carbonFootprint.reduction}%`, color: "blue" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-600">{item.label}:</span>
                  <span className={`font-medium text-${item.color}-600`}>{item.value}</span>
                </div>
              ))}

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="text-green-800 mb-2">Environmental Benefits</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Reduces groundwater extraction pressure</li>
                  <li>• Prevents urban flooding and runoff</li>
                  <li>• Recharges local aquifer systems</li>
                  <li>• Decreases energy consumption for water treatment</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Rainfall Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Rainfall & Collection Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-2">
                {weatherData.monthlyRainfall.map((data, idx) => (
                  <div key={data.month} className="text-center">
                    <div className="relative h-32 bg-gray-100 rounded-t-lg overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.rainfall / 200) * 100}%` }}
                        transition={{ delay: 0.8 + idx * 0.1, duration: 0.5 }}
                        className="absolute bottom-0 w-full bg-blue-400 rounded-t-lg"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.collection / 200) * 100}%` }}
                        transition={{ delay: 0.9 + idx * 0.1, duration: 0.5 }}
                        className="absolute bottom-0 w-full bg-green-500 rounded-t-lg opacity-80"
                      />
                    </div>
                    <p className="text-xs font-medium mt-2">{data.month}</p>
                    <p className="text-xs text-gray-600">{data.rainfall}mm</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded" />
                  <span>Rainfall (mm)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span>Collectible Water</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  💡 Peak collection months are July-August. Consider increasing tank capacity or installing overflow management for optimal utilization.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
