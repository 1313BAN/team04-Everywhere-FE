<template>
  <div class="profile-page">
    <Header />

    <div class="profile-container">
      <h2>내 프로필</h2>

      <div v-if="loading" class="loading">사용자 정보를 불러오는 중...</div>

      <div v-else-if="userInfo" class="user-info">
        <div class="profile-section">
          <h3>계정 정보</h3>
          <div class="info-row">
            <span class="label">아이디:</span>
            <span class="value">{{ userInfo.userId }}</span>
          </div>
          <div class="info-row">
            <span class="label">닉네임:</span>
            <span class="value">{{ userInfo.nickname }}</span>
          </div>
          <div class="info-row">
            <span class="label">가입일:</span>
            <span class="value">{{ formatDate(userInfo.createdAt) }}</span>
          </div>
        </div>

        <div class="profile-actions">
          <button class="primary-button" @click="editProfile">프로필 수정</button>
          <button class="secondary-button" @click="handleLogout">로그아웃</button>
        </div>
      </div>

      <div v-else class="error-container">
        <p>사용자 정보를 불러오는데 실패했습니다.</p>
        <button class="primary-button" @click="loadUserInfo">다시 시도</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import { userService } from '../api/services/userService'

const router = useRouter()
const userInfo = ref(null)
const loading = ref(true)

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

// 사용자 정보 로드
const loadUserInfo = async () => {
  loading.value = true
  try {
    const response = await userService.getUserInfo()
    userInfo.value = response.data
  } catch (err) {
    console.error('사용자 정보 로드 실패:', err)
    userInfo.value = null
  } finally {
    loading.value = false
  }
}

// 프로필 수정 페이지로 이동
const editProfile = () => {
  // 프로필 수정 페이지로 이동하는 로직 (추후 구현)
  console.log('프로필 수정 페이지로 이동')
}

// 로그아웃 처리
const handleLogout = () => {
  userService.logout()
  router.push('/')
}

// 컴포넌트 마운트 시 사용자 정보 로드
onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: var(--light-gray);
}

.profile-container {
  max-width: 700px;
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

h3 {
  color: var(--primary-color);
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: var(--dark-gray);
}

.profile-section {
  margin-bottom: 30px;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
}

.label {
  width: 100px;
  font-weight: 500;
  color: var(--dark-gray);
}

.value {
  flex: 1;
}

.profile-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.primary-button,
.secondary-button {
  padding: 10px 20px;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-md);
  cursor: pointer;
  border: none;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
}

.secondary-button {
  background-color: #f5f5f5;
  color: var(--text-color);
  border: 1px solid #ddd;
}

.primary-button:hover {
  background-color: #0062a3;
}

.secondary-button:hover {
  background-color: #e8e8e8;
}

.error-container {
  text-align: center;
  padding: 20px;
}

.error-container p {
  color: #e53935;
  margin-bottom: 15px;
}
</style>
