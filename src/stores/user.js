import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi } from '@/api/user'

const TOKEN_KEY = 'erp_token'
const USER_KEY = 'erp_user'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const userInfo = ref(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))

  const isLoggedIn = computed(() => Boolean(token.value))

  async function login({ username, password }) {
    const data = await loginApi({ username, password })
    token.value = data.token
    userInfo.value = data.userInfo
    localStorage.setItem(TOKEN_KEY, token.value)
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo.value))
    return userInfo.value
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
  }
})
