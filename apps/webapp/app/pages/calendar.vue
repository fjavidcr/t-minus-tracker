<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useOrbitalLink } from '~/composables/useOrbitalLink';
import { CACHE_POLICY } from '~/lib/constants';

const { setStatus } = useOrbitalLink();

useHead({
  title: 'T-minus | Launch Calendar'
})

interface Launch {
  id: string;
  net: string;
  name: string;
  launch_service_provider?: {
    name: string;
  };
  mission?: {
    description: string;
  };
}

// Fetch data from Nitro backend
const { data: launchesRaw, pending, error, refresh } = useSecureFetch<{ data: Launch[], cachedAt: number }>('/api/launches', {
  lazy: true
});

const launches = computed(() => launchesRaw.value?.data || []);
const cachedAt = computed(() => launchesRaw.value?.cachedAt);

// Sync status with global link
watch([pending, error], () => {
  setStatus(pending.value, error.value, refresh);
}, { immediate: true });

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Calendar Logic
const now = new Date();
const currentMonthName = now.toLocaleString('en-US', { month: 'long' });
const currentYear = now.getFullYear();
const firstDayOfMonth = new Date(currentYear, now.getMonth(), 1).getDay();
const totalDays = new Date(currentYear, now.getMonth() + 1, 0).getDate();

// Array of 42 cells (6 weeks) to cover any month
const calendarCells = computed(() => {
  const cells = [];
  const prevMonthLastDay = new Date(currentYear, now.getMonth(), 0).getDate();
  
  // Padding from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    cells.push({
      day: prevMonthLastDay - i,
      month: 'prev',
      fullDate: new Date(currentYear, now.getMonth() - 1, prevMonthLastDay - i)
    });
  }
  
  // Days of current month
  for (let i = 1; i <= totalDays; i++) {
    cells.push({
      day: i,
      month: 'current',
      fullDate: new Date(currentYear, now.getMonth(), i)
    });
  }
  
  // Padding for next month
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({
      day: i,
      month: 'next',
      fullDate: new Date(currentYear, now.getMonth() + 1, i)
    });
  }
  
  return cells;
});

const getEventsForDate = (date: Date) => {
  if (!launches.value) return [];
  return launches.value.filter(l => {
    const launchDate = new Date(l.net);
    return launchDate.getDate() === date.getDate() &&
           launchDate.getMonth() === date.getMonth() &&
           launchDate.getFullYear() === date.getFullYear();
  });
};

const getAgencyColor = (agency: string | undefined) => {
  if (agency?.includes('NASA')) return 'bg-primary';
  if (agency?.includes('SpaceX')) return 'bg-tertiary';
  if (agency?.includes('ESA')) return 'bg-secondary';
  return 'bg-secondary';
};

const getAgencyBadge = (agency: string | undefined) => {
  if (agency?.includes('NASA')) return 'NASA';
  if (agency?.includes('SpaceX')) return 'SPX';
  if (agency?.includes('ESA')) return 'ESA';
  return 'GEN';
};
</script>

