import React from "react";
// SystemBlueprint.tsx

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Download, FileText, Wrench, ShoppingCart } from "lucide-react";
<<<<<<< HEAD
import type { UserData } from "../../App";
=======
import type { UserData } from "../../types";
>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f

interface SystemBlueprintProps {
  userData: UserData;
  results: {
    annualCollection: number;
    annualSavings: number;
    paybackPeriod: number;
  };
}

const SystemBlueprint: React.FC<SystemBlueprintProps> = ({ userData, results }) => {
  const components = [
    {
      name: "Gutters & Downspouts",
      quantity: Math.ceil(userData.rooftop.area / 20),
      unit: "sets",
      priceRange: "₹2,000 - ₹4,000",
      description: "Aluminum/PVC gutters for water collection",
    },
    {
      name: "First Flush Diverter",
      quantity: 1,
      unit: "unit",
      priceRange: "₹3,500 - ₹5,500",
      description: "Removes initial contaminated water",
    },
    {
      name: "Mesh Filter",
      quantity: 2,
      unit: "units",
      priceRange: "₹800 - ₹1,500",
      description: "Coarse and fine filtration layers",
    },
    {
      name: `Storage Tank (${userData.tankCapacity}L)`,
      quantity: 1,
      unit: "unit",
      priceRange:
        userData.tankCapacity <= 1000
          ? "₹12,000 - ₹18,000"
          : userData.tankCapacity <= 5000
          ? "₹35,000 - ₹50,000"
          : "₹60,000 - ₹2,50,000",
      description: userData.hasTank
        ? "Modification of existing tank"
        : "New storage tank installation",
    },
    {
      name: "Distribution Pump",
      quantity: 1,
      unit: "unit",
      priceRange: "₹8,000 - ₹15,000",
      description: "Water delivery system to taps",
    },
    {
      name: "Piping & Fittings",
      quantity: 1,
      unit: "set",
      priceRange: "₹5,000 - ₹10,000",
      description: "PVC/HDPE pipes and connectors",
    },
    {
      name: "Control Panel",
      quantity: 1,
      unit: "unit",
      priceRange: "₹3,000 - ₹6,000",
      description: "Automated system monitoring",
    },
  ];

  const installationSteps = [
    "Site survey and planning",
    "Gutter and downspout installation",
    "First flush diverter setup",
    "Filtration system installation",
    "Tank placement and connection",
    "Pump and distribution setup",
    "System testing and commissioning",
    "User training and handover",
  ];

  const totalEstimate = {
    materials:
      userData.useType === "household"
        ? userData.tankCapacity <= 1000
          ? 35000
          : userData.tankCapacity <= 5000
          ? 65000
          : 120000
        : userData.tankCapacity <= 25000
        ? 180000
        : 350000,
    installation: userData.useType === "household" ? 15000 : 35000,
    total: 0,
  };
  totalEstimate.total = totalEstimate.materials + totalEstimate.installation;

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              System Architecture Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Specifications */}
              <div className="space-y-4">
                <h4 className="text-gray-800">System Specifications</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collection Area:</span>
                    <span className="font-medium">{userData.rooftop.area} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Roof Type:</span>
                    <span className="font-medium capitalize">{userData.rooftop.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage Capacity:</span>
                    <span className="font-medium">{userData.tankCapacity.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Collection:</span>
                    <span className="font-medium">{results.annualCollection.toLocaleString()} L/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Use Case:</span>
                    <span className="font-medium capitalize">{userData.useType}</span>
                  </div>
                </div>
              </div>

              {/* Flow Diagram */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-blue-800 mb-3">Flow Diagram</h4>
                <div className="space-y-2 text-sm">
                  {[
                    { color: "bg-blue-500", text: "Rooftop Collection" },
                    { color: "bg-green-500", text: "Gutter System" },
                    { color: "bg-yellow-500", text: "First Flush Diverter" },
                    { color: "bg-purple-500", text: "Filtration System" },
                    { color: "bg-red-500", text: "Storage Tank" },
                    { color: "bg-gray-500", text: "Distribution System" },
                  ].map((item, i, arr) => (
                    <React.Fragment key={i}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${item.color} rounded-full`} />
                        <span>{item.text}</span>
                      </div>
                      {i < arr.length - 1 && <div className="pl-5 text-gray-600">↓</div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Components List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-green-500" />
              Required Components & Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Component</th>
                    <th className="text-center py-2">Quantity</th>
                    <th className="text-center py-2">Price Range</th>
                    <th className="text-left py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((component, index) => (
                    <motion.tr
                      key={component.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 font-medium">{component.name}</td>
                      <td className="py-3 text-center">
                        {component.quantity} {component.unit}
                      </td>
                      <td className="py-3 text-center text-green-600">{component.priceRange}</td>
                      <td className="py-3 text-gray-600">{component.description}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cost Summary */}
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-blue-600 font-medium">Materials Cost</p>
                <p className="text-2xl font-bold text-blue-800">₹{totalEstimate.materials.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-green-600 font-medium">Installation Cost</p>
                <p className="text-2xl font-bold text-green-800">₹{totalEstimate.installation.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-purple-600 font-medium">Total Investment</p>
                <p className="text-2xl font-bold text-purple-800">₹{totalEstimate.total.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Installation Process */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-500" />
              Installation Process & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Steps */}
              <div>
                <h4 className="text-gray-800 mb-4">Installation Steps</h4>
                <div className="space-y-3">
                  {installationSteps.map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="text-gray-800">Timeline & Requirements</h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-800">Installation Duration</p>
                    <p className="text-sm text-gray-600">
                      {userData.useType === "household" ? "3-5 days" : "1-2 weeks"} (weather dependent)
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-800">Permits Required</p>
                    <p className="text-sm text-gray-600">Building permission for structural modifications (if any)</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-800">Maintenance</p>
                    <p className="text-sm text-gray-600">Quarterly filter cleaning, annual system inspection</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-800">Warranty</p>
                    <p className="text-sm text-gray-600">2 years on equipment, 5 years on tank</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Download Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-blue-800 mb-4">Complete System Blueprint & Documentation</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Download your complete rainwater harvesting system blueprint including detailed drawings, component
                specifications, installation guide, and maintenance schedule.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Blueprint (PDF)
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Technical Specifications
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Includes: CAD drawings, material list, installation guide, maintenance schedule, warranty information
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SystemBlueprint;
