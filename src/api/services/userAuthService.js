/* eslint-disable no-useless-catch */
import axios from '@/api/axios'

/**
 * 사용자 인증 서비스
 * 회원가입, 로그인, 로그아웃 등 인증 관련 기능 처리
 */
class UserAuthService {
  /**
   * 회원가입 기능
   * @param {Object} userData - 사용자 데이터
   * @param {string} userData.userId - 사용자 아이디
   * @param {string} userData.password - 사용자 비밀번호
   * @param {string} userData.nickname - 사용자 닉네임
   * @returns {Promise<Object>} 회원가입 결과
   */
  async signup(userData) {
    const response = await axios.post('/api/user/signup', userData)
    return response.data
  }

  /**
   * 로그인 기능
   * @param {Object} credentials - 로그인 정보
   * @param {string} credentials.userId - 사용자 아이디
   * @param {string} credentials.password - 사용자 비밀번호
   * @returns {Promise<Object>} 로그인 결과 및 토큰
   */
  async login(credentials) {
    try {

const response = await instance.post('/auth/login', credentials)
        credentials,
        { withCredentials: true } // 이거 꼭 추가
      )

      const { accessToken = '', refreshToken = '', nickname = '' } = response.data || {}

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('nickname', nickname)
      }

      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * 로그아웃 기능
   * 로컬 스토리지에서 토큰 제거
   */
  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('nickname')
    // 보안과 일관성을 위해 모든 인증 관련 데이터를 제거
    //로그아웃 시 저장된 모든 인증 관련 데이터를 제거
  }

  /**
   * 토큰 확인 기능
   * @returns {boolean} 토큰 존재 여부
   */
  isAuthenticated() {
    return !!localStorage.getItem('accessToken')
  }

  /**
   * 토큰 가져오기
   * @returns {string|null} 토큰 문자열 또는 null
   */
  getToken() {
    return localStorage.getItem('accessToken')
  }
}

// 싱글톤 인스턴스 생성
export const userAuthService = new UserAuthService()

export default userAuthService
