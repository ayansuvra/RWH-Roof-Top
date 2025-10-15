"use client";

import { useCallback } from "react";
import { useMap } from "@vis.gl/react-google-maps";

import { useToast } from "../hooks/use-toast";
import type { LatLng, Step } from "./surveyor-app";
import { suggestRooftopBoundaries } from "../ai/flows/suggest-rooftop-boundaries";

interface AIDetectModeProps {
  setIsLoading: (loading: boolean) => void;
  setPolygonPoints: (points: LatLng[]) => void;
  setStep: (step: Step) => void;
  mapCenter: LatLng;
  zoom: number;
  apiKey: string;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export default function AIDetectMode({ 
  setIsLoading, 
  setPolygonPoints,
  setStep,
  mapCenter,
  zoom,
  apiKey,
  searchInputRef
}: AIDetectModeProps) {
  const map = useMap();
  const { toast } = useToast();

  const handleAIDetect = useCallback(
    async (clickedLatLng: LatLng, mapInstance: google.maps.Map) => {
      const projection = mapInstance.getProjection();
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
        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=${zoom}&size=${imageWidth}x${imageHeight}&maptype=hybrid&key=${apiKey}`;
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


            const result = await suggestRooftopBoundaries({
              satelliteImageDataUri: base64data,
              clickedPoint: { x: clickX, y: clickY },
            });
            
            const pixelCoords = result.suggestedBoundaries.coordinates[0];

            const newPoints = pixelCoords.map(pixel => {
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
    [apiKey, mapCenter, toast, zoom, setIsLoading, setPolygonPoints, setStep]
  );
  
  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng || !map) return;
      
      const clickedLatLng = event.latLng.toJSON();
      handleAIDetect(clickedLatLng, map);

       const geocoder = new google.maps.Geocoder();
       geocoder.geocode({ location: event.latLng }, (results, status) => {
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

    },
    [map, handleAIDetect, searchInputRef, toast]
  );

  useEffect(() => {
    if (!map) return;

    // Clear existing listeners and add our AI detect listener
    google.maps.event.clearInstanceListeners(map);
    const clickListener = map.addListener("click", handleMapClick);

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map, handleMapClick]);

  return null;
}
