<script setup lang="ts">
import { cn } from '@t-minus/utils'
import { computed } from 'vue'

const props = defineProps<{
  class?: string
  status?: 'active' | 'error' | 'pending'
}>()

const colorClass = computed(() => {
  switch (props.status) {
    case 'active':
      return 'bg-nasa-blue'
    case 'error':
      return 'bg-error'
    case 'pending':
      return 'bg-artemis-orange'
    default:
      return 'bg-nasa-blue'
  }
})
</script>

<template>
  <div :class="cn('relative flex h-2 w-2', props.class)">
    <span
      :class="
        cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', colorClass)
      "
    />
    <span :class="cn('relative inline-flex h-2 w-2 rounded-full', colorClass)" />
  </div>
</template>
