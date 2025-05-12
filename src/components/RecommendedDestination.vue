<template>
  <div class="destination-card" @click="selectDestination">
    <div class="destination-content">
      {{ destination.name }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  destination: {
    type: Object,
    required: true,
  },
})

const selectDestination = () => {
  // 목적지 선택 로직
  console.log('선택된 목적지:', props.destination.name)
}
</script>

<style scoped>
.destination-card {
  flex: 0 0 auto;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 25px 20px;
  min-width: 70px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.destination-card:hover {
  background-color: #e0e0e0;
}

.destination-content {
  font-size: 14px;
  font-weight: 500;
}
</style>
