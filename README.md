# 여기저기 여행 애플리케이션

## 프로젝트 개요

'여기저기'는 여행 계획 및 추천 서비스를 제공하는 Vue.js 기반의 웹 애플리케이션입니다. 사용자는 여행지를 검색하고, 추천 여행지를 확인하며, 개인 계정을 통해 여행 계획을 관리할 수 있습니다.

## 기술 스택

- **프론트엔드**: Vue.js 3, Vue Router
- **HTTP 클라이언트**: Axios
- **스타일링**: CSS Variables, 컴포넌트 스코프 스타일

## 프로젝트 구조

```
travel-app/
├── src/
│   ├── api/
│   │   ├── axios.js                   # Axios 공통 설정 및 인터셉터
│   │   ├── index.js                   # 모든 API 서비스의 통합 export
│   │   ├── userAuthService.js         # 로그인, 로그아웃, 인증 관련 API
│   │   ├── userProfileService.js      # 사용자 프로필 관련 API
│   │   └── userService.js             # 기타 사용자 관련 API
│   ├── assets/
│   │   └── vue.svg                    # 프로젝트 로고 또는 아이콘 리소스
│   ├── components/
│   │   ├── Header.vue                 # 상단 네비게이션 컴포넌트
│   │   ├── KakaoMap.vue              # 카카오 지도 컴포넌트
│   │   ├── RecommendedDestination.vue # 추천 여행지 카드 리스트
│   │   ├── SearchBox.vue             # 검색 입력창 UI
│   │   ├── SearchResults.vue         # 검색 결과 목록
│   │   └── TravelOption.vue          # 여행 테마/옵션 선택 컴포넌트
│   ├── router/
│   │   └── router.js                  # Vue Router 설정
│   ├── stores/
│   │   ├── auth.js                    # 인증 관련 상태 (예: 토큰)
│   │   └── user.js                    # 사용자 정보 관련 상태
│   ├── views/
│   │   ├── ImproveSignup.vue          # 개선된 회원가입 페이지
│   │   ├── Login.vue                  # 로그인 페이지
│   │   ├── Map.vue                    # 지도 중심 페이지 (기본 지도)
│   │   ├── Profile.vue                # 사용자 프로필 (마이페이지)
│   │   ├── TravelHome.vue             # 여행 추천 홈 화면
│   │   └── UpdatedMap.vue             # 업데이트된 지도 페이지 (지도 기능 강화판)
│   ├── App.vue                        # 애플리케이션 루트 컴포넌트
│   ├── index.css                      # 전체 프로젝트에 적용되는 전역 CSS
│   └── main.js                        # 앱 초기화, 라우터/스토어 마운트
├── index.html                         # Vite HTML 템플릿 엔트리 포인트
├── vite.config.js                     # Vite 설정 파일
├── tailwind.config.js                 # Tailwind CSS 설정
├── postcss.config.js                  # PostCSS 설정
├── package.json                       # 프로젝트 의존성과 스크립트
├── package-lock.json                  # 의존성 고정 버전
├── .gitignore                         # Git에서 무시할 파일 목록
├── .prettierrc                        # 코드 스타일 설정 (Prettier)
├── eslint.config.js                   # 코드 린팅 설정 (ESLint)
└── README.md                          # 프로젝트 소개 및 설명
```

## 주요 기능

1. **사용자 인증**

   - 회원가입, 로그인, 로그아웃
   - 토큰 기반 인증

2. **여행 검색**

   - 여행지 검색
   - 추천 여행지 표시

3. **사용자 프로필**
   - 사용자 정보 조회 및 수정
   - 비밀번호 변경

## API 통신

- API 통신은 `api` 폴더 내의 서비스들로 분리
- 각 서비스는 단일 책임 원칙에 따라 특정 도메인의 API 호출을 담당
- Axios 인터셉터를 통한 토큰 관리 및 에러 처리

## 스타일 가이드

- CSS 변수를 통한 일관된 스타일 적용
- 컴포넌트별 스코프 스타일링 적용

## 실행 방법

1. 종속성 설치:

```bash
npm install
```

2. 개발 서버 실행:

```bash
npm run dev
```
