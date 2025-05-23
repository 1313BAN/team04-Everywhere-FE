<template>
  <div class="min-h-screen bg-gray-100 pt-16">
    <Header :alwaysLight="true" />

    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 사이드바 -->
        <aside class="w-full lg:w-1/4 bg-white rounded-lg shadow p-6 sticky top-24">
          <div class="flex flex-col items-center pb-6 border-b border-gray-200 mb-6">
            <div
              class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-indigo-500 overflow-hidden"
            >
              {{ userInfo.nickname?.charAt(0)?.toUpperCase() || '?' }}
            </div>
            <div class="mt-4 text-xl font-bold text-gray-800">{{ userInfo.nickname }}</div>
            <div class="text-sm text-gray-500">{{ userInfo.userId }}</div>
          </div>
          <ul class="space-y-4">
            <li>
              <router-link
                to="/profile"
                class="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium"
                active-class="text-indigo-600"
              >
                <span>👤</span><span>내 정보 관리</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/plans"
                class="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium"
              >
                <span>🏝️</span><span>내 여행 계획</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/favorites"
                class="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium"
              >
                <span>⭐</span><span>즐겨찾기 장소</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/profile/posts"
                class="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium"
              >
                <span>📝</span><span>작성한 게시글</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/profile/security"
                class="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium"
              >
                <span>🔐</span><span>보안 설정</span>
              </router-link>
            </li>
          </ul>
        </aside>

        <!-- 메인 콘텐츠 -->
        <main class="flex-1 space-y-6">
          <!-- 내 정보 관리 섹션 -->
          <section class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-gray-800">내 정보 관리</h2>
              <button @click="saveProfile" class="text-indigo-600 font-medium hover:underline">
                변경사항 저장
              </button>
            </div>
            <form class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 font-medium mb-1">아이디</label>
                  <input
                    type="text"
                    v-model="userInfo.userId"
                    disabled
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-1">닉네임</label>
                  <input
                    type="text"
                    v-model="userInfo.nickname"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </form>
          </section>

          <!-- 작성한 게시글 섹션 -->
          <section class="bg-white rounded-lg shadow p-6">
            <div class="mb-4">
              <h2 class="text-2xl font-bold text-gray-800">작성한 게시글</h2>
            </div>
            <ul class="space-y-3">
              <li
                v-for="post in userInfo.boards"
                :key="post.id"
                class="flex justify-between items-center"
              >
                <router-link :to="`/posts/${post.id}`" class="text-gray-700 hover:text-indigo-600">
                  {{ post.title }}
                </router-link>
                <span class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</span>
              </li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import axios from '@/api/axios'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const userInfo = ref({ userId: '', nickname: '', boards: [] })

// 날짜 포맷
const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadUserInfo = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/user/me', {
      headers: { Authorization: `Bearer ${userStore.token}` },
    })
    const d = res.data.data
    userInfo.value = {
      userId: d.userId,
      nickname: d.nickname,
      boards: d.boardList.boards,
    }
  } catch (err) {
    console.error('마이페이지 정보 로드 실패:', err)
    if (err.response?.status === 401) {
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.')
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  try {
    const newNickname = userInfo.value.nickname.trim()
    if (!newNickname) {
      alert('닉네임을 입력해주세요.')
      return
    }

    await axios.patch(
      '/api/user/me/nickname',
      { nickname: newNickname },
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      }
    )
    userStore.nickname = userInfo.value.nickname
    alert('닉네임이 성공적으로 변경되었습니다.')
  } catch (err) {
    console.error('닉네임 변경 실패:', err)
    alert('닉네임 변경 중 오류가 발생했습니다.')
  }
}

const onMountedLoad = onMounted(loadUserInfo)
</script>

<style scoped>
/* 필요한 스타일만 유지 */
</style>
