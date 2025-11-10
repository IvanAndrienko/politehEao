import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

const API_PROXY_TARGET = process.env.VITE_API_URL || 'http://localhost:5000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      // все запросы к /api будут проксироваться на бэкенд
      '/api': API_PROXY_TARGET,
      // прокси для загруженных файлов
      '/uploads': API_PROXY_TARGET
    }
  }
})


