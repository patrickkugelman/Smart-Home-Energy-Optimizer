<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6">
          <router-link to="/dashboard" class="text-xl font-bold text-gray-900 hover:text-green-600 transition-colors">
            Smart Home Energy Optimizer
          </router-link>
          <div class="hidden md:flex gap-4">
            <router-link 
              to="/dashboard" 
              class="text-gray-600 hover:text-green-600 transition-colors"
              active-class="text-green-600 font-medium"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/devices" 
              class="text-gray-600 hover:text-green-600 transition-colors"
              active-class="text-green-600 font-medium"
            >
              Devices
            </router-link>
            <router-link 
              to="/owners" 
              class="text-gray-600 hover:text-green-600 transition-colors"
              active-class="text-green-600 font-medium"
            >
              Owners
            </router-link>
            <router-link 
              to="/consumption" 
              class="text-gray-600 hover:text-green-600 transition-colors"
              active-class="text-green-600 font-medium"
            >
              Consumption
            </router-link>
            <router-link 
              to="/chat" 
              class="text-gray-600 hover:text-green-600 transition-colors"
              active-class="text-green-600 font-medium"
            >
              AI Chat
            </router-link>
            <router-link 
              v-if="userRole === 'ADMIN'" 
              to="/admin" 
              class="text-gray-600 hover:text-green-600 transition-colors"
              active-class="text-green-600 font-medium"
            >
              Admin
            </router-link>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">{{ username || 'User' }}</span>
          <button
            @click="handleLogout"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref<string | null>(null)
const userRole = ref<string | null>(null)

onMounted(() => {
  username.value = localStorage.getItem('username')
  userRole.value = localStorage.getItem('role')
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('role')
  localStorage.removeItem('user')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

