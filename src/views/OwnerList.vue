<template>
  <div class="container">
    <h1>Owners</h1>
    
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="loading" class="loading">Loading owners...</div>
    
    <div v-else>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Monthly Budget (kWh)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="owner in owners" :key="owner.id">
              <td>{{ owner.id }}</td>
              <td>{{ owner.firstName }} {{ owner.lastName }}</td>
              <td>{{ owner.email }}</td>
              <td>{{ owner.monthlyBudgetKwh }}</td>
              <td>
                <router-link 
                  :to="`/owners/${owner.id}/devices`" 
                  class="btn btn-primary btn-small"
                >
                  View Devices
                </router-link>
                <router-link 
                  :to="`/owners/${owner.id}/budget`" 
                  class="btn btn-success btn-small"
                >
                  Check Budget
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ownersApi } from '../services/api'

const owners = ref([])
const loading = ref(true)
const error = ref(null)

const loadOwners = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await ownersApi.getAll()
    owners.value = response.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOwners()
})
</script>

