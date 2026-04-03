<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  launch: any;
}>();

const getTimeUntil = (dateString: string) => {
  const targetDate = new Date(dateString).getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference <= 0) return 'LAUNCHED';

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  const isUrgent = days <= 3;

  return {
    label: `T-Minus ${days}d`,
    isUrgent
  };
};

const tMinusData = ref({ label: 'CALCULATING', isUrgent: false });
let interval: any;

onMounted(() => {
  tMinusData.value = getTimeUntil(props.launch.net) as any;
  interval = setInterval(() => {
    tMinusData.value = getTimeUntil(props.launch.net) as any;
  }, 60000); // UI update every minute
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});

const defaultImage = 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80';
</script>

<template>
  <div
    class="group bg-surface-variant/70 backdrop-blur-xl hover:shadow-[0_12px_40px_rgba(255,109,0,0.08)] transition-all duration-300 rounded-lg overflow-hidden flex flex-col relative">
    <div class="h-52 overflow-hidden relative">
      <img :src="launch.image || defaultImage" :alt="launch.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2] contrast-125" />
      <div class="absolute top-4 left-4 max-w-[80%]">
        <div
          class="bg-surface-container-highest/90 backdrop-blur px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest text-on-surface truncate">
          {{ launch.name?.split('|')?.[1] || launch.name }}
        </div>
      </div>
      <div class="absolute bottom-4 right-4">
        <span v-if="tMinusData.isUrgent"
          class="bg-primary text-on-primary px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest rounded shadow-[0_4px_14px_rgba(255,109,0,0.4)]">
          {{ tMinusData.label }}
        </span>
        <span v-else
          class="bg-surface-container-highest/90 backdrop-blur text-on-surface-variant px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest rounded">
          {{ tMinusData.label }}
        </span>
      </div>
    </div>

    <div class="p-8 space-y-6 flex-1 flex flex-col">
      <div class="flex justify-between items-start gap-4">
        <div class="flex-1">
          <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Agency</p>
          <p class="text-sm font-bold text-on-surface tracking-wide line-clamp-1"
            :title="launch.launch_service_provider?.name">{{ launch.launch_service_provider?.name || 'Unknown' }}</p>
        </div>
        <div class="text-right flex-1">
          <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Launch Site</p>
          <p class="text-sm font-bold text-on-surface tracking-wide line-clamp-1" :title="launch.pad?.location?.name">{{
            launch.pad?.location?.name?.split(',')[0] || 'Unknown' }}</p>
        </div>
      </div>

      <div class="mt-auto">
        <button
          class="w-full bg-transparent border-2 border-primary/20 text-primary py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-primary hover:text-on-primary hover:border-primary transition-all active:scale-[0.98]">
          MISSION SPECS
        </button>
      </div>
    </div>
  </div>
</template>
