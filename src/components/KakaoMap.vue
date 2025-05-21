<template>
  <div class="map-wrapper">
    <div id="map" ref="mapContainer"></div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">로딩 중...</div>
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import axios from '@/api/axios'

const mapContainer = ref(null)
const map = ref(null)
const kakaoMarkers = ref([])

const isLoading = ref(false)
const errorMessage = ref('')
const isMapReady = ref(false) // 지도 준비 여부

// props 정의
const props = defineProps({
  searchKeyword: {
    type: String,
    default: '',
  },
  selectedCategory: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['search-completed'])

// Kakao Maps 스크립트 로드
const loadKakaoMapsScript = () => {
  return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps) {
      resolve()
    } else {
      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services,clusterer,drawing&autoload=false`
      script.onload = () => {
        window.kakao.maps.load(() => resolve())
      }
      document.head.appendChild(script)
    }
  })
}

// 관광지 정보 불러와 마커 렌더링
const fetchAndRenderAttractions = async () => {
  if (!map.value) return // map 준비 확인

  isLoading.value = true
  errorMessage.value = ''
  try {
    const params = {}
    if (props.searchKeyword) params.keyword = props.searchKeyword
    if (props.selectedCategory) params.category = props.selectedCategory

    const response = await axios.get('/api/map', { params })
    const attractions = response.data.data.attractions
    emit('search-completed', attractions.length)

    // 기존 마커 제거
    kakaoMarkers.value.forEach((marker) => marker.setMap(null))
    kakaoMarkers.value = []

    const bounds = new window.kakao.maps.LatLngBounds()
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
    const imageSize = new window.kakao.maps.Size(24, 35)

    attractions.forEach((item) => {
      const position = new window.kakao.maps.LatLng(item.latitude, item.longitude)
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize)

      const marker = new window.kakao.maps.Marker({
        map: map.value,
        position,
        title: item.title,
        image: markerImage,
      })

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:13px;">${item.title}</div>`,
      })

      window.kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map.value, marker)
      })

      kakaoMarkers.value.push(marker)
      bounds.extend(position)
    })

    if (attractions.length > 1) {
      map.value.setBounds(bounds)
    }
  } catch (error) {
    console.error('❌ 관광지 데이터를 불러오지 못했습니다:', error)
    errorMessage.value = '데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
}

// 지도 초기화
onMounted(async () => {
  await loadKakaoMapsScript()

  window.kakao.maps.load(async () => {
    map.value = new window.kakao.maps.Map(mapContainer.value, {
      center: new window.kakao.maps.LatLng(37.5014, 127.0394),
      level: 11,
    })

    isMapReady.value = true // 지도 준비 완료
    await fetchAndRenderAttractions()
  })
})

// props 변경 시 자동 갱신
watch(
  () => [props.searchKeyword, props.selectedCategory],
  async () => {
    if (!isMapReady.value) return
    await fetchAndRenderAttractions()
  },
  { deep: true }
)

// 컴포넌트 언마운트 시 마커 제거
onUnmounted(() => {
  kakaoMarkers.value.forEach((marker) => marker.setMap(null))
})
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100vh;
}

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
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
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
  padding: 5px 10px;
  border-radius: 4px;
}
</style>
