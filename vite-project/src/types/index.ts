export type AppState = "language" | "login" | "onboarding" | "results";

export interface UserData {
  language: string;
  location: {
    name: string;
    coordinates: { lat: number; lng: number };
  };
  useType: "household" | "industrial";
  hasTank: boolean;
  rooftop: {
    area: number;
    type: "flat" | "sloped";
  };
  tankCapacity: number;
  waterSource: "municipality" | "submersible" | "tubewell" | "well";
}
