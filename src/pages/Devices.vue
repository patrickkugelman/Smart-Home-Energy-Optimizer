<template>
  <div class="min-h-screen bg-background p-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Device Management</h1>
        <div class="flex gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name..."
            class="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select v-model="filterActive" class="px-3 py-2 border border-border rounded-md bg-background text-foreground">
            <option :value="null">All Devices</option>
            <option :value="true">Active Only</option>
            <option :value="false">Inactive Only</option>
          </select>
        </div>
      </div>
      
      <div v-if="devicesQuery.isLoading.value" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card v-for="i in 6" :key="i" class="p-4 animate-pulse">
          <div class="h-32 bg-muted rounded"></div>
        </Card>
      </div>
      
      <div v-else-if="devicesQuery.isError.value" class="text-center py-12">
        <p class="text-muted-foreground">Error loading devices</p>
      </div>
      
      <div v-else-if="filteredDevices.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DeviceCard
          v-for="device in filteredDevices"
          :key="device.id"
          :device="device"
        />
      </div>
      <div v-else class="text-center py-12">
        <p class="text-muted-foreground">No devices found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { devicesApi } from '@/services/api'
import DeviceCard from '@/components/DeviceCard.vue'
import Card from '@/components/ui/Card.vue'

const filterActive = ref<boolean | null>(null)
const searchQuery = ref('')

const devicesQuery = useQuery({
  queryKey: ['devices'],
  queryFn: async () => {
    const res = await devicesApi.getAll()
    return res.data
  }
})

const filteredDevices = computed(() => {
  let devices = devicesQuery.data.value || []
  
  // Filter by active status
  if (filterActive.value !== null) {
    devices = devices.filter(d => d.isActive === filterActive.value)
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    devices = devices.filter(d => 
      d.name.toLowerCase().includes(query) ||
      d.type.toLowerCase().includes(query)
    )
  }
  
  return devices
})
</script>

