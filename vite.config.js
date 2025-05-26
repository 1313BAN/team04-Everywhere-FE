/* eslint-env node */
// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'

dotenv.config()
export default defineConfig(({ mode }) => {
  // 1) 현재 mode(dev, production 등)에 맞춰 .env(.local) 로드
  const env = loadEnv(mode, process.cwd(), '')

  console.log('✅ VITE_API_URL:', env.VITE_API_URL)

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // loadEnv으로 가져온 값 사용
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
