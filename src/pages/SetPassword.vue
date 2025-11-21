<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Set Your Password</h1>
        <p class="text-gray-600">Set a password for your account</p>
      </div>

      <form @submit.prevent="handleSetPassword" class="space-y-5">
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
            New Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="Enter new password (min 6 characters)"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            minlength="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="Confirm new password"
          />
        </div>

        <div v-if="error" class="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          {{ error }}
        </div>

        <div v-if="successMessage" class="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
          {{ successMessage }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Setting password...' : 'Set Password' }}
        </button>

        <div class="text-center text-sm text-gray-600">
          Already have a password?
          <router-link to="/login" class="text-green-600 hover:underline ml-1 font-medium">
            Log in here
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const handleSetPassword = async () => {
  error.value = ''
  successMessage.value = ''

  // Validate password length
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  // Validate password match
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true

  try {
    const response = await axios.post('http://localhost:8080/api/auth/setup-password', {
      username: username.value.trim(),
      password: password.value,
      confirmPassword: confirmPassword.value
    })

    successMessage.value = 'Password set successfully! Redirecting to login...'
    
    // Redirect to login after 1.5 seconds
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (err: any) {
    console.error('Set password error:', err)
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else if (err.message) {
      error.value = err.message
    } else if (err.request) {
      error.value = 'Unable to connect to server. Make sure backend is running.'
    } else {
      error.value = 'Failed to set password. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

