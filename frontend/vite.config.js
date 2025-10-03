import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This is the main configuration file for Vite.
// https://vitejs.dev/config/
export default defineConfig({
  // The plugins array is where you add Vite plugins.
  // @vitejs/plugin-react enables React support.
  plugins: [react()],
  
  // The 'server' object configures the development server.
  server: {
    // This is the key line. Setting 'open' to true tells Vite
    // to automatically open a new browser tab when you run 'npm run dev'.
    open: true 
  }
})
