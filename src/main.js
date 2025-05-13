import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import { createPinia } from 'pinia' // Pinia 임포트

const app = createApp(App)

const pinia = createPinia() // Pinia 인스턴스 생성
app.use(pinia) // Pinia 등록
app.use(router) // 라우터 등록

app.config.errorHandler = (err, vm, info) => {
  console.error('Vue 앱 에러:', err)
  console.error('컴포넌트:', vm)
  console.error('정보:', info)
}

app.mount('#app')
