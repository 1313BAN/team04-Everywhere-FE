<template>
  <div class="login-page">
    <Header />

    <div class="login-container">
      <h2>로그인</h2>

      <div class="form-group">
        <label for="userId">아이디</label>
        <input type="text" id="userId" v-model="userId" />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="password" />
      </div>

      <button class="login-button" @click="handleLogin">로그인</button>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <p class="signup-link">계정이 없으신가요? <router-link to="/signup">회원가입</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import { userAuthService } from '../api/services/userAuthService'
import { useUserStore } from '../stores/user' // 추가
const userStore = useUserStore() // 추가

const router = useRouter()
const route = useRoute()

const userId = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    if (!userId.value || !password.value) {
      errorMessage.value = '아이디와 비밀번호를 입력해주세요.'
      return
    }

    // 로그인 API 호출
    const response = await userAuthService.login({
      userId: userId.value,
      password: password.value,
    })

    const { accessToken, refreshToken } = response.data

    // 토큰 저장
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    // 상태 업데이트: store에 로그인 반영
    userStore.login(userId.value)

    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } catch (err) {
    if (err.response?.status === 401) {
      errorMessage.value = '아이디 또는 비밀번호가 올바르지 않습니다.'
    } else {
      errorMessage.value = '로그인에 실패했습니다.'
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: var(--light-gray);
}

.login-container {
  max-width: 450px;
  margin: 50px auto;
  padding: 30px;
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: var(--primary-color);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-md);
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-md);
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #0062a3;
}

.error-message {
  color: #e53935;
  margin-top: 15px;
}

.signup-link {
  text-align: center;
  margin-top: 20px;
}

.signup-link a {
  color: var(--primary-color);
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
