<template>
  <header class="app-header">
    <div class="container">
      <nav class="main-nav">
        <div class="left-nav">
          <button class="menu-button" @click="goBack">여기저기</button>
        </div>

        <div class="right-nav">
          <button class="nav-button" @click="showMap">지도 보기</button>
          <button class="nav-button" @click="showProfile">프로필</button>
          <button class="nav-button" @click="signup">회원가입</button>
          <button class="nav-button" @click="login">로그인</button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/')
}

const showMap = () => {
  // 지도 기능 구현
  console.log('지도 보기 기능')
}

const showProfile = () => {
  // 프로필 페이지로 이동
  router.push('/profile')
}

const signup = () => {
  router.push('/signup')
}

const login = () => {
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  background-color: #0079c2;
  padding: 15px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-button {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.right-nav {
  display: flex;
  gap: 15px;
}

.nav-button {
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  padding: 5px;
}
</style>
