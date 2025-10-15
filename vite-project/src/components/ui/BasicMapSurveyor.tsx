import React, { useState, useEffect, useRef } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { MapPin, Square } from 'lucide-react';

interface LatLng {
  lat: number;
  lng: number;
}

interface BasicMapSurveyorProps {
  onAreaCalculated: (area: number) => void;
  apiKey: string;
}

const BasicMapSurveyor: React.FC<BasicMapSurveyorProps> = ({ onAreaCalculated, apiKey }) => {
  const [polygonPoints, setPolygonPoints] = useState<LatLng[]>([]);
  const [area, setArea] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const polygonInstance = useRef<any>(null);

  useEffect(() => {
    // Create a unique callback name
    const callbackName = `initMap_${Date.now()}`;
    
    // Define the callback function
    (window as any)[callbackName] = () => {
      try {
        initMap();
        setIsMapLoaded(true);
      } catch (err) {
        setError('Failed to initialize map');
        console.error('Map initialization error:', err);
      }
    };

    // Check if Google Maps is already loaded
    if ((window as any).google?.maps) {
      (window as any)[callbackName]();
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
      setError('Failed to load Google Maps');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      delete (window as any)[callbackName];
      const existingScript = document.querySelector(`script[src*="${callbackName}"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [apiKey]);

  const initMap = () => {
    if (!mapRef.current || !(window as any).google?.maps) return;

    const google = (window as any).google;
    
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 28.6139, lng: 77.2090 },
      zoom: 18,
      mapTypeId: 'satellite',
    });

    mapInstance.current = map;

    map.addListener('click', (event: any) => {
      if (event.latLng && !isComplete) {
        const newPoint = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        
        const newPoints = [...polygonPoints, newPoint];
        setPolygonPoints(newPoints);
        updatePolygon(newPoints);
      }
    });
  };

  const updatePolygon = (points: LatLng[]) => {
    if (!mapInstance.current || !(window as any).google?.maps) return;

    const google = (window as any).google;

    // Remove existing polygon
    if (polygonInstance.current) {
      polygonInstance.current.setMap(null);
    }

    if (points.length < 2) return;

    // Create new polygon
    const polygon = new google.maps.Polygon({
      paths: points,
      strokeColor: '#3B82F6',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#3B82F6',
      fillOpacity: 0.35,
    });

    polygon.setMap(mapInstance.current);
    polygonInstance.current = polygon;

    // Calculate area if we have at least 3 points
    if (points.length >= 3 && google.maps.geometry) {
      const path = points.map(point => new google.maps.LatLng(point.lat, point.lng));
      const calculatedArea = google.maps.geometry.spherical.computeArea(path);
      setArea(calculatedArea);
    }
  };

  const completeDrawing = () => {
    if (polygonPoints.length >= 3) {
      setIsComplete(true);
    }
  };

  const resetSurvey = () => {
    setPolygonPoints([]);
    setArea(0);
    setIsComplete(false);
    if (polygonInstance.current) {
      polygonInstance.current.setMap(null);
    }
  };

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <div className="absolute top-4 left-4 z-10 space-y-4">
        <Card className="w-80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Rooftop Surveyor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isMapLoaded ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Click on the map to draw your rooftop boundaries. You need at least 3 points.
                </p>

                <div className="text-sm">
                  Points selected: {polygonPoints.length}
                  {polygonPoints.length >= 3 && (
                    <span className="ml-2 text-green-600">
                      ✓ Ready to complete
                    </span>
                  )}
                </div>

                {polygonPoints.length >= 3 && !isComplete && (
                  <Button onClick={completeDrawing} className="w-full">
                    Complete Drawing
                  </Button>
                )}

                {area > 0 && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Square className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold">Area Calculated</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {area.toFixed(2)} m²
                    </p>
                    <p className="text-sm text-gray-600">
                      {(area * 10.764).toFixed(2)} sq ft
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={resetSurvey} variant="outline" className="flex-1">
                    Reset
                  </Button>
                  {isComplete && (
                    <Button onClick={() => onAreaCalculated(area)} className="flex-1">
                      Use This Area
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div ref={mapRef} className="w-full h-full">
        {!isMapLoaded && (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Google Maps...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicMapSurveyor;
