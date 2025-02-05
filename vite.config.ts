import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@matejmazur/react-katex', 'katex']
  },
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  }
})