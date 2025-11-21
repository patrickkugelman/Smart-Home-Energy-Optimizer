<template>
  <div class="container mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold text-foreground">Owners</h1>

    <div v-if="ownersQuery.isLoading.value" class="text-center py-8">
      <p class="text-muted-foreground">Loading owners...</p>
    </div>
    <div v-else-if="ownersQuery.isError.value" class="text-center py-8">
      <p class="text-destructive">Error loading owners</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="owner in ownersQuery.data.value" :key="owner.id" class="p-6">
        <div class="space-y-4">
          <div>
            <h3 class="text-xl font-semibold text-foreground">
              {{ owner.firstName }} {{ owner.lastName }}
            </h3>
            <p class="text-muted-foreground">{{ owner.email }}</p>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Monthly Budget:</span>
              <span class="font-medium text-foreground">{{ owner.monthlyBudgetKwh }} kWh</span>
            </div>
            <div v-if="budgetChecks[owner.id]" class="mt-4 p-3 rounded-md" :class="budgetChecks[owner.id].overBudget ? 'bg-destructive/10' : 'bg-green-500/10'">
              <div class="text-sm">
                <div class="flex justify-between mb-1">
                  <span>Consumed:</span>
                  <span>{{ budgetChecks[owner.id].totalConsumed.toFixed(2) }} kWh</span>
                </div>
                <div class="flex justify-between mb-1">
                  <span>Remaining:</span>
                  <span>{{ budgetChecks[owner.id].remaining.toFixed(2) }} kWh</span>
                </div>
                <div class="flex justify-between">
                  <span>Usage:</span>
                  <span>{{ budgetChecks[owner.id].usagePercentage.toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <Button @click="checkBudget(owner.id)" variant="outline" size="sm" class="flex-1">
              Check Budget
            </Button>
            <Button @click="sendAlert(owner.id)" variant="default" size="sm" class="flex-1">
              Send Alert
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation } from '@tanstack/vue-query'
import { ownersApi, budgetApi, alertsApi } from '@/services/api'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'

const budgetChecks = ref<Record<number, any>>({})

const ownersQuery = useQuery({
  queryKey: ['owners'],
  queryFn: async () => {
    const res = await ownersApi.getAll()
    return res.data
  }
})

const checkBudgetMutation = useMutation({
  mutationFn: async (ownerId: number) => {
    const res = await budgetApi.check(ownerId)
    return { ownerId, data: res.data }
  },
  onSuccess: (result) => {
    budgetChecks.value[result.ownerId] = result.data
  }
})

const sendAlertMutation = useMutation({
  mutationFn: (ownerId: number) => alertsApi.checkAndSend(ownerId),
  onSuccess: () => {
    alert('Budget alert sent successfully!')
  }
})

const checkBudget = (ownerId: number) => {
  checkBudgetMutation.mutate(ownerId)
}

const sendAlert = (ownerId: number) => {
  sendAlertMutation.mutate(ownerId)
}
</script>

