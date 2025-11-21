import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { ownersApi } from '@/services/api'
import type { OwnerDto } from '@/types'

export function useOwners() {
  return useQuery({
    queryKey: ['owners'],
    queryFn: async () => {
      const response = await ownersApi.getAll()
      return response.data
    }
  })
}

export function useOwner(id: number) {
  return useQuery({
    queryKey: ['owners', id],
    queryFn: async () => {
      const response = await ownersApi.getById(id)
      return response.data
    },
    enabled: !!id
  })
}

export function useOwnersOverBudget() {
  return useQuery({
    queryKey: ['owners', 'over-budget'],
    queryFn: async () => {
      const response = await ownersApi.getOverBudget()
      return response.data
    }
  })
}

export function useCreateOwner() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Partial<OwnerDto>) => ownersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] })
    }
  })
}

export function useUpdateOwner() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<OwnerDto> }) => 
      ownersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] })
    }
  })
}

export function useDeleteOwner() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => ownersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] })
    }
  })
}

