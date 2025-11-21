import axios, { AxiosInstance } from 'axios'
import type { 
  DeviceDto, OwnerDto, ConsumptionLogDto, BudgetDto, AlertDto,
  LoginRequest, LoginResponse, RegisterRequest, RegisterResponse,
  ChatMessageRequest, ChatMessageResponse,
  BudgetCheckResponse, BudgetAlertResponse
} from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred')
    } else if (error.request) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
)

// Devices API
export const devicesApi = {
  getAll: (): Promise<{ data: DeviceDto[] }> => api.get('/api/devices'),
  getById: (id: number): Promise<{ data: DeviceDto }> => api.get(`/api/devices/${id}`),
  getByOwner: (ownerId: number, active?: boolean): Promise<{ data: DeviceDto[] }> => {
    const params = active !== undefined ? { active } : {}
    return api.get(`/api/devices/owner/${ownerId}`, { params })
  },
  create: (data: Partial<DeviceDto>): Promise<{ data: DeviceDto }> => 
    api.post('/api/devices', data),
  update: (id: number, data: Partial<DeviceDto>): Promise<{ data: DeviceDto }> => 
    api.put(`/api/devices/${id}`, data),
  delete: (id: number): Promise<void> => api.delete(`/api/devices/${id}`),
  toggle: (id: number): Promise<{ data: DeviceDto }> => 
    api.patch(`/api/devices/${id}/toggle`)
}

// Owners API
export const ownersApi = {
  getAll: (): Promise<{ data: OwnerDto[] }> => api.get('/api/owners'),
  getById: (id: number): Promise<{ data: OwnerDto }> => api.get(`/api/owners/${id}`),
  create: (data: Partial<OwnerDto>): Promise<{ data: OwnerDto }> => 
    api.post('/api/owners', data),
  update: (id: number, data: Partial<OwnerDto>): Promise<{ data: OwnerDto }> => 
    api.put(`/api/owners/${id}`, data),
  delete: (id: number): Promise<void> => api.delete(`/api/owners/${id}`),
  getOverBudget: (): Promise<{ data: OwnerDto[] }> => api.get('/api/owners/over-budget')
}

// Consumption Logs API
export const consumptionLogsApi = {
  getAll: (): Promise<{ data: ConsumptionLogDto[] }> => api.get('/api/consumption-logs'),
  getById: (id: number): Promise<{ data: ConsumptionLogDto }> => api.get(`/api/consumption-logs/${id}`),
  getByDevice: (deviceId: number): Promise<{ data: ConsumptionLogDto[] }> => 
    api.get(`/api/consumption-logs/device/${deviceId}`),
  getByOwner: (ownerId: number): Promise<{ data: ConsumptionLogDto[] }> => 
    api.get(`/api/consumption-logs/owner/${ownerId}/history`),
  create: (deviceId: number, data: Partial<ConsumptionLogDto>): Promise<{ data: ConsumptionLogDto }> => 
    api.post(`/api/consumption-logs/device/${deviceId}`, data),
  update: (id: number, data: Partial<ConsumptionLogDto>): Promise<{ data: ConsumptionLogDto }> => 
    api.put(`/api/consumption-logs/${id}`, data),
  delete: (id: number): Promise<void> => api.delete(`/api/consumption-logs/${id}`)
}

// Budgets API
export const budgetsApi = {
  getAll: (): Promise<{ data: BudgetDto[] }> => api.get('/api/budget'),
  getById: (id: number): Promise<{ data: BudgetDto }> => api.get(`/api/budget/${id}`),
  create: (data: Partial<BudgetDto>): Promise<{ data: BudgetDto }> => 
    api.post('/api/budget', data),
  update: (id: number, data: Partial<BudgetDto>): Promise<{ data: BudgetDto }> => 
    api.put(`/api/budget/${id}`, data),
  delete: (id: number): Promise<void> => api.delete(`/api/budget/${id}`),
  check: (ownerId: number): Promise<{ data: BudgetCheckResponse }> => 
    api.get(`/api/budget/check/${ownerId}`),
  getStatus: (ownerId: number): Promise<{ data: BudgetCheckResponse }> => 
    api.get(`/api/budget/${ownerId}/status`)
}

// Alerts API
export const alertsApi = {
  getAll: (): Promise<{ data: AlertDto[] }> => api.get('/api/alerts'),
  getById: (id: number): Promise<{ data: AlertDto }> => api.get(`/api/alerts/${id}`),
  create: (data: Partial<AlertDto>): Promise<{ data: AlertDto }> => 
    api.post('/api/alerts', data),
  delete: (id: number): Promise<void> => api.delete(`/api/alerts/${id}`),
  checkAndSend: (ownerId: number): Promise<{ data: BudgetAlertResponse }> =>
    api.post(`/api/alerts/check-and-send/${ownerId}`)
}

// Auth API
export const authApi = {
  login: (data: LoginRequest): Promise<{ data: LoginResponse }> =>
    api.post('/api/auth/login', data),
  register: (data: RegisterRequest): Promise<{ data: RegisterResponse }> =>
    api.post('/api/auth/register', data)
}

// Chat API
export const chatApi = {
  sendMessage: (data: ChatMessageRequest): Promise<{ data: ChatMessageResponse }> =>
    api.post('/api/ai/chat', data)
}

// Budget API
export const budgetApi = {
  check: (ownerId: number): Promise<{ data: BudgetCheckResponse }> =>
    api.get(`/api/budget/check/${ownerId}`)
}

// Optimization Logs API
export const optimizationLogsApi = {
  getAll: (): Promise<{ data: any[] }> => api.get('/api/optimization-logs'),
  getById: (id: number): Promise<{ data: any }> => api.get(`/api/optimization-logs/${id}`),
  getByDevice: (deviceId: number): Promise<{ data: any[] }> => 
    api.get(`/api/optimization-logs/device/${deviceId}`),
  create: (deviceId: number, data: Partial<any>): Promise<{ data: any }> => 
    api.post(`/api/optimization-logs/device/${deviceId}`, data),
  update: (id: number, data: Partial<any>): Promise<{ data: any }> => 
    api.put(`/api/optimization-logs/${id}`, data),
  delete: (id: number): Promise<void> => api.delete(`/api/optimization-logs/${id}`)
}

// Users API (Admin only)
export const usersApi = {
  getAll: (): Promise<{ data: any[] }> => api.get('/api/users'),
  getById: (id: number): Promise<{ data: any }> => api.get(`/api/users/${id}`),
  create: (data: Partial<any>): Promise<{ data: any }> => 
    api.post('/api/users', data),
  update: (id: number, data: Partial<any>): Promise<{ data: any }> => 
    api.put(`/api/users/${id}`, data),
  delete: (id: number): Promise<void> => api.delete(`/api/users/${id}`)
}

export default api

