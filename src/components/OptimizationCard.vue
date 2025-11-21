<template>
  <Card class="p-4">
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-start gap-3 flex-1">
        <div class="p-2 rounded-full bg-primary/10 text-primary">
          <component :is="iconComponent" :size="20" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium">{{ suggestion.description }}</p>
          <div class="mt-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Save {{ suggestion.savings }} kWh/month
            </span>
          </div>
        </div>
      </div>
      <Button size="sm" @click="$emit('apply', suggestion)">
        Apply
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Lightbulb, Wind, Clock } from 'lucide-vue-next'
import Card from './ui/Card.vue'
import Button from './ui/Button.vue'
import type { OptimizationSuggestion } from '@/types'

const props = defineProps<{
  suggestion: OptimizationSuggestion
}>()

defineEmits<{
  apply: [suggestion: OptimizationSuggestion]
}>()

const iconComponent = computed(() => {
  const iconMap: Record<string, any> = {
    lightbulb: Lightbulb,
    wind: Wind,
    clock: Clock
  }
  return iconMap[props.suggestion.icon] || Lightbulb
})
</script>

