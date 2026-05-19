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
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'NovelEngineTimingGame',
      formats: ['es', 'cjs'],
      fileName: (format) => `novel-engine-timing-game.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@novel-engine/hub'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime',
          '@novel-engine/hub': 'NovelEngineHub',
        },
      },
    },
    cssCodeSplit: false,
  },
});
