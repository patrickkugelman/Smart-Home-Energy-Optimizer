<template>
  <div class="container">
    <h1>AI Chat Assistant</h1>
    
    <div class="card">
      <div v-if="error" class="error-message">{{ error }}</div>
      
      <div style="margin-bottom: 20px;">
        <label>
          User ID:
          <input 
            type="number" 
            v-model.number="userId" 
            placeholder="Enter user ID"
            style="width: 200px; margin-left: 10px;"
          />
        </label>
      </div>
      
      <div 
        style="border: 1px solid #ddd; border-radius: 4px; padding: 15px; min-height: 400px; max-height: 500px; overflow-y: auto; margin-bottom: 20px; background-color: #f9f9f9;"
      >
        <div v-if="messages.length === 0" style="text-align: center; color: #666; padding: 20px;">
          No messages yet. Start a conversation!
        </div>
        <div v-for="(msg, index) in messages" :key="index" style="margin-bottom: 15px;">
          <div v-if="msg.type === 'user'" style="text-align: right;">
            <div style="display: inline-block; background-color: #007bff; color: white; padding: 10px; border-radius: 8px; max-width: 70%;">
              {{ msg.text }}
            </div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">
              {{ formatTime(msg.timestamp) }}
            </div>
          </div>
          <div v-else style="text-align: left;">
            <div style="display: inline-block; background-color: #e9ecef; color: #333; padding: 10px; border-radius: 8px; max-width: 70%;">
              {{ msg.text }}
            </div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">
              {{ formatTime(msg.timestamp) }}
            </div>
          </div>
        </div>
        <div v-if="loading" style="text-align: center; color: #666; padding: 10px;">
          AI is thinking...
        </div>
      </div>
      
      <form @submit.prevent="sendMessage" style="display: flex; gap: 10px;">
        <input 
          type="text" 
          v-model="messageInput" 
          placeholder="Type your message..."
          style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"
          :disabled="!userId || loading"
        />
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="!userId || !messageInput.trim() || loading"
        >
          {{ loading ? 'Sending...' : 'Send' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { chatApi } from '../services/api'

const userId = ref(null)
const messageInput = ref('')
const messages = ref([])
const loading = ref(false)
const error = ref(null)

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

const sendMessage = async () => {
  if (!userId.value || !messageInput.value.trim()) {
    return
  }
  
  const userMessage = messageInput.value.trim()
  messageInput.value = ''
  
  // Add user message to chat
  messages.value.push({
    type: 'user',
    text: userMessage,
    timestamp: new Date()
  })
  
  try {
    loading.value = true
    error.value = null
    
    const response = await chatApi.sendMessage({
      userId: userId.value,
      message: userMessage
    })
    
    // Add AI response to chat
    messages.value.push({
      type: 'ai',
      text: response.data.response,
      timestamp: response.data.timestamp
    })
  } catch (err) {
    error.value = err.message
    // Remove user message if error occurred
    messages.value.pop()
  } finally {
    loading.value = false
  }
}
</script>

