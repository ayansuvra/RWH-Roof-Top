import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveGoogleMapsApiKey(): string | undefined {
  const fromEnvPrimary = (import.meta as any)?.env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined
  if (fromEnvPrimary) return fromEnvPrimary

  const fromEnvAlt = (import.meta as any)?.env?.VITE_GOOGLE_MAPS_KEY as string | undefined
  if (fromEnvAlt) return fromEnvAlt

  const fromStorage = typeof localStorage !== "undefined"
    ? (localStorage.getItem("VITE_GOOGLE_MAPS_KEY") || undefined)
    : undefined
  if (fromStorage) return fromStorage

  const fromWindow = (globalThis as any)?.__GMAPS_KEY__ as string | undefined
  if (fromWindow) return fromWindow

  const fromUrl = typeof window !== "undefined"
    ? (new URLSearchParams(window.location.search).get("gmaps") || undefined)
    : undefined
  return fromUrl || undefined
}