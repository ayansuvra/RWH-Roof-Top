"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // ✅ fix import
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { MapPin, Navigation, Search } from "lucide-react";
import type { UserData } from "../types";

interface LocationSelectionProps {
  onNext: (data: Partial<UserData>) => void;
  isLoading: boolean;
  data: Partial<UserData>;
}

export function LocationSelection({
  onNext,
  isLoading,
  data,
}: LocationSelectionProps) {
  const [locationName, setLocationName] = useState(
    data.location?.name || ""
  );
  const [coordinates, setCoordinates] = useState(
    data.location?.coordinates || { lat: 0, lng: 0 }
  );
  const [isUsingGPS, setIsUsingGPS] = useState(false);
  const [gpsSupported, setGpsSupported] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsSupported(false);
    }
  }, []);

  const handleManualLocation = () => {
    if (locationName.trim()) {
      const mockCoordinates = {
        lat: 28.6139 + Math.random(),
        lng: 77.209 + Math.random(),
      };
      onNext({
        location: {
          name: locationName,
          coordinates: mockCoordinates,
        },
      });
    }
  };

  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      setGpsSupported(false);
      alert(
        "GPS not supported by this browser. Please enter your location manually."
      );
      return;
    }

    setIsUsingGPS(true);

    const backupTimeout = setTimeout(() => {
      setIsUsingGPS(false);
      alert(
        "GPS request is taking too long. Please enter your location manually."
      );
    }, 15000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(backupTimeout);
        try {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCoordinates(coords);
          setLocationName(
            `Location at ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
          );
          setIsUsingGPS(false);
          onNext({
            location: {
              name: `GPS Location (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`,
              coordinates: coords,
            },
          });
        } catch (e) {
          console.error("Error processing GPS position:", e);
          setIsUsingGPS(false);
          alert(
            "Error processing location data. Please enter your location manually."
          );
        }
      },
      (error) => {
        clearTimeout(backupTimeout);

        const errorDetails = {
          code: error?.code ?? "Unknown",
          message: error?.message ?? "No message",
          timestamp: new Date().toISOString(),
        };

        console.error("GPS Error Details:", errorDetails);

        setIsUsingGPS(false);

        let errorMessage =
          "Unable to get your location. Please enter manually.";
        if (error && typeof error === "object") {
          switch (error.code) {
            case 1:
              errorMessage =
                "Location access denied. Enable permissions in browser settings.";
              break;
            case 2:
              errorMessage =
                "Location not available. Please check your device GPS settings.";
              break;
            case 3:
              errorMessage =
                "Location request timed out. Try again or check your internet.";
              break;
            default:
              if (error.message) {
                errorMessage = `Location error: ${error.message}`;
              }
          }
        }
        errorMessage +=
          " You can enter your location manually below.";
        alert(errorMessage);
      },
      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-blue-800">
          <MapPin className="w-6 h-6" />
          Select Your Location
        </CardTitle>
        <p className="text-gray-600">
          We need your location to provide accurate rainfall data
          and system recommendations
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="location">Enter Location Name</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="location"
                placeholder="e.g., Mumbai, Maharashtra"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleManualLocation}
              disabled={!locationName.trim() || isLoading}
            >
              <Search className="w-4 h-4 mr-2" />
              Search Location
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              onClick={handleGPSLocation}
              disabled={isLoading || isUsingGPS || !gpsSupported}
              title={
                !gpsSupported
                  ? "GPS not supported by this browser"
                  : isUsingGPS
                  ? "Getting your location..."
                  : "Use your device GPS to detect location"
              }
            >
              <Navigation
                className={`w-4 h-4 mr-2 ${
                  isUsingGPS ? "animate-spin" : ""
                }`}
              />
              {isUsingGPS
                ? "Getting Location..."
                : !gpsSupported
                ? "GPS Unavailable"
                : "Use GPS"}
            </Button>
          </div>
        </motion.div>

        {/* Map placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
        >
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">
              Interactive map will appear here
            </p>
            <p className="text-sm text-gray-400">
              Click to drop a pin at your exact location
            </p>
          </div>
        </motion.div>

        {/* Selected location */}
        {locationName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800">Selected Location</span>
            </div>
            <p className="text-gray-700">{locationName}</p>
            {coordinates.lat !== 0 && (
              <p className="text-sm text-gray-500">
                Coordinates: {coordinates.lat.toFixed(4)},{" "}
                {coordinates.lng.toFixed(4)}
              </p>
            )}
          </motion.div>
        )}

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500">
            Your location data is used only for rainfall
            calculations and system recommendations
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
