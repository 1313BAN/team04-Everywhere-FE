<template>
  <header
    :class="[
      'fixed w-full top-0 z-50 transition-all duration-300',
      effectiveLight ? 'bg-white shadow' : 'bg-transparent',
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <!-- 로고 -->
      <div
        @click="goHome"
        :class="[
          'text-2xl font-bold cursor-pointer',
          effectiveLight ? 'text-yellow-400' : 'text-white',
        ]"
      >
        여기<span :class="effectiveLight ? 'text-indigo-500' : 'text-yellow-400'">저기</span>
      </div>

      <!-- 내비게이션 -->
      <nav class="hidden md:flex gap-6">
        <span
          @click="navigateWithAuth('/map')"
          :class="[
            effectiveLight ? 'text-gray-800 hover:text-indigo-600' : 'text-white hover:underline',
            'cursor-pointer',
          ]"
          >지도보기</span
        >
        <span
          @click="navigateWithAuth('/posts')"
          :class="[
            effectiveLight ? 'text-gray-800 hover:text-indigo-600' : 'text-white hover:underline',
            'cursor-pointer',
          ]"
          >게시글 보기</span
        >
        <span
          @click="navigateWithAuth('/notice')"
          :class="[
            effectiveLight ? 'text-gray-800 hover:text-indigo-600' : 'text-white hover:underline',
            'cursor-pointer',
          ]"
          >공지사항</span
        >
      </nav>

      <!-- 로그인 상태 버튼 -->
      <div v-if="isLoggedIn" class="flex items-center gap-3">
        <span
          :class="[effectiveLight ? 'text-gray-800 font-semibold' : 'text-white font-semibold']"
        >
          {{ nickname }}님! 반가워요!
        </span>
        <button
          @click="navigateWithAuth('/profile')"
          :class="[
            'px-4 py-1 rounded transition',
            effectiveLight
              ? 'border-gray-800 text-gray-800 hover:bg-gray-100'
              : 'border-white text-white hover:bg-white hover:text-blue-600',
          ]"
        >
          마이페이지
        </button>
        <button
          @click="handleLogout"
          :class="[
            'px-4 py-1 rounded transition',
            effectiveLight
              ? 'border-gray-800 text-gray-800 hover:bg-gray-100'
              : 'border-white text-white hover:bg-white hover:text-blue-600',
          ]"
        >
          로그아웃
        </button>
      </div>

      <!-- 비로그인 상태 버튼 -->
      <button
        v-else
        @click="goLogin"
        :class="[
          'px-4 py-2 rounded transition',
          effectiveLight
            ? 'border-gray-800 text-gray-800 hover:bg-gray-100'
            : 'border-white text-white hover:bg-white hover:text-blue-600',
        ]"
      >
        시작하기
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

// prop으로 강제 라이트 모드 사용 여부 전달
const props = defineProps({
  alwaysLight: { type: Boolean, default: false },
})

const router = useRouter()
const userStore = useUserStore()
const { isLoggedIn, nickname } = storeToRefs(userStore)

const SCROLL_THRESHOLD = 100
const dynamicLight = ref(false)

function checkScroll() {
  dynamicLight.value = window.scrollY > SCROLL_THRESHOLD
}

onMounted(() => {
  if (!props.alwaysLight) {
    checkScroll()
    window.addEventListener('scroll', checkScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (!props.alwaysLight) {
    window.removeEventListener('scroll', checkScroll)
  }
})

// alwaysLight 우선, 아니면 scroll 상태
const effectiveLight = computed(() => props.alwaysLight || dynamicLight.value)

const goHome = () => router.push('/')
const goLogin = () => router.push('/login')
const navigateWithAuth = (path) => {
  if (!isLoggedIn.value) router.push('/login')
  else router.push(path)
}
const handleLogout = () => {
  userStore.logout()
  router.push('/')
}
</script>
