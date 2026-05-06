import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH ?? '/',
  resolve: {
    alias: {
      '@novel-engine/core':     path.resolve(__dirname, 'packages/core/src/index.ts'),
      '@novel-engine/hub':      path.resolve(__dirname, 'packages/hub/src/index.ts'),
      '@novel-engine/maze-rpg': path.resolve(__dirname, 'packages/maze-rpg/src/index.ts'),
      '@novel-engine/runner-action': path.resolve(__dirname, 'packages/runner-action/src/index.ts'),
      '@novel-engine/memory-game':   path.resolve(__dirname, 'packages/memory-game/src/index.ts'),
      '@novel-engine/flash-calc':    path.resolve(__dirname, 'packages/flash-calc/src/index.ts'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        editor: path.resolve(__dirname, 'editor.html'),
      },
    },
  },
})
