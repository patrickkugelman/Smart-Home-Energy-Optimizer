import { ref, computed } from 'vue'
import { authApi } from '@/services/api'
import type { LoginRequest, LoginResponse } from '@/types'

const token = ref<string | null>(localStorage.getItem('token'))
const user = ref<LoginResponse | null>(
  localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
)

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: LoginRequest) => {
    try {
      console.log('Attempting login with:', { username: credentials.username })
      const response = await authApi.login(credentials)
      const loginData = response.data
      
      console.log('Login successful:', { username: loginData.username, role: loginData.role })
      
      token.value = loginData.token
      user.value = loginData
      
      localStorage.setItem('token', loginData.token)
      localStorage.setItem('userId', String(loginData.userId))
      localStorage.setItem('role', loginData.role)
      localStorage.setItem('user', JSON.stringify(loginData))
      
      return loginData
    } catch (error: any) {
      console.error('Login error details:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    localStorage.removeItem('user')
    localStorage.removeItem('username')
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout
  }
}

