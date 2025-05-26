<template>
  <div class="bg-[#f3f4f6] min-h-screen">
    <Header :alwaysLight="true" />
    <div class="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div class="bg-white rounded-xl shadow p-6">
        <h1 class="text-2xl font-bold mb-6">게시글 수정</h1>
        <form @submit.prevent="submitEdit">
          <!-- 제목 입력 -->
          <div class="mb-4">
            <label class="block mb-1 font-semibold">제목</label>
            <input v-model="title" type="text" class="w-full border rounded px-4 py-2" required />
          </div>

          <!-- 내용 입력 -->
          <div class="mb-4">
            <label class="block mb-1 font-semibold">내용</label>
            <textarea v-model="content" class="w-full border rounded px-4 py-2 h-40" required />
          </div>

          <!-- 기존 이미지 미리보기 및 삭제 -->
          <div class="mb-4" v-if="existingImages.length">
            <label class="block mb-1 font-semibold">기존 이미지</label>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="(img, index) in existingImages"
                :key="index"
                class="relative group border rounded overflow-hidden"
              >
                <img :src="img" class="object-cover h-40 w-full" />
                <button
                  type="button"
                  @click="removeExistingImage(img)"
                  class="absolute top-1 right-1 bg-white text-red-600 font-bold rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-100"
                  title="이미지 삭제"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- 새 이미지 추가 -->
          <div class="mb-4">
            <label class="block mb-1 font-semibold">새 이미지 추가</label>
            <input type="file" multiple @change="handleFiles" accept="image/*" />
          </div>

          <!-- 제출 버튼 -->
          <div class="mt-6 flex justify-end">
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              :disabled="isSubmitting"
              :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
            >
              {{ isSubmitting ? '수정 중...' : '수정 완료' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/api/axios'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { nickname } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()

const title = ref('')
const content = ref('')
const files = ref([]) // 새로 추가한 파일
const existingImages = ref([]) // 기존 이미지 URL
const removedImages = ref([]) // 제거된 기존 이미지 URL
const isSubmitting = ref(false)

const handleFiles = (e) => {
  const input = e.target
  if (input.files) {
    files.value = Array.from(input.files)
  }
}

const removeExistingImage = (url) => {
  existingImages.value = existingImages.value.filter((img) => img !== url)
  removedImages.value.push(url)
}

const fetchPost = async () => {
  try {
    const res = await axios.get(`/api/board/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    const post = res.data.data

    if (post.writer !== nickname.value) {
      alert('작성자만 수정할 수 있습니다.')
      router.push(`/board/${route.params.id}`)
      return
    }

    title.value = post.title
    content.value = post.content
    existingImages.value = post.imageUrls || []
  } catch (err) {
    alert('게시글 불러오기 실패')
    router.push('/board')
  }
}

// ⭐ 새 이미지 먼저 업로드
const uploadNewImages = async () => {
  if (files.value.length === 0) return []

  // 파일 크기 검증 (예: 5MB 제한)
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const oversizedFiles = files.value.filter((file) => file.size > MAX_FILE_SIZE)
  if (oversizedFiles.length > 0) {
    alert(`파일 크기는 5MB를 초과할 수 없습니다.`)
    throw new Error('파일 크기 초과')
  }

  const formData = new FormData()
  files.value.forEach((file) => formData.append('images', file))

  try {
    const res = await axios.post('/api/image/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })

    return res.data.imageUrls || [] // 예: ['/images/1.png', '/images/2.png']
  } catch (err) {
    console.error('이미지 업로드 실패', err)
    throw new Error('이미지 업로드 실패')
  }
}

const submitEdit = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  try {
    // 1. 새 이미지 업로드
    const newImageUrls = await uploadNewImages()

    // 2. 기존 유지 이미지 + 새 이미지 병합
    const finalImageUrls = [...existingImages.value, ...newImageUrls]

    // 3. JSON 형태로 PUT 요청
    const payload = {
      title: title.value,
      content: content.value,
      imageUrls: finalImageUrls,
      removedImageUrls: removedImages.value,
    }

    await axios.put(`/api/board/${route.params.id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })

    alert('수정 완료!')
    router.push(`/board/${route.params.id}`)
  } catch (err) {
    console.error('수정 실패', err)
    alert('수정 실패!')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchPost)
</script>

<style scoped>
img {
  background-color: #f9fafb;
}
</style>
