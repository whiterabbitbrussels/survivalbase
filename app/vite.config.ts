import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Absolute asset paths: pages live at nested addresses (/fr/product/water-0/) on the survivalbase.net root.
  base: '/',
})
