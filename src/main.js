import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 앱 생성 및 마운트
const app = createApp(App)

// 라우터 등록
app.use(router)

// 전역 에러 핸들러
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue 앱 에러:', err)
  console.error('컴포넌트:', vm)
  console.error('정보:', info)
}

// 앱 마운트
app.mount('#app')
