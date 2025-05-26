<template>
  <div class="bg-[#f3f4f6] min-h-screen">
    <Header :alwaysLight="true" />
    <div class="max-w-5xl mx-auto pt-28 pb-12 px-4">
      <!-- 게시판 헤더 -->
      <div class="board-header">
        <h1 class="board-title">여행 게시판</h1>
        <button class="write-btn" @click="goWrite"><span>✏️</span>글쓰기</button>
      </div>

      <!-- 카테고리 탭 -->
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="['category-tab', { active: selectedCategory === cat.id }]"
          @click="selectCategory(cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- 게시글 목록 -->
      <div v-if="isLoading" class="text-center py-10">로딩 중...</div>

      <div v-else-if="errorMessage" class="text-center py-10 text-red-500">
        {{ errorMessage }}
      </div>

      <div v-else class="post-list">
        <div
          v-for="post in boards"
          :key="post.id"
          class="post-card"
          @click="goToPostDetail(post.id)"
        >
          <div class="post-content">
            <div class="post-header">
              <span :class="['post-category', mapCategoryColor(post.category)]">
                {{ mapCategoryName(post.category) }}
              </span>
              <div class="post-actions">
                <button class="like-btn" @click.stop="handleLike(post.id)">❤️</button>
              </div>
            </div>
            <h2 class="post-title truncate">{{ post.title }}</h2>
            <p class="post-excerpt">{{ post.summary || '내용이 없습니다.' }}</p>
            <div class="post-meta">
              <div class="post-author">
                <div class="author-avatar">{{ post.writer.slice(0, 1).toUpperCase() }}</div>
                <div class="author-info">
                  <div class="author-name">{{ post.writer }}</div>
                  <div class="post-date">{{ formatDate(post.createdAt) }}</div>
                </div>
              </div>
              <div class="post-stats">
                <div class="stat-item">
                  <span>👁️</span><span>{{ post.viewCount || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span>❤️</span><span>{{ post.likeCount || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span>💬</span><span>{{ post.commentCount || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button class="pagination-btn" :disabled="page === 0" @click="changePage(page - 1)">
          ‹
        </button>
        <button class="pagination-btn active">{{ page + 1 }}</button>
        <button class="pagination-btn" :disabled="!hasNextPage" @click="changePage(page + 1)">
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import { ref, onMounted } from 'vue'
import axios from '@/api/axios'
import { useRouter } from 'vue-router'

// 상태 정의
const router = useRouter()
const boards = ref([])
const page = ref(0)
const size = 10
const hasNextPage = ref(false)
const isLoading = ref(false)
const selectedCategory = ref('all')
const errorMessage = ref('') // ✅ 에러 메시지 상태 추가

const categories = [
  { id: 'all', name: '전체' },
  { id: 'review', name: '여행후기' },
  { id: 'question', name: '질문' },
  { id: 'info', name: '정보공유' },
  { id: 'mate', name: '동행구함' },
]

// 카테고리 이름 매핑
const mapCategoryName = (id) => {
  const found = categories.find((c) => c.id === id)
  return found ? found.name : '기타'
}

// 카테고리 색상 클래스 매핑
const mapCategoryColor = (id) => {
  switch (id) {
    case 'review':
      return 'review'
    case 'question':
      return 'question'
    case 'info':
      return 'info'
    case 'mate':
      return 'mate'
    default:
      return 'default'
  }
}

// 게시글 가져오기
const fetchBoards = async () => {
  isLoading.value = true
  errorMessage.value = '' // 에러 초기화

  try {
    let query = `/api/board?page=${page.value}&size=${size}&sort=createdAt,desc`
    if (selectedCategory.value !== 'all') {
      query += `&category=${selectedCategory.value}`
    }

    const response = await axios.get(query)
    const data = response.data.data

    // 응답 데이터 검증
    if (!data || !Array.isArray(data.boards)) {
      throw new Error('잘못된 응답 형식')
    }

    boards.value = data.boards
    hasNextPage.value = data.totalPages ? page.value < data.totalPages - 1 : false
  } catch (err) {
    // 토스트 없으면 주석처리하거나 아래처럼 에러 메시지만 출력
    // toast.error('게시글을 불러오는 중 문제가 발생했습니다.')
    errorMessage.value = '게시글을 불러오는 중 문제가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 페이지 변경
const changePage = (newPage) => {
  if (newPage >= 0) {
    page.value = newPage
    fetchBoards()
  }
}

// 카테고리 선택
const selectCategory = (cat) => {
  selectedCategory.value = cat
  page.value = 0
  fetchBoards()
}

// 게시글 상세 보기
const goToPostDetail = (id) => {
  router.push(`/board/${id}`)
}

// 글쓰기 이동
const goWrite = () => {
  router.push('/board/write')
}

// 날짜 포맷
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(fetchBoards)
</script>

<style scoped>
/* 게시판 내부 스타일 */
.board-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.write-btn {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: 0.3s;
}

.write-btn:hover {
  background-color: #2563eb;
}

.category-tabs {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0 2rem;
  overflow-x: auto;
}

.category-tab {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  background-color: #fff;
  font-weight: 500;
  color: #4b5563;
  white-space: nowrap;
  transition: all 0.3s;
}

.category-tab.active {
  background-color: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  cursor: pointer;
  padding: 1.5rem;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  align-items: center;
}

.post-category {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  color: white;
}

.post-category.review {
  background-color: #f59e0b;
}
.post-category.question {
  background-color: #8b5cf6;
}
.post-category.info {
  background-color: #06b6d4;
}
.post-category.mate {
  background-color: #10b981;
}
.post-category.default {
  background-color: #9ca3af;
}

.post-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.post-excerpt {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #6b7280;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  background-color: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #3b82f6;
}

.author-name {
  font-weight: 600;
}

.post-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  color: #374151;
  font-weight: 500;
  transition: 0.2s;
}

.pagination-btn.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.post-title.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
</style>
