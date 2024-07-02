/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Import path module for resolving file paths
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts']
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      // Specify multiple entry points for Rollup
      input: {
        index: resolve(__dirname, 'index.html'), // Main entry for your React app
        background: resolve(__dirname, 'src/background.ts'), // Separate entry for the background script
      },
      output: {
        // Adjust the output settings if necessary
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  }
});
