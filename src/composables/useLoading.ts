import { ref } from 'vue'

const isLoading = ref(false)
const loadingMessage = ref<string>('')

export function useLoading() {
  const setLoading = (loading: boolean, message = 'Loading...') => {
    isLoading.value = loading
    loadingMessage.value = message
  }

  return {
    isLoading,
    loadingMessage,
    setLoading
  }
}

