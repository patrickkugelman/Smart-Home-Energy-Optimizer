<template>
  <div class="container">
    <h1>Budget Overview for Owner #{{ ownerId }}</h1>
    
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="loading" class="loading">Loading budget information...</div>
    
    <div v-else>
      <div class="card">
        <h2>Monthly Budget Status</h2>
        
        <div v-if="budgetInfo" style="margin-top: 20px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
            <div>
              <strong>Monthly Budget:</strong>
              <p style="font-size: 24px; color: #007bff;">{{ budgetInfo.monthlyBudgetKwh }} kWh</p>
            </div>
            <div>
              <strong>Total Consumed:</strong>
              <p style="font-size: 24px; color: #dc3545;">{{ budgetInfo.totalConsumed }} kWh</p>
            </div>
            <div>
              <strong>Status:</strong>
              <p>
                <span :class="budgetInfo.overBudget ? 'badge badge-danger' : 'badge badge-success'" style="font-size: 18px;">
                  {{ budgetInfo.overBudget ? 'OVER BUDGET' : 'OK' }}
                </span>
              </p>
            </div>
          </div>
          
          <div v-if="budgetInfo.overBudget" style="margin-top: 20px;">
            <p style="color: #dc3545; font-weight: bold;">
              You have exceeded your monthly budget by 
              {{ (budgetInfo.totalConsumed - budgetInfo.monthlyBudgetKwh).toFixed(2) }} kWh
            </p>
            <button 
              @click="sendAlert" 
              class="btn btn-danger"
              :disabled="sendingAlert"
              style="margin-top: 10px;"
            >
              {{ sendingAlert ? 'Sending...' : 'Send Alert Email' }}
            </button>
          </div>
        </div>
        
        <div v-else style="margin-top: 20px;">
          <p>No budget information available for this owner.</p>
        </div>
      </div>
      
      <div class="card" style="margin-top: 20px;">
        <h3>Owners Over Budget</h3>
        <div v-if="loadingOverBudget" class="loading">Loading...</div>
        <div v-else-if="overBudgetOwners.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Budget</th>
                <th>Consumed</th>
                <th>Over By</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="owner in overBudgetOwners" :key="owner.ownerId">
                <td>{{ owner.firstName }} {{ owner.lastName }}</td>
                <td>{{ owner.email }}</td>
                <td>{{ owner.monthlyBudgetKwh }} kWh</td>
                <td>{{ owner.totalConsumed }} kWh</td>
                <td>{{ (owner.totalConsumed - owner.monthlyBudgetKwh).toFixed(2) }} kWh</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>No owners are currently over budget.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ownersApi, alertsApi } from '../services/api'

const props = defineProps({
  ownerId: {
    type: [String, Number],
    required: true
  }
})

const budgetInfo = ref(null)
const overBudgetOwners = ref([])
const loading = ref(true)
const loadingOverBudget = ref(false)
const sendingAlert = ref(false)
const error = ref(null)

const loadBudgetInfo = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Get owner details
    const ownerResponse = await ownersApi.getById(props.ownerId)
    const owner = ownerResponse.data
    
    // Get over budget owners list
    const overBudgetResponse = await ownersApi.getOverBudget()
    const overBudgetList = overBudgetResponse.data
    
    // Find current owner in over budget list
    const currentOwnerOverBudget = overBudgetList.find(o => o.ownerId === owner.id)
    
    if (currentOwnerOverBudget) {
      budgetInfo.value = {
        monthlyBudgetKwh: currentOwnerOverBudget.monthlyBudgetKwh,
        totalConsumed: currentOwnerOverBudget.totalConsumed,
        overBudget: true
      }
    } else {
      budgetInfo.value = {
        monthlyBudgetKwh: owner.monthlyBudgetKwh,
        totalConsumed: 0,
        overBudget: false
      }
    }
    
    overBudgetOwners.value = overBudgetList
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const loadOverBudgetOwners = async () => {
  try {
    loadingOverBudget.value = true
    const response = await ownersApi.getOverBudget()
    overBudgetOwners.value = response.data
  } catch (err) {
    console.error('Error loading over budget owners:', err)
  } finally {
    loadingOverBudget.value = false
  }
}

const sendAlert = async () => {
  try {
    sendingAlert.value = true
    error.value = null
    await alertsApi.checkAndSend(props.ownerId)
    alert('Alert email sent successfully!')
  } catch (err) {
    error.value = err.message
  } finally {
    sendingAlert.value = false
  }
}

onMounted(() => {
  loadBudgetInfo()
  loadOverBudgetOwners()
})
</script>

