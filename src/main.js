import './index.css'
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'
import { useUserStore } from './stores/user'
import piniaPersistedstate from 'pinia-plugin-persistedstate'

// 1. Pinia 설정
const pinia = createPinia()
pinia.use(piniaPersistedstate)

// 2. 앱 생성 및 마운트
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')

const userStore = useUserStore()
userStore.initUser()
