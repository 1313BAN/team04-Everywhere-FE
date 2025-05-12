import axios from 'axios'

// API 기본 설정
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://70.12.60.56:8080', // 여기에 실제 백엔드 주소 입력
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: 요청 전 토큰 추가
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터: 에러 처리
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 401 에러 처리 (인증 실패)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      // 로그인 페이지로 리디렉션하는 코드를 추가할 수 있음
    }
    return Promise.reject(error)
  }
)

export default instance
