import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative assets resolution for GitHub Pages
  server: {
    port: 5173,
    open: false
  }
});
