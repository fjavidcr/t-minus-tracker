<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { UI_CONFIG } from '~/lib/constants';

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

  const isUrgent = days <= UI_CONFIG.THRESHOLDS.MISSION_URGENCY_DAYS;

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
  }, UI_CONFIG.INTERVALS.UI_REFRESH); // UI update every minute
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});

const defaultImage = UI_CONFIG.ASSETS.DEFAULT_LAUNCH_IMAGE;
</script>

<template>
  <div
    class="group bg-surface-container-low backdrop-blur-xl hover:shadow-[0_12px_40px_rgba(11,61,145,0.1)] transition-all duration-300 rounded-xl overflow-hidden flex flex-col relative border border-outline-variant/10">
    <div class="h-52 overflow-hidden relative">
      <img :src="launch.image?.image_url || launch.image?.thumbnail_url || defaultImage" :alt="launch.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2] contrast-125" />
      <div class="absolute top-4 left-4 max-w-[80%]">
        <div
          class="bg-surface-container/90 backdrop-blur px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest text-on-surface truncate font-label">
          {{ launch.name?.split('|')?.[1] || launch.name }}
        </div>
      </div>
      <div class="absolute bottom-4 right-4">
        <span v-if="tMinusData.isUrgent"
          class="bg-secondary text-on-secondary px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest rounded shadow-[0_4px_14px_rgba(252,61,33,0.4)] font-label">
          {{ tMinusData.label }}
        </span>
        <span v-else
          class="bg-surface-container-highest/90 backdrop-blur text-on-surface-variant px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest rounded font-label">
          {{ tMinusData.label }}
        </span>
      </div>
    </div>

    <div class="p-8 space-y-6 flex-1 flex flex-col">
      <div class="flex justify-between items-start gap-4">
        <div class="flex-1">
          <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-secondary mb-1 font-label">Agency</p>
          <p class="text-xs font-bold text-on-surface tracking-wide line-clamp-1 font-body uppercase"
            :title="launch.launch_service_provider?.name">{{ launch.launch_service_provider?.name || 'Unknown' }}</p>
        </div>
        <div class="text-right flex-1">
          <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-secondary mb-1 font-label">Launch Site</p>
          <p class="text-xs font-bold text-on-surface tracking-wide line-clamp-1 font-body uppercase" :title="launch.pad?.location?.name">{{
            launch.pad?.location?.name?.split(',')[0] || 'Unknown' }}</p>
        </div>
      </div>

      <div class="mt-auto">
        <NuxtLink :to="`/missions/${launch.id}`"
          class="w-full bg-primary text-on-primary py-3.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] rounded-lg shadow-[0_8px_20px_-8px_rgba(11,61,145,0.6)] hover:shadow-[0_12px_24px_-8px_rgba(11,61,145,0.7)] hover:brightness-110 hover:-translate-y-0.5 transition-all active:scale-[0.98] font-label inline-block text-center cursor-pointer">
          MISSION SPECS
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