<template>
  <main class="flex-1 flex flex-col md:flex-row overflow-hidden bg-surface min-h-[calc(100vh-80px)]">
    <!-- Calendar View -->
    <section class="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
      <div v-if="!pending" class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div class="font-label text-on-surface-variant uppercase tracking-[0.3em] font-medium text-[10px] mb-2">Classification: Schedule-Alpha</div>
          <h1 class="text-4xl font-black tracking-tighter text-on-surface font-headline uppercase leading-none">{{ currentMonthName }} {{ currentYear }}</h1>
        </div>
        <div class="flex items-center gap-2 bg-surface-container p-1 rounded-lg font-label">
          <button class="px-6 py-2 text-[10px] font-bold uppercase tracking-wider bg-primary text-on-primary rounded-lg shadow-sm transition-all focus:outline-none">Month</button>
          <button class="px-6 py-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-all focus:outline-none">Week</button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div v-if="!pending" class="flex flex-wrap gap-4 mb-8 font-label">
        <div class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/10">
          <span class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(11,61,145,0.6)]"></span>
          <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">NASA</span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/10">
          <span class="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(252,61,33,0.6)]"></span>
          <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">ESA</span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/10">
          <span class="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(173,203,218,0.6)]"></span>
          <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">SpaceX</span>
        </div>
        <button class="ml-auto text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <span class="material-symbols-outlined text-sm">filter_list</span>
          Advanced Filters
        </button>
      </div>

      <!-- Calendar Grid -->
      <div v-if="!pending" class="grid grid-cols-7 gap-px bg-outline-variant/10 border border-outline-variant/10 overflow-hidden rounded-xl">
        <!-- Days Header -->
        <div v-for="day in days" :key="day" class="bg-surface-container-low py-3 text-center border-b border-outline-variant/10">
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant font-label">{{ day }}</span>
        </div>

        <!-- Calendar Days -->
        <div v-for="(cell, idx) in calendarCells" :key="idx" 
          :class="[
            'min-h-[140px] bg-surface p-3 flex flex-col gap-2 transition-colors hover:bg-surface-container/30 group',
            cell.month !== 'current' ? 'opacity-20' : ''
          ]">
          <span class="text-[11px] font-bold font-label" :class="cell.fullDate.toDateString() === now.toDateString() ? 'text-secondary' : 'text-on-surface-variant'">
            {{ cell.day }}
          </span>
          
          <!-- Dynamic Events -->
          <template v-for="event in getEventsForDate(cell.fullDate)" :key="event.id">
            <NuxtLink :to="`/missions/${event.id}`" 
              class="p-1.5 rounded-sm text-[8px] font-bold uppercase tracking-tighter truncate font-label transition-all hover:scale-[1.02] shadow-sm"
              :class="[
                getAgencyColor(event.launch_service_provider?.name),
                'text-white'
              ]">
              {{ event.name.split('|')[1] || event.name }}
            </NuxtLink>
          </template>
        </div>
      </div>
    </section>

    <!-- Upcoming Milestones Side Panel -->
    <aside class="w-full md:w-80 lg:w-96 bg-surface-container-low border-l border-outline-variant/5 p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
      <div>
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-sm font-black tracking-tight text-on-surface uppercase font-headline">Telemetry Log</h2>
            <TelemetryStatus 
              v-if="cachedAt" 
              :cached-at="cachedAt" 
              :max-age="CACHE_POLICY.MAX_AGE.LAUCHES" 
              class="mt-1"
            />
          </div>
          <span class="material-symbols-outlined text-secondary text-lg">priority_high</span>
        </div>
        <div v-if="!pending" class="space-y-6">
          <div v-for="launch in launches?.slice(0, 5)" :key="launch.id" class="relative group cursor-pointer">
            <NuxtLink :to="`/missions/${launch.id}`" class="flex items-start gap-4">
              <div class="h-10 w-10 shrink-0 bg-surface-container rounded-lg flex items-center justify-center ring-1 ring-outline-variant/10 group-hover:ring-primary/50 transition-all">
                <span class="material-symbols-outlined text-primary text-lg">rocket</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start mb-1 font-label">
                  <span class="text-[9px] font-black uppercase tracking-widest" :class="getAgencyColor(launch.launch_service_provider?.name).replace('bg-', 'text-')">{{ getAgencyBadge(launch.launch_service_provider?.name) }}</span>
                  <span class="text-[9px] font-bold text-on-surface-variant">{{ new Date(launch.net).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}) }}</span>
                </div>
                <h3 class="text-[11px] font-bold text-on-surface mb-1 font-headline uppercase tracking-tight line-clamp-1">{{ launch.name }}</h3>
                <p class="text-[10px] text-on-surface-variant leading-relaxed font-body line-clamp-2">{{ launch.mission?.description || 'Orbital deployment sequence initiated.' }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- System Diagnostics -->
      <div class="mt-auto pt-8 border-t border-outline-variant/10 space-y-6">
        <div>
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-6 font-label">Launch Site Status</h4>
          <div class="space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between font-label">
                <span class="text-[10px] text-on-surface font-bold uppercase tracking-tight">KSC LC-39B</span>
                <span class="text-[9px] font-black text-secondary uppercase tracking-widest">Go for Launch</span>
              </div>
              <div class="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                <div class="h-full bg-secondary w-[92%] shadow-[0_0_8px_rgba(252,61,33,0.4)]"></div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between font-label">
                <span class="text-[10px] text-on-surface font-bold uppercase tracking-tight">Vandenberg SLC-4E</span>
                <span class="text-[9px] font-black text-primary uppercase tracking-widest">Nominal</span>
              </div>
              <div class="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                <div class="h-full bg-primary w-[75%] shadow-[0_0_8px_rgba(11,61,145,0.4)]"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-surface-container rounded-xl border border-outline-variant/10">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-2 w-2 rounded-full bg-secondary animate-pulse"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-on-surface font-label">Live Telemetry</span>
          </div>
          <div class="aspect-video bg-surface-container-low rounded-lg relative overflow-hidden group">
            <img alt="Rocket Cam" class="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-700" src="https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop"/>
            <div class="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
            <div class="absolute bottom-2 left-2 right-2 flex justify-between items-end font-label text-[8px] uppercase font-bold text-on-surface-variant tracking-widest">
              <span>Pad Cam 09-B</span>
              <span class="material-symbols-outlined text-xs text-secondary">videocam</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </main>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1c2028;
  border-radius: 10px;
}
</style>
