<script setup>
import { ref, reactive } from 'vue'
import KakaoMap from '@/components/KakaoMap.vue'
import axios from '@/api/axios'
import { useRouter } from 'vue-router'

// 상태 관리
const router = useRouter()
const searchKeyword = ref('')
const selectedCategory = ref(null)
const selectedContentId = ref(null)
const attractionList = ref([])
const kakaoMapRef = ref(null)

const categories = reactive([
  { id: 'ALL', name: '전체', icon: '🌍' }, // 🚨 전체 카테고리 추가
  { id: 'A01', name: '자연', icon: '🌳' },
  { id: 'A02', name: '문화', icon: '🏯' },
  { id: 'A03', name: '레포츠', icon: '🚵' },
  { id: 'A04', name: '쇼핑', icon: '🎁' },
  { id: 'A05', name: '식당', icon: '🍽️' },
  { id: 'B02', name: '숙박', icon: '🏨' },
  { id: 'C01', name: '추천코스', icon: '💯' },
])

const goBack = () => {
  router.push('/')
}

const clearSearch = () => {
  searchKeyword.value = ''
}

// 🚨 카테고리 선택 (전체 포함)
const selectCategory = (category) => {
  if (selectedCategory.value === category.id) {
    // 카테고리 해제
    selectedCategory.value = null
    searchKeyword.value = ''
    // if (kakaoMapRef.value) {
    //   kakaoMapRef.value.renderAttractions([])
    // }
    updateAttractions([])
    console.log('카테고리 선택 해제')
  } else {
    // 카테고리 선택
    selectedCategory.value = category.id
    searchKeyword.value = category.name
    console.log(`"${category.name}" 카테고리 선택됨. 현 지도에서 검색 버튼을 눌러주세요.`)
  }
}

const updateAttractions = (items) => {
  attractionList.value = items
}

const onAttractionClick = (attraction) => {
  selectedContentId.value = attraction.contentId
  if (kakaoMapRef.value) {
    kakaoMapRef.value.focusMarker(attraction.contentId)
  }
}

// 🚨 수정된 메인 검색 함수 - 전체 검색 지원
const requestMarkers = async () => {
  // 현재 지도 정보 가져오기
  if (!kakaoMapRef.value) {
    alert('지도가 준비되지 않았습니다.')
    return
  }

  const mapInfo = kakaoMapRef.value.getCurrentMapInfo()
  if (!mapInfo) {
    alert('지도 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.')
    return
  }

  const { level, bounds } = mapInfo

  // // 레벨 체크
  // if (level > 12) {
  //   alert('지도를 더 확대해주세요. (현재 너무 멀리 보고 있습니다)')
  //   console.log(`🔕 레벨 ${level} → 너무 멀어 검색 취소`)
  //   updateAttractions([])
  //   kakaoMapRef.value.renderAttractions([])
  //   return
  // }

  const sw = bounds.sw
  const ne = bounds.ne

  try {
    console.log(`🔍 검색 시작... 카테고리: ${selectedCategory.value || '없음'}`)
    console.log(`📍 검색 범위: SW(${sw.lat}, ${sw.lng}) ~ NE(${ne.lat}, ${ne.lng})`)

    let apiUrl = ''
    let attractions = []

    // 🚨 카테고리에 따른 API 호출 분기
    if (!selectedCategory.value || selectedCategory.value === 'ALL') {
      // 전체 검색 - 새로운 API 사용
      apiUrl = `/api/map?swLatLng=${sw.lat},${sw.lng}&neLatLng=${ne.lat},${ne.lng}`
      console.log('📡 전체 검색 API 호출:', apiUrl)

      const { data } = await axios.get(apiUrl)
      if (!data?.data?.attractions) {
        throw new Error('서버 응답이 올바르지 않습니다')
      }
      attractions = data.data.attractions
    } else {
      // 카테고리별 검색 - 기존 API 사용
      apiUrl = `/api/map/category/${selectedCategory.value}`
      console.log('📡 카테고리별 검색 API 호출:', apiUrl)

      const { data } = await axios.get(apiUrl)
      if (!data?.data?.attractions) {
        throw new Error('서버 응답이 올바르지 않습니다')
      }
      attractions = data.data.attractions

      // 현 지도 범위 안에 있는 항목만 필터링 (카테고리별 검색일 때만)
      attractions = attractions.filter((item) => {
        if (!item.latitude || !item.longitude || isNaN(item.latitude) || isNaN(item.longitude)) {
          return false
        }

        const lat = Number(item.latitude)
        const lng = Number(item.longitude)

        return lat >= sw.lat && lat <= ne.lat && lng >= sw.lng && lng <= ne.lng
      })
    }

    console.log(`✅ 검색 완료: ${attractions.length}개 발견`)

    // 지도 & 리스트 업데이트
    updateAttractions(attractions)
    kakaoMapRef.value.renderAttractions(attractions)

    if (attractions.length === 0) {
      alert('현재 지도 범위에서 장소를 찾을 수 없습니다.')
    }
  } catch (err) {
    console.error('검색 실패:', err)
    alert(`검색 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`)
  }
}

