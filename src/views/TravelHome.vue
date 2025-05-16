<!-- <template>
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
</template> -->
<template>
  <div class="travel-home font-sans text-gray-800 bg-white">
    <!-- Header -->
    <Header />

    <!-- Hero/Search Section -->
    <section
      class="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-center py-16 px-4"
    >
      <h2 class="text-3xl md:text-4xl font-bold mb-6">여기저기서 추억을 쌓아보세요</h2>
      <div class="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="어디로 떠나실 건가요?"
          v-model="searchDestination"
          class="w-full md:flex-1 px-4 py-3 rounded-md border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          @click="searchTravel"
          class="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition"
        >
          계획 만들기
        </button>
      </div>
    </section>

    <!-- 추천 여행지 섹션 -->
    <section class="py-12 px-4 max-w-7xl mx-auto">
      <div class="text-center mb-8">
        <h3 class="text-2xl font-bold">어떤 데가 좋을까요?</h3>
        <p class="text-gray-500 mt-2">여행지를 선택하고 여정을 시작하세요!</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <RecommendedDestination
          v-for="(destination, index) in recommendedDestinations"
          :key="index"
          :destination="destination"
        />
      </div>
    </section>

    <!-- 여행 옵션 섹션 -->
    <section class="py-12 px-4 bg-gray-50">
      <div class="text-center mb-8">
        <h3 class="text-2xl font-bold">요즘 핫한 장소들</h3>
        <p class="text-gray-500 mt-2">여기저기에서 인기 장소들을 추천합니다.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <TravelOption v-for="(option, index) in travelOptions" :key="index" :option="option" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
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

<!-- <style scoped>
.travel-home {
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  align-items: center;
}

.search-container {
  background-color: #d0d0d0;
  padding: 40px 20px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  width: 100%;
  text-align: center;
}

.search-container h2 {
  margin-bottom: 20px;
  font-weight: 500;
}

.search-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 600px;
  align-items: center;
}

.search-box input {
  padding: 12px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
}

.search-button {
  padding: 12px;
  font-size: 16px;
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  max-width: 600px;
}

.recommendations-section,
.travel-options-section {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-title {
  margin: 30px 0 15px;
  text-align: center;
  width: 100%;
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
  width: 100%;
  justify-content: center;
}

.options-container {
  display: flex;
  overflow-x: auto;
  padding: 0 20px;
  gap: 15px;
  width: 100%;
  justify-content: center;
}

@media (min-width: 768px) {
  .search-button {
    width: auto;
    padding: 12px 30px;
  }

  .search-box {
    flex-direction: row;
    justify-content: center;
  }

  .search-box input {
    flex: 1;
    max-width: 70%;
  }

  .search-button {
    max-width: 200px;
  }
}
</style> -->
