<template>
  <div class="bg-[#f3f4f6] min-h-screen">
    <Header :alwaysLight="true" />
    <div class="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div class="bg-white rounded-xl shadow p-6">
        <h1 class="text-2xl font-bold mb-6">게시글 작성</h1>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label class="block mb-1 font-semibold">제목</label>
            <input
              v-model="title"
              type="text"
              class="w-full border rounded px-4 py-2"
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-semibold">내용</label>
            <textarea
              v-model="content"
              class="w-full border rounded px-4 py-2 h-40"
              placeholder="내용을 입력하세요"
              required
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-semibold">이미지 선택</label>
            <input type="file" multiple @change="handleFiles" />
          </div>

          <div class="mt-6 flex justify-end">
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/api/axios'
import Header from '@/components/Header.vue'

const router = useRouter()
const title = ref('')
const content = ref('')
const files = ref([])

function handleFiles(event) {
  const input = event.target
  if (input.files) {
    files.value = Array.from(input.files)
  }
}

async function submitForm() {
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('content', content.value)

  files.value.forEach((file) => {
    formData.append('images', file)
  })

  try {
    const res = await axios.post('/api/board', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    alert('게시글이 등록되었습니다!')
    router.push(`/board/${res.data.data.id}`)
  } catch (err) {
    alert('등록에 실패했습니다. 다시 시도해주세요.')
  }
}
</script>

<style scoped>
input,
textarea {
  background-color: #f9fafb;
}
</style>
