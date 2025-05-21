import axios from '@/api/axios'

export const userService = {
  // 사용자 정보 가져오기
  getUserInfo() {
    return axios.get('/user/info') // 이 URL은 실제 백엔드 API에 맞게 수정해야 함
  },

  // 로그아웃 처리 (단순 로컬스토리지 삭제)
  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },
}
