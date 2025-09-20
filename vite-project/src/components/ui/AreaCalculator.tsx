import { useState, useCallback } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { MapPin, Calculator } from "lucide-react";

interface AreaCalculatorProps {
  onAreaCalculated: (area: number) => void;
}

export function AreaCalculator({ onAreaCalculated }: AreaCalculatorProps) {
  const [polygonPoints, setPolygonPoints] = useState<google.maps.LatLngLiteral[]>([]);
  const [area, setArea] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "demo-key";

  const calculateArea = useCallback((points: google.maps.LatLngLiteral[]) => {
    if (points.length < 3) return 0;
    
    // Simple polygon area calculation using shoelace formula
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].lat * points[j].lng;
      area -= points[j].lat * points[i].lng;
    }
    return Math.abs(area) * 111320 * 111320 / 2; // Convert to square meters
  }, []);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (!isDrawing || !event.latLng) return;
    
    const newPoint = event.latLng.toJSON();
    const newPoints = [...polygonPoints, newPoint];
    setPolygonPoints(newPoints);
    
    if (newPoints.length >= 3) {
      const calculatedArea = calculateArea(newPoints);
      setArea(calculatedArea);
    }
  }, [isDrawing, polygonPoints, calculateArea]);

  const finishDrawing = () => {
    setIsDrawing(false);
    onAreaCalculated(area);
  };

  const clearArea = () => {
    setPolygonPoints([]);
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
              onClick={handleMapClick}
            >
              {polygonPoints.length > 0 && (
                <div>
                  {/* Polygon will be rendered here */}
                </div>
              )}
            </Map>
          </APIProvider>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsDrawing(!isDrawing)}
            variant={isDrawing ? "destructive" : "default"}
          >
            {isDrawing ? "Stop Drawing" : "Start Drawing"}
          </Button>
          
          {polygonPoints.length >= 3 && (
            <Button onClick={finishDrawing} variant="outline">
              Finish ({Math.round(area)} m²)
            </Button>
          )}
          
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
