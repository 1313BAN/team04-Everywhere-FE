<template>
  <div class="travel-option" @click="selectOption">
    <div class="option-image" :style="{ backgroundImage: `url(/api/placeholder/200/150)` }"></div>
    <div class="option-title">{{ option.title }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
})

const selectOption = () => {
  // 여행 옵션 선택 로직
  console.log('선택된 옵션:', props.option.title)
}
</script>

<style scoped>
.travel-option {
  flex: 0 0 auto;
  width: 200px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
}

.option-image {
  height: 150px;
  background-color: #e0e0e0;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
}

.option-title {
  padding: 10px 5px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}
</style>
