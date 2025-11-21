<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Smart Home Energy Optimizer</h1>
        <p class="text-gray-600">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username or Email
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="Enter your username or email"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>

        <div v-if="error" class="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>

        <div class="text-center text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="text-green-600 hover:underline ml-1 font-medium">
            Register here
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login({
      username: username.value.trim(),
      password: password.value
    })
    
    // Redirect based on role
    if (authStore.user?.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  } catch (err: any) {
    console.error('Login error:', err)
    if (err.response?.data?.message) {
      const errorMsg = err.response.data.message
      // Check if user needs to set password
      if (errorMsg.includes('PASSWORD_NOT_SET') || errorMsg.includes('set a password')) {
        error.value = 'You need to set a password first. Redirecting...'
        setTimeout(() => {
          router.push('/set-password')
        }, 2000)
      } else {
        error.value = errorMsg
      }
    } else if (err.request) {
      error.value = 'Unable to connect to server. Make sure backend is running.'
    } else if (err.message) {
      error.value = err.message
    } else {
      error.value = 'Invalid username or password'
    }
  } finally {
    loading.value = false
  }
}
</script>

