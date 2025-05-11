<template>
    <div class="main-container">
      <h1>여행 플랫폼에 오신 걸 환영합니다!</h1>
  
      <div v-if="!userStore.isLoggedIn">
        <button @click="goToLogin">로그인</button>
      </div>
  
      <div v-else>
        <p><strong>{{ userStore.nickname }}</strong>님 반갑습니다.</p>
        <button @click="logout">로그아웃</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '../stores/user'
  
  const router = useRouter()
  const userStore = useUserStore()
  
  onMounted(() => {
    userStore.initUser()
  })
  
  const goToLogin = () => {
    router.push('/login')
  }
  
  const logout = () => {
    userStore.logout()
  }
  </script>
  
  <style scoped>
  .main-container {
    text-align: center;
    margin-top: 100px;
  }
  button {
    padding: 10px 20px;
    margin: 10px;
  }
  </style>
  