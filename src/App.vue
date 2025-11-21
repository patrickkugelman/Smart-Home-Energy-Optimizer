<template>
  <div class="min-h-screen bg-background">
    <ToastContainer />
    <LoadingSpinner :loading="isLoading" :message="loadingMessage" />
    <nav v-if="authStore.isAuthenticated && $route.path !== '/login' && $route.path !== '/register'" class="border-b border-border bg-card">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <router-link to="/dashboard" class="text-xl font-bold text-foreground">Smart Home Optimizer</router-link>
            <div class="flex gap-4">
              <router-link to="/dashboard" class="text-muted-foreground hover:text-foreground">Dashboard</router-link>
              <router-link to="/devices" class="text-muted-foreground hover:text-foreground">Devices</router-link>
              <router-link to="/owners" class="text-muted-foreground hover:text-foreground">Owners</router-link>
              <router-link to="/consumption" class="text-muted-foreground hover:text-foreground">Consumption</router-link>
              <router-link to="/chat" class="text-muted-foreground hover:text-foreground">AI Chat</router-link>
              <router-link v-if="authStore.isAdmin" to="/admin" class="text-muted-foreground hover:text-foreground">Admin</router-link>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-muted-foreground">{{ authStore.user?.username }}</span>
            <Button @click="handleLogout" variant="outline" size="sm">Logout</Button>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoading } from '@/composables/useLoading'
import ToastContainer from '@/components/ToastContainer.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import Button from '@/components/ui/Button.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { isLoading, loadingMessage } = useLoading()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
