<<<<<<< HEAD
// import { useState } from "react";
=======
>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { resolveGoogleMapsApiKey } from "../../../lib/utils";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface MapAreaCalculatorProps {
  onAreaCalculated: (area: number) => void;
}

export function MapAreaCalculator({ onAreaCalculated }: MapAreaCalculatorProps) {
<<<<<<< HEAD
  // const [area] = useState(0);
  
=======
  const apiKey = resolveGoogleMapsApiKey() || "";
>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f
  return (
    <Card>
      <CardHeader>
        <CardTitle>Map Area Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4">
          <APIProvider apiKey={apiKey}>
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
