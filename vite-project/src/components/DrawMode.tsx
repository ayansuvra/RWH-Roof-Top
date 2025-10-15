"use client";

import { useCallback, useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

import type { LatLng, Step } from "./surveyor-app";

interface DrawModeProps {
  polygonPoints: LatLng[];
  setPolygonPoints: (points: LatLng[] | ((prev: LatLng[]) => LatLng[])) => void;
  step: Step;
  setStep: (step: Step) => void;
  finishDrawing: () => void;
}

export default function DrawMode({ polygonPoints, setPolygonPoints, step, setStep, finishDrawing }: DrawModeProps) {
  const map = useMap();

  const handleDrawPoint = useCallback((clickedLatLng: LatLng) => {
    if (step !== 'COMPLETE') {
      setPolygonPoints(prevPoints => [...prevPoints, clickedLatLng]);
    }
  }, [setPolygonPoints, step]);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;
    handleDrawPoint(event.latLng.toJSON());
  }, [handleDrawPoint]);

  useEffect(() => {
    if (!map) return;

    // Clear existing listeners and add our draw listener
    google.maps.event.clearInstanceListeners(map);
    const clickListener = map.addListener("click", handleMapClick);

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map, handleMapClick]);

  return null;
}
