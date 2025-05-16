<template>
  <div class="map-container">
    <!-- Search Component -->
    <div class="search-components">
      <SearchBox
        :categories="categories"
        @search="searchPlaces"
        @select-category="selectCategory"
        @clear-search="clearSearch"
      />

      <SearchResults
        v-if="showResults"
        :show-results="showResults"
        :results="searchResults"
        :keyword="searchKeyword"
        @close="closeResults"
        @select-place="selectPlace"
      />
    </div>

    <!-- Map Component -->
    <KakaoMap
      ref="mapRef"
      :center="mapCenter"
      :level="mapLevel"
      :markers="mapMarkers"
      @map-initialized="onMapInitialized"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import SearchBox from '../components/SearchBox.vue'
import SearchResults from '../components/SearchResults.vue'
import KakaoMap from '../components/KakaoMap.vue'

// Map state
const mapRef = ref(null)
const mapInstance = ref(null)
const mapCenter = ref({ lat: 37.5014, lng: 127.0394 })
const mapLevel = ref(3)
const mapMarkers = ref([])

// Search state
const searchKeyword = ref('')
const showResults = ref(false)
const searchResults = ref([])
const placesService = ref(null)

// Categories
const categories = reactive([
  { id: 'restaurant', name: '음식점', icon: '🍽️' },
  { id: 'cafe', name: '카페', icon: '☕' },
  { id: 'convenience', name: '편의점', icon: '🏪' },
  { id: 'subway', name: '지하철', icon: '🚇' },
  { id: 'bus', name: '버스', icon: '🚌' },
  { id: 'hospital', name: '병원', icon: '🏥' },
  { id: 'pharmacy', name: '약국', icon: '💊' },
  { id: 'bank', name: '은행', icon: '🏦' },
])

// Map initialized callback
const onMapInitialized = (map) => {
  mapInstance.value = map

  // Initialize places service
  if (window.kakao && window.kakao.maps) {
    placesService.value = new window.kakao.maps.services.Places()
  }
}

// Search places
const searchPlaces = (keyword) => {
  searchKeyword.value = keyword

  if (!keyword || !placesService.value) return

  placesService.value.keywordSearch(keyword, (result, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      // Process results
      searchResults.value = result.map((place) => ({
        name: place.place_name,
        address: place.address_name,
        distance: calculateDistance(place),
        lat: parseFloat(place.y),
        lng: parseFloat(place.x),
      }))

      // Update map markers
      mapMarkers.value = searchResults.value.map((place) => ({
        lat: place.lat,
        lng: place.lng,
      }))

      showResults.value = true
    } else {
      searchResults.value = []
      mapMarkers.value = []
      showResults.value = true
    }
  })
}

// Calculate distance (mock function)
const calculateDistance = (place) => {
  // In a real app, calculate actual distance using current location
  return Math.floor(Math.random() * 1000) + 100
}

// Select a place from results
const selectPlace = (place) => {
  mapCenter.value = { lat: place.lat, lng: place.lng }
  mapLevel.value = 2
}

// Select category
const selectCategory = (category) => {
  searchPlaces(category.name)
}

// Clear search
const clearSearch = () => {
  searchKeyword.value = ''
  searchResults.value = []
  mapMarkers.value = []
  showResults.value = false
}

// Close results panel
const closeResults = () => {
  showResults.value = false
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.search-components {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  width: 400px;
}
</style>
