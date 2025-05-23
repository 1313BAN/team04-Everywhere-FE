// src/api/services/userService.js
import axios from '@/api/axios'
import { useUserStore } from '@/stores/user'

export const userService = {
  async getUserInfo() {
    return axios.get('/user/info') // 필요한 경우 실제 API로 수정
  },

  async logout() {
    const userStore = useUserStore()

    try {
      await axios.post('/api/auth/logout', null, {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      })
    } catch (err) {
      console.error('🔴 서버 로그아웃 실패:', err)
      throw err
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      userStore.logout()
    }
  },
}
