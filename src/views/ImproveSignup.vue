<template>
  <div class="signup-page">
    <Header />

    <div class="signup-container">
      <h2>회원가입</h2>

      <div class="form-group">
        <label for="userId">아이디</label>
        <input type="text" id="userId" v-model="userId" />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="password" />
      </div>

      <div class="form-group">
        <label for="nickname">닉네임</label>
        <input type="text" id="nickname" v-model="nickname" />
      </div>

      <button class="signup-button" @click="handleSignup">회원가입</button>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <p class="login-link">
        이미 계정이 있으신가요? <router-link to="/login">로그인</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import { userAuthService } from '../api/services/userAuthService'

const router = useRouter()

// 상태 관리
const userId = ref('')
const password = ref('')
const nickname = ref('')
const errorMessage = ref('')
const successMessage = ref('')

// 회원가입 처리
const handleSignup = async () => {
  try {
    // 폼 유효성 검사
    if (!userId.value || !password.value || !nickname.value) {
      errorMessage.value = '모든 필드를 입력해주세요.'
      return
    }

    // 회원가입 API 호출
    await userAuthService.signup({
      userId: userId.value,
      password: password.value,
      nickname: nickname.value,
    })

    // 성공 메시지 표시 후 로그인 페이지로 이동
    successMessage.value = '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.'
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (err) {
    // 에러 처리
    if (err.response?.status === 403) {
      errorMessage.value = err.response.data?.data || '중복된 아이디입니다.'
    } else {
      errorMessage.value = '회원가입에 실패했습니다.'
    }
  }
}
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
  background-color: var(--light-gray);
}

.signup-container {
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

.signup-button {
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

.signup-button:hover {
  background-color: #0062a3;
}

.error-message {
  color: #e53935;
  margin-top: 15px;
}

.success-message {
  color: #2e7d32;
  margin-top: 15px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
}

.login-link a {
  color: var(--primary-color);
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
