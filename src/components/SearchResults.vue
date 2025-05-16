<template>
  <div class="search-results" v-if="showResults">
    <div class="results-header">
      <h3 v-if="keyword">'{{ keyword }}' 검색 결과</h3>
      <h3 v-else>검색 결과</h3>
      <button @click="closeResults" class="close-btn">×</button>
    </div>
    <div class="results-list" v-if="results.length > 0">
      <div
        v-for="(place, index) in results"
        :key="index"
        class="result-item"
        @click="selectPlace(place)"
      >
        <div class="place-name">{{ place.name }}</div>
        <div class="place-address">{{ place.address }}</div>
        <div class="place-distance">{{ place.distance }}m</div>
        <div class="actions">
          <button class="action-btn">즐겨찾기</button>
          <button class="action-btn">도착</button>
        </div>
      </div>
    </div>
    <div v-else class="no-results">검색 결과가 없습니다.</div>
  </div>
</template>

<script setup>
defineProps({
  showResults: {
    type: Boolean,
    default: false,
  },
  results: {
    type: Array,
    default: () => [],
  },
  keyword: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'selectPlace'])

const closeResults = () => {
  emit('close')
}

const selectPlace = (place) => {
  emit('selectPlace', place)
}
</script>

<style scoped>
.search-results {
  width: 100%;
  max-height: calc(100vh - 130px);
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  margin-top: 10px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.results-header h3 {
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.results-list {
  padding: 0;
}

.result-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.result-item:hover {
  background-color: #f9f9f9;
}

.place-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.place-address {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.place-distance {
  font-size: 14px;
  color: #2196f3;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: #666;
}
</style>
