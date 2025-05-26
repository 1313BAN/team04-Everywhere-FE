<template>
  <div class="bg-[#f3f4f6] min-h-screen">
    <Header :alwaysLight="true" />
    <div class="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div class="bg-white rounded-xl shadow p-6">
        <h1 class="text-2xl font-bold mb-6">게시글 수정</h1>
        <form @submit.prevent="submitEdit">
          <div class="mb-4">
            <label class="block mb-1 font-semibold">제목</label>
            <input v-model="title" type="text" class="w-full border rounded px-4 py-2" required />
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-semibold">내용</label>
            <textarea v-model="content" class="w-full border rounded px-4 py-2 h-40" required />
          </div>

          <div class="mt-6 flex justify-end">
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              수정 완료
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

const route = useRoute()
const router = useRouter()

const title = ref('')
const content = ref('')

const fetchPost = async () => {
  try {
    const res = await axios.get(`/api/board/${route.params.id}`)
    const post = res.data.data
    title.value = post.title
    content.value = post.content
  } catch (err) {
    alert('게시글 불러오기 실패')
  }
}

const submitEdit = async () => {
  try {
    await axios.put(
      `/api/board/${route.params.id}`,
      {
        title: title.value,
        content: content.value,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    )

    alert('수정 완료!')
    router.push(`/board/${route.params.id}`)
  } catch (err) {
    alert('수정 실패!')
  }
}

onMounted(fetchPost)
</script>

<style scoped>
img {
  background-color: #f9fafb;
}
</style>
