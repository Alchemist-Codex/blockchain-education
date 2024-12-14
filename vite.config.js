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
      'react': 'react',
      'react-dom': 'react-dom'
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
    host: true,
    strictPort: true,
    port: 5173,
    headers: {
      'Content-Type': 'text/css'
    }
  },
  
  // Production build configuration
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,  // Disable manual chunk splitting
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    assetsDir: 'assets',
  },
  esbuild: {
    legalComments: 'none',
    format: 'esm',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true
      },
    },
    include: ['react', 'react-dom']
  },
});
