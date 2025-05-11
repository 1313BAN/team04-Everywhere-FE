<template>
    <div class="register-container">
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
  
      <div class="form-group">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="email" />
      </div>
  
      <button @click="handleRegister">회원가입</button>
  
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from '../axios'
  
  const router = useRouter()
  
  const userId = ref('')
  const password = ref('')
  const nickname = ref('')
  const email = ref('')
  
  const errorMessage = ref('')
  const successMessage = ref('')
  
  const handleRegister = async () => {
    if (!userId.value || !password.value || !nickname.value || !email.value) {
      errorMessage.value = '모든 필드를 입력해주세요.'
      return
    }
  
    try {
      await axios.post('/users', {
        userId: userId.value,
        password: password.value,
        nickname: nickname.value,
        email: email.value,
      })
  
      successMessage.value = '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.'
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (err) {
      errorMessage.value = err.response?.data?.data || '회원가입에 실패했습니다.'
    }
  }
  </script>
  
  <style scoped>
  .register-container {
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
  .success {
    color: green;
    margin-top: 10px;
  }
  </style>
  