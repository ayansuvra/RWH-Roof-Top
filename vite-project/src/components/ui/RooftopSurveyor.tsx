import React, { useState, useEffect } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Switch } from './switch';
import { Input } from './input';
import { MapPin, Square, Bot, Hand } from 'lucide-react';

interface LatLng {
  lat: number;
  lng: number;
}

interface RooftopSurveyorProps {
  onAreaCalculated: (area: number) => void;
  apiKey: string;
}

const RooftopSurveyor: React.FC<RooftopSurveyorProps> = ({ onAreaCalculated, apiKey }) => {
  const [polygonPoints, setPolygonPoints] = useState<LatLng[]>([]);
  const [area, setArea] = useState<number>(0);
  const [step, setStep] = useState<string>('SEARCH');
  const [mode, setMode] = useState<string>('DRAW');
  const [mapCenter, setMapCenter] = useState<LatLng>({ lat: 28.6139, lng: 77.2090 });
  const [zoom, setZoom] = useState<number>(18);
  const [searchValue, setSearchValue] = useState<string>('');

  // Calculate area when polygon points change
  useEffect(() => {
    if (polygonPoints.length >= 3) {
      // Simple area calculation for demo
      const calculatedArea = polygonPoints.length * 50; // Mock calculation
      setArea(calculatedArea);
    }
  }, [polygonPoints]);

  const handleMapClick = (event: any) => {
    if (!event.detail?.latLng) return;

    const clickedPoint = {
      lat: event.detail.latLng.lat,
      lng: event.detail.latLng.lng
    };

    if (mode === 'DRAW') {
      setPolygonPoints(prev => [...prev, clickedPoint]);
      if (step === 'SEARCH') setStep('DRAWING');
    }
  };

  const completeDrawing = () => {
    if (polygonPoints.length >= 3) {
      setStep('COMPLETE');
    }
  };

  const resetSurvey = () => {
    setPolygonPoints([]);
    setArea(0);
    setStep('SEARCH');
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      setStep('DRAWING');
    }
  };

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
            {step === 'SEARCH' && (
              <div className="space-y-2">
                <Input
                  placeholder="Search for your address..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button onClick={handleSearch} className="w-full">
                  Search Location
                </Button>
              </div>
            )}

            {step === 'DRAWING' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Detection Mode</span>
                  <div className="flex items-center gap-2">
                    <Hand className="w-4 h-4" />
                    <Switch
                      checked={mode === 'AI_DETECT'}
                      onCheckedChange={(checked) => setMode(checked ? 'AI_DETECT' : 'DRAW')}
                    />
                    <Bot className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  {mode === 'AI_DETECT' 
                    ? 'Click on your rooftop for AI detection'
                    : 'Click to draw rooftop boundaries'
                  }
                </p>

                <div className="text-sm">
                  Points: {polygonPoints.length}
                </div>

                {polygonPoints.length >= 3 && (
                  <Button onClick={completeDrawing} className="w-full">
                    Complete Drawing
                  </Button>
                )}
              </div>
            )}

            {step === 'COMPLETE' && (
              <div className="space-y-4">
                <div className="text-center">
                  <Square className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold">Area Calculated</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {area.toFixed(2)} m²
                  </p>
                  <p className="text-sm text-gray-600">
                    {(area * 10.764).toFixed(2)} sq ft
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={resetSurvey} variant="outline" className="flex-1">
                    Reset
                  </Button>
                  <Button onClick={() => onAreaCalculated(area)} className="flex-1">
                    Use This Area
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={mapCenter}
          defaultZoom={zoom}
          mapTypeId="satellite"
          onClick={handleMapClick}
          className="w-full h-full"
          onCameraChanged={(ev) => {
            if (ev.detail?.center) {
              setMapCenter({ lat: ev.detail.center.lat, lng: ev.detail.center.lng });
            }
            if (ev.detail?.zoom) {
              setZoom(ev.detail.zoom);
            }
          }}
        />
      </APIProvider>
    </div>
  );
};

export default RooftopSurveyor;
