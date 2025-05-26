<template>
  <div class="bg-[#f3f4f6] min-h-screen">
    <Header :alwaysLight="true" />
    <div class="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div v-if="isLoading" class="text-center py-10">로딩 중...</div>
      <div v-else-if="errorMessage" class="text-center text-red-500">{{ errorMessage }}</div>
      <div v-else class="bg-white rounded-xl shadow p-6">
        <div class="flex justify-between items-start mb-4">
          <h1 class="text-2xl font-bold">{{ board.title }}</h1>
          <div v-if="isOwner" class="flex gap-2">
            <button
              class="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
              @click="goToEdit"
            >
              수정
            </button>
            <button
              class="text-sm px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-100"
              @click="deletePost"
            >
              삭제
            </button>
          </div>
        </div>
        <div class="text-sm text-gray-500 mb-6">
          작성자: <span class="font-semibold">{{ board.writer }}</span> •
          {{ formatDate(board.createdAt) }}
        </div>
        <div v-if="board.imageUrls && board.imageUrls.length" class="grid grid-cols-2 gap-4 mb-6">
          <img
            v-for="(img, index) in board.imageUrls"
            :key="index"
            :src="img"
            class="rounded-lg border object-cover h-48 w-full"
          />
        </div>
        <p class="text-gray-800 whitespace-pre-line">{{ board.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/api/axios'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const board = ref({})
const isLoading = ref(true)
const errorMessage = ref('')
const userStore = useUserStore()
const { nickname } = storeToRefs(userStore)
const isOwner = ref(false)

const fetchBoard = async () => {
  try {
    const id = route.params.id
    const response = await axios.get(`/api/board/${id}`)
    board.value = response.data.data
    isOwner.value = board.value.writer === nickname.value
  } catch (err) {
    errorMessage.value = '게시글을 불러올 수 없습니다.'
  } finally {
    isLoading.value = false
  }
}

const goToEdit = () => {
  router.push(`/board/edit/${board.value.id}`)
}

const deletePost = async () => {
  if (confirm('정말 삭제하시겠습니까? 삭제한 게시글은 복구할 수 없습니다.')) {
    try {
      await axios.delete(`/api/board/${board.value.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      alert('삭제되었습니다.')
      router.push('/board')
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.')
    }
  }
}

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

onMounted(fetchBoard)
</script>

<style scoped>
img {
  background-color: #f9fafb;
}
</style>
