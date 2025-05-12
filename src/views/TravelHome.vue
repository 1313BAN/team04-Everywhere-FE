<template>
  <div class="travel-home">
    <Header />

    <div class="search-container">
      <h2>여기저기서 추억을 쌓아보세요</h2>
      <div class="search-box">
        <input type="text" placeholder="어디로 떠나실 건가요?" v-model="searchDestination" />
        <button class="search-button" @click="searchTravel">계획 만들기</button>
      </div>
    </div>

    <div class="recommendations-section">
      <div class="section-title">
        <h3>어떤데가 좋을까요?</h3>
        <small>어디로 떠나고 싶으신가요?</small>
      </div>

      <div class="destinations-container">
        <RecommendedDestination
          v-for="(destination, index) in recommendedDestinations"
          :key="index"
          :destination="destination"
        />
      </div>
    </div>

    <div class="travel-options-section">
      <div class="section-title">
        <h3>요즘 핫한 장소들</h3>
        <small>여기저기에서 인기 장소들을 추천합니다.</small>
      </div>

      <div class="options-container">
        <TravelOption v-for="(option, index) in travelOptions" :key="index" :option="option" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '../components/Header.vue'
import RecommendedDestination from '../components/RecommendedDestination.vue'
import TravelOption from '../components/TravelOption.vue'

const searchDestination = ref('')

const recommendedDestinations = ref([
  { id: 1, name: '서울' },
  { id: 2, name: '제주' },
  { id: 3, name: '부산' },
  { id: 4, name: '강원' },
  { id: 5, name: '경주' },
  { id: 6, name: '여수' },
])

const travelOptions = ref([
  { id: 1, title: '힐링 여행', image: '/placeholder-healing.jpg' },
  { id: 2, title: '액티비티', image: '/placeholder-activity.jpg' },
  { id: 3, title: '맛집 탐방', image: '/placeholder-food.jpg' },
  { id: 4, title: '문화 체험', image: '/placeholder-culture.jpg' },
])

const searchTravel = () => {
  // 실제 검색 로직은 여기에 구현
  console.log('검색어:', searchDestination.value)
}
</script>

<style scoped>
.travel-home {
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.search-container {
  background-color: #0079c2;
  padding: 40px 20px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.search-container h2 {
  margin-bottom: 20px;
  font-weight: 500;
}

.search-box {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-box input {
  padding: 12px 15px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  width: 100%;
}

.search-button {
  padding: 12px 0;
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
}

.section-title {
  margin: 30px 20px 15px;
}

.section-title h3 {
  font-weight: 500;
  margin-bottom: 5px;
}

.section-title small {
  color: #666;
  font-size: 14px;
}

.destinations-container {
  display: flex;
  overflow-x: auto;
  padding: 0 20px;
  gap: 10px;
}

.options-container {
  display: flex;
  overflow-x: auto;
  padding: 0 20px;
  gap: 15px;
}

@media (min-width: 768px) {
  .search-box {
    flex-direction: row;
  }

  .search-button {
    width: auto;
    padding: 12px 30px;
  }
}
</style>
