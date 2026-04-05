<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps<{
  cachedAt?: number;
  maxAge: number;
  label?: string;
}>();

const remainingSeconds = ref(0);
let timer: any = null;

const calculateRemaining = () => {
  if (!props.cachedAt) return;
  const expiry = props.cachedAt + (props.maxAge * 1000);
  const diff = expiry - Date.now();
  remainingSeconds.value = Math.max(0, Math.floor(diff / 1000));
};

const formattedTime = computed(() => {
  const m = Math.floor(remainingSeconds.value / 60);
  const s = remainingSeconds.value % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
});

const isExpiring = computed(() => remainingSeconds.value < 60);

onMounted(() => {
  calculateRemaining();
  timer = setInterval(calculateRemaining, 1000);
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
        <div class="relative flex h-1.5 w-1.5">
          <span 
            class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            :class="isExpiring ? 'bg-secondary' : 'bg-primary'"
          ></span>
          <span 
            class="relative inline-flex rounded-full h-1.5 w-1.5"
            :class="isExpiring ? 'bg-secondary' : 'bg-primary'"
          ></span>
        </div>
      </div>
    </div>
    
    <div class="h-6 w-[1px] bg-outline-variant/20"></div>
    
    <div class="hidden md:flex flex-col">
      <span class="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Status</span>
      <span class="text-[9px] font-black uppercase text-primary tracking-tight">Sync Nominal</span>
    </div>
  </div>
</template>
