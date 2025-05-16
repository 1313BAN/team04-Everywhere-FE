import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import { createPinia } from 'pinia'
import './index.css' // Tailwind 포함된 CSS

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

app.config.errorHandler = (err, vm, info) => {
  console.error('Vue 앱 에러:', err)
  console.error('컴포넌트:', vm)
  console.error('정보:', info)
}

app.mount('#app')
