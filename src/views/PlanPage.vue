<template>
  <div class="min-h-screen bg-gray-100">
    <Header :alwaysLight="true" />

    <!-- 수직 분할 가능한 컨테이너 -->
    <div class="flex h-[calc(100vh-64px)] overflow-hidden">
      <!-- 왼쪽 지도 영역 -->
      <div :style="{ width: leftWidth + 'px' }" class="relative overflow-hidden">
        <div id="map" class="w-full h-full"></div>
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner">로딩 중...</div>
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>

      <!-- 사이 간격 조절 핸들 -->
      <div
        class="w-2 cursor-col-resize bg-gray-200 hover:bg-gray-400 transition"
        @mousedown="startDragging"
      ></div>

      <!-- 오른쪽 여행 계획 작성 영역 -->
      <div class="flex-1 bg-white p-6 overflow-y-auto">
        <!-- 계획 입력 -->
        <div>
          <input
            type="text"
            v-model="plan.title"
            class="w-full border px-4 py-2 rounded-lg mb-4 text-xl font-semibold"
            placeholder="여행 제목을 입력하세요"
          />
          <div class="flex gap-4 mb-4">
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

        <!-- 일자별 계획 -->
        <div class="mt-8">
          <div v-for="(day, index) in plan.days" :key="index" class="mb-6 border rounded-lg">
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Header from '@/components/Header.vue'

const plan = ref({
  title: '서울 여행 계획',
  startDate: '2025-06-15',
  endDate: '2025-06-17',
  description: '서울의 주요 관광지와 맛집을 탐방하는 여행입니다.',
  days: [
    {
      date: '2025-06-15',
      places: [
        { name: '경복궁', time: '10:00 - 12:00' },
        { name: '광화문 광장', time: '12:30 - 14:00' },
        { name: '인사동', time: '14:30 - 16:30' },
      ],
    },
    {
      date: '2025-06-16',
      places: [{ name: '남산타워', time: '10:00 - 12:00' }],
    },
    {
      date: '2025-06-17',
      places: [{ name: '한강공원', time: '10:00 - 13:00' }],
    },
  ],
})

// 지도 로딩 관련
const mapContainer = ref(null)
const map = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const leftWidth = ref(window.innerWidth * 0.6) // 60% = 3:2
let isDragging = false

const loadKakaoMapsScript = () => {
  return new Promise((resolve) => {
    if (window.kakao?.maps) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`
    script.onload = () => {
      window.kakao.maps.load(() => resolve())
    }
    script.onerror = () => {
      errorMessage.value = '카카오맵 로드 실패'
      resolve()
    }
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  try {
    isLoading.value = true
    await loadKakaoMapsScript()
    await nextTick()
    const container = document.getElementById('map')
    if (!container) throw new Error('지도 컨테이너 없음')
    map.value = new window.kakao.maps.Map(container, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 8,
    })
  } catch (err) {
    console.error(err)
    errorMessage.value = '지도 초기화 실패'
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (map.value) {
    map.value = null
  }
})

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

  // ⭐ 지도 리사이즈 반영
  if (map.value) {
    window.kakao.maps.event.trigger(map.value, 'resize') // 이 방식도 됨
    map.value.relayout() // 또는 이 방식으로 직접 강제 리레이아웃
  }
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
#map {
  width: 100%;
  height: 100%;
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
