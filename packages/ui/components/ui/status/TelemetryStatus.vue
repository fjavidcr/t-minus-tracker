<script setup lang="ts">
import { formatCountdown } from '@t-minus/utils'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import StatusIndicator from './StatusIndicator.vue'

const props = defineProps<{
  cachedAt?: number
  label?: string
  maxAge: number
}>()

const now = ref(Date.now())
const mounted = ref(false)

const remainingSeconds = computed(() => {
  if (!props.cachedAt) return 0
  const timestamp = Number(props.cachedAt)
  const expiry = timestamp + Number(props.maxAge) * 1000
  const diff = expiry - now.value
  return Math.max(0, Math.floor(diff / 1000))
})

const isExpiring = computed(() => remainingSeconds.value < 60)

const formattedTime = computed(() => {
  if (!mounted.value) return '--m --s'
  return formatCountdown(remainingSeconds.value)
})

let timer: null | ReturnType<typeof setInterval> = null

onMounted(() => {
  mounted.value = true
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div v-if="cachedAt" class="font-label group flex select-none items-center gap-3">
    <div class="flex flex-col items-end">
      <span
        class="text-on-surface-variant/60 group-hover:text-primary text-[8px] font-black uppercase tracking-[0.2em] transition-colors"
      >
        {{ label || 'Telemetry Cache' }}
      </span>
      <div class="flex items-center gap-2">
        <span
          class="text-[10px] font-bold tabular-nums tracking-wider transition-colors"
          :class="isExpiring ? 'text-secondary font-black' : 'text-on-surface'"
        >
          T-MINUS {{ formattedTime }}
        </span>
        <StatusIndicator :status="isExpiring ? 'pending' : 'active'" class="h-1.5 w-1.5" />
      </div>
    </div>

    <div class="bg-outline-variant/20 h-6 w-[1px]" />

    <div class="hidden flex-col md:flex">
      <span class="text-on-surface-variant mb-0.5 text-[8px] font-bold uppercase tracking-widest"
        >Status</span
      >
      <span class="text-primary text-[9px] font-black uppercase tracking-tight">Sync Nominal</span>
    </div>
  </div>
</template>
