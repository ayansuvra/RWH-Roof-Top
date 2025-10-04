<<<<<<< HEAD
=======

>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  APIProvider,
  Map,
  useMap,
  useApiIsLoaded,
} from "@vis.gl/react-google-maps";
import type { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import {
  DraftingCompass,
  Loader2,
  LocateFixed,
  Info,
  Trash2,
  PenLine,
} from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useToast } from "../hooks/use-toast";
import { suggestRooftopBoundaries } from "../ai/flows/suggest-rooftop-boundaries";

type LatLng = google.maps.LatLngLiteral;
type Mode = "AI_DETECT" | "DRAW";
type Step = "SEARCH" | "PIN" | "DRAWING" | "COMPLETE";
type Unit = "sqm" | "sqft";

const SQM_TO_SQFT = 10.7639;
const INITIAL_ZOOM = 18;
const INITIAL_CENTER: LatLng = { lat: 26.5139, lng: 89.5457 };

<<<<<<< HEAD
=======
// removed unused geoJsonToLatLng helper

>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f
const Guide = ({ step }: { step: Step }) => {
  const guideContent = {
    SEARCH: {
      title: "Step 1: Find your home",
      description:
        "Use the search bar to find an address or use your current location.",
    },
    PIN: {
      title: "Step 2: Pin your house",
      description:
        "Click on the map to place a pin on a rooftop for the AI to detect, or click 'Draw' to outline an area manually.",
    },
    DRAWING: {
      title: "Step 2: Draw your area",
      description:
        "Click on the map to add points to your polygon. When you're done, click 'Finish Drawing'.",
    },
    COMPLETE: {
      title: "Step 3: Survey Complete!",
      description:
        "The area has been outlined and calculated. You can now edit the polygon or clear the result to try again.",
    },
  };

  const { title, description } = guideContent[step];

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <Info className="text-primary w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

interface PolygonProps extends google.maps.PolygonOptions {
  onEdit?: (path: LatLng[]) => void;
}

const Polygon = (props: PolygonProps) => {
  const map = useMap();
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const { onEdit, ...polygonOptions } = props;

<<<<<<< HEAD
=======

>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f
  useEffect(() => {
    if (!map) return;
    if (!polygon) {
      const newPolygon = new google.maps.Polygon(polygonOptions);
      setPolygon(newPolygon);
    } else {
      polygon.setOptions(polygonOptions);
    }
  }, [map, polygon, polygonOptions]);

  useEffect(() => {
    if (polygon) {
      polygon.setMap(map);

      // Clean up existing listeners
      listenersRef.current.forEach(listener => listener.remove());
      listenersRef.current = [];

      const updatePath = () => {
        const path = polygon.getPath().getArray().map(p => p.toJSON());
        onEdit?.(path);
      };

      if (props.editable) {
        listenersRef.current.push(polygon.getPath().addListener('set_at', updatePath));
        listenersRef.current.push(polygon.getPath().addListener('insert_at', updatePath));
        listenersRef.current.push(polygon.getPath().addListener('remove_at', updatePath));
      }
    }

    return () => {
      if (polygon) polygon.setMap(null);
    };
  }, [map, polygon, props.editable, onEdit]);

  return null;
};

export default function SurveyorApp({ apiKey }: { apiKey: string }) {
  const [polygonPoints, setPolygonPoints] = useState<LatLng[]>([]);
  const [area, setArea] = useState(0);
  const [unit, setUnit] = useState<Unit>("sqm");
  const [step, setStep] = useState<Step>("SEARCH");
  const [mode, setMode] = useState<Mode>("AI_DETECT");
  const [mapCenter, setMapCenter] = useState<LatLng>(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef =
    useRef<google.maps.places.Autocomplete | null>(null);

  const displayedArea = useMemo(
    () => (unit === "sqm" ? area : area * SQM_TO_SQFT),
    [area, unit]
  );

  useEffect(() => {
    if (polygonPoints.length > 2) {
      const polygonPath = new google.maps.Polygon({ paths: polygonPoints });
      const polygonArea =
        google.maps.geometry.spherical.computeArea(polygonPath.getPath());
      setArea(polygonArea);
    } else {
      setArea(0);
    }
  }, [polygonPoints]);

  const handleAIDetect = useCallback(
    async (clickedLatLng: LatLng, map: google.maps.Map) => {
      const projection = map.getProjection();
      if (!projection) return;

      setIsLoading(true);
      setPolygonPoints([]);
      setStep("PIN");
      toast({
        title: "AI is thinking...",
        description: "Analyzing the rooftop image.",
      });

      try {
        const imageWidth = 800;
        const imageHeight = 600;
        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=${zoom}&size=${imageWidth}x${imageHeight}&maptype=satellite&key=${apiKey}`;
        const response = await fetch(staticMapUrl);
        if (!response.ok) {
          toast({
            variant: 'destructive',
            title: 'Map Capture Failed',
            description: 'Failed to fetch map image. Please ensure the "Maps Static API" is enabled in your Google Cloud project.'
          });
          setIsLoading(false);
          return;
        }

        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = async () => {
          try {
            const base64data = reader.result as string;
            
            const mapCenterPoint = projection.fromLatLngToPoint(new google.maps.LatLng(mapCenter));
            if(!mapCenterPoint) throw new Error("Could not calculate map center point");

            const clickedPointOnMap = projection.fromLatLngToPoint(new google.maps.LatLng(clickedLatLng));
            if(!clickedPointOnMap) throw new Error("Could not calculate clicked point");
            
            const scale = 1 << zoom;
            
            const worldCenter = projection.fromLatLngToPoint(new google.maps.LatLng(mapCenter), new google.maps.Point(0,0));
            if(!worldCenter) throw new Error("Could not get world center");

            const clickX = (clickedPointOnMap.x - worldCenter.x) * scale + imageWidth / 2;
            const clickY = (clickedPointOnMap.y - worldCenter.y) * scale + imageHeight / 2;

<<<<<<< HEAD
=======

>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f
            const result = await suggestRooftopBoundaries({
              satelliteImageDataUri: base64data,
              clickedPoint: { x: clickX, y: clickY },
            });
            
            const pixelCoords = result.suggestedBoundaries.coordinates[0];

<<<<<<< HEAD
            const newPoints = pixelCoords.map((pixel: any) => {
=======
            const newPoints = pixelCoords.map(pixel => {
>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f
              const pixelX = pixel[0];
              const pixelY = pixel[1];

              const worldX = (pixelX - imageWidth/2) / scale + worldCenter.x;
              const worldY = (pixelY - imageHeight/2) / scale + worldCenter.y;

              const point = new google.maps.Point(worldX, worldY);
              const latLng = projection.fromPointToLatLng(point);
              
              if(!latLng) throw new Error("Could not convert point to latlng");
              
              return { lat: latLng.lat(), lng: latLng.lng() };
            });

            setPolygonPoints(newPoints);
            setStep("COMPLETE");

            toast({
              title: "AI Suggestion Applied!",
              description: "The rooftop has been outlined and area calculated.",
            });
          } catch (err: any) {
            console.error("AI suggestion failed:", err);
            setStep("PIN");
            toast({
              variant: "destructive",
              title: "AI Error",
              description: err.message || "Could not detect rooftop.",
            });
          } finally {
            setIsLoading(false);
          }
        };

        reader.onerror = () => {
          setIsLoading(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to process map image.",
          });
        };

        reader.readAsDataURL(blob);
      } catch (error: any) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Map Capture Failed",
          description: error.message,
        });
        setIsLoading(false);
      }
    },
    [apiKey, mapCenter, toast, zoom]
  );
  
  const handleDrawPoint = useCallback((clickedLatLng: LatLng) => {
    setPolygonPoints(prevPoints => [...prevPoints, clickedLatLng]);
  }, []);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent, map: google.maps.Map | null) => {
      if (!event.latLng || isLoading || !map) return;
      
      const clickedLatLng = event.latLng.toJSON();

      if (mode === "AI_DETECT") {
        handleAIDetect(clickedLatLng, map);
      } else if (mode === "DRAW") {
        if (step !== 'COMPLETE') {
          handleDrawPoint(clickedLatLng);
        }
      }
    },
    [isLoading, mode, handleAIDetect, handleDrawPoint, step]
  );

  const handleClear = useCallback(() => {
    setPolygonPoints([]);
    setArea(0);
    setStep(mode === "DRAW" ? "DRAWING" : "PIN");
  }, [mode]);

  const handleCameraChange = (e: MapCameraChangedEvent) => {
    setZoom(e.detail.zoom);
    setMapCenter(e.detail.center);
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCenter = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setMapCenter(newCenter);
          setZoom(20);
          setStep(mode === "DRAW" ? "DRAWING" : "PIN");
          toast({
            title: "Location Found!",
            description: "Map centered on your current location.",
          });
        },
        () =>
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not access your location.",
          })
      );
    }
  };

  const toggleMode = (newMode: Mode) => {
    setMode(newMode);
    setPolygonPoints([]);
    setArea(0);
    if (newMode === "DRAW") {
      setStep("DRAWING");
    } else {
      setStep("PIN");
    }
  };

  const finishDrawing = () => {
    if (polygonPoints.length > 2) {
      // Close the polygon
      setPolygonPoints(prevPoints => [...prevPoints, prevPoints[0]]);
      setStep("COMPLETE");
      toast({
        title: "Drawing Complete!",
        description: "The area has been calculated.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Not enough points",
        description: "Please click at least 3 points to form an area.",
      });
    }
  };

<<<<<<< HEAD
=======

>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f
  return (
    <APIProvider apiKey={apiKey} libraries={["places", "geometry"]}>
        <div className="flex flex-col h-screen font-body text-foreground">
          <header className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-3">
              <DraftingCompass className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold tracking-tight font-headline">
                Rooftop Surveyor
              </h1>
            </div>
          </header>

          <main className="flex-1 grid grid-cols-1 md:grid-cols-[380px_1fr]">
            {/* Sidebar */}
            <div className="flex flex-col gap-4 p-4 overflow-y-auto bg-card">
              <Guide step={step} />

              {/* Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-headline">
                    Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => toggleMode("AI_DETECT")} variant={mode === "AI_DETECT" ? "default" : "outline"}>
                      <DraftingCompass className="mr-2" /> AI Detect
                    </Button>
                    <Button onClick={() => toggleMode("DRAW")} variant={mode === "DRAW" ? "default" : "outline"}>
                       <PenLine className="mr-2" /> Draw
                    </Button>
                  </div>

                  <Label>Address Search</Label>
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Enter your address..."
                    disabled={step === 'DRAWING' && polygonPoints.length > 0}
                  />
                  <Button
                    onClick={handleUseLocation}
                    variant="outline"
                    className="w-full"
                     disabled={step === 'DRAWING' && polygonPoints.length > 0}
                  >
                    <LocateFixed className="mr-2" />
                    Use My Location
                  </Button>
                  {mode === 'DRAW' && step === 'DRAWING' && (
                    <Button onClick={finishDrawing} className="w-full" disabled={polygonPoints.length < 3}>
                      Finish Drawing
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-headline">
                    Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Unit Switch */}
                  <div className="flex items-center justify-between">
                    <Label className="flex flex-col">
                      <span className="font-semibold">Area Unit</span>
                      <span className="text-sm text-muted-foreground">
                        Toggle between m² and ft²
                      </span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          unit === "sqm"
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        m²
                      </span>
                      <Switch
                        checked={unit === "sqft"}
<<<<<<< HEAD
                        onCheckedChange={(checked: any) =>
=======
                        onCheckedChange={(checked) =>
>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f
                          setUnit(checked ? "sqft" : "sqm")
                        }
                      />
                      <span
                        className={`text-sm ${
                          unit === "sqft"
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        ft²
                      </span>
                    </div>
                  </div>

                  {/* Area Display */}
                  <div className="text-center bg-muted/50 p-6 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Rooftop Area
                    </p>
                    <p className="text-4xl font-bold">
                      {displayedArea.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {unit === "sqm" ? "Square Meters" : "Square Feet"}
                    </p>
                  </div>

                  {/* Clear Button */}
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleClear}
                    disabled={polygonPoints.length === 0 || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 />
                    )}
                    Clear
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Map View */}
            <div className="relative w-full h-full border-l">
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 text-white">
                    <Loader2 className="animate-spin" />
                    <span>Detecting Rooftop...</span>
                  </div>
                </div>
              )}
              <Map
                center={mapCenter}
                zoom={zoom}
                onCameraChanged={handleCameraChange}
                mapTypeId="hybrid"
                tilt={0}
                className="w-full h-full"
                gestureHandling={step === 'DRAWING' && polygonPoints.length > 0 ? 'none' : 'auto'}
              >
                <Polygon
                  paths={polygonPoints}
                  strokeColor="#FFA500"
                  strokeOpacity={0.9}
                  strokeWeight={3}
                  fillColor="#FFA500"
                  fillOpacity={0.3}
                  editable={step === "COMPLETE"}
                  draggable={step === "COMPLETE"}
                  onEdit={(newPath) => setPolygonPoints(newPath)}
                />
                <MapInteractionHandler
                  setMapCenter={setMapCenter}
                  setStep={setStep}
                  setZoom={setZoom}
                  searchInputRef={searchInputRef}
                  autocompleteRef={autocompleteRef}
                  onMapClick={handleMapClick}
                  mode={mode}
                />
              </Map>
            </div>
          </main>
        </div>
    </APIProvider>
  );
}

function MapInteractionHandler({
  setMapCenter,
  setStep,
  setZoom,
  searchInputRef,
  autocompleteRef,
  onMapClick,
  mode
}: {
  setMapCenter: (center: LatLng) => void;
  setStep: (step: Step) => void;
  setZoom: (zoom: number) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>;
  onMapClick: (e: google.maps.MapMouseEvent, map: google.maps.Map | null) => void;
  mode: Mode;
}) {
  const map = useMap();
  const apiIsLoaded = useApiIsLoaded();
  const { toast } = useToast();
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (!apiIsLoaded || !map) return;
    if (!geocoderRef.current) geocoderRef.current = new google.maps.Geocoder();

    const clickListener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      onMapClick(e, map);
      if (e.latLng && mode === 'AI_DETECT') {
        geocoderRef.current!.geocode({ location: e.latLng }, (results, status) => {
          if (status === "OK" && results && results[0] && searchInputRef.current) {
            searchInputRef.current.value = results[0].formatted_address;
          } else if (status !== 'ZERO_RESULTS') {
            toast({
              variant: "destructive",
              title: "Geocoding Failed",
              description: "Could not find address for this location.",
            });
          }
        });
      }
    });

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [apiIsLoaded, map, searchInputRef, toast, onMapClick, mode]);

  useEffect(() => {
    if (!map || !apiIsLoaded || !searchInputRef.current) return;

    if (!autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(searchInputRef.current, {
        fields: ["geometry", "formatted_address"],
        types: ["address"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current!.getPlace();
        if (place.geometry?.location) {
          setMapCenter(place.geometry.location.toJSON());
          setZoom(20);
          setStep(mode === "DRAW" ? "DRAWING" : "PIN");
        }
        if (place.formatted_address && searchInputRef.current) {
          searchInputRef.current.value = place.formatted_address;
        }
      });
    }
  }, [map, apiIsLoaded, searchInputRef, autocompleteRef, setMapCenter, setStep, setZoom, mode]);

  return null;
}
<<<<<<< HEAD

=======
>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f
