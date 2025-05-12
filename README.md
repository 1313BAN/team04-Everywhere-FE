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
│   │   ├── axios.js                   # Axios 기본 설정 및 인터셉터
│   │   ├── index.js                   # API 서비스 종합 내보내기
│   │   └── services/
│   │       ├── userAuthService.js     # 사용자 인증 관련 API
│   │       └── userProfileService.js  # 사용자 프로필 관련 API
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css               # 전역 스타일 정의
│   │   │   └── variables.css          # CSS 변수 정의 (컬러, 폰트 등)
│   │   └── vue.svg                    # 프로젝트 로고 또는 뱃지
│   ├── components/
│   │   ├── Header.vue                 # 상단 네비게이션 바 컴포넌트
│   │   ├── RecommendedDestination.vue # 추천 여행지 컴포넌트
│   │   └── TravelOption.vue           # 여행 옵션(테마) 컴포넌트
│   ├── pages/
│   │   ├── LoginPage.vue              # 로그인 페이지 (헤더 포함 구성)
│   │   └── MainPage.vue               # 메인 페이지 (페이지 라우트 단위)
│   ├── stores/
│   │   ├── auth.js                    # 이전 인증 상태 관리 (사용 안 할 수도 있음)
│   │   └── user.js                    # Pinia 기반 사용자 상태 관리 (isLoggedIn 등)
│   ├── views/
│   │   ├── TravelHome.vue             # 홈 페이지 (추천/검색 포함)
│   │   ├── Login.vue                  # 로그인 폼 뷰
│   │   ├── Signup.vue                 # 회원가입 페이지
│   │   ├── Profile.vue                # 마이페이지 (유저 정보)
│   │   └── ImproveSinup.vue           # (추가 기능) 회원가입 개선 관련 페이지
│   ├── App.vue                        # 루트 컴포넌트
│   ├── main.js                        # 앱 진입점, Pinia 및 라우터 등록
│   └── router.js                      # 라우터 정의
├── index.html                         # 앱 HTML 템플릿
├── style.css                          # 전역 CSS 파일 (추가 스타일)
├── vite.config.js                     # Vite 설정 파일
├── package.json                       # npm 패키지 목록
├── package-lock.json                  # lock 파일
├── README.md                          # 프로젝트 설명
├── .gitignore                         # Git 무시 파일 목록
├── .prettierrc                        # Prettier 포맷 설정
└── eslint.config.js                   # ESLint 설정 파일

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
