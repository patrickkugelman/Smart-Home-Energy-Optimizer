<template>
  <div class="card" style="margin-top: 20px;">
    <h2>{{ editingDevice ? 'Edit Device' : 'Create Device' }}</h2>
    
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="success" class="success-message">{{ success }}</div>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Name *</label>
        <input 
          type="text" 
          v-model="formData.name" 
          required
          placeholder="Device name"
        />
      </div>
      
      <div class="form-group">
        <label>Type *</label>
        <input 
          type="text" 
          v-model="formData.type" 
          required
          placeholder="e.g., Air Conditioner, Refrigerator"
        />
      </div>
      
      <div class="form-group">
        <label>Hourly Power (kWh) *</label>
        <input 
          type="number" 
          v-model.number="formData.hourlyPowerKwh" 
          required
          step="0.01"
          min="0"
          placeholder="0.00"
        />
      </div>
      
      <div class="form-group">
        <label>
          <input 
            type="checkbox" 
            v-model="formData.isActive"
            style="width: auto; margin-right: 5px;"
          />
          Active
        </label>
      </div>
      
      <div style="display: flex; gap: 10px;">
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Saving...' : (editingDevice ? 'Update' : 'Create') }}
        </button>
        <button type="button" @click="handleClose" class="btn btn-secondary">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { devicesApi } from '../services/api'

const props = defineProps({
  device: {
    type: Object,
    default: null
  },
  ownerId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['close', 'saved'])

const formData = ref({
  name: '',
  type: '',
  hourlyPowerKwh: 0,
  isActive: true
})

const editingDevice = ref(null)
const saving = ref(false)
const error = ref(null)
const success = ref(null)

onMounted(() => {
  if (props.device) {
    editingDevice.value = props.device
    formData.value = {
      name: props.device.name || '',
      type: props.device.type || '',
      hourlyPowerKwh: props.device.hourlyPowerKwh || 0,
      isActive: props.device.isActive !== undefined ? props.device.isActive : true
    }
  } else {
    formData.value.ownerId = props.ownerId
  }
})

const handleSubmit = async () => {
  try {
    saving.value = true
    error.value = null
    success.value = null
    
    const data = {
      ...formData.value,
      ownerId: props.ownerId
    }
    
    if (editingDevice.value) {
      await devicesApi.update(editingDevice.value.id, data)
      success.value = 'Device updated successfully!'
    } else {
      await devicesApi.create(data)
      success.value = 'Device created successfully!'
    }
    
    setTimeout(() => {
      emit('saved')
    }, 1000)
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}

const handleClose = () => {
  emit('close')
}
</script>

