<template>
  <header
    class="fixed w-full top-0 z-50 transition-all duration-300 bg-transparent"
    id="site-header"
  >
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <!-- 로고 -->
      <div class="text-white text-2xl font-bold cursor-pointer" @click="goHome">
        여기<span class="text-yellow-400">저기</span>
      </div>

      <!-- 내비게이션 -->
      <nav class="hidden md:flex gap-6">
        <a href="/map" class="text-white hover:underline">지도보기</a>
        <a href="#" class="text-white hover:underline">게시글 보기</a>
        <a href="#" class="text-white hover:underline">공지사항</a>
      </nav>

      <!-- 로그인 상태에 따른 버튼 -->
      <div v-if="isLoggedIn" class="flex items-center gap-3">
        <span class="text-white font-semibold">{{ nickname }}님! 반가워요!</span>
        <button
          class="border-2 border-white text-white px-4 py-1 rounded hover:bg-white hover:text-blue-600 transition"
          @click="goProfile"
        >
          마이페이지
        </button>
        <button
          class="border-2 border-white text-white px-4 py-1 rounded hover:bg-white hover:text-blue-600 transition"
          @click="handleLogout"
        >
          로그아웃
        </button>
      </div>

      <button
        v-else
        @click="goLogin"
        class="border-2 border-white text-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 transition"
      >
        시작하기
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user' // 경로는 맞게 수정

const router = useRouter()
const userStore = useUserStore()
const { isLoggedIn, nickname } = storeToRefs(userStore)

const goHome = () => router.push('/')
const goLogin = () => router.push('/login')
const goProfile = () => router.push('/profile')

const handleLogout = () => {
  userStore.logout()
  router.push('/')
  location.reload()
}
</script>
