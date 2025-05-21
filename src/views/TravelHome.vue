<template>
  <div class="travel-home font-sans text-gray-800 bg-white scroll-smooth">
    <Header />
    <!-- Hero -->
    <section
      class="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-br from-blue-500 to-green-400 text-white pt-24"
    >
      <h1 class="text-3xl md:text-4xl font-bold mb-4">여기저기 여행의 모든 것</h1>
      <p class="text-base md:text-lg mb-6">
        지도 기반 여행 계획부터 AI 추천까지, 여행의 시작과 끝을 함께합니다
      </p>
      <div class="w-full max-w-md flex flex-col gap-3">
        <div class="relative">
          <input
            type="text"
            placeholder="어디로 여행을 떠나시나요?"
            class="w-full px-4 py-3 rounded-md shadow-md text-gray-800"
          />
          <button class="absolute right-3 top-1/2 -translate-y-1/2 text-xl">🔍</button>
        </div>
        <button
          @click="goLogin"
          class="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-md"
        >
          여행 시작하기
        </button>
      </div>
      <div class="mt-12 text-sm opacity-80">스크롤 해서 내려보기</div>
    </section>

    <!-- 주요 기능 -->
    <section class="py-20 bg-white text-center">
      <h2 class="text-2xl font-bold mb-12">주요 기능</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div class="bg-white p-6 rounded-xl shadow-md">
          <div class="text-3xl mb-3">🗺️</div>
          <h3 class="font-semibold mb-2">지도 기반 위치 검색</h3>
          <p class="text-sm text-gray-600">
            맛집, 관광지, 숙소 등을 지도에서 바로 검색하고 확인하세요.
          </p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md">
          <div class="text-3xl mb-3">📝</div>
          <h3 class="font-semibold mb-2">여행 계획 생성 및 수정</h3>
          <p class="text-sm text-gray-600">
            일정별로 세부 계획을 자유롭게 작성하고 수정할 수 있어요.
          </p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md">
          <div class="text-3xl mb-3">🤖</div>
          <h3 class="font-semibold mb-2">AI 여행 계획 추천</h3>
          <p class="text-sm text-gray-600">맞춤형 추천으로 나만의 여행을 디자인하세요.</p>
        </div>
      </div>
    </section>

    <!-- 이용 방법 -->
    <section class="py-20 bg-gray-100 text-center">
      <h2 class="text-2xl font-bold mb-12">이용 방법</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div class="bg-white p-6 rounded-xl shadow-md relative">
          <div
            class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-400 w-10 h-10 flex items-center justify-center text-white font-bold rounded-full"
          >
            1
          </div>
          <h3 class="mt-6 font-semibold mb-2">계정 생성</h3>
          <p class="text-sm text-gray-600">
            회원가입으로 나만의 여행 계획을 저장하고 관리할 수 있습니다.
          </p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md relative">
          <div
            class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-400 w-10 h-10 flex items-center justify-center text-white font-bold rounded-full"
          >
            2
          </div>
          <h3 class="mt-6 font-semibold mb-2">여행지 검색</h3>
          <p class="text-sm text-gray-600">지도에서 여행하고 싶은 지역을 검색하세요.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md relative">
          <div
            class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-400 w-10 h-10 flex items-center justify-center text-white font-bold rounded-full"
          >
            3
          </div>
          <h3 class="mt-6 font-semibold mb-2">계획 생성</h3>
          <p class="text-sm text-gray-600">일정, 숙소, 교통편을 계획하고 AI 추천을 받으세요.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md relative">
          <div
            class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-400 w-10 h-10 flex items-center justify-center text-white font-bold rounded-full"
          >
            4
          </div>
          <h3 class="mt-6 font-semibold mb-2">여행 떠나기</h3>
          <p class="text-sm text-gray-600">작성한 계획을 바탕으로 여행을 시작하세요!</p>
        </div>
      </div>
    </section>

    <!-- 소개 -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 items-center">
        <div class="flex-1 text-left">
          <h3 class="text-lg font-bold text-blue-500 mb-4">여기저기</h3>
          <p class="mb-4 text-sm">
            팀 삼각김밥이 개발한 Vue.js 기반의 여행 계획 및 추천 서비스입니다. 사용자는 여행지를
            검색하고, 추천 여행지를 확인하며, 개인 계정을 통해 여행 계획을 관리할 수 있습니다.
          </p>
          <p class="mb-4 text-sm">
            특별한 기능보다는 실속에 초점을 맞춘 웹 애플리케이션으로, 하나의 웹 페이지에서 맛집부터
            데이트코스까지 모든 여행 기획을 처리할 수 있습니다.
          </p>
          <div class="mt-6">
            <p class="font-semibold text-base mb-1">우리의 모토</p>
            <p class="italic text-orange-500">
              "여기저기와 함께 우리나라 여기저기를 여행해보세요!"
            </p>
          </div>
        </div>
        <div class="flex-1">
          <div class="w-full h-64 bg-gray-300 rounded-xl relative">
            <div
              class="absolute w-5 h-5 bg-blue-500 rounded-full"
              style="top: 40%; left: 30%"
            ></div>
            <div
              class="absolute w-5 h-5 bg-blue-500 rounded-full"
              style="top: 60%; left: 50%"
            ></div>
            <div
              class="absolute w-5 h-5 bg-blue-500 rounded-full"
              style="top: 35%; left: 70%"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section
      class="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-r from-yellow-400 to-blue-500 text-white"
    >
      <h2 class="text-xl md:text-2xl font-bold mb-4">지금 바로 여행 계획을 시작하세요</h2>
      <p class="mb-6">혼자서도, AI와 함께도 가능한 쉽고 간편한 여행 계획</p>
      <div class="flex gap-4">
        <button
          @click="goLogin"
          class="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition"
        >
          로그인 없이 시작하기
        </button>
        <button class="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition">
          더 알아보기
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12 text-sm">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 class="font-bold mb-4">여기저기</h3>
          <p>지도 기반 검색부터 AI 추천까지, 여행의 모든 것을 한 곳에서 해결하세요.</p>
        </div>
        <div>
          <h3 class="font-bold mb-4">링크</h3>
          <ul class="space-y-2">
            <li><a href="#features" class="hover:underline">주요 기능</a></li>
            <li><a href="#how" class="hover:underline">이용 방법</a></li>
            <li><a href="#about" class="hover:underline">서비스 소개</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-bold mb-4">고객지원</h3>
          <ul class="space-y-2">
            <li><a href="#" class="hover:underline">자주 묻는 질문</a></li>
            <li><a href="#" class="hover:underline">문의하기</a></li>
            <li><a href="#" class="hover:underline">이용약관</a></li>
            <li><a href="#" class="hover:underline">개인정보처리방침</a></li>
          </ul>
        </div>
      </div>
      <div class="text-center mt-8 text-gray-400">&copy; 2025 여기저기 | 팀 삼각김밥 제작</div>
    </footer>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue' // 경로는 실제 파일 위치에 맞게 수정
</script>
