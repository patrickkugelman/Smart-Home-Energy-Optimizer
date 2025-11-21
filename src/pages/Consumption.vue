<template>
  <div class="container mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold text-foreground">Consumption Chart</h1>

    <Card class="p-6">
      <div v-if="consumptionQuery.isLoading.value" class="text-center py-8">
        <p class="text-muted-foreground">Loading consumption data...</p>
      </div>
      <div v-else-if="consumptionQuery.isError.value" class="text-center py-8">
        <p class="text-destructive">Error loading consumption data</p>
      </div>
      <div v-else>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Select Device</label>
          <select v-model="selectedDeviceId" class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
            <option value="">All Devices</option>
            <option v-for="device in devicesQuery.data.value" :key="device.id" :value="device.id">
              {{ device.name }} ({{ device.type }})
            </option>
          </select>
        </div>
        <div class="h-64 flex items-center justify-center border border-border rounded-md bg-muted/50">
          <p class="text-muted-foreground">Chart visualization would go here</p>
        </div>
        <div v-if="filteredLogs.length > 0" class="mt-6">
          <h3 class="text-lg font-semibold mb-4">Recent Consumption Logs</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left p-2 text-foreground">Device</th>
                  <th class="text-left p-2 text-foreground">Timestamp</th>
                  <th class="text-left p-2 text-foreground">Consumption (kWh)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in filteredLogs" :key="log.id" class="border-b border-border">
                  <td class="p-2 text-foreground">{{ getDeviceName(log.deviceId) }}</td>
                  <td class="p-2 text-foreground">{{ new Date(log.timestamp).toLocaleString() }}</td>
                  <td class="p-2 text-foreground">{{ log.actualKwhConsumed }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { devicesApi, consumptionLogsApi } from '@/services/api'
import type { ConsumptionLogDto, DeviceDto } from '@/types'
import Card from '@/components/ui/Card.vue'

const selectedDeviceId = ref<number | ''>('')

const devicesQuery = useQuery({
  queryKey: ['devices'],
  queryFn: async () => {
    const res = await devicesApi.getAll()
    return res.data
  }
})

const consumptionQuery = useQuery({
  queryKey: ['consumption', selectedDeviceId],
  queryFn: async () => {
    if (selectedDeviceId.value) {
      const res = await consumptionLogsApi.getByDevice(selectedDeviceId.value as number)
      return res.data
    }
    // Get logs for all devices
    const allDevices = devicesQuery.data.value || []
    const allLogs: ConsumptionLogDto[] = []
    for (const device of allDevices) {
      try {
        const res = await consumptionLogsApi.getByDevice(device.id)
        allLogs.push(...res.data)
      } catch (error) {
        // Skip devices without logs
      }
    }
    return allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  },
  enabled: () => !!devicesQuery.data.value
})

const filteredLogs = computed(() => {
  const logs = consumptionQuery.data.value || []
  return logs.slice(0, 20) // Show last 20 logs
})

const getDeviceName = (deviceId: number) => {
  const device = devicesQuery.data.value?.find(d => d.id === deviceId)
  return device ? `${device.name} (${device.type})` : `Device ${deviceId}`
}
</script>

