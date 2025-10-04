# Rainwater Harvesting System UI

A React + TypeScript application for rainwater harvesting system design and cost analysis.

## Features

- Multi-language support
- Location-based system design
- Cost comparison and ROI analysis
- Interactive onboarding flow
- System blueprint generation
- Automatic roof area detection

## Tech Stack

- React 19.1.1
- TypeScript
- Vite 7.1.2
- Tailwind CSS 4.1.13
- Framer Motion
- Radix UI Components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd rainwater-harvesting-ui

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── components/
│   ├── ui/              # Main UI components
│   │   ├── LocationSelection.tsx
│   │   ├── OnboardingFlow.tsx
│   │   ├── ResultsPage.tsx
│   │   └── ...
│   └── childcomponents/ # Reusable UI components
├── lib/
│   └── utils.ts         # Utility functions
└── styles/
    └── global.css       # Global styles
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the Vite configuration
4. Deploy with default settings

### Manual Deployment

```bash
# Build the project
npm run build

# The dist/ folder contains the production build
# Upload the contents to your hosting provider
```

## Environment Variables

Create a `.env.local` file for local development:

```env
# Add your environment variables here
VITE_API_URL=your_api_url
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
