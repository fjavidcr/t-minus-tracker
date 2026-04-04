<script setup lang="ts">
import { useSeoMeta } from '#imports';
import { ref, computed, onMounted, onUnmounted } from 'vue';

// SEO Meta Data
useSeoMeta({
  title: 'T-minus - NASA & Global Space Launch Calendar',
  ogTitle: 'T-minus - NASA & Global Space Launch Calendar',
  description: 'Descubre los próximos lanzamientos espaciales de NASA, SpaceX, y más. Mantente actualizado sobre exploración espacial, datos logísticos y rastreo orbital.',
});

// Fetch data from Nitro backend
const { data: launches, pending, error } = await useFetch('/api/launches');

const futureLaunches = computed(() => {
  if (!launches.value) return [];
  const now = new Date().getTime();
  return launches.value.filter((l: any) => new Date(l.net).getTime() > now);
});

const heroLaunch = computed(() => {
  return futureLaunches.value.length > 0 ? futureLaunches.value[0] : null;
});

const activeDeployments = computed(() => {
  return futureLaunches.value.length > 1 ? futureLaunches.value.slice(1, 4) : [];
});

const heroMissionNameSegments = computed(() => {
  if (!heroLaunch.value) return ['', ''];
  const parts = heroLaunch.value.name.split('|');
  return [parts[0]?.trim() || 'Mission', parts[1]?.trim() || heroLaunch.value.name];
});

// Countdown logic for the Hero Section
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
let intervalId: any;

const updateHeroCountdown = () => {
  if (!heroLaunch.value || !heroLaunch.value.net) return;
  const targetDate = new Date(heroLaunch.value.net).getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference > 0) {
    days.value = Math.floor(difference / (1000 * 60 * 60 * 24));
    hours.value = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes.value = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    seconds.value = Math.floor((difference % (1000 * 60)) / 1000);
  } else {
    days.value = 0; hours.value = 0; minutes.value = 0; seconds.value = 0;
  }
};

const padZero = (num: number) => num.toString().padStart(2, '0');

