import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Calculator } from 'lucide-react';

interface SimpleAreaCalculatorProps {
  onAreaCalculated: (area: number) => void;
}

const SimpleAreaCalculator: React.FC<SimpleAreaCalculatorProps> = ({ onAreaCalculated }) => {
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [area, setArea] = useState<number>(0);

  const calculateArea = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    if (l > 0 && w > 0) {
      const calculatedArea = l * w;
      setArea(calculatedArea);
      onAreaCalculated(calculatedArea);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculate Rooftop Area
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Length (meters)</label>
            <Input
              type="number"
              placeholder="Enter length"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Width (meters)</label>
            <Input
              type="number"
              placeholder="Enter width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>

          <Button onClick={calculateArea} className="w-full">
            Calculate Area
          </Button>

          {area > 0 && (
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold">Calculated Area</h3>
              <p className="text-2xl font-bold text-blue-600">
                {area.toFixed(2)} m²
              </p>
              <p className="text-sm text-gray-600">
                {(area * 10.764).toFixed(2)} sq ft
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleAreaCalculator;
