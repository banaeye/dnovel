import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@editor-src': path.resolve(__dirname, '../../src/editor'),
      '@novel-engine/core': path.resolve(__dirname, '../core/src/index.ts'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'NovelEngineEditor',
      formats: ['es', 'cjs'],
      fileName: (format) => `novel-engine-editor.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'js-yaml', '@novel-engine/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime',
          'js-yaml': 'jsyaml',
          '@novel-engine/core': 'NovelEngineCore',
        },
      },
    },
    cssCodeSplit: false,
  },
});
