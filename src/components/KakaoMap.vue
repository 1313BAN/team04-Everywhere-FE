<template>
  <div class="map-wrapper">
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from '@/api/axios'

const mapContainer = ref(null)
const map = ref(null)
const kakaoMarkers = ref([])

// ✅ Kakao Maps 스크립트 로드
const loadKakaoMapsScript = () => {
  return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps) {
      resolve()
    } else {
      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=561dfa60b97113cdd16dd7ae9d80f53a&libraries=services,clusterer,drawing&autoload=false`
      script.onload = () => {
        window.kakao.maps.load(() => resolve())
      }
      document.head.appendChild(script)
    }
  })
}

const fetchAndRenderAttractions = async () => {
  try {
    const response = await axios.get('/api/map')

    console.log('📦 실제 응답 데이터:', response.data)

    const attractions = response.data.data.attractions

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
  }
}

// ✅ 지도 초기화
onMounted(async () => {
  await loadKakaoMapsScript()

  window.kakao.maps.load(async () => {
    map.value = new window.kakao.maps.Map(mapContainer.value, {
      center: new window.kakao.maps.LatLng(37.5014, 127.0394),
      level: 11,
    })

    // 💡 지도 생성 완료 후 마커 렌더링
    await fetchAndRenderAttractions()
  })
})

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
</style>
