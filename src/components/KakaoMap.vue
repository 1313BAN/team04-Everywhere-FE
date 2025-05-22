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
const isMapReady = ref(false)

const props = defineProps({
  searchKeyword: { type: String, default: '' },
  selectedCategory: { type: String, default: null },
})

const emit = defineEmits(['search-completed', 'map-info-updated'])

// 📌 마커 렌더링 함수 (외부에서 호출 가능)
const renderAttractions = (attractions) => {
  if (!map.value) return

  kakaoMarkers.value.forEach((marker) => marker.setMap(null))
  kakaoMarkers.value = []

  const markerBounds = new window.kakao.maps.LatLngBounds()
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
    markerBounds.extend(position)
  })
}

// 🌐 외부에서 renderAttractions 호출 가능하게 노출
defineExpose({ renderAttractions })

// 지도 상태 추적
const watchMapInfo = () => {
  if (!map.value) return

  const level = map.value.getLevel()
  const center = map.value.getCenter()
  const mapTypeId = map.value.getMapTypeId()
  const mapBounds = map.value.getBounds()
  const swLatLng = mapBounds.getSouthWest()
  const neLatLng = mapBounds.getNorthEast()

  emit('map-info-updated', {
    level,
    center: { lat: center.getLat(), lng: center.getLng() },
    type: mapTypeId,
    bounds: {
      ne: { lat: neLatLng.getLat(), lng: neLatLng.getLng() },
      sw: { lat: swLatLng.getLat(), lng: swLatLng.getLng() },
    },
  })
}

// 카카오맵 스크립트 로드
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

// 초기 지도 불러오기
onMounted(async () => {
  await loadKakaoMapsScript()

  window.kakao.maps.load(() => {
    map.value = new window.kakao.maps.Map(mapContainer.value, {
      center: new window.kakao.maps.LatLng(37.5014, 127.0394),
      level: 11,
    })

    isMapReady.value = true
    window.kakao.maps.event.addListener(map.value, 'idle', watchMapInfo)
  })
})

// props 변경 시 기존 fetch 사용
watch(
  () => [props.searchKeyword, props.selectedCategory],
  async () => {
    if (!isMapReady.value) return

    // ✅ props 변화 시 기존 방식 유지 (원하면 제거 가능)
    // fetchAndRenderAttractions()
  },
  { deep: true }
)

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
