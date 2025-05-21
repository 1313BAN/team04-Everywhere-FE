// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const accessToken = ref(localStorage.getItem('accessToken') || null)

    const isLoggedIn = computed(() => !!accessToken.value)

    function setToken(newToken) {
      accessToken.value = newToken
      localStorage.setItem('accessToken', newToken)
    }

    function clearToken() {
      accessToken.value = null
      localStorage.removeItem('accessToken')
    }

    return {
      accessToken,
      isLoggedIn,
      setToken,
      clearToken,
    }
  },
  {
    persist: true,
  }
)
