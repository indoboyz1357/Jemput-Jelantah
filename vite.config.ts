import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // penting untuk Vercel/Netlify (jangan './')
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
