<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { formatCountdown } from '@t-minus/utils';
import StatusIndicator from './StatusIndicator.vue';

const props = defineProps<{
  cachedAt?: number;
  maxAge: number;
  label?: string;
}>();

const remainingSeconds = ref(0);
let timer: any = null;

const calculateRemainingValue = () => {
  if (!props.cachedAt) return 0;
  const timestamp = Number(props.cachedAt);
  const expiry = timestamp + (Number(props.maxAge) * 1000);
  const diff = expiry - Date.now();
  return Math.max(0, Math.floor(diff / 1000));
};

const updateRemaining = () => {
  remainingSeconds.value = calculateRemainingValue();
};

const formattedTime = computed(() => formatCountdown(remainingSeconds.value));
const isExpiring = computed(() => remainingSeconds.value < 60);

updateRemaining();
watch(() => props.cachedAt, updateRemaining);

onMounted(() => {
  updateRemaining();
  timer = setInterval(updateRemaining, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div v-if="cachedAt" class="flex items-center gap-3 font-label select-none group">
    <div class="flex flex-col items-end">
      <span class="text-[8px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 group-hover:text-primary transition-colors">
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
    
    <div class="h-6 w-[1px] bg-outline-variant/20"></div>
    
    <div class="hidden md:flex flex-col">
      <span class="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Status</span>
      <span class="text-[9px] font-black uppercase text-primary tracking-tight">Sync Nominal</span>
    </div>
  </div>
</template>
