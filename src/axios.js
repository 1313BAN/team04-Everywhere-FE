import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 여기에 실제 백엔드 주소 입력
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 시 accessToken 자동 삽입
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
