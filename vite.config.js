import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Suroor/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'axios', 'react-icons'],
          player: ['react-player', 'hls.js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
