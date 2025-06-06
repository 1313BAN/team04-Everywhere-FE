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
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

// 상태 관리
const mapContainer = ref(null)
const map = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const isMapReady = ref(false)

// 마커 관리
const currentMarkers = ref([])
const markerMap = new Map() // contentId → marker 객체
const attractionMap = new Map() // contentId → attraction 데이터
let sharedOverlay = null

const props = defineProps({
  searchKeyword: { type: String, default: '' },
  selectedCategory: { type: String, default: null },
  selectedContentId: { type: Number, default: null },
})

const emit = defineEmits(['search-completed'])

// 유틸리티 함수들
function escapeHTML(str) {
  if (!str || typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function wrapText(text, maxLength = 20) {
  if (!text || typeof text !== 'string') return ''
  const words = escapeHTML(text).split(' ')
  let result = ''
  let line = ''
  for (let word of words) {
    if ((line + word).length > maxLength - 5) {
      result += line.trim() + '<br>'
      line = ''
    }
    line += word + ' '
  }
  return result + line.trim()
}

const openOverlay = (marker, item) => {
  if (!marker || !item || !map.value) return

  // 기존 오버레이 정리
  if (sharedOverlay) {
    sharedOverlay.setMap(null)
    sharedOverlay = null
  }

  const content = document.createElement('div')
  content.className = 'wrap'
  content.innerHTML = `
    <div class="info">
      <div class="title" style="font-size: 14px; font-weight: bold; line-height: 1.4; white-space: normal; word-break: keep-all;">
        ${escapeHTML(item.title || '제목 없음')}
        <div class="close" title="닫기"></div>
      </div>
      <div class="body">
        <div class="img">
          <img src="${item.firstImage || 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png'}" width="73" height="70">
        </div>
        <div class="desc">
          <div class="ellipsis">${wrapText(item.address || '주소 정보 없음')}</div>
          ${item.tel ? `<div class="jibun ellipsis">${escapeHTML(item.tel)}</div>` : ''}
        </div>
      </div>
    </div>`

  sharedOverlay = new window.kakao.maps.CustomOverlay({
    content,
    map: map.value,
    position: marker.getPosition(),
    xAnchor: 0.5,
    yAnchor: 1.4,
  })

  const closeBtn = content.querySelector('.close')
  if (closeBtn) {
    const closeHandler = () => {
      closeBtn.removeEventListener('click', closeHandler)
      if (sharedOverlay) {
        sharedOverlay.setMap(null)
        sharedOverlay = null
      }
    }
    closeBtn.addEventListener('click', closeHandler)
  }
}

// 모든 마커 제거
const clearMarkers = () => {
  // 개별 마커 제거
  currentMarkers.value.forEach((marker) => {
    marker.setMap(null)
  })
  currentMarkers.value = []
  markerMap.clear()
  attractionMap.clear()
}

const renderAttractions = (attractions) => {
  if (!map.value || !isMapReady.value) return

  // 기존 마커 모두 제거
  clearMarkers()

  // 기존 오버레이 제거
  if (sharedOverlay) {
    sharedOverlay.setMap(null)
    sharedOverlay = null
  }

  if (!attractions || attractions.length === 0) {
    emit('search-completed', [])
    return
  }

  // 현재 지도 레벨 체크
  const currentLevel = map.value.getLevel()
  const maxVisibleLevel = 12

  if (currentLevel > maxVisibleLevel) {
    console.log(`🔕 현재 레벨 ${currentLevel} → 너무 멀어서 마커 생략됨`)
    emit('search-completed', [])
    return
  }

  // 유효한 관광지 필터링
  const validAttractions = attractions.filter((item) => {
    if (!item) return false
    const lat = parseFloat(item.latitude)
    const lng = parseFloat(item.longitude)
    const isValidCoord = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0

    if (!isValidCoord) return false
    if (item.category === 'C01') return false

    // 카테고리 필터링
    if (!props.selectedCategory) return true
    return item.category === props.selectedCategory
  })

  if (validAttractions.length === 0) {
    emit('search-completed', [])
    return
  }

  // 마커 이미지 설정
  const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
  const imageSize = new window.kakao.maps.Size(24, 35)

  // 마커 생성 (개별 마커로)
  const markers = validAttractions.map((item) => {
    const position = new window.kakao.maps.LatLng(item.latitude, item.longitude)
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize)

    const marker = new window.kakao.maps.Marker({
      position: position,
      title: item.title || '제목 없음',
      image: markerImage,
    })

    // 마커 클릭 이벤트
    window.kakao.maps.event.addListener(marker, 'click', () => {
      openOverlay(marker, item)
    })

    // 개별 마커를 지도에 직접 추가
    marker.setMap(map.value)

    // Map에 저장
    markerMap.set(item.contentId, marker)
    attractionMap.set(item.contentId, item)

    return marker
  })

  currentMarkers.value = markers
  emit('search-completed', validAttractions)
}

const focusMarker = (contentId) => {
  if (!map.value || !contentId || !markerMap.has(contentId)) return

  const marker = markerMap.get(contentId)
  const attraction = attractionMap.get(contentId)

  if (marker && attraction) {
    map.value.setCenter(marker.getPosition())
    openOverlay(marker, attraction)
  }
}

const getCurrentMapInfo = () => {
  if (!map.value || !isMapReady.value) return null

  const bounds = map.value.getBounds()
  if (!bounds) return null

  const level = map.value.getLevel()
  const center = map.value.getCenter()
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()

  return {
    level,
    center: { lat: center.getLat(), lng: center.getLng() },
    bounds: {
      ne: { lat: ne.getLat(), lng: ne.getLng() },
      sw: { lat: sw.getLat(), lng: sw.getLng() },
    },
  }
}

defineExpose({
  renderAttractions,
  focusMarker,
  getCurrentMapInfo,
})

const loadKakaoMapsScript = () => {
  return new Promise((resolve) => {
    if (window.kakao?.maps) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services,clusterer&autoload=false`

    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve()
      })
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

    if (!mapContainer.value) {
      throw new Error('지도 컨테이너를 찾을 수 없음')
    }

    await nextTick()

    // 지도 생성
    map.value = new window.kakao.maps.Map(mapContainer.value, {
      center: new window.kakao.maps.LatLng(37.5014, 127.0394),
      level: 3,
    })

    isMapReady.value = true
  } catch (error) {
    errorMessage.value = '지도 초기화 실패'
  } finally {
    isLoading.value = false
  }
})

watch(
  () => props.selectedContentId,
  (newContentId) => {
    if (newContentId && isMapReady.value) {
      focusMarker(newContentId)
    }
  }
)

onUnmounted(() => {
  clearMarkers()

  if (sharedOverlay) {
    sharedOverlay.setMap(null)
    sharedOverlay = null
  }

  if (map.value) {
    map.value = null
  }
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

<style>
.wrap {
  width: 288px;
  height: 132px;
  text-align: left;
  overflow: hidden;
  font-size: 12px;
  font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;
  line-height: 1.5;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1000;
}

.wrap * {
  padding: 0;
  margin: 0;
}

.wrap .info {
  width: 100%;
  height: 100%;
  position: relative;
}

.info .title {
  padding: 5px 10px;
  height: 30px;
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info .close {
  width: 17px;
  height: 17px;
  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png');
  background-size: cover;
  cursor: pointer;
}

.info .body {
  position: relative;
  overflow: hidden;
  display: flex;
  padding: 10px;
}

.info .desc {
  margin-left: 10px;
  flex: 1;
}

.desc .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desc .jibun {
  font-size: 11px;
  color: #888;
  margin-top: 4px;
}

.info .img {
  flex-shrink: 0;
  width: 73px;
  height: 71px;
  border: 1px solid #ddd;
  overflow: hidden;
}

.info .img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info:after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -12px;
  margin-left: -11px;
  width: 22px;
  height: 12px;
  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png');
}
</style>
