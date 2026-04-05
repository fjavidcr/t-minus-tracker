<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useOrbitalLink } from '~/composables/useOrbitalLink';
import { UI_CONFIG, CACHE_POLICY } from '~/lib/constants';

const { setStatus } = useOrbitalLink();

// SEO Meta Data
useSeoMeta({
  title: 'T-minus - NASA & Global Space Launch Calendar',
  ogTitle: 'T-minus - NASA & Global Space Launch Calendar',
  description: 'Descubre los próximos lanzamientos espaciales de NASA, SpaceX, y más. Mantente actualizado sobre exploración espacial, datos logísticos y rastreo orbital.',
});

// Fetch data from Nitro backend with lazy loading
const { data: launchesRaw, pending, error, refresh } = useFetch<any>('/api/launches', {
  lazy: true
});

const launches = computed(() => launchesRaw.value?.data || []);
const cachedAt = computed(() => launchesRaw.value?.cachedAt);

// Sync status with global link
watch([pending, error], () => {
  setStatus(pending.value, error.value, refresh);
}, { immediate: true });

const futureLaunches = computed(() => {
  if (!launches.value) return [];
  const now = new Date().getTime();
  return launches.value.filter((l: any) => new Date(l.net).getTime() > now);
});

const heroLaunch = computed(() => {
  return futureLaunches.value.length > 0 ? futureLaunches.value[0] : null;
});

const activeDeployments = computed(() => {
  return futureLaunches.value.length > 1 ? futureLaunches.value.slice(1, 10) : [];
});

const scrollContainer = ref<HTMLElement | null>(null);

const scrollNext = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 400, behavior: 'smooth' });
  }
};

const scrollPrev = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -400, behavior: 'smooth' });
  }
};

const heroMissionNameSegments = computed(() => {
  if (!heroLaunch.value) return ['', ''];
  const parts = heroLaunch.value.name.split('|');
  return [parts[0]?.trim() || 'Mission', parts[1]?.trim() || heroLaunch.value.name];
});

