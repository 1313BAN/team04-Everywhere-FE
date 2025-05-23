import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(!!localStorage.getItem('accessToken'))
  const nickname = ref(localStorage.getItem('nickname') || '')

  const login = (accessToken, userNickname) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('nickname', userNickname)

    isLoggedIn.value = true
    nickname.value = userNickname
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('nickname')

    isLoggedIn.value = false
    nickname.value = ''
  }

  const initUser = () => {
    const accessToken = localStorage.getItem('accessToken')
    const savedNickname = localStorage.getItem('nickname')
    if (accessToken && savedNickname) {
      isLoggedIn.value = true
      nickname.value = savedNickname
    } else {
      isLoggedIn.value = false
      nickname.value = ''
    }
  }

  return { isLoggedIn, nickname, login, logout, initUser }
})
