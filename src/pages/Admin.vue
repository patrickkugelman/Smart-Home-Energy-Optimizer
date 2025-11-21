<template>
  <div class="container mx-auto p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-foreground">Admin Panel</h1>
      <Button @click="showOwnerForm = true" variant="default">
        <Plus class="w-4 h-4 mr-2" />
        Add Owner
      </Button>
    </div>

    <!-- Owners Section -->
    <Card>
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4 text-foreground">Owners</h2>
        <div v-if="ownersQuery.isLoading.value" class="text-center py-8">
          <p class="text-muted-foreground">Loading owners...</p>
        </div>
        <div v-else-if="ownersQuery.isError.value" class="text-center py-8">
          <p class="text-destructive">Error loading owners</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left p-2 text-foreground">ID</th>
                <th class="text-left p-2 text-foreground">Name</th>
                <th class="text-left p-2 text-foreground">Email</th>
                <th class="text-left p-2 text-foreground">Budget (kWh)</th>
                <th class="text-left p-2 text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="owner in ownersQuery.data.value" :key="owner.id" class="border-b border-border">
                <td class="p-2 text-foreground">{{ owner.id }}</td>
                <td class="p-2 text-foreground">{{ owner.firstName }} {{ owner.lastName }}</td>
                <td class="p-2 text-foreground">{{ owner.email }}</td>
                <td class="p-2 text-foreground">{{ owner.monthlyBudgetKwh }}</td>
                <td class="p-2">
                  <div class="flex gap-2">
                    <Button @click="editOwner(owner)" variant="outline" size="sm">
                      <Edit class="w-4 h-4" />
                    </Button>
                    <Button @click="deleteOwner(owner.id)" variant="destructive" size="sm">
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>

    <!-- Devices Section -->
    <Card>
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-foreground">Devices</h2>
          <Button @click="showDeviceForm = true" variant="default">
            <Plus class="w-4 h-4 mr-2" />
            Add Device
          </Button>
        </div>
        <div v-if="devicesQuery.isLoading.value" class="text-center py-8">
          <p class="text-muted-foreground">Loading devices...</p>
        </div>
        <div v-else-if="devicesQuery.isError.value" class="text-center py-8">
          <p class="text-destructive">Error loading devices</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left p-2 text-foreground">ID</th>
                <th class="text-left p-2 text-foreground">Name</th>
                <th class="text-left p-2 text-foreground">Type</th>
                <th class="text-left p-2 text-foreground">Owner ID</th>
                <th class="text-left p-2 text-foreground">Power (kWh/h)</th>
                <th class="text-left p-2 text-foreground">Status</th>
                <th class="text-left p-2 text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="device in devicesQuery.data.value" :key="device.id" class="border-b border-border">
                <td class="p-2 text-foreground">{{ device.id }}</td>
                <td class="p-2 text-foreground">{{ device.name }}</td>
                <td class="p-2 text-foreground">{{ device.type }}</td>
                <td class="p-2 text-foreground">{{ device.ownerId }}</td>
                <td class="p-2 text-foreground">{{ device.hourlyPowerKwh }}</td>
                <td class="p-2">
                  <span :class="device.isActive ? 'text-green-500' : 'text-gray-500'">
                    {{ device.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="p-2">
                  <div class="flex gap-2">
                    <Button @click="toggleDevice(device.id)" variant="outline" size="sm">
                      {{ device.isActive ? 'Deactivate' : 'Activate' }}
                    </Button>
                    <Button @click="editDevice(device)" variant="outline" size="sm">
                      <Edit class="w-4 h-4" />
                    </Button>
                    <Button @click="deleteDevice(device.id)" variant="destructive" size="sm">
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>

    <!-- Owner Form Modal -->
    <div v-if="showOwnerForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card class="w-full max-w-md m-4">
        <div class="p-6 space-y-4">
          <h3 class="text-xl font-semibold">{{ editingOwner ? 'Edit Owner' : 'Add Owner' }}</h3>
          <form @submit.prevent="saveOwner" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">First Name</label>
              <input v-model="ownerForm.firstName" type="text" required class="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Last Name</label>
              <input v-model="ownerForm.lastName" type="text" required class="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input v-model="ownerForm.email" type="email" required class="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Monthly Budget (kWh)</label>
              <input v-model.number="ownerForm.monthlyBudgetKwh" type="number" step="0.01" required class="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">User ID</label>
              <input v-model.number="ownerForm.userId" type="number" required class="w-full px-3 py-2 border rounded-md" />
            </div>
            <div class="flex gap-2">
              <Button type="submit" :disabled="saving">Save</Button>
              <Button type="button" variant="outline" @click="cancelOwnerForm">Cancel</Button>
            </div>
          </form>
        </div>
      </Card>
    </div>

    <!-- Device Form Modal -->
    <div v-if="showDeviceForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card class="w-full max-w-md m-4">
        <div class="p-6 space-y-4">
          <h3 class="text-xl font-semibold">{{ editingDevice ? 'Edit Device' : 'Add Device' }}</h3>
          <form @submit.prevent="saveDevice" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Name</label>
              <input v-model="deviceForm.name" type="text" required class="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Type</label>
              <input v-model="deviceForm.type" type="text" required class="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Owner ID</label>
              <input v-model.number="deviceForm.ownerId" type="number" required class="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Hourly Power (kWh)</label>
              <input v-model.number="deviceForm.hourlyPowerKwh" type="number" step="0.01" required class="w-full px-3 py-2 border rounded-md" />
            </div>
            <div class="flex gap-2">
              <Button type="submit" :disabled="saving">Save</Button>
              <Button type="button" variant="outline" @click="cancelDeviceForm">Cancel</Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { ownersApi, devicesApi } from '@/services/api'
import type { OwnerDto, DeviceDto } from '@/types'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'

const queryClient = useQueryClient()

const ownersQuery = useQuery({
  queryKey: ['owners'],
  queryFn: async () => {
    const res = await ownersApi.getAll()
    return res.data
  }
})

const devicesQuery = useQuery({
  queryKey: ['devices'],
  queryFn: async () => {
    const res = await devicesApi.getAll()
    return res.data
  }
})

const showOwnerForm = ref(false)
const showDeviceForm = ref(false)
const editingOwner = ref<OwnerDto | null>(null)
const editingDevice = ref<DeviceDto | null>(null)
const saving = ref(false)

const ownerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  monthlyBudgetKwh: 0,
  userId: 0
})

