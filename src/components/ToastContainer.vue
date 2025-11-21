<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md',
          toast.type === 'success' && 'bg-green-500 text-white',
          toast.type === 'error' && 'bg-red-500 text-white',
          toast.type === 'info' && 'bg-blue-500 text-white',
          toast.type === 'warning' && 'bg-yellow-500 text-white'
        ]"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium">{{ toast.message }}</p>
          <button
            @click="removeToast(toast.id)"
            class="ml-4 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>

