<template>
  <div class="min-h-screen bg-background p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold flex items-center gap-2">
          <Zap class="text-primary" :size="32" />
          Smart Home Optimizer
        </h1>
        <p class="text-muted-foreground mt-1">Monitor and optimize your energy consumption.</p>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
        <Leaf :size="16" />
        <span class="text-sm font-medium">Eco Mode Active</span>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        label="Total Consumption"
        :value="totalConsumption"
        :icon="Zap"
      />
      <StatCard
        label="Active Devices"
        :value="activeDevicesText"
        :icon="Lightbulb"
      />
      <StatCard
        label="Potential Savings"
        :value="potentialSavings"
        :icon="TrendingDown"
        variant="success"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Connected Devices -->
      <div>
        <div class="flex items-center gap-2 mb-4">
          <Zap class="text-primary" :size="20" />
          <h2 class="text-xl font-semibold">Connected Devices</h2>
        </div>
        <div v-if="devicesQuery.isLoading" class="space-y-4">
          <Card v-for="i in 4" :key="i" class="p-4 animate-pulse">
            <div class="h-20 bg-muted rounded"></div>
          </Card>
        </div>
        <div v-else-if="devicesQuery.isError" class="text-center py-8 text-muted-foreground">
          Error loading devices
        </div>
        <div v-else-if="devices" class="space-y-4">
          <DeviceCard
            v-for="device in devices"
            :key="device.id"
            :device="device"
          />
        </div>
      </div>

      <!-- Optimization Suggestions -->
      <div>
        <div class="flex items-center gap-2 mb-4">
          <Leaf class="text-primary" :size="20" />
          <h2 class="text-xl font-semibold">Optimization Suggestions</h2>
        </div>
        <div v-if="suggestions.length === 0" class="text-center py-8 text-muted-foreground">
          No optimization suggestions available
        </div>
        <div v-else class="space-y-4">
          <OptimizationCard
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            :suggestion="suggestion"
            @apply="handleApplySuggestion"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Zap, Lightbulb, TrendingDown, Leaf } from 'lucide-vue-next'
import { useDevices } from '@/composables/useDevices'
import { generateOptimizationSuggestions } from '@/utils/optimization'
import StatCard from '@/components/StatCard.vue'
import DeviceCard from '@/components/DeviceCard.vue'
import OptimizationCard from '@/components/OptimizationCard.vue'
import Card from '@/components/ui/Card.vue'
import type { DeviceDto, OptimizationSuggestion } from '@/types'

const devicesQuery = useDevices()
const devices = computed(() => devicesQuery.data.value || [])

// Calculate total consumption from active devices
const totalConsumption = computed(() => {
  if (!devices.value.length) return '0W'
  const totalWatts = devices.value
    .filter(d => d.isActive)
    .reduce((sum, d) => sum + (d.hourlyPowerKwh * 1000), 0)
  
  if (totalWatts >= 1000) {
    return `${(totalWatts / 1000).toFixed(1)}kW`
  }
  return `${Math.round(totalWatts)}W`
})

// Calculate active devices
const activeDevicesText = computed(() => {
  const active = devices.value.filter(d => d.isActive).length
  const total = devices.value.length
  return `${active}/${total}`
})

// Calculate potential savings from suggestions
const suggestions = computed(() => {
  if (!devices.value.length) return []
  
  // For now, generate suggestions based on devices
  // In a real app, you'd fetch consumption logs for each device
  const consumptionLogs: Record<number, any[]> = {}
  return generateOptimizationSuggestions(devices.value, consumptionLogs)
})

const potentialSavings = computed(() => {
  const total = suggestions.value.reduce((sum, s) => sum + s.savings, 0)
  return `${Math.round(total)} kWh`
})

function handleApplySuggestion(suggestion: OptimizationSuggestion) {
  // Handle applying optimization suggestion
  console.log('Applying suggestion:', suggestion)
  // You can implement the actual logic here, e.g., toggle device, update settings, etc.
}
</script>

