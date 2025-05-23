// src/api/services/userService.js
import axios from '@/api/axios'
import { useUserStore } from '@/stores/user'

export const userService = {
  getUserInfo() {
    return axios.get('/user/info') // 필요한 경우 실제 API로 수정
  },

  async logout() {
    const userStore = useUserStore()

    try {
      await axios.post('/api/auth/logout', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      // API 성공 시에만 토큰 제거
      localStorage.removeItem('accessToken')
      userStore.logout()
    } catch (err) {
      console.error('🔴 서버 로그아웃 실패:', err)
      throw err
    }
  },
}
