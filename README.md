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
│   │   └── userAuthService.js         # 사용자 인증 관련 API
│   │   └── userProfileService.js      # 사용자 프로필 관련 API
│   │   └── userService.js             # 사용자 기타 API
│   ├── assets/
│   │   └── vue.svg                    # 프로젝트 로고 또는 뱃지
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.vue             # 공통 버튼 컴포넌트
│   │   │   └── Button.css             # 버튼 전용 스타일
│   │   ├── Header.vue                 # 상단 네비게이션 바
│   │   ├── RecommendedDestination.vue # 추천 여행지 카드
│   │   └── TravelOption.vue           # 여행 테마/옵션 선택 컴포넌트
│   ├── router/
│   │   └── router.js                  # 라우터 설정
│   ├── stores/
│   │   ├── auth.js                    # 인증 상태 관리
│   │   └── user.js                    # 사용자 상태 관리 (Pinia)
│   ├── views/
│   │   ├── ImproveSignup.vue          # 회원가입 개선 화면
│   │   ├── Login.vue                  # 로그인 폼
│   │   ├── Profile.vue                # 마이페이지
│   │   ├── Signup.vue                 # 회원가입 폼
│   │   └── TravelHome.vue             # 추천 + 메인 홈 페이지
│   ├── App.vue                        # 루트 컴포넌트
│   ├── index.css                      # 전역 스타일 (기존 스타일 통합)
│   └── main.js                        # 앱 진입점, 라우터 및 Pinia 등록
├── index.html                         # HTML 템플릿
├── vite.config.js                     # Vite 설정 파일
├── package.json                       # 의존성 및 스크립트 정의
├── package-lock.json                  # lock 파일
├── README.md                          # 프로젝트 설명
├── .gitignore                         # Git 무시 파일
├── .prettierrc                        # Prettier 설정
└── eslint.config.js                   # ESLint 설정
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
