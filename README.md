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
│   │   ├── index.js                   # 모든 API 서비스 통합 export
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
│   │   ├── TravelOption.vue          # 여행 테마/옵션 선택 컴포넌트
│   │   └── TypewriterText.vue        # 타이핑 애니메이션 텍스트 컴포넌트
│   ├── router/
│   │   └── router.js                  # Vue Router 설정
│   ├── stores/
│   │   ├── auth.js                    # 인증 상태 (예: 토큰)
│   │   └── user.js                    # 사용자 정보 상태
│   ├── views/
│   │   ├── BoardCreate.vue            # 게시글 작성 페이지
│   │   ├── BoardDetail.vue            # 게시글 상세 페이지
│   │   ├── BoardEdit.vue              # 게시글 수정 페이지
│   │   ├── ImproveSignup.vue          # 개선된 회원가입 페이지
│   │   ├── Login.vue                  # 로그인 페이지
│   │   ├── Map.vue                    # 기본 지도 페이지
│   │   ├── PlanPage.vue               # 여행 계획 작성 페이지
│   │   ├── Profile.vue                # 마이페이지 (사용자 프로필)
│   │   ├── TravelHome.vue             # 여행 홈 화면
│   │   └── UpdatedMap.vue             # 카카오맵 중심 지도 페이지
│   ├── App.vue                        # 루트 컴포넌트
│   ├── index.css                      # 전역 CSS
│   └── main.js                        # 앱 초기화, 라우터/스토어 마운트
├── index.html                         # Vite 진입 HTML
├── vite.config.js                     # Vite 설정
├── tailwind.config.js                # Tailwind 설정
├── postcss.config.js                 # PostCSS 설정
├── package.json                       # 프로젝트 설정
├── package-lock.json                  # 의존성 버전 고정
├── .gitignore                         # Git 무시 파일
├── .prettierrc                        # Prettier 설정
├── eslint.config.js                   # ESLint 설정
└── README.md                          # 프로젝트 문서
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
