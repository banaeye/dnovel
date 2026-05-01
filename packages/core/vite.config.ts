import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@engine-src': path.resolve(__dirname, '../../src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'NovelEngineCore',
      formats: ['es', 'cjs'],
      fileName: (format) => `novel-engine-core.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'zustand', 'js-yaml'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime',
          zustand: 'zustand',
          'js-yaml': 'jsyaml',
        },
      },
    },
    cssCodeSplit: false,
  },
});
