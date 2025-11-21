import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { devicesApi } from '@/services/api'
import type { DeviceDto } from '@/types'

export function useDevices() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const response = await devicesApi.getAll()
      return response.data
    }
  })
}

export function useDevice(id: number) {
  return useQuery({
    queryKey: ['devices', id],
    queryFn: async () => {
      const response = await devicesApi.getById(id)
      return response.data
    },
    enabled: !!id
  })
}

export function useDevicesByOwner(ownerId: number, active?: boolean) {
  return useQuery({
    queryKey: ['devices', 'owner', ownerId, active],
    queryFn: async () => {
      const response = await devicesApi.getByOwner(ownerId, active)
      return response.data
    },
    enabled: !!ownerId
  })
}

export function useToggleDevice() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => devicesApi.toggle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    }
  })
}

export function useCreateDevice() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Partial<DeviceDto>) => devicesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    }
  })
}

export function useUpdateDevice() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DeviceDto> }) => 
      devicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    }
  })
}

export function useDeleteDevice() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => devicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    }
  })
}

