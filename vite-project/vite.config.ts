import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Allow .env to be placed at repo root or inside vite-project
  // Vite will load from this directory in addition to the project root
  envDir: '../',
})
