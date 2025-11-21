<template>
  <Card class="p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-muted-foreground">{{ label }}</p>
        <p :class="cn('text-2xl font-bold mt-1', valueClass)">{{ value }}</p>
      </div>
      <div :class="cn('p-3 rounded-full', iconBgClass)">
        <component :is="icon" :size="24" :class="iconClass" />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from './ui/Card.vue'
import { cn } from '@/utils'
import type { Component } from 'vue'

const props = defineProps<{
  label: string
  value: string
  icon: Component
  variant?: 'default' | 'primary' | 'success'
}>()

const valueClass = computed(() => {
  if (props.variant === 'success') {
    return 'text-primary'
  }
  return ''
})

const iconBgClass = computed(() => {
  if (props.variant === 'success') {
    return 'bg-primary/10'
  }
  return 'bg-primary/10'
})

const iconClass = computed(() => {
  if (props.variant === 'success') {
    return 'text-primary'
  }
  return 'text-primary'
})
</script>

