import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist', // ensure Vercel deploys the correct folder
    chunkSizeWarningLimit: 1000,
  },
  base: '/', // 👈 ensures correct routing base for SPA
})
