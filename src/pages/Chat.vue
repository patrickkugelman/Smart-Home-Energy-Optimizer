<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <h1 class="text-3xl font-bold text-foreground mb-6">AI Chat Assistant</h1>

    <Card class="h-[600px] flex flex-col">
      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <div v-if="messages.length === 0" class="text-center text-muted-foreground py-8">
          Start a conversation with the AI assistant
        </div>
        <div v-for="(message, index) in messages" :key="index" class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
          <div class="max-w-[80%] rounded-lg p-4" :class="message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'">
            <p class="whitespace-pre-wrap">{{ message.content }}</p>
            <p class="text-xs mt-2 opacity-70">{{ message.timestamp }}</p>
          </div>
        </div>
        <div v-if="isLoading" class="flex justify-start">
          <div class="bg-muted rounded-lg p-4">
            <p class="text-muted-foreground">AI is thinking...</p>
          </div>
        </div>
      </div>
      <div class="border-t border-border p-4">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            :disabled="isLoading"
          />
          <Button type="submit" :disabled="isLoading || !inputMessage.trim()">
            <Send class="w-4 h-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { chatApi } from '@/services/api'
import { useAuth } from '@/composables/useAuth'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { Send } from 'lucide-vue-next'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const { user } = useAuth()
const messages = ref<Message[]>([])
const inputMessage = ref('')
const isLoading = ref(false)

const chatMutation = useMutation({
  mutationFn: async (message: string) => {
    if (!user.value) throw new Error('User not authenticated')
    const res = await chatApi.sendMessage({
      userId: user.value.userId,
      message
    })
    return res.data
  },
  onSuccess: (response) => {
    messages.value.push({
      role: 'assistant',
      content: response.response,
      timestamp: new Date(response.timestamp).toLocaleTimeString()
    })
    isLoading.value = false
  },
  onError: () => {
    isLoading.value = false
  }
})

const sendMessage = () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage = inputMessage.value.trim()
  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date().toLocaleTimeString()
  })

  inputMessage.value = ''
  isLoading.value = true
  chatMutation.mutate(userMessage)
}
</script>

