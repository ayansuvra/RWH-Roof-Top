# Rooftop Surveyor Setup

## Overview
The Rooftop Surveyor has been integrated into your rainwater harvesting app. It appears after login and allows users to calculate their rooftop area using Google Maps.

## Features Implemented
- Interactive Google Maps with satellite view
- Manual drawing mode (click to draw polygon)
- AI detection mode (mock implementation)
- Real-time area calculation
- Address search with autocomplete
- Editable polygons after completion

## Setup Instructions

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Static Maps API
4. Create credentials (API Key)
5. Restrict the API key to your domain

### 2. Configure Environment
1. Add your API key to `.env.local`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

### 3. Start the Application
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend
npm run dev
```

## Flow Integration
1. **Language Selection** → **Login** → **Rooftop Surveyor** → **Onboarding** → **Results**
2. The surveyor captures the rooftop area and passes it to the onboarding flow
3. Users can choose between manual drawing or AI detection

## AI Detection
Currently implemented as a mock service. To integrate real AI:

1. Replace the mock endpoint in `server.js` with your AI service
2. The expected input format:
   ```json
   {
     "satelliteImageDataUri": "data:image/jpeg;base64,...",
     "clickedPoint": { "x": 123, "y": 456 }
   }
   ```
3. Expected output format:
   ```json
   {
     "coordinates": [[x1,y1], [x2,y2], [x3,y3], [x4,y4]],
     "confidence": 0.85
   }
   ```

## Technical Details
- Uses `@vis.gl/react-google-maps` for map rendering
- Coordinate conversion between geographic (lat/lng) and pixel coordinates
- Real-time area calculation using Google Maps geometry library
- State management with React hooks

## Troubleshooting
- Ensure API key has proper permissions
- Check browser console for API errors
- Verify CORS settings if using external AI service
- Make sure both frontend and backend servers are running
