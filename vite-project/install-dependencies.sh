#!/bin/bash

# Rain UI Project - Dependency Installation Script
echo "Installing dependencies for Rain UI Project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

# Navigate to the project directory
cd "$(dirname "$0")/sih2025/vite-project" || exit 1

echo "Current directory: $(pwd)"

# Install dependencies
echo "Installing npm dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "Available scripts:"
    echo "  npm run dev     - Start development server"
    echo "  npm run build   - Build for production"
    echo "  npm run lint    - Run ESLint"
    echo "  npm run preview - Preview production build"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
