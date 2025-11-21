<template>
  <Card class="p-4">
    <div class="flex items-start justify-between">
      <div class="flex items-start gap-3 flex-1">
        <div :class="cn(
          'p-2 rounded-full',
          device.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        )">
          <component :is="icon" :size="20" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-sm">{{ device.name }}</h3>
          <p class="text-xs text-muted-foreground">{{ category }}</p>
          <div class="mt-2 flex items-center gap-2">
            <span class="text-sm font-medium">
              {{ formatPower(device.hourlyPowerKwh) }}
            </span>
            <span :class="cn(
              'text-xs px-2 py-0.5 rounded-full',
              device.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            )">
              {{ device.isActive ? 'on' : 'off' }}
            </span>
          </div>
        </div>
      </div>
      <button
        :class="cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          device.isActive ? 'bg-primary' : 'bg-muted',
          toggleMutation.isPending.value && 'opacity-50 cursor-not-allowed'
        )"
        @click="handleToggle"
        :disabled="toggleMutation.isPending.value"
      >
        <span
          :class="cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            device.isActive ? 'translate-x-6' : 'translate-x-1'
          )"
        />
      </button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from './ui/Card.vue'
import { getDeviceIcon, getDeviceCategory } from '@/utils/deviceIcons'
import { useToggleDevice } from '@/composables/useDevices'
import { cn } from '@/utils'
import type { DeviceDto } from '@/types'

const props = defineProps<{
  device: DeviceDto
}>()

const icon = computed(() => getDeviceIcon(props.device.type))
const category = computed(() => getDeviceCategory(props.device.type))

const toggleMutation = useToggleDevice()

function formatPower(kwh: number): string {
  const watts = kwh * 1000
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(1)}kW`
  }
  return `${Math.round(watts)}W`
}

function handleToggle() {
  toggleMutation.mutate(props.device.id)
}
</script>
