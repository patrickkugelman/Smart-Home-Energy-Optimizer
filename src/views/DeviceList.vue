<template>
  <div class="container">
    <h1>Devices for Owner #{{ ownerId }}</h1>
    
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="loading" class="loading">Loading devices...</div>
    
    <div v-else>
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <label>
              <input 
                type="checkbox" 
                v-model="filterActive" 
                @change="loadDevices"
                style="margin-right: 5px;"
              />
              Show only active devices
            </label>
          </div>
          <button @click="showForm = true" class="btn btn-primary">Create Device</button>
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Hourly Power (kWh)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in devices" :key="device.id">
              <td>{{ device.id }}</td>
              <td>{{ device.name }}</td>
              <td>{{ device.type }}</td>
              <td>{{ device.hourlyPowerKwh }}</td>
              <td>
                <span :class="device.isActive ? 'badge badge-success' : 'badge badge-danger'">
                  {{ device.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <button 
                  @click="editDevice(device)" 
                  class="btn btn-secondary btn-small"
                >
                  Edit
                </button>
                <button 
                  @click="deleteDevice(device.id)" 
                  class="btn btn-danger btn-small"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <DeviceForm 
        v-if="showForm"
        :device="editingDevice"
        :ownerId="ownerId"
        @close="handleFormClose"
        @saved="handleDeviceSaved"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { devicesApi } from '../services/api'
import DeviceForm from '../components/DeviceForm.vue'

const props = defineProps({
  ownerId: {
    type: [String, Number],
    required: true
  }
})

const devices = ref([])
const loading = ref(true)
const error = ref(null)
const filterActive = ref(false)
const showForm = ref(false)
const editingDevice = ref(null)

const loadDevices = async () => {
  try {
    loading.value = true
    error.value = null
    const active = filterActive.value ? true : null
    const response = await devicesApi.getByOwner(props.ownerId, active)
    devices.value = response.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const editDevice = (device) => {
  editingDevice.value = { ...device }
  showForm.value = true
}

const deleteDevice = async (deviceId) => {
  if (!confirm('Are you sure you want to delete this device?')) {
    return
  }
  
  try {
    await devicesApi.delete(deviceId)
    await loadDevices()
  } catch (err) {
    error.value = err.message
  }
}

const handleFormClose = () => {
  showForm.value = false
  editingDevice.value = null
}

const handleDeviceSaved = () => {
  showForm.value = false
  editingDevice.value = null
  loadDevices()
}

onMounted(() => {
  loadDevices()
})
</script>

