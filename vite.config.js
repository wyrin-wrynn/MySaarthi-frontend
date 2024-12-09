import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Specify the desired port here
  },
  build: {
    sourcemap: true, // Enable or adjust as needed
  },
});
