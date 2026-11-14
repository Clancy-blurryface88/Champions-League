import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// Built files are cached "forever" by name, so a phone that once stored a broken copy of a file
// keeps using it. Bumping BUILD_TAG gives every built file a new name, which forces a fresh
// download everywhere (14.11: the home-screen app on a phone held a broken copy → white screen).
const BUILD_TAG = 'b2';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash]-${BUILD_TAG}.js`,
        chunkFileNames: `assets/[name]-[hash]-${BUILD_TAG}.js`,
        assetFileNames: `assets/[name]-[hash]-${BUILD_TAG}[extname]`,
      },
    },
  },
})
