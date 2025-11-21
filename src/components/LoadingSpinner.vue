<template>
  <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 flex flex-col items-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
      <p class="text-gray-700">{{ message || 'Loading...' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
  message?: string
}>()
</script>

