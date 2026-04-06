<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@t-minus/utils';

const props = defineProps<{
  status?: 'active' | 'pending' | 'error';
  class?: string;
}>();

const colorClass = computed(() => {
  switch (props.status) {
    case 'active': return 'bg-nasa-blue';
    case 'pending': return 'bg-artemis-orange';
    case 'error': return 'bg-error';
    default: return 'bg-nasa-blue';
  }
});
</script>

<template>
  <div :class="cn('relative flex h-2 w-2', props.class)">
    <span 
      :class="cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', colorClass)"
    ></span>
    <span 
      :class="cn('relative inline-flex rounded-full h-2 w-2', colorClass)"
    ></span>
  </div>
</template>
