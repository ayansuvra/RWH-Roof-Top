# Rainwater Harvesting System UI

## Project Structure

```
src/
├── components/
│   ├── ui/              # UI components
│   └── childcomponents/ # Child components
├── types/               # TypeScript types
└── styles/              # Global styles
hooks/                   # Custom hooks
lib/                     # Utilities
```

## Getting Started

```bash
npm install
npm run dev
```

## Environment

```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
# Optional alternative also supported
VITE_GOOGLE_MAPS_KEY=your_api_key_here
```

If you cannot create a `.env`, you can use one of these fallbacks without restarting dev server:

- localStorage: `localStorage.setItem("VITE_GOOGLE_MAPS_KEY", "YOUR_KEY")`
- window global: `window.__GMAPS_KEY__ = "YOUR_KEY"`
- URL param: append `?gmaps=YOUR_KEY`
