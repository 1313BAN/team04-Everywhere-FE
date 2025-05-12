import axios from './axios'
import userService from './services/userService'
import { userAuthService } from './services/userAuthService'
import { userProfileService } from './services/userProfileService'

// 모든 API 서비스를 한 곳에서 내보냄
export { axios, userService, userAuthService, userProfileService }

// 기본 내보내기
export default {
  axios,
  userService,
  userAuthService,
  userProfileService,
}
