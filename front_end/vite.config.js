import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/auth': 'http://localhost:3005',
      '/api': 'http://localhost:3005',
    },
  },
})
