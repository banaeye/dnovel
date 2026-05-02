import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'zustand'],
    alias: {
      '@novel-engine/core': path.resolve(__dirname, '../packages/core/src/index.ts'),
      '@novel-engine/hub': path.resolve(__dirname, '../packages/hub/src/index.ts'),
    },
  },
});
