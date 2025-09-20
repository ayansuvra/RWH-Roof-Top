import { useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface MapAreaCalculatorProps {
  onAreaCalculated: (area: number) => void;
}

export function MapAreaCalculator({ onAreaCalculated }: MapAreaCalculatorProps) {
  const [area, setArea] = useState(0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Map Area Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}>
            <Map
              defaultCenter={{ lat: 28.6139, lng: 77.209 }}
              defaultZoom={18}
              mapTypeId="satellite"
            />
          </APIProvider>
        </div>
        <Button onClick={() => onAreaCalculated(100)}>
          Use Calculated Area
        </Button>
      </CardContent>
    </Card>
  );
}
