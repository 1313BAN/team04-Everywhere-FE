import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const nickname = ref('')

  const login = (userNickname) => {
    isLoggedIn.value = true
    nickname.value = userNickname
    localStorage.setItem('nickname', userNickname)
    localStorage.setItem('accessToken', 'TOKEN') // 실제 토큰은 axios에서 따로 저장
  }

  const logout = () => {
    isLoggedIn.value = false
    nickname.value = ''
    localStorage.removeItem('nickname')
    localStorage.removeItem('accessToken')
  }

  const initUser = () => {
    const savedNickname = localStorage.getItem('nickname')
    if (savedNickname) {
      isLoggedIn.value = true
      nickname.value = savedNickname
    }
  }

  return { isLoggedIn, nickname, login, logout, initUser }
})
