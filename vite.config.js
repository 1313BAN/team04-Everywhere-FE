/* eslint-env node */
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // 1) 현재 mode(dev, production 등)에 맞춰 .env(.local) 로드
  const env = loadEnv(mode, process.cwd(), '')

  // ✅ 환경 변수 유효성 검사 추가
  if (!env.VITE_API_URL) {
    throw new Error('❌ VITE_API_URL is not defined in environment variables')
  }

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
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
