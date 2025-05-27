<template>
  <div class="min-h-screen bg-gray-100 pt-[64px]">
    <Header :alwaysLight="true" />

    <!-- 검색창 고정 -->
    <div class="absolute top-[80px] left-5 z-30 bg-white rounded-xl shadow-lg p-2 flex w-[400px]">
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="장소 검색하기"
        class="flex-1 px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keyup.enter="handleSearchKeyword"
      />
      <button
        @click="handleSearchKeyword"
        class="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
      >
        검색
      </button>
      <!-- 🔄 새로고침 버튼 -->
      <button @click="requestMarkers" class="refresh-button ml-2" title="현 지도에서 새로고침">
        🔄
      </button>
    </div>

    <!-- 카테고리 -->
    <div class="absolute top-[130px] left-5 z-30 flex gap-2 bg-white rounded-xl shadow p-2">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectCategory(category)"
        :class="[
          'px-3 py-1 rounded',
          selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-100',
        ]"
      >
        {{ category.icon }} {{ category.name }}
      </button>
    </div>

    <!-- 수직 분할 가능한 컨테이너 -->
    <div class="flex h-[calc(100vh-64px)] overflow-hidden">
      <!-- 왼쪽 지도 영역 -->
      <div
        :style="{ width: leftWidth + 'px' }"
        class="relative overflow-hidden"
        ref="mapContainerWrapper"
      >
        <KakaoMap ref="kakaoMapRef" />
      </div>

      <!-- 사이 간격 조절 핸들 -->
      <div
        class="w-2 cursor-col-resize bg-gray-200 hover:bg-gray-400 transition"
        @mousedown="startDragging"
      ></div>

      <!-- 오른쪽 여행 계획 작성 영역 -->
      <div class="flex-1 bg-white p-10 pt-16 overflow-y-auto max-w-3xl mx-auto">
        <div class="space-y-4">
          <input
            type="text"
            v-model="plan.title"
            class="w-full border px-4 py-2 rounded-lg text-xl font-semibold"
            placeholder="여행 제목을 입력하세요"
          />
          <div class="flex gap-4">
            <input
              type="date"
              v-model="plan.startDate"
              class="border px-4 py-2 rounded-lg w-full"
            />
            <span class="self-center">~</span>
            <input type="date" v-model="plan.endDate" class="border px-4 py-2 rounded-lg w-full" />
          </div>
          <textarea
            v-model="plan.description"
            class="w-full border rounded-lg px-4 py-2 min-h-[100px]"
            placeholder="여행 소개를 적어보세요"
          ></textarea>
        </div>

        <div class="mt-8 space-y-6">
          <div v-for="(day, index) in plan.days" :key="index" class="border rounded-lg">
            <div class="flex justify-between items-center bg-gray-50 px-4 py-3">
              <div class="font-semibold text-lg">Day {{ index + 1 }} ({{ day.date }})</div>
              <div class="flex gap-2">
                <button @click="editDay(index)">✏️</button>
                <button @click="removeDay(index)">🗑️</button>
              </div>
            </div>
            <ul>
              <li
                v-for="(place, i) in day.places"
                :key="i"
                class="flex justify-between items-center px-4 py-2 border-t"
              >
                <div>
                  <div class="font-medium">{{ place.name }}</div>
                  <div class="text-sm text-gray-500">{{ place.time }}</div>
                </div>
                <div class="flex gap-2">
                  <button @click="editPlace(index, i)">✏️</button>
                  <button @click="removePlace(index, i)">🗑️</button>
                </div>
              </li>
            </ul>
            <button
              class="w-full py-2 text-gray-500 hover:text-gray-800 border-t"
              @click="addPlace(index)"
            >
              ➕ 장소 추가하기
            </button>
          </div>
          <button
            class="w-full py-3 border border-dashed rounded-lg text-gray-600 hover:bg-gray-100"
            @click="addDay"
          >
            ➕ 새로운 일자 추가하기
          </button>
        </div>

        <div class="flex justify-between mt-8">
          <button
            class="px-6 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50"
          >
            미리보기
          </button>
          <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            저장하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import Header from '@/components/Header.vue'
import KakaoMap from '@/components/KakaoMap.vue'
import axios from '@/api/axios'

const kakaoMapRef = ref()
const mapContainerWrapper = ref()
const searchKeyword = ref('')
const selectedCategory = ref(null)

const categories = [
  { id: 'ALL', name: '전체', icon: '🌍' },
  { id: 'A01', name: '자연', icon: '🌳' },
  { id: 'A02', name: '문화', icon: '🏭' },
  { id: 'A03', name: '레포츠', icon: '🚵' },
  { id: 'A04', name: '쇼핑', icon: '🏱' },
  { id: 'A05', name: '식당', icon: '🍽️' },
  { id: 'B02', name: '숙박', icon: '🏨' },
  { id: 'C01', name: '추천코스', icon: '💯' },
]

const handleSearchKeyword = () => {
  if (!searchKeyword.value.trim()) return
  requestMarkers()
}

const selectCategory = (category) => {
  selectedCategory.value = category.id
  searchKeyword.value = category.name
  requestMarkers()
}

const requestMarkers = async () => {
  if (!kakaoMapRef.value) return
  const mapInfo = kakaoMapRef.value.getCurrentMapInfo()
  if (!mapInfo) return
  const { sw, ne } = mapInfo.bounds

  try {
    let url = ''
    if (!selectedCategory.value || selectedCategory.value === 'ALL') {
      url = `/api/map?swLatLng=${sw.lat},${sw.lng}&neLatLng=${ne.lat},${ne.lng}`
    } else {
      url = `/api/map/category/${selectedCategory.value}`
    }
    const res = await axios.get(url)
    const attractions = res.data.data.attractions || []
    kakaoMapRef.value.renderAttractions(attractions)
  } catch (e) {
    console.error('마커 요청 실패', e)
  }
}

const plan = ref({
  title: '',
  startDate: '',
  endDate: '',
  description: '',
  days: [],
})

const leftWidth = ref(window.innerWidth * 0.6)
let isDragging = false
const startDragging = (e) => {
  isDragging = true
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDragging)
}
const onDrag = (e) => {
  if (isDragging) {
    const min = 300
    const max = window.innerWidth - 400
    leftWidth.value = Math.min(Math.max(e.clientX, min), max)
  }
}
const stopDragging = () => {
  isDragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDragging)
  nextTick(() => window.dispatchEvent(new Event('resize')))
}

const addDay = () => plan.value.days.push({ date: '', places: [] })
const removeDay = (index) => plan.value.days.splice(index, 1)
const addPlace = (dayIndex) =>
  plan.value.days[dayIndex].places.push({ name: '새 장소', time: '시간 설정' })
const removePlace = (dayIndex, placeIndex) => plan.value.days[dayIndex].places.splice(placeIndex, 1)
const editDay = (index) => alert('Day 수정 예정')
const editPlace = (dayIndex, placeIndex) => alert('장소 수정 예정')
</script>

<style scoped>
.refresh-button {
  background: none;
  border: none;
  padding: 0 10px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.refresh-button:hover {
  background-color: #f0f0f0;
  border-radius: 6px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.loading-spinner {
  font-size: 1.2rem;
  color: #333;
}
.error-message {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: #fdd;
  color: #900;
  padding: 6px 10px;
  border-radius: 4px;
  z-index: 20;
}
</style>
