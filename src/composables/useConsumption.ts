import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { consumptionLogsApi } from '@/services/api'
import type { ConsumptionLogDto } from '@/types'

export function useConsumptionLogs(deviceId: number) {
  return useQuery({
    queryKey: ['consumption', deviceId],
    queryFn: async () => {
      const response = await consumptionLogsApi.getByDevice(deviceId)
      return response.data
    },
    enabled: !!deviceId
  })
}

export function useCreateConsumptionLog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ deviceId, data }: { deviceId: number; data: Partial<ConsumptionLogDto> }) => 
      consumptionLogsApi.create(deviceId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consumption', variables.deviceId] })
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    }
  })
}

