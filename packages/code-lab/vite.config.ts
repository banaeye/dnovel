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
      name: 'NovelEngineCodeLab',
      formats: ['es', 'cjs'],
      fileName: (format) => `novel-engine-code-lab.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@novel-engine/hub',
        '@codemirror/state',
        '@codemirror/view',
        'codemirror',
        '@codemirror/lang-html',
        '@codemirror/lang-css',
        '@codemirror/lang-javascript',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime',
          '@novel-engine/hub': 'NovelEngineHub',
          '@codemirror/state': 'CodeMirrorState',
          '@codemirror/view': 'CodeMirrorView',
          codemirror: 'CodeMirror',
          '@codemirror/lang-html': 'CodeMirrorLangHtml',
          '@codemirror/lang-css': 'CodeMirrorLangCss',
          '@codemirror/lang-javascript': 'CodeMirrorLangJavaScript',
        },
      },
    },
    cssCodeSplit: false,
  },
});
