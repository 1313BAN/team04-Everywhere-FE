import axios from '@/api/axios'

/**
 * 사용자 프로필 서비스
 * 사용자 정보 조회 및 수정 관련 기능 처리
 */
class UserProfileService {
  /**
   * 사용자 정보 조회
   * @returns {Promise<Object>} 사용자 정보
   */
  async getUserInfo() {
    try {
      const response = await axios.get('/api/user/info')
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * 사용자 프로필 수정
   * @param {Object} profileData - 수정할 프로필 데이터
   * @param {string} [profileData.nickname] - 닉네임
   * @param {string} [profileData.profileImage] - 프로필 이미지
   * @returns {Promise<Object>} 수정된 사용자 정보
   */
  async updateProfile(profileData) {
    try {
      const response = await axios.put('/api/user/profile', profileData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * 비밀번호 변경
   * @param {Object} passwordData - 비밀번호 데이터
   * @param {string} passwordData.currentPassword - 현재 비밀번호
   * @param {string} passwordData.newPassword - 새 비밀번호
   * @returns {Promise<Object>} 비밀번호 변경 결과
   */
  async changePassword(passwordData) {
    try {
      const response = await axios.put('/api/user/password', passwordData)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

// 싱글톤 인스턴스 생성
export const userProfileService = new UserProfileService()

export default userProfileService
