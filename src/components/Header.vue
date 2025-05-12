<template>
  <header class="app-header">
    <div class="container">
      <nav class="main-nav">
        <div class="left-nav">
          <button class="menu-button" @click="goBack">여기저기</button>
        </div>

        <div class="right-nav">
          <p style="color: yellow">로그인 상태: {{ isLoggedIn }}</p>
          <!-- 확인용 -->

          <button class="nav-button" @click="showMap">지도 보기</button>

          <template v-if="isLoggedIn">
            <button class="nav-button" type="button" @click="showProfile">마이페이지</button>
            <button class="nav-button" type="button" @click="logout">로그아웃</button>
          </template>
          <template v-else>
            <button class="nav-button" type="button" @click="signup">회원가입</button>
            <button class="nav-button" type="button" @click="login">로그인</button>
          </template>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)

const goBack = () => router.push('/')
const showMap = () => console.log('지도 보기 기능')
const showProfile = () => router.push('/profile')
const signup = () => router.push('/signup')
const login = () => {
  console.log('로그인 버튼 클릭됨') // 이게 콘솔에 출력되는지 확인
  router.push('/login')
}

const logout = () => {
  userStore.logout()
  router.push('/')
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
