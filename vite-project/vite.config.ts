import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
=======
  // Allow .env to be placed at repo root or inside vite-project
  // Vite will load from this directory in addition to the project root
  envDir: '../',
>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f
})
