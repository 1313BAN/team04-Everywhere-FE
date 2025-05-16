<template>
  <div class="map-wrapper">
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  center: {
    type: Object,
    default: () => ({ lat: 37.5014, lng: 127.0394 }),
  },
  level: {
    type: Number,
    default: 3,
  },
  markers: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['mapInitialized'])

const mapContainer = ref(null)
const map = ref(null)
const kakaoMarkers = ref([])

// Load Kakao Map script if not already loaded
const loadKakaoMapsScript = () => {
  return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps) {
      resolve()
    } else {
      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_MAPS_API_KEY&libraries=services,clusterer,drawing&autoload=false`
      script.onload = () => {
        window.kakao.maps.load(() => {
          resolve()
        })
      }
      document.head.appendChild(script)
    }
  })
}

// Initialize map
const initializeMap = () => {
  const mapOptions = {
    center: new window.kakao.maps.LatLng(props.center.lat, props.center.lng),
    level: props.level,
  }

  map.value = new window.kakao.maps.Map(mapContainer.value, mapOptions)

  // Let parent component know map is ready
  emit('mapInitialized', map.value)

  // Add initial markers if provided
  updateMarkers()
}

// Update markers when props change
const updateMarkers = () => {
  // Clear old markers
  kakaoMarkers.value.forEach((marker) => {
    marker.setMap(null)
  })
  kakaoMarkers.value = []

  // Add new markers
  if (props.markers.length > 0) {
    const bounds = new window.kakao.maps.LatLngBounds()

    props.markers.forEach((markerInfo) => {
      const position = new window.kakao.maps.LatLng(markerInfo.lat, markerInfo.lng)

      const marker = new window.kakao.maps.Marker({
        map: map.value,
        position: position,
      })

      kakaoMarkers.value.push(marker)
      bounds.extend(position)
    })

    // Adjust map bounds to show all markers
    if (props.markers.length > 1) {
      map.value.setBounds(bounds)
    }
  }
}

// Expose methods to parent component
defineExpose({
  setCenter: (lat, lng) => {
    if (map.value) {
      map.value.setCenter(new window.kakao.maps.LatLng(lat, lng))
    }
  },
  setLevel: (level) => {
    if (map.value) {
      map.value.setLevel(level)
    }
  },
})

// Watch for changes to props
import { watch } from 'vue'

watch(
  () => props.markers,
  () => {
    if (map.value) {
      updateMarkers()
    }
  },
  { deep: true }
)

watch(
  () => props.center,
  () => {
    if (map.value) {
      map.value.setCenter(new window.kakao.maps.LatLng(props.center.lat, props.center.lng))
    }
  },
  { deep: true }
)

watch(
  () => props.level,
  () => {
    if (map.value) {
      map.value.setLevel(props.level)
    }
  }
)

// Lifecycle hooks
onMounted(async () => {
  await loadKakaoMapsScript()
  initializeMap()
})

onUnmounted(() => {
  // Clean up markers
  kakaoMarkers.value.forEach((marker) => {
    marker.setMap(null)
  })
})
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
}

#map {
  width: 100%;
  height: 100%;
}
</style>
