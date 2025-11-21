<template>
  <button
    :class="cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      modelValue 
        ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
        : 'bg-muted text-muted-foreground hover:bg-muted/80',
      pressed ? 'bg-primary/90' : '',
      $attrs.class
    )"
    :aria-pressed="modelValue"
    @click="toggle"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { cn } from '@/utils'

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const pressed = defineModel<boolean>('pressed', { default: false })

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

