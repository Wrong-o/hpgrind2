import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // svgr options
      },
    }),
  ],
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