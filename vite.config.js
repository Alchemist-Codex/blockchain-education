// Import Vite configuration utilities and plugins
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import restrictHTMLInPublic from './plugins/restrictHTMLInPublic';

export default defineConfig({
  // Configure Vite plugins
  plugins: [
    react(),                  // Enable React support
    restrictHTMLInPublic()    // Custom plugin to restrict HTML in public directory
  ],
  
  // Set base URL for production builds
  base: './',
  
  // Configure module resolution
  resolve: {
    alias: {
      buffer: 'buffer',     // Alias for buffer module
    },
  },
  
  // Define global variables for client-side code
  define: {
    global: {},            // Polyfill for global object
    'process.env': {},     // Polyfill for process.env
  },
  
  // Development server configuration
  server: {
    historyApiFallback: true,  // Enable SPA routing support
  },
  
  // Production build configuration
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,  // Disable manual chunk splitting
      },
    },
  },
});
