import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({

  base: '/Hiber-Pong/',

  build: {
    outDir: 'dist',
    assetsInlineLimit: 0, // Esto deshabilita la conversión a data URIs
  },
  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
  },

  plugins: [

  ],
});