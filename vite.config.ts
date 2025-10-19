import path from 'node:path';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  // Base path for GitHub Pages deployment
  // Use '/thrive/' for production, '/' for local development
  base: process.env.NODE_ENV === 'production' ? '/thrive/' : '/',
  
  plugins: [devtools(), tanstackRouter(), react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },
  
  build: {
    // Generate source maps for better error tracking
    sourcemap: true,
    // Optimize chunk sizes
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'tanstack-vendor': ['@tanstack/react-query', '@tanstack/react-router', '@tanstack/react-table'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
        },
      },
    },
  },
});
