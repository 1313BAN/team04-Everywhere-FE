<template>
  <div
    class="auth-page min-h-screen bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center py-10"
  >
    <div class="absolute top-5 left-5 text-white font-semibold">
      <router-link to="/"> ← 메인으로 돌아가기 </router-link>
    </div>

    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
      <div class="flex border-b text-sm font-semibold text-gray-500">
        <button
          :class="[
            'flex-1 py-3 text-center',
            activeTab === 'login' ? 'text-blue-500 border-b-2 border-blue-500' : '',
          ]"
          @click="activeTab = 'login'"
        >
          로그인
        </button>
        <button
          :class="[
            'flex-1 py-3 text-center',
            activeTab === 'signup' ? 'text-blue-500 border-b-2 border-blue-500' : '',
          ]"
          @click="activeTab = 'signup'"
        >
          회원가입
        </button>
      </div>

      <!-- 로그인 탭 -->
      <div v-if="activeTab === 'login'" class="p-6">
        <h2 class="text-2xl font-bold text-center mb-6">로그인</h2>
        <div class="space-y-4">
          <form @submit.prevent="handleLogin">
            <div>
              <label class="block mb-1 text-sm font-medium">아이디</label>
              <input
                v-model="userId"
                type="text"
                class="w-full px-4 py-2 border rounded-md"
                placeholder="아이디을 입력하세요"
              />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">비밀번호</label>
              <input
                v-model="password"
                type="password"
                class="w-full px-4 py-2 border rounded-md"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <div class="flex items-center text-sm">
              <input id="remember" v-model="rememberMe" type="checkbox" class="mr-2" />
              <label for="remember">로그인 정보 기억하기</label>
            </div>
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-blue-500 to-green-400 text-white py-2 rounded-md font-semibold"
            >
              로그인
            </button>
          </form>
          <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
        </div>
        <div class="text-center mt-4 text-sm">
          계정이 없으신가요?
          <button @click="activeTab = 'signup'" class="text-blue-600 font-semibold">
            회원가입
          </button>
        </div>
      </div>

      <!-- 회원가입 탭 -->
      <div v-else class="p-6">
        <h2 class="text-2xl font-bold text-center mb-6">회원가입</h2>
        <div class="space-y-4">
          <div>
            <label class="block mb-1 text-sm font-medium">이름</label>
            <input
              v-model="nickname"
              type="text"
              class="w-full px-4 py-2 border rounded-md"
              placeholder="이름을 입력하세요"
            />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">아이디</label>
            <input
              v-model="userId"
              type="text"
              class="w-full px-4 py-2 border rounded-md"
              placeholder="아이디을 입력하세요"
            />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">비밀번호</label>
            <input
              v-model="password"
              type="password"
              class="w-full px-4 py-2 border rounded-md"
              placeholder="비밀번호를 입력하세요"
            />
            <p class="text-xs text-red-500 mt-1">8자 이상, 숫자와 특수문자를 포함해주세요</p>
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">비밀번호 확인</label>
            <input
              v-model="passwordConfirm"
              type="password"
              class="w-full px-4 py-2 border rounded-md"
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>
          <form @submit.prevent="handleSignup">
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-blue-500 to-green-400 text-white py-2 rounded-md font-semibold"
            >
              회원가입
            </button>
          </form>
          <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
          <p v-if="successMessage" class="text-green-600 text-sm mt-2">{{ successMessage }}</p>
        </div>
        <p class="text-xs text-center mt-4 text-gray-500">
          가입하면 <a href="#" class="text-blue-500 underline">이용약관</a>과
          <a href="#" class="text-blue-500 underline">개인정보처리방침</a>에 동의하게 됩니다.
        </p>
        <div class="text-center mt-4 text-sm">
          이미 계정이 있으신가요?
          <button @click="activeTab = 'login'" class="text-blue-600 font-semibold">로그인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userAuthService } from '../api/services/userAuthService'
import { useUserStore } from '../stores/user'

const userId = ref('')
const password = ref('')
const nickname = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const activeTab = ref('login')
const rememberMe = ref(false)
const passwordConfirm = ref('')

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

watch(activeTab, () => {
  errorMessage.value = ''
  successMessage.value = ''
})

const handleLogin = async () => {
  try {
    if (!userId.value || !password.value) {
      errorMessage.value = '아이디와 비밀번호를 입력해주세요.'
      return
    }

    const response = await userAuthService.login({
      userId: userId.value,
      password: password.value,
    })

    const { accessToken, nickname: serverNickname } = response.data

    if (accessToken) {
      userStore.login(accessToken, serverNickname, rememberMe.value) // nickname이 백엔드 응답에 포함돼야 함
      router.push(route.query.redirect || '/')
    } else {
      throw new Error('토큰이 없습니다.')
    }
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'
    console.error('❌ 로그인 실패:', err)
  }
}
const handleSignup = async () => {
  try {
    if (!userId.value || !password.value || !nickname.value) {
      errorMessage.value = '모든 필드를 입력해주세요.'
      return
    }

    // 비밀번호 유효성 검사 추가
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
    if (!passwordRegex.test(password.value)) {
      errorMessage.value = '비밀번호는 8자 이상이며 숫자와, 특수문자를 포함해야 합니다.'
      return
    }

    // handleSignup 함수 내부 유효성 검사 부분에 추가
    if (password.value !== passwordConfirm.value) {
      errorMessage.value = '비밀번호가 일치하지 않습니다.'
      return
    }
    await userAuthService.signup({
      userId: userId.value,
      password: password.value,
      nickname: nickname.value,
    })
    successMessage.value = '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.'
    setTimeout(() => {
      activeTab.value = 'login'
      successMessage.value = ''
    }, 1500)
  } catch (err) {
    errorMessage.value =
      err.response?.status === 403
        ? err.response.data?.data || '중복된 아이디입니다.'
        : err.response?.data?.message || '회원가입에 실패했습니다. 나중에 다시 시도해주세요.'
    console.error('❌ 회원가입 실패:', err)
  }
}
</script>

<style scoped>
.auth-page {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>
