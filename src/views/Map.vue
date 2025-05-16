<template>
  <div class="map-container">
    <!-- Search Box at the top -->
    <button class="back-button" @click="goBack">
      <span>←</span>
    </button>
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

      <!-- Category Buttons -->
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
    <div class="map-container">
      <div id="map" ref="mapContainer"></div>
    </div>
  </div>
</template>

<script setup>
import { useTemplateRef, onMounted, ref, reactive } from 'vue'

const mapContainer = ref(null)
const mapOption = {
  center: new window.kakao.maps.LatLng(37.5014, 127.0394),
  level: 1,
}

onMounted(() => {
  window.kakao.maps.load(() => {
    const map = new window.kakao.maps.Map(mapContainer.value, mapOption)
  })
})

const searchKeyword = ref('')
const selectedCategory = ref(null)

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

const searchPlaces = () => {
  if (!searchKeyword.value.trim()) return
  console.log(`Searching for: ${searchKeyword.value}`)
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
</script>

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
</style>
