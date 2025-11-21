export interface Device {
  id: number
  ownerId: number
  name: string
  deviceType: string
  status: 'on' | 'off'
  powerRating: number
  isActive: boolean
  createdAt: string
}

export interface Owner {
  id: number
  name: string
  email: string
}

export interface ConsumptionLog {
  id: number
  deviceId: number
  timestamp: string
  consumptionValue: number
}

export interface DeviceDto {
  id: number
  ownerId: number
  name: string
  type: string
  hourlyPowerKwh: number
  isActive: boolean
}

export interface OwnerDto {
  id: number
  firstName: string
  lastName: string
  email: string
  monthlyBudgetKwh: number
  registrationDate: string
  userId: number
}

export interface ConsumptionLogDto {
  id: number
  deviceId: number
  timestamp: string
  actualKwhConsumed: number
}

export interface BudgetDto {
  id: number
  deviceId: number
  periodType: string
  limitKwh: number
  isActive: boolean
}

export interface AlertDto {
  id: number
  deviceId: number
  message: string
  severity: string
  createdAt: string
}

export interface OptimizationSuggestion {
  id: string
  deviceId: number
  deviceName: string
  description: string
  savings: number
  icon: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  username: string
  email?: string
  role: string
  userId: number
  message?: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RegisterResponse {
  message: string
  username: string
  email: string
}

export interface ChatMessageRequest {
  userId: number
  message: string
}

export interface ChatMessageResponse {
  response: string
  timestamp: string
}

export interface BudgetCheckResponse {
  ownerId: number
  totalConsumed: number
  budget: number
  remaining: number
  overBudget: boolean
  usagePercentage: number
}

export interface BudgetAlertResponse {
  ownerId: number
  overBudget: boolean
  totalConsumed: number
  budget: number
}
