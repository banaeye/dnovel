import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.json',
      include: ['src'],
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      '@novel-engine/core': path.resolve(__dirname, '../core/src/index.ts'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'NovelEngineHub',
      formats: ['es', 'cjs'],
      fileName: (format) => `novel-engine-hub.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'zustand', 'js-yaml', '@novel-engine/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime',
          '@novel-engine/core': 'NovelEngineCore',
        },
      },
    },
    cssCodeSplit: false,
  },
});