onMounted(() => {
  updateHeroCountdown();
  intervalId = setInterval(updateHeroCountdown, 1000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div class="p-4 md:p-8 lg:p-12 space-y-12">
    <!-- Loading State -->
    <div v-if="pending" class="h-96 flex items-center justify-center">
      <span class="w-8 h-8 rounded-full bg-primary animate-ping"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="error"
      class="bg-error-container text-on-error-container p-6 rounded-lg border border-error/20 font-mono">
      Error of transmission. Unable to connect to orbital data nodes.
    </div>

    <!-- Loaded State -->
    <template v-else-if="heroLaunch">
      <!-- Hero Section: Central Countdown -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative">
        <!-- Light bleed glow behind hero (Artemis Orange for contrast) -->
        <div
          class="absolute -top-20 left-0 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(252,61,33,0.08)_0%,transparent_70%)] pointer-events-none">
        </div>
        <div class="lg:col-span-8 hero-glow">
          <div class="flex items-center gap-2 mb-4 relative z-10">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_#Fc3d21]"></span>
            <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary font-label">Live Telemetry: Active
              Mission</span>
          </div>

          <NuxtLink :to="`/missions/${heroLaunch.id}`" class="group/title block">
            <h2
              class="text-5xl font-black tracking-tighter text-on-surface leading-[0.95] mb-8 lg:text-7xl uppercase relative z-10 font-headline group-hover/title:text-primary transition-colors">
              {{ heroMissionNameSegments[0] }}:<br v-if="heroMissionNameSegments[0]" />
              <span class="mission-text-stroke line-clamp-1 break-all">{{ heroMissionNameSegments[1] }}</span>
            </h2>
          </NuxtLink>

          <div class="flex flex-wrap gap-4 lg:gap-10 font-headline">
            <div>
              <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2 font-label">Days</p>
              <p class="font-black text-on-surface text-4xl md:text-5xl tabular-nums">{{ padZero(days) }}</p>
            </div>
            <div class="h-14 w-px bg-outline-variant/30 mt-2"></div>
            <div>
              <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2 font-label">Hours</p>
              <p class="font-black text-on-surface text-4xl md:text-5xl tabular-nums">{{ padZero(hours) }}</p>
            </div>
            <div class="h-14 w-px bg-outline-variant/30 mt-2"></div>
            <div>
              <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2 font-label">Minutes</p>
              <p class="font-black text-on-surface text-4xl md:text-5xl tabular-nums">{{ padZero(minutes) }}</p>
            </div>
            <div class="h-14 w-px bg-outline-variant/30 mt-2"></div>
            <div>
              <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2 font-label">Seconds</p>
              <p class="font-black text-secondary text-4xl md:text-5xl tabular-nums">{{ padZero(seconds) }}</p>
            </div>
          </div>
          <div class="mt-12 flex flex-wrap gap-4 relative z-10">
            <NuxtLink :to="`/missions/${heroLaunch.id}`"
              class="bg-primary text-on-primary px-8 py-4 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_8px_24px_-8px_rgba(11,61,145,0.6)] hover:shadow-[0_12px_32px_-8px_rgba(11,61,145,0.7)] hover:brightness-110 hover:-translate-y-0.5 transition-all active:scale-[0.98] font-label inline-flex items-center gap-3">
              View Mission Spec
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </NuxtLink>
            <NuxtLink to="/calendar"
              class="bg-surface-container-low border border-outline-variant/20 text-on-surface px-8 py-4 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-surface-container hover:border-outline-variant/40 transition-all font-label">
              Full Calendar
            </NuxtLink>
          </div>
        </div>

        <div
          class="lg:col-span-4 bg-surface-variant/60 backdrop-blur-xl p-8 rounded-lg relative overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
          <div class="absolute top-0 right-0 p-4 opacity-5">
            <span class="material-symbols-outlined text-8xl line-clamp-1">rocket</span>
          </div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-6">Environment Status</p>
          <div class="space-y-6">
            <div>
              <div class="flex justify-between items-end mb-2">
                <span class="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Rocket Config</span>
                <span class="text-lg font-bold text-on-surface line-clamp-1 text-right ml-4">{{
                  heroLaunch.rocket?.configuration?.name || 'Unknown' }}</span>
              </div>
              <div class="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                <div class="bg-secondary h-full w-[85%]"></div>
              </div>
            </div>
            <div class="flex justify-between items-center pt-2 gap-4">
              <span class="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Pad Target</span>
              <span class="text-sm font-bold text-on-surface uppercase tracking-widest text-right line-clamp-1">{{
                heroLaunch.pad?.name || 'Unknown' }}</span>
            </div>
            <div class="flex justify-between items-center pt-2">
              <span class="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Window Status</span>
              <span
                class="text-[0.65rem] font-bold px-3 py-1 bg-secondary/10 text-secondary rounded uppercase tracking-widest">
                {{ heroLaunch.status?.name || 'TBD' }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Launches with Filter -->
      <section class="space-y-8 mt-16 pt-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 font-label">Classification:
              Schedule</p>
            <h3 class="text-3xl font-black text-on-surface font-headline uppercase tracking-tight">Upcoming Deployments</h3>
          </div>
          <div class="flex gap-1 p-1 bg-surface-container-low rounded-lg font-label">
            <button
              class="px-5 py-2 text-[10px] font-bold uppercase tracking-widest bg-primary text-on-primary rounded-md shadow-sm transition-all focus:outline-none">All</button>
            <button
              class="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors focus:outline-none">NASA</button>
            <button
              class="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors focus:outline-none">SpaceX</button>
            <button
              class="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors focus:outline-none">ESA</button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LaunchCard v-for="launch in activeDeployments" :key="launch.id" :launch="launch" />
        </div>

        <!-- View All link -->
        <div class="mt-8 flex justify-center">
          <NuxtLink 
            to="/missions"
            class="group flex items-center gap-4 bg-surface-container-low px-8 py-4 rounded-xl border border-outline-variant/10 hover:border-secondary/30 transition-all font-label text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant hover:text-secondary group"
          >
            Access Full Archive
            <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </NuxtLink>
        </div>
      </section>

      <!-- Bottom Dashboard Row: News Feed & Archival Logs -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16 mt-8">
        <!-- News Feed -->
        <div class="lg:col-span-7 space-y-8">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 font-label">Intelligence: Agency
              Feed</p>
            <h3 class="text-2xl font-black text-on-surface font-headline uppercase tracking-tight">Global Dispatch</h3>
          </div>
          <div class="space-y-8">
            <div class="flex gap-6 items-start group">
              <span class="text-[0.65rem] font-bold text-secondary uppercase tracking-widest mt-1 min-w-[70px]">04:12
                GMT</span>
              <div class="space-y-2">
                <h4 class="text-sm font-bold text-on-surface group-hover:text-primary transition-colors tracking-wide">
                  Federal space administration approves orbital window.</h4>
                <p class="text-xs text-on-surface-variant leading-relaxed">Flight readiness review scheduled for T-minus
                  24 hours. Weather parameters hold within launch feasibility.</p>
              </div>
            </div>
            <div class="flex gap-6 items-start group">
              <span
                class="text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-widest mt-1 min-w-[70px]">Yesterday</span>
              <div class="space-y-2">
                <h4 class="text-sm font-bold text-on-surface group-hover:text-primary transition-colors tracking-wide">
                  Payload integration completed for commercial payload.</h4>
                <p class="text-xs text-on-surface-variant leading-relaxed">Structural integrity confirmed through vacuum
                  testing. Standard payload processing proceeds without anomalies.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Archival Insights / Stats -->
        <div class="lg:col-span-5 bg-surface-container-low p-10 rounded-xl space-y-10 relative overflow-hidden border border-outline-variant/10">
          <!-- Light bleed on stats card (Artemis Orange) -->
          <div
            class="absolute -top-10 -right-10 w-[200px] h-[200px] bg-[radial-gradient(ellipse_at_center,rgba(252,61,33,0.08)_0%,transparent_70%)] pointer-events-none">
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 font-label">Archive: Global Metrics
            </p>
            <h3 class="text-2xl font-black text-on-surface font-headline uppercase tracking-tight">Yearly Logistics</h3>
          </div>
          <div class="grid grid-cols-2 gap-x-12 gap-y-10 font-headline">
            <div>
              <p class="text-4xl font-black text-on-surface tabular-nums">142</p>
              <p class="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mt-2 font-label">Global Launches
              </p>
            </div>
            <div>
              <p class="text-4xl font-black text-secondary tabular-nums">98.4%</p>
              <p class="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mt-2 font-label">Success Rate</p>
            </div>
            <div>
              <p class="text-4xl font-black text-on-surface tabular-nums">412.5</p>
              <p class="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mt-2 font-label">Tons to Orbit
              </p>
            </div>
            <div>
              <p class="text-4xl font-black text-on-surface tabular-nums">12</p>
              <p class="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mt-2 font-label">Crewed Missions
              </p>
            </div>
          </div>
          <div class="pt-8">
            <p class="text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Active Payloads
              by Orbit</p>
            <div class="flex h-3 w-full bg-surface-container overflow-hidden rounded-full">
              <div class="bg-secondary h-full" style="width: 65%" title="LEO"></div>
              <div class="bg-secondary/60 h-full" style="width: 20%" title="GEO"></div>
              <div class="bg-secondary/30 h-full" style="width: 10%" title="Deep Space"></div>
              <div class="bg-outline/20 h-full" style="width: 5%" title="Other"></div>
            </div>
            <div
              class="flex justify-between mt-3 text-[0.55rem] font-bold uppercase tracking-widest text-on-surface-variant">
              <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> LEO
                65%</span>
              <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-secondary/30"></span> Deep
                Space 10%</span>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
