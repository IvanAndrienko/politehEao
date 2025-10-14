import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    port: 3000,
    proxy: {
      // все запросы к /api будут проксироваться на бэкенд
      '/api': 'http://localhost:5000',
      // прокси для загруженных файлов
      '/uploads': 'http://localhost:5000'
    }
  }
})
