├── src/
│ ├── assets/
│ │ └── css/
│ │ ├── main.css # 전역 스타일
│ │ └── variables.css # CSS 변수 정의
│ ├── components/
│ │ ├── Header.vue # 헤더 컴포넌트
│ │ ├── RecommendedDestination.vue # 추천 여행지 컴포넌트
│ │ └── TravelOption.vue # 여행 옵션 컴포넌트
│ ├── api/
│ │ ├── index.js # API 서비스 내보내기
│ │ ├── axios.js # Axios 설정 및 인터셉터
│ │ └── services/
│ │ ├── userService.js # 사용자 서비스 (레거시)
│ │ ├── userAuthService.js # 사용자 인증 서비스
│ │ └── userProfileService.js # 사용자 프로필 서비스
│ ├── views/
│ │ ├── TravelHome.vue # 메인 홈 페이지
│ │ ├── Login.vue # 로그인 페이지
│ │ ├── Signup.vue # 회원가입 페이지
│ │ └── Profile.vue # 사용자 프로필 페이지
│ ├── App.vue # 루트 컴포넌트
│ ├── main.js # 앱 진입점
│ └── router.js # 라우터 설정
└── index.html # HTML 템플릿