const heroMissionPatch = computed(() => {
  if (!heroLaunch.value) return null;
  // Look in root mission_patches
  if (heroLaunch.value.mission_patches?.[0]?.image_url) {
    return heroLaunch.value.mission_patches[0].image_url;
  }
  // Fallback to program mission_patches
  if (heroLaunch.value.program?.[0]?.mission_patches?.[0]?.image_url) {
    return heroLaunch.value.program[0].mission_patches[0].image_url;
  }
  return null;
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
  intervalId = setInterval(updateHeroCountdown, UI_CONFIG.INTERVALS.COUNTDOWN);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div class="p-4 md:p-8 lg:p-12 space-y-12">
    <!-- Loaded State -->
    <template v-if="heroLaunch">
      <!-- Hero Section: Central Countdown -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative overflow-hidden p-8 md:p-12 rounded-2xl min-h-[500px]">
        <!-- Cinematic Background Image -->
        <div class="absolute inset-0 z-0">
          <img
            v-if="heroLaunch.image?.image_url"
            :src="heroLaunch.image.image_url"
            class="w-full h-full object-cover transition-opacity duration-1000"
            alt="Mission Background"
          />
          <div v-else class="w-full h-full bg-surface-container-low"></div>
          
          <!-- Gradient Masks for Premium Readability -->
          <div class="absolute inset-0 bg-gradient-to-r from-surface via-surface/60 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
          <!-- Darken more for clarity -->
          <div class="absolute inset-0 bg-black/30"></div>
        </div>

        <!-- Light bleed glow behind hero (Artemis Orange for contrast) -->
        <div
          class="absolute -top-20 left-0 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(252,61,33,0.12)_0%,transparent_70%)] pointer-events-none z-[1]">
        </div>
        <div class="lg:col-span-8 hero-glow relative min-h-[460px] flex flex-col justify-center z-10">
          <div class="flex flex-col md:flex-row md:items-center gap-4 mb-4 relative z-10">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_#Fc3d21]"></span>
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary font-label">Live Telemetry: Active Mission</span>
            </div>

            <!-- Cache Freshness Component -->
            <TelemetryStatus
              v-if="cachedAt"
              :cached-at="cachedAt"
              :max-age="CACHE_POLICY.MAX_AGE.LAUCHES"
              class="md:ml-4"
            />
          </div>

          <NuxtLink :to="`/missions/${heroLaunch.id}`" class="group/title block">
            <h2
              class="text-5xl font-black tracking-tighter text-on-surface leading-[0.95] mb-8 lg:text-7xl uppercase relative z-10 font-headline group-hover/title:text-primary transition-all duration-500 drop-shadow-2xl">
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

        <div class="lg:col-span-4 flex flex-col items-end gap-6 z-10">
          <!-- Premium Mission Patch: Positioned exactly in the black space ABOVE the card -->
          <div v-if="heroMissionPatch" class="w-40 h-40 lg:w-56 lg:h-56 flex items-center justify-center p-2 z-[20] pointer-events-none self-end">
            <div class="relative group/patch">
              <!-- Glow Effect -->
              <div class="absolute inset-0 bg-primary/30 blur-[80px] rounded-full group-hover/patch:bg-primary/40 transition-all duration-1000 animate-pulse"></div>
              <img
                :src="heroMissionPatch"
                class="w-full h-full object-contain relative z-10 animate-float drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
                alt="Mission Patch"
              />
            </div>
          </div>

          <div
            class="w-full bg-surface-variant/70 backdrop-blur-3xl p-8 rounded-lg relative overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.5)] group border border-outline-variant/10">
            <!-- Mission Patch / Feature Image (Removed from here as it's now in the hero column) -->
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

        <!-- Mission Carousel -->
        <div class="relative group/carousel">
          <div
            ref="scrollContainer"
            class="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            <div v-for="launch in activeDeployments" :key="launch.id" class="snap-start shrink-0 w-full md:w-[400px]">
              <LaunchCard :launch="launch" />
            </div>
          </div>

          <!-- Carousel Controls -->
          <button
            @click="scrollPrev"
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-surface-container/80 backdrop-blur p-3 rounded-full border border-outline-variant/30 text-on-surface opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-primary hover:text-on-primary z-20 hidden md:block"
          >
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            @click="scrollNext"
            class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-surface-container/80 backdrop-blur p-3 rounded-full border border-outline-variant/30 text-on-surface opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-primary hover:text-on-primary z-20 hidden md:block"
          >
            <span class="material-symbols-outlined">chevron_right</span>
          </button>

          <!-- Custom scroll indicator -->
          <div class="h-1 w-full bg-surface-container rounded-full overflow-hidden mt-4 opacity-30">
            <div class="h-full bg-primary/50 w-1/4 rounded-full"></div>
          </div>
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

    <!-- Fallback State: No Upcoming Launches -->
    <div v-else-if="!pending" class="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 p-12">
      <div class="relative">
        <div class="absolute -inset-12 bg-secondary/5 blur-3xl rounded-full animate-pulse"></div>
        <span class="material-symbols-outlined text-7xl text-secondary relative z-10" style="font-variation-settings: 'FILL' 0, 'wght' 200;">satellite_alt</span>
      </div>

      <div class="space-y-3 max-w-md relative z-10">
        <h2 class="text-3xl font-black font-headline uppercase tracking-tighter text-on-surface">Orbital Standby</h2>
        <p class="text-[10px] font-bold uppercase tracking-[0.3em] font-label text-on-surface-variant leading-relaxed">
          No immediate deployments detected in the current window. <br/>
          Mission control is monitoring deep space frequencies.
        </p>
      </div>

      <NuxtLink
        to="/missions"
        class="group flex items-center gap-4 bg-surface-container-low px-8 py-4 rounded-xl border border-outline-variant/10 hover:border-primary/50 transition-all font-label text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant hover:text-primary"
      >
        Access Archival Logs
        <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.mission-text-stroke {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
  color: transparent;
}

.hero-glow {
  position: relative;
}

.hero-glow::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(11, 61, 145, 0.05) 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes slow-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}
</style>
