import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import restrictHTMLInPublic from './plugins/restrictHTMLInPublic';

export default defineConfig({
  plugins: [react(), restrictHTMLInPublic()],
  base: './',
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  define: {
    global: {},
    'process.env': {},
  },
  server: {
    historyApiFallback: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
