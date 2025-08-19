import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // penting untuk deployment ke Vercel/Netlify
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
