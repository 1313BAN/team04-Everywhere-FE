<script setup>
import { ref, reactive } from 'vue'
import KakaoMap from '@/components/KakaoMap.vue'
import axios from '@/api/axios'
const searchKeyword = ref('')
const selectedCategory = ref(null)
const latestMapInfo = ref(null) // watchMapInfo에서 전달된 최신 정보 저장

const categories = reactive([
  { id: 'A01', name: '자연', icon: '🌳' },
  { id: 'A02', name: '문화', icon: '🏯' },
  { id: 'A03', name: '레포츠', icon: '🚵' },
  { id: 'A04', name: '쇼핑', icon: '🎁' },
  { id: 'A05', name: '식당', icon: '🍽️' },
  { id: 'B02', name: '숙박', icon: '🏨' },
  { id: 'C01', name: '추천코스', icon: '💯' },
])

const searchPlaces = () => {
  if (!searchKeyword.value.trim()) return
  // 검색 이벤트 발생 또는 상태 업데이트
  // 필요한 경우 이벤트 발생하여 KakaoMap 컴포넌트에 알림
}

const clearSearch = () => {
  searchKeyword.value = ''
}

const selectCategory = (category) => {
  if (selectedCategory.value === category.id) {
    selectedCategory.value = null
  } else {
    selectedCategory.value = category.id
    searchKeyword.value = category.name
    searchPlaces()
  }
}

const handleMapInfo = (info) => {
  latestMapInfo.value = info
  console.log('📍 지도 정보 저장됨:', info)
}

const kakaoMapRef = ref(null)
const attractionList = ref([])

const updateAttractions = (items) => {
  attractionList.value = items
}

const requestMarkers = async () => {
  if (!latestMapInfo.value) return

  const { level, bounds } = latestMapInfo.value
  const sw = bounds.sw
  const ne = bounds.ne

  const params = {
    level: level.toString(),
    swLatLng: `${sw.lat},${sw.lng}`,
    neLatLng: `${ne.lat},${ne.lng}`,
    keyword: searchKeyword.value,
    category: selectedCategory.value,
  }

  try {
    const { data } = await axios.get('/api/map', { params })
    const attractions = data.data.attractions
    kakaoMapRef.value?.renderAttractions(attractions)
    updateAttractions(attractions)
  } catch (err) {
    console.error('마커 데이터 요청 실패:', err)
  }
}
const selectedContentId = ref(null)

const onAttractionClick = (attraction) => {
  selectedContentId.value = attraction.contentId
  kakaoMapRef.value?.focusMarker(attraction.contentId)
}
</script>

<template>
  <div class="map-container">
    <!-- Search UI -->
    <div class="search-box">
      <div class="search-input-container">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="지도에서 검색"
          class="search-input"
          @keyup.enter="searchPlaces"
        />
        <button v-if="searchKeyword" @click="clearSearch" class="clear-button">
          <span>×</span>
        </button>
        <button @click="searchPlaces" class="search-button">
          <span>🔍</span>
        </button>
      </div>

      <div class="category-container">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-item"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category)"
        >
          <div class="category-icon">{{ category.icon }}</div>
          <div class="category-name">{{ category.name }}</div>
        </div>
      </div>
    </div>

    <!-- 카카오맵 컴포넌트 삽입 
    KakaoMap 컴포넌트 통합
    KakaoMap 컴포넌트가 성공적으로 통합되었습니다. 
    그러나 현재는 props나 이벤트를 통한 상호작용이 없습니다. 
    이로 인해 검색어나 카테고리 선택이 지도에 반영되지 않을 수 있습니다.
    컴포넌트 간 데이터 흐름을 설정하여 사용자 입력이 지도에 반영되도록 하세요.-->
    <KakaoMap
      ref="kakaoMapRef"
      :searchKeyword="searchKeyword"
      :selectedCategory="selectedCategory"
      @map-info-updated="handleMapInfo"
      @search-completed="updateAttractions"
    />

    <div class="attraction-list">
      <div
        v-for="item in attractionList"
        :key="item.contentId"
        class="attraction-item"
        :class="{ active: selectedContentId === item.contentId }"
        @click="onAttractionClick(item)"
      >
        <!-- <div
        v-for="item in attractionList"
        :key="item.contentId"
        class="attraction-item"
        @click="onAttractionClick(item)"
        tabindex="0"
        @keyup.enter="onAttractionClick(item)"
        role="button"
        :aria-label="`${item.title} 장소 선택`"
      > -->
        <img
          :src="
            item.firstImage ||
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png'
          "
          class="attraction-thumbnail"
        />
        <div class="attraction-info">
          <strong>{{ item.title }}</strong
          ><br />
          <small>{{ item.address }}</small>
        </div>
      </div>
    </div>

    <button
      class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 z-20"
      @click="requestMarkers"
    >
      현 지도에서 검색
    </button>
  </div>
</template>

<style scoped>
/* Container for the entire map view */
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #f8f9fa; /* Light gray background */
}

/* Map element takes the full container */
#map {
  width: 100%;
  height: 100%;
}

/* Search box styling */
.search-box {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 400px;
  z-index: 10;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

/* Search input container */
.search-input-container {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

/* Search input field */
.search-input {
  flex: 1;
  height: 40px;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 0 10px;
}

/* Clear and search buttons */
.clear-button,
.search-button {
  background: none;
  border: none;
  padding: 0 5px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.clear-button:hover,
.search-button:hover {
  background-color: #f8f9fa;
  border-radius: 50%;
}

/* Category container */
.category-container {
  display: flex;
  padding: 10px 5px;
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.category-container::-webkit-scrollbar {
  display: none;
}

/* Category item styling */
.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 12px;
  cursor: pointer;
  min-width: 50px;
}

.category-item:hover {
  background-color: #f8f9fa;
  border-radius: 8px;
}

.category-item.active {
  color: #2196f3;
}

.category-icon {
  font-size: 22px;
  margin-bottom: 5px;
}

.category-name {
  font-size: 12px;
  white-space: nowrap;
}
.attraction-list {
  position: absolute;
  top: 170px; /* 검색창 아래로 살짝 내림 */
  left: 10px;
  width: 400px;
  max-height: 1000px;
  overflow-y: auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 11;
}

@media (max-width: 768px) {
  .attraction-list {
    width: calc(100vw - 20px);
    max-width: 400px;
  }

  .search-box {
    width: calc(100vw - 20px);
    max-width: 400px;
  }
}

.attraction-item {
  display: flex;
  align-items: center;
  height: 120px;
  padding: 10px;
  padding-left: 20px;
  gap: 10px;
  border-bottom: 1px solid #eee;
}

.attraction-item:last-child {
  border-bottom: none;
}

.attraction-thumbnail {
  width: 75px;
  height: 75px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid #ddd;
}

.attraction-info {
  flex: 1;
  font-size: 16px;
}
</style>
