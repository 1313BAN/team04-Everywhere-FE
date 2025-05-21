// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // ✅ 여기에 프록시 추가!
  server: {
    proxy: {
      '/api': {
        target: 'http://70.12.60.56:8080', // <- 백엔드 포트에 맞춰 바꿔줘야 함!
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
