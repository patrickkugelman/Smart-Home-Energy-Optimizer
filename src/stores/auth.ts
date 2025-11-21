import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginUser, registerUser } from '@/services/authService'
import type { LoginRequest, RegisterRequest } from '@/types'
import axios from 'axios'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: {
    id: number | null
    username: string | null
    email: string | null
    role: string | null
  } | null
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const user = ref<AuthState['user']>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  )

  const isAuthenticated = computed(() => !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  // Setup axios interceptor for token refresh
  const setupAxiosInterceptor = () => {
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry && refreshToken.value) {
          originalRequest._retry = true

          try {
            const response = await axios.post('/api/auth/refresh', {
              refreshToken: refreshToken.value
            })

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data

            accessToken.value = newAccessToken
            refreshToken.value = newRefreshToken
            localStorage.setItem('accessToken', newAccessToken)
            localStorage.setItem('refreshToken', newRefreshToken)

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return axios(originalRequest)
          } catch (refreshError) {
            logout()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await loginUser(credentials)
      const data = response.data

      accessToken.value = data.accessToken || data.token
      refreshToken.value = data.refreshToken
      user.value = {
        id: data.userId,
        username: data.username,
        email: data.email,
        role: data.role
      }

      localStorage.setItem('accessToken', accessToken.value!)
      if (refreshToken.value) {
        localStorage.setItem('refreshToken', refreshToken.value)
      }
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', accessToken.value!) // For backward compatibility
      localStorage.setItem('userId', String(data.userId))
      localStorage.setItem('role', data.role)

      // Setup interceptor after login
      setupAxiosInterceptor()

      return data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed')
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response = await registerUser(data)
      const responseData = response.data

      // Store tokens if provided
      if (responseData.accessToken) {
        accessToken.value = responseData.accessToken
        refreshToken.value = responseData.refreshToken
        user.value = {
          id: responseData.userId,
          username: responseData.username,
          email: responseData.email,
          role: responseData.role
        }

        localStorage.setItem('accessToken', accessToken.value)
        if (refreshToken.value) {
          localStorage.setItem('refreshToken', refreshToken.value)
        }
        localStorage.setItem('user', JSON.stringify(user.value))
      }

      return responseData
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed')
    }
  }

  const logout = () => {
    accessToken.value = null
    refreshToken.value = null
    user.value = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    localStorage.removeItem('username')
  }

  // Initialize interceptor on store creation
  if (accessToken.value) {
    setupAxiosInterceptor()
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout
  }
})

