import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Label } from "./label";
<<<<<<< HEAD
import type { UserData } from "../../App";
=======
import type { UserData } from "../../types";
>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f

interface CostComparisonProps {
  userData: UserData;
}

export function CostComparison({ userData: _ }: CostComparisonProps) {
  const [monthlyWaterBill, setMonthlyWaterBill] = useState("2500");
  const [monthlyElectricityBill, setMonthlyElectricityBill] = useState("1800");
  const [waterConsumption, setWaterConsumption] = useState("15000");

  const currentAnnualWaterCost = parseFloat(monthlyWaterBill) * 12;
  const currentAnnualElectricityCost = parseFloat(monthlyElectricityBill) * 12;
  const totalCurrentCost = currentAnnualWaterCost + currentAnnualElectricityCost;

  const estimatedSystemCost = 75000;
  const annualWaterSavings = currentAnnualWaterCost * 0.6;
  const annualElectricitySavings = currentAnnualElectricityCost * 0.3;
  const totalAnnualSavings = annualWaterSavings + annualElectricitySavings;
  const paybackPeriod = estimatedSystemCost / totalAnnualSavings;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis & Savings Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="waterBill">Monthly Water Bill (₹)</Label>
                <Input
                  id="waterBill"
                  type="number"
                  value={monthlyWaterBill}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlyWaterBill(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="electricityBill">Monthly Electricity Bill (₹)</Label>
                <Input
                  id="electricityBill"
                  type="number"
                  value={monthlyElectricityBill}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlyElectricityBill(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="waterConsumption">Water Consumption (L/month)</Label>
                <Input
                  id="waterConsumption"
                  type="number"
                  value={waterConsumption}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaterConsumption(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Annual Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Water:</span>
                      <span>₹{currentAnnualWaterCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Electricity:</span>
                      <span>₹{currentAnnualElectricityCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>₹{totalCurrentCost.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Projected Annual Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Water Savings:</span>
                      <span className="text-green-600">₹{annualWaterSavings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Electricity Savings:</span>
                      <span className="text-green-600">₹{annualElectricitySavings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total Savings:</span>
                      <span className="text-green-600">₹{totalAnnualSavings.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Investment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">₹{estimatedSystemCost.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Initial Investment</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{paybackPeriod.toFixed(1)} years</div>
                    <div className="text-sm text-gray-600">Payback Period</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {((totalAnnualSavings / estimatedSystemCost) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Annual ROI</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
