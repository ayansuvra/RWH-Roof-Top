import { useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { resolveGoogleMapsApiKey } from "../../../lib/utils";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { MapPin } from "lucide-react";

interface AreaCalculatorProps {
  onAreaCalculated: (area: number) => void;
}

export function AreaCalculator({ onAreaCalculated }: AreaCalculatorProps) {
  const [area, setArea] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const apiKey = resolveGoogleMapsApiKey() || "demo-key";

  const finishDrawing = () => {
    setIsDrawing(false);
    onAreaCalculated(area);
  };

  const clearArea = () => {
    setArea(0);
    setIsDrawing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Area Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64 w-full rounded-lg overflow-hidden">
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={{ lat: 28.6139, lng: 77.209 }}
              defaultZoom={18}
              mapTypeId="satellite"
            />
          </APIProvider>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsDrawing(!isDrawing)}
            variant={isDrawing ? "destructive" : "default"}
          >
            {isDrawing ? "Stop Drawing" : "Start Drawing"}
          </Button>
          
          <Button onClick={() => finishDrawing()} variant="outline">
            Finish (100 m²)
          </Button>
          
          <Button onClick={clearArea} variant="ghost">
            Clear
          </Button>
        </div>
        
        {area > 0 && (
          <div className="text-sm text-muted-foreground">
            Calculated area: {Math.round(area)} square meters
          </div>
        )}
      </CardContent>
    </Card>
  );
}
