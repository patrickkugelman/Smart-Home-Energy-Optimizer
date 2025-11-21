import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(VueQueryPlugin, { queryClient })
app.use(router)

app.mount('#app')

