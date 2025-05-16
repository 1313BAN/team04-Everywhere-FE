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
import { ref } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)
const mobileMenuOpen = ref(false)

const goBack = () => router.push('/')
const showMap = () => {
  mobileMenuOpen.value = false
  router.push('/showMap')
}
const showProfile = () => {
  mobileMenuOpen.value = false
  router.push('/profile')
}
const signup = () => {
  mobileMenuOpen.value = false
  router.push('/signup')
}
const login = () => {
  console.log('로그인 버튼 클릭됨')
  mobileMenuOpen.value = false
  router.push('/login')
}

const logout = () => {
  mobileMenuOpen.value = false
  userStore.logout()
  router.push('/')
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<style scoped>
.app-header {
  background-color: #0079c2;
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
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

.left-nav {
  display: flex;
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
  transition: opacity 0.2s ease;
}

.menu-button:hover {
  opacity: 0.8;
}

.right-nav {
  display: flex;
  gap: 15px;
  align-items: center;
}

.nav-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 모바일 메뉴 관련 스타일 */
.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.hamburger-line {
  display: block;
  width: 24px;
  height: 2px;
  margin: 5px 0;
  background-color: white;
  transition: 0.3s;
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #0079c2;
  padding: 15px;
  flex-direction: column;
  gap: 10px;
  transform: translateY(-20px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 999;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.mobile-menu.active {
  transform: translateY(0);
  opacity: 1;
}

.mobile-nav-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 16px;
  padding: 12px;
  width: 100%;
  text-align: left;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.mobile-nav-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .right-nav {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }

  .mobile-menu {
    display: flex;
  }
}
</style>