// 🚨 수정된 검색창 처리 - 카테고리 없이도 가능
const handleSearchKeyword = () => {
  if (!searchKeyword.value.trim()) {
    // 검색어가 없으면 전체 검색으로 처리
    selectedCategory.value = 'ALL'
    searchKeyword.value = '전체'
  }

  // 검색 실행
  requestMarkers()
}
</script>

<template>
  <div class="map-container">
    <!-- Search UI -->
    <div class="search-box">
      <div class="search-input-container">
        <!-- 뒤로가기 버튼 -->
        <button class="back-button" @click="goBack" aria-label="뒤로가기">👈</button>

        <!-- 🚨 수정된 검색창 - 항상 활성화 -->
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="카테고리를 선택하거나 Enter로 전체 검색"
          class="search-input"
          @keyup.enter="handleSearchKeyword"
        />
        <button v-if="searchKeyword" @click="clearSearch" class="clear-button">
          <span>×</span>
        </button>
        <button @click="handleSearchKeyword" class="search-button">
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

    <!-- 카카오맵 컴포넌트 -->
    <KakaoMap
      ref="kakaoMapRef"
      :search-keyword="searchKeyword"
      :selected-category="selectedCategory"
      :selected-content-id="selectedContentId"
      @search-completed="updateAttractions"
    />

    <!-- 관광지 리스트 -->
    <div class="attraction-list" v-if="attractionList.length > 0">
      <div
        v-for="item in attractionList"
        :key="item.contentId"
        class="attraction-item"
        :class="{ active: selectedContentId === item.contentId }"
        @click="onAttractionClick(item)"
      >
        <img
          :src="
            item.firstImage ||
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png'
          "
          :alt="item.title"
          class="attraction-thumbnail"
          loading="lazy"
        />
        <div class="attraction-info">
          <strong>{{ item.title }}</strong
          ><br />
          <small>{{ item.address }}</small>
          <div v-if="item.tel" class="tel">📞 {{ item.tel }}</div>
        </div>
      </div>
    </div>

    <!-- 🚨 수정된 메인 검색 버튼 - 항상 활성화 -->
    <button class="search-main-button active" @click="requestMarkers">
      {{
        selectedCategory && selectedCategory !== 'ALL'
          ? `현 지도에서 "${searchKeyword}" 검색`
          : '현 지도에서 전체 검색'
      }}
    </button>

    <!-- 🚨 수정된 상태 표시 -->
    <div v-if="!selectedCategory && attractionList.length === 0" class="status-message">
      지도를 원하는 위치로 이동한 후<br />
      아래 버튼을 눌러 검색하세요.
    </div>
    <div v-else-if="selectedCategory && attractionList.length === 0" class="status-message">
      "{{ searchKeyword }}" 카테고리가 선택되었습니다.<br />
      아래 버튼을 눌러 현재 지도 범위에서 검색하세요.
    </div>
  </div>
</template>

<style scoped>
/* Container for the entire map view */
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #f8f9fa;
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
  font-size: 15px;
  padding: 0 10px;
  transition: background-color 0.2s;
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
  transition: all 0.2s;
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
  -ms-overflow-style: none;
  scrollbar-width: none;
}

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
  transition: all 0.2s;
}

.category-item:hover {
  background-color: #f8f9fa;
  border-radius: 8px;
}

.category-item.active {
  color: #2196f3;
  background-color: #e3f2fd;
  border-radius: 8px;
}

.category-icon {
  font-size: 23px;
  margin-bottom: 5px;
}

.category-name {
  font-size: 12px;
  white-space: nowrap;
}

/* Attraction list */
.attraction-list {
  position: absolute;
  top: 170px;
  left: 10px;
  width: 400px;
  max-height: calc(100vh - 320px);
  overflow-y: auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 11;
}

.attraction-item {
  display: flex;
  align-items: center;
  min-height: 100px;
  padding: 15px;
  gap: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: all 0.2s;
}

.attraction-item:hover {
  background-color: #f9f9f9;
}

.attraction-item.active {
  background-color: #e6f2ff;
  border-left: 4px solid #2196f3;
}

.attraction-item:last-child {
  border-bottom: none;
}

.attraction-thumbnail {
  width: 70px;
  height: 70px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid #ddd;
}

.attraction-info {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

.attraction-info strong {
  font-size: 16px;
  color: #333;
}

.attraction-info small {
  color: #666;
}

.tel {
  font-size: 12px;
  color: #2196f3;
  margin-top: 4px;
}

/* Back button */
.back-button {
  margin-right: 10px;
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #f0f0f0;
}

/* Main search button - 항상 활성화 */
.search-main-button {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  transition: all 0.3s;
  z-index: 20;
  max-width: 400px;
  white-space: nowrap;
}

.search-main-button:hover {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
  transform: translateX(-50%) translateY(-2px);
}

.search-main-button.active {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(33, 150, 243, 0.5);
  }
  100% {
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }
}

/* Status message */
.status-message {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(33, 150, 243, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  text-align: center;
  z-index: 19;
  max-width: 350px;
  line-height: 1.4;
}

/* Responsive design */
@media (max-width: 768px) {
  .search-box,
  .attraction-list {
    width: calc(100vw - 20px);
    max-width: 400px;
  }

  .search-main-button {
    width: calc(100vw - 40px);
    max-width: 360px;
  }

  .status-message {
    width: calc(100vw - 40px);
    max-width: 320px;
  }
}
</style>