const deviceForm = reactive({
  name: '',
  type: '',
  ownerId: 0,
  hourlyPowerKwh: 0,
  isActive: true
})

const createOwnerMutation = useMutation({
  mutationFn: (data: Partial<OwnerDto>) => ownersApi.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['owners'] })
    cancelOwnerForm()
  }
})

const updateOwnerMutation = useMutation({
  mutationFn: ({ id, data }: { id: number; data: Partial<OwnerDto> }) => ownersApi.update(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['owners'] })
    cancelOwnerForm()
  }
})

const deleteOwnerMutation = useMutation({
  mutationFn: (id: number) => ownersApi.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['owners'] })
  }
})

const createDeviceMutation = useMutation({
  mutationFn: (data: Partial<DeviceDto>) => devicesApi.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['devices'] })
    cancelDeviceForm()
  }
})

const updateDeviceMutation = useMutation({
  mutationFn: ({ id, data }: { id: number; data: Partial<DeviceDto> }) => devicesApi.update(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['devices'] })
    cancelDeviceForm()
  }
})

const deleteDeviceMutation = useMutation({
  mutationFn: (id: number) => devicesApi.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['devices'] })
  }
})

const toggleDeviceMutation = useMutation({
  mutationFn: (id: number) => devicesApi.toggle(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['devices'] })
  }
})

const editOwner = (owner: OwnerDto) => {
  editingOwner.value = owner
  ownerForm.firstName = owner.firstName
  ownerForm.lastName = owner.lastName
  ownerForm.email = owner.email
  ownerForm.monthlyBudgetKwh = owner.monthlyBudgetKwh
  ownerForm.userId = owner.userId
  showOwnerForm.value = true
}

const saveOwner = async () => {
  saving.value = true
  try {
    if (editingOwner.value) {
      await updateOwnerMutation.mutateAsync({ id: editingOwner.value.id, data: ownerForm })
    } else {
      await createOwnerMutation.mutateAsync(ownerForm)
    }
  } finally {
    saving.value = false
  }
}

const cancelOwnerForm = () => {
  showOwnerForm.value = false
  editingOwner.value = null
  Object.assign(ownerForm, {
    firstName: '',
    lastName: '',
    email: '',
    monthlyBudgetKwh: 0,
    userId: 0
  })
}

const deleteOwner = async (id: number) => {
  if (confirm('Are you sure you want to delete this owner?')) {
    await deleteOwnerMutation.mutateAsync(id)
  }
}

const editDevice = (device: DeviceDto) => {
  editingDevice.value = device
  deviceForm.name = device.name
  deviceForm.type = device.type
  deviceForm.ownerId = device.ownerId
  deviceForm.hourlyPowerKwh = device.hourlyPowerKwh
  deviceForm.isActive = device.isActive
  showDeviceForm.value = true
}

const saveDevice = async () => {
  saving.value = true
  try {
    if (editingDevice.value) {
      await updateDeviceMutation.mutateAsync({ id: editingDevice.value.id, data: deviceForm })
    } else {
      await createDeviceMutation.mutateAsync(deviceForm)
    }
  } finally {
    saving.value = false
  }
}

const cancelDeviceForm = () => {
  showDeviceForm.value = false
  editingDevice.value = null
  Object.assign(deviceForm, {
    name: '',
    type: '',
    ownerId: 0,
    hourlyPowerKwh: 0,
    isActive: true
  })
}

const toggleDevice = async (id: number) => {
  await toggleDeviceMutation.mutateAsync(id)
}

const deleteDevice = async (id: number) => {
  if (confirm('Are you sure you want to delete this device?')) {
    await deleteDeviceMutation.mutateAsync(id)
  }
}
</script>

