<template>
  <div class="search-box">
    <div class="search-bar">
      <input v-model="keyword" type="text" placeholder="지도에서 검색" @keyup.enter="search" />
      <button v-if="keyword" @click="clearSearch" class="clear-btn">
        <span>×</span>
      </button>
      <button @click="search" class="search-btn">
        <span>🔍</span>
      </button>
    </div>

    <!-- Category Buttons -->
    <div class="category-buttons">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectCategory(category)"
        :class="{ active: selectedCategory === category.id }"
      >
        <div class="category-icon">{{ category.icon }}</div>
        <div class="category-name">{{ category.name }}</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['search', 'selectCategory', 'clearSearch'])

const keyword = ref('')
const selectedCategory = ref(null)

const search = () => {
  if (keyword.value.trim()) {
    emit('search', keyword.value)
  }
}

const clearSearch = () => {
  keyword.value = ''
  emit('clearSearch')
}

const selectCategory = (category) => {
  if (selectedCategory.value === category.id) {
    selectedCategory.value = null
  } else {
    selectedCategory.value = category.id
    keyword.value = category.name
    search()
  }

  emit('selectCategory', category)
}
</script>

<style scoped>
.search-box {
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.search-bar input {
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
  font-size: 16px;
}

.clear-btn,
.search-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 10px;
  font-size: 18px;
}

.category-buttons {
  display: flex;
  overflow-x: auto;
  padding: 10px;
  gap: 15px;
}

.category-buttons button {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.category-buttons button.active {
  color: #2196f3;
}

.category-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.category-name {
  font-size: 12px;
}
</style>
