<template>
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

    <button @click="handleLogin">로그인</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <p>
      계정이 없으신가요?
      <button @click="goToRegister">회원가입</button>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../api/axios'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const router = useRouter()
const userId = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    const response = await axios.post('/login', {
      userId: userId.value,
      password: password.value,
    })

    const { accessToken, nickname } = response.data.data

    // 토큰과 닉네임 저장
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('nickname', nickname)

    // 상태 반영
    userStore.login(nickname)

    // 메인 페이지로 이동
    router.push('/')
  } catch (err) {
    errorMessage.value = '로그인 실패: 아이디 또는 비밀번호를 확인하세요.'
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 16px;
}
input {
  width: 100%;
  padding: 8px;
}
button {
  margin-top: 10px;
  padding: 8px 16px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
