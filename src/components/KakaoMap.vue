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

const markerMap = new Map() // contentId → marker 객체
const attractionMap = new Map() // contentId → attraction 데이터

const mapContainer = ref(null)
const map = ref(null)
const kakaoMarkers = ref([])

const isLoading = ref(false)
const errorMessage = ref('')
const isMapReady = ref(false)

const props = defineProps({
  searchKeyword: { type: String, default: '' },
  selectedCategory: { type: String, default: null },
  selectedContentId: { type: Number, default: null },
})

const emit = defineEmits(['search-completed', 'map-info-updated'])
let sharedOverlay = null

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function wrapText(text, maxLength = 20) {
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
  if (sharedOverlay) sharedOverlay.setMap(null)

  const content = document.createElement('div')
  content.className = 'wrap'
  content.innerHTML = `
    <div class="info">
      <div class="title" style="
        font-size: 14px;
        font-weight: bold;
        line-height: 1.4;
        white-space: normal;
        word-break: keep-all;
      ">
        ${escapeHTML(item.title)}
        <div class="close" title="닫기"></div>
      </div>
      <div class="body">
        <div class="img">
          <img src="${item.firstImage || 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png'}" width="73" height="70">
        </div>
        <div class="desc">
          <div class="ellipsis">${wrapText(escapeHTML(item.address))}</div>
          ${item.tel ? `<div class="jibun ellipsis">${item.tel}</div>` : ''}
        </div>
      </div>
    </div>
  `

  sharedOverlay = new kakao.maps.CustomOverlay({
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
      sharedOverlay.setMap(null)
      sharedOverlay = null
    }
    closeBtn.addEventListener('click', closeHandler)
  }
}

const renderAttractions = (attractions) => {
  if (!map.value) return

  if (sharedOverlay) {
    sharedOverlay.setMap(null)
    sharedOverlay = null
  }

  kakaoMarkers.value.forEach((marker) => marker.setMap(null))
  kakaoMarkers.value = []
  markerMap.clear()
  attractionMap.clear()

  // 현재 지도 레벨 가져오기
  const currentLevel = map.value.getLevel()
  const maxVisibleLevel = 12 // 너무 멀리 있으면 마커 안 보이게

  if (currentLevel > maxVisibleLevel) {
    console.log(`🔕 현재 레벨 ${currentLevel} → 너무 멀어서 마커 생략됨`)
    emit('search-completed', []) // 리스트도 비움
    return
  }

  const markerBounds = new window.kakao.maps.LatLngBounds()
  const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
  const imageSize = new window.kakao.maps.Size(24, 35)

  const filteredAttractions = attractions.filter((item) => {
    const categoryCode = item.category
    if (categoryCode === 'C01') return false
    if (!props.selectedCategory) return true
    return categoryCode === props.selectedCategory
  })

  filteredAttractions.forEach((item) => {
    const position = new window.kakao.maps.LatLng(item.latitude, item.longitude)
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize)

    const marker = new window.kakao.maps.Marker({
      map: map.value,
      position,
      title: item.title,
      image: markerImage,
    })

    kakao.maps.event.addListener(marker, 'click', () => {
      openOverlay(marker, item)
    })

    kakaoMarkers.value.push(marker)
    markerMap.set(item.contentId, marker)
    attractionMap.set(item.contentId, item)
    markerBounds.extend(position)
  })

  emit('search-completed', filteredAttractions)
}

const focusMarker = (contentId) => {
  if (!map.value || !markerMap.has(contentId)) return
  kakaoMarkers.value.forEach((m) => m.setMap(null))
  const marker = markerMap.get(contentId)
  const item = attractionMap.get(contentId)
  if (marker && item) {
    marker.setMap(map.value)
    map.value.setCenter(marker.getPosition())
    openOverlay(marker, item)
  }
}

defineExpose({ renderAttractions, focusMarker })

const watchMapInfo = () => {
  if (!map.value || !window.kakao) return

  const bounds = map.value.getBounds()
  if (!bounds) return

  const level = map.value.getLevel()
  const center = map.value.getCenter()
  const mapTypeId = map.value.getMapTypeId()

  const swLatLng = bounds.getSouthWest()
  const neLatLng = bounds.getNorthEast()

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

let idleListener = null

onMounted(async () => {
  try {
    await loadKakaoMapsScript()
    window.kakao.maps.load(() => {
      map.value = new window.kakao.maps.Map(mapContainer.value, {
        center: new window.kakao.maps.LatLng(37.5014, 127.0394),
        level: 11,
      })
      isMapReady.value = true
      idleListener = window.kakao.maps.event.addListener(map.value, 'idle', () => {
        if (map.value && map.value.getBounds) {
          watchMapInfo()
        }
      })
    })
  } catch (e) {
    errorMessage.value = '지도를 불러오지 못했습니다.'
    console.error('❌ 지도 로딩 실패:', e)
  }
})

watch(
  () => [props.searchKeyword, props.selectedCategory],
  async () => {
    if (!isMapReady.value || !map.value || !map.value.getBounds) return
    watchMapInfo()
  },
  { deep: true }
)

watch(
  () => props.selectedContentId,
  (newContentId) => {
    if (newContentId && isMapReady.value) {
      focusMarker(newContentId)
    }
  }
)

onUnmounted(() => {
  kakaoMarkers.value.forEach((marker) => marker.setMap(null))
  if (map.value && idleListener) {
    window.kakao.maps.event.removeListener(map.value, 'idle', idleListener)
  }
})
</script>

<style>
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
