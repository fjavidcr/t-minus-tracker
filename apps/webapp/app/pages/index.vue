<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import { useOrbitalLink } from '~/composables/useOrbitalLink'
import { CACHE_POLICY, UI_CONFIG } from '~/lib/constants'

const { setStatus } = useOrbitalLink()

// SEO Meta Data
useSeoMeta({
  description:
    'Descubre los próximos lanzamientos espaciales de NASA, SpaceX, y más. Mantente actualizado sobre exploración espacial, datos logísticos y rastreo orbital.',
  ogTitle: 'T-minus - NASA & Global Space Launch Calendar',
  title: 'T-minus - NASA & Global Space Launch Calendar'
})

interface Launch {
  id: string
  image?: { image_url: string }
  mission_patches?: { image_url: string }[]
  name: string
  net: string
  pad?: { name: string }
  program?: { mission_patches: { image_url: string }[] }[]
  rocket?: { configuration: { name: string } }
  status?: { name: string }
}

// Fetch data from Nitro backend with lazy loading
const {
  data: launchesRaw,
  error,
  pending,
  refresh
} = useSecureFetch<{ cachedAt: number; data: Launch[] }>('/api/launches', {
  lazy: true
})

const launches = computed(() => launchesRaw.value?.data || [])
const cachedAt = computed(() => launchesRaw.value?.cachedAt)

// Sync status with global link
watch(
  [pending, error],
  () => {
    setStatus(pending.value, error.value, refresh)
  },
  { immediate: true }
)

const futureLaunches = computed(() => {
  if (!launches.value) return []
  const now = new Date().getTime()
  return launches.value.filter((l: Launch) => new Date(l.net).getTime() > now)
})

const heroLaunch = computed(() => {
  return futureLaunches.value.length > 0 ? futureLaunches.value[0] : null
})

const activeDeployments = computed(() => {
  return futureLaunches.value.length > 1 ? futureLaunches.value.slice(1, 10) : []
})

const scrollContainer = ref<HTMLElement | null>(null)

const scrollNext = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ behavior: 'smooth', left: 400 })
  }
}

const scrollPrev = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ behavior: 'smooth', left: -400 })
  }
}

const heroMissionNameSegments = computed(() => {
  if (!heroLaunch.value) return ['', '']
  const parts = heroLaunch.value.name.split('|')
  return [parts[0]?.trim() || 'Mission', parts[1]?.trim() || heroLaunch.value.name]
})

const heroMissionPatch = computed(() => {
  if (!heroLaunch.value) return null
  // Look in root mission_patches
  if (heroLaunch.value.mission_patches?.[0]?.image_url) {
    return heroLaunch.value.mission_patches[0].image_url
  }
  // Fallback to program mission_patches
  if (heroLaunch.value.program?.[0]?.mission_patches?.[0]?.image_url) {
    return heroLaunch.value.program[0].mission_patches[0].image_url
  }
  return null
})

// Countdown logic for the Hero Section
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
let intervalId: null | ReturnType<typeof setInterval> = null

const updateHeroCountdown = () => {
  if (!heroLaunch.value || !heroLaunch.value.net) return
  const targetDate = new Date(heroLaunch.value.net).getTime()
  const now = new Date().getTime()
  const difference = targetDate - now

  if (difference > 0) {
    days.value = Math.floor(difference / (1000 * 60 * 60 * 24))
    hours.value = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    minutes.value = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    seconds.value = Math.floor((difference % (1000 * 60)) / 1000)
  } else {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
  }
}

const padZero = (num: number) => num.toString().padStart(2, '0')

onMounted(() => {
  updateHeroCountdown()
  intervalId = setInterval(updateHeroCountdown, UI_CONFIG.INTERVALS.COUNTDOWN)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="space-y-12 p-4 md:p-8 lg:p-12">
    <!-- Loaded State -->
    <template v-if="heroLaunch">
      <!-- Hero Section: Central Countdown -->
      <section
        class="relative grid min-h-[500px] grid-cols-1 items-end gap-8 overflow-hidden rounded-2xl p-8 md:p-12 lg:grid-cols-12"
      >
        <!-- Cinematic Background Image -->
        <div class="absolute inset-0 z-0">
          <img
            v-if="heroLaunch.image?.image_url"
            :src="heroLaunch.image.image_url"
            class="h-full w-full object-cover transition-opacity duration-1000"
            :alt="`Cinematic view of ${heroLaunch.name} mission`"
            fetchpriority="high"
          />
          <div v-else class="bg-surface-container-low h-full w-full"></div>

          <!-- Gradient Masks for Premium Readability -->
          <div
            class="from-surface via-surface/60 absolute inset-0 bg-gradient-to-r to-transparent"
          ></div>
          <div
            class="from-surface absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
          ></div>
          <!-- Darken more for clarity -->
          <div class="absolute inset-0 bg-black/30"></div>
        </div>

        <!-- Light bleed glow behind hero (Artemis Orange for contrast) -->
        <div
          class="pointer-events-none absolute -top-20 left-0 z-[1] h-[400px] w-[600px] bg-[radial-gradient(ellipse_at_center,rgba(252,61,33,0.12)_0%,transparent_70%)]"
        ></div>
        <div
          class="hero-glow relative z-10 flex min-h-[460px] flex-col justify-center lg:col-span-8"
        >
          <div class="relative z-10 mb-4 flex flex-col gap-4 md:flex-row md:items-center">
            <div class="flex items-center gap-2">
              <span
                class="bg-secondary h-2 w-2 animate-pulse rounded-full shadow-[0_0_10px_#Fc3d21]"
              ></span>
              <span
                class="text-secondary font-label text-[10px] font-bold uppercase tracking-[0.2em]"
                >Live Telemetry: Active Mission</span
              >
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
              class="text-on-surface font-headline group-hover/title:text-primary relative z-10 mb-8 text-5xl font-black uppercase leading-[0.95] tracking-tighter drop-shadow-2xl transition-all duration-500 lg:text-7xl"
            >
              {{ heroMissionNameSegments[0] }}:<br v-if="heroMissionNameSegments[0]" />
              <span class="mission-text-stroke line-clamp-1 break-all">{{
                heroMissionNameSegments[1]
              }}</span>
            </h2>
          </NuxtLink>

          <div class="font-headline flex flex-wrap gap-4 lg:gap-10">
            <div>
              <p
                class="text-on-surface-variant font-label mb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em]"
              >
                Days
              </p>
              <p class="text-on-surface text-4xl font-black tabular-nums md:text-5xl">
                {{ padZero(days) }}
              </p>
            </div>
            <div class="bg-outline-variant/30 mt-2 h-14 w-px"></div>
            <div>
              <p
                class="text-on-surface-variant font-label mb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em]"
              >
                Hours
              </p>
              <p class="text-on-surface text-4xl font-black tabular-nums md:text-5xl">
                {{ padZero(hours) }}
              </p>
            </div>
            <div class="bg-outline-variant/30 mt-2 h-14 w-px"></div>
            <div>
              <p
                class="text-on-surface-variant font-label mb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em]"
              >
                Minutes
              </p>
              <p class="text-on-surface text-4xl font-black tabular-nums md:text-5xl">
                {{ padZero(minutes) }}
              </p>
            </div>
            <div class="bg-outline-variant/30 mt-2 h-14 w-px"></div>
            <div>
              <p
                class="text-on-surface-variant font-label mb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em]"
              >
                Seconds
              </p>
              <p class="text-secondary text-4xl font-black tabular-nums md:text-5xl">
                {{ padZero(seconds) }}
              </p>
            </div>
          </div>
          <div class="relative z-10 mt-12 flex flex-wrap gap-4">
            <NuxtLink
              :to="`/missions/${heroLaunch.id}`"
              class="bg-primary text-on-primary font-label inline-flex items-center gap-3 rounded-lg px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_8px_24px_-8px_rgba(11,61,145,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(11,61,145,0.7)] hover:brightness-110 active:scale-[0.98]"
            >
              View Mission Spec
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </NuxtLink>
            <NuxtLink
              to="/calendar"
              class="bg-surface-container-low border-outline-variant/20 text-on-surface hover:bg-surface-container hover:border-outline-variant/40 font-label rounded-lg border px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
            >
              Full Calendar
            </NuxtLink>
          </div>
        </div>

        <div class="z-10 flex flex-col items-end gap-6 lg:col-span-4">
          <!-- Premium Mission Patch: Positioned exactly in the black space ABOVE the card -->
          <div
            v-if="heroMissionPatch"
            class="pointer-events-none z-[20] flex h-40 w-40 items-center justify-center self-end p-2 lg:h-56 lg:w-56"
          >
            <div class="group/patch relative">
              <!-- Glow Effect -->
              <div
                class="bg-primary/30 group-hover/patch:bg-primary/40 absolute inset-0 animate-pulse rounded-full blur-[80px] transition-all duration-1000"
              ></div>
              <img
                :src="heroMissionPatch"
                class="animate-float relative z-10 h-full w-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
                :alt="`Official Mission Patch for ${heroLaunch.name}`"
              />
            </div>
          </div>

          <div
            class="bg-surface-variant/70 border-outline-variant/10 group relative w-full overflow-hidden rounded-lg border p-8 shadow-[0_12px_32px_rgba(0,0,0,0.5)] backdrop-blur-3xl"
          >
            <!-- Mission Patch / Feature Image (Removed from here as it's now in the hero column) -->
            <p class="text-on-surface-variant mb-6 text-xs font-bold uppercase tracking-[0.2em]">
              Environment Status
            </p>
            <div class="space-y-6">
              <div>
                <div class="mb-2 flex items-end justify-between">
                  <span class="text-on-surface-variant text-xs font-medium uppercase tracking-wider"
                    >Rocket Config</span
                  >
                  <span class="text-on-surface ml-4 line-clamp-1 text-right text-lg font-bold">{{
                    heroLaunch.rocket?.configuration?.name || 'Unknown'
                  }}</span>
                </div>
                <div class="bg-surface-container h-1.5 w-full overflow-hidden rounded-full">
                  <div class="bg-secondary h-full w-[85%]"></div>
                </div>
              </div>
              <div class="flex items-center justify-between gap-4 pt-2">
                <span class="text-on-surface-variant text-xs font-medium uppercase tracking-wider"
                  >Pad Target</span
                >
                <span
                  class="text-on-surface line-clamp-1 text-right text-sm font-bold uppercase tracking-widest"
                  >{{ heroLaunch.pad?.name || 'Unknown' }}</span
                >
              </div>
              <div class="flex items-center justify-between pt-2">
                <span class="text-on-surface-variant text-xs font-medium uppercase tracking-wider"
                  >Window Status</span
                >
                <span
                  class="bg-secondary/10 text-secondary rounded px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest"
                >
                  {{ heroLaunch.status?.name || 'TBD' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Launches with Filter -->
      <section class="mt-16 space-y-8 pt-8">
        <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p
              class="text-on-surface-variant font-label mb-2 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Classification: Schedule
            </p>
            <h3 class="text-on-surface font-headline text-3xl font-black uppercase tracking-tight">
              Upcoming Deployments
            </h3>
          </div>
        </div>

        <!-- Mission Carousel -->
        <div class="group/carousel relative">
          <div
            ref="scrollContainer"
            class="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-8"
          >
            <div
              v-for="launch in activeDeployments"
              :key="launch.id"
              class="w-full shrink-0 snap-start md:w-[400px]"
            >
              <LaunchCard :launch="launch" />
            </div>
          </div>

          <!-- Carousel Controls -->
          <button
            class="bg-surface-container/80 border-outline-variant/30 text-on-surface hover:bg-primary hover:text-on-primary absolute left-0 top-1/2 z-20 hidden -translate-x-4 -translate-y-1/2 rounded-full border p-3 opacity-0 backdrop-blur transition-all group-hover/carousel:opacity-100 md:block"
            @click="scrollPrev"
          >
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            class="bg-surface-container/80 border-outline-variant/30 text-on-surface hover:bg-primary hover:text-on-primary absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 translate-x-4 rounded-full border p-3 opacity-0 backdrop-blur transition-all group-hover/carousel:opacity-100 md:block"
            @click="scrollNext"
          >
            <span class="material-symbols-outlined">chevron_right</span>
          </button>

          <!-- Custom scroll indicator -->
          <div class="bg-surface-container mt-4 h-1 w-full overflow-hidden rounded-full opacity-30">
            <div class="bg-primary/50 h-full w-1/4 rounded-full"></div>
          </div>
        </div>

        <!-- View All link -->
        <div class="mt-8 flex justify-center">
          <NuxtLink
            to="/missions"
            class="bg-surface-container-low border-outline-variant/10 hover:border-secondary/30 font-label text-on-surface-variant hover:text-secondary group flex items-center gap-4 rounded-xl border px-8 py-4 text-[10px] font-bold uppercase tracking-[0.4em] transition-all"
          >
            Access Full Archive
            <span
              class="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1"
              >arrow_forward</span
            >
          </NuxtLink>
        </div>
      </section>

      <!-- TODO: Implement News Feed & Archival Logs -->
      <!-- Bottom Dashboard Row: News Feed & Archival Logs -->
      <section class="mt-8 grid grid-cols-1 gap-12 pt-16 lg:grid-cols-12">
        <!-- News Feed -->
        <div class="space-y-8 lg:col-span-7">
          <div>
            <p
              class="text-on-surface-variant font-label mb-2 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Intelligence: Agency Feed
            </p>
            <h3 class="text-on-surface font-headline text-2xl font-black uppercase tracking-tight">
              Global Dispatch
            </h3>
          </div>
          <div class="space-y-8">
            <div class="group flex items-start gap-6">
              <span
                class="text-secondary mt-1 min-w-[70px] text-[0.65rem] font-bold uppercase tracking-widest"
                >04:12 GMT</span
              >
              <div class="space-y-2">
                <h4
                  class="text-on-surface group-hover:text-primary text-sm font-bold tracking-wide transition-colors"
                >
                  Federal space administration approves orbital window.
                </h4>
                <p class="text-on-surface-variant text-xs leading-relaxed">
                  Flight readiness review scheduled for T-minus 24 hours. Weather parameters hold
                  within launch feasibility.
                </p>
              </div>
            </div>
            <div class="group flex items-start gap-6">
              <span
                class="text-on-surface-variant mt-1 min-w-[70px] text-[0.65rem] font-bold uppercase tracking-widest"
                >Yesterday</span
              >
              <div class="space-y-2">
                <h4
                  class="text-on-surface group-hover:text-primary text-sm font-bold tracking-wide transition-colors"
                >
                  Payload integration completed for commercial payload.
                </h4>
                <p class="text-on-surface-variant text-xs leading-relaxed">
                  Structural integrity confirmed through vacuum testing. Standard payload processing
                  proceeds without anomalies.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Archival Insights / Stats -->
        <div
          class="bg-surface-container-low border-outline-variant/10 relative space-y-10 overflow-hidden rounded-xl border p-10 lg:col-span-5"
        >
          <!-- Light bleed on stats card (Artemis Orange) -->
          <div
            class="pointer-events-none absolute -right-10 -top-10 h-[200px] w-[200px] bg-[radial-gradient(ellipse_at_center,rgba(252,61,33,0.08)_0%,transparent_70%)]"
          ></div>
          <div>
            <p
              class="text-on-surface-variant font-label mb-2 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Archive: Global Metrics
            </p>
            <h3 class="text-on-surface font-headline text-2xl font-black uppercase tracking-tight">
              Yearly Logistics
            </h3>
          </div>
          <div class="font-headline grid grid-cols-2 gap-x-12 gap-y-10">
            <div>
              <p class="text-on-surface text-4xl font-black tabular-nums">142</p>
              <p
                class="text-on-surface-variant font-label mt-2 text-[9px] font-black uppercase tracking-widest"
              >
                Global Launches
              </p>
            </div>
            <div>
              <p class="text-secondary text-4xl font-black tabular-nums">98.4%</p>
              <p
                class="text-on-surface-variant font-label mt-2 text-[9px] font-black uppercase tracking-widest"
              >
                Success Rate
              </p>
            </div>
            <div>
              <p class="text-on-surface text-4xl font-black tabular-nums">412.5</p>
              <p
                class="text-on-surface-variant font-label mt-2 text-[9px] font-black uppercase tracking-widest"
              >
                Tons to Orbit
              </p>
            </div>
            <div>
              <p class="text-on-surface text-4xl font-black tabular-nums">12</p>
              <p
                class="text-on-surface-variant font-label mt-2 text-[9px] font-black uppercase tracking-widest"
              >
                Crewed Missions
              </p>
            </div>
          </div>
          <div class="pt-8">
            <p
              class="text-on-surface-variant mb-4 text-[0.65rem] font-bold uppercase tracking-widest"
            >
              Active Payloads by Orbit
            </p>
            <div class="bg-surface-container flex h-3 w-full overflow-hidden rounded-full">
              <div class="bg-secondary h-full" style="width: 65%" title="LEO"></div>
              <div class="bg-secondary/60 h-full" style="width: 20%" title="GEO"></div>
              <div class="bg-secondary/30 h-full" style="width: 10%" title="Deep Space"></div>
              <div class="bg-outline/20 h-full" style="width: 5%" title="Other"></div>
            </div>
            <div
              class="text-on-surface-variant mt-3 flex justify-between text-[0.55rem] font-bold uppercase tracking-widest"
            >
              <span class="flex items-center gap-1.5"
                ><span class="bg-secondary h-1.5 w-1.5 rounded-full"></span> LEO 65%</span
              >
              <span class="flex items-center gap-1.5"
                ><span class="bg-secondary/30 h-1.5 w-1.5 rounded-full"></span> Deep Space 10%</span
              >
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Fallback State: No Upcoming Launches -->
    <div
      v-else-if="!pending"
      class="flex min-h-[70vh] flex-col items-center justify-center space-y-8 p-12 text-center"
    >
      <div class="relative">
        <div class="bg-secondary/5 absolute -inset-12 animate-pulse rounded-full blur-3xl"></div>
        <span
          class="material-symbols-outlined text-secondary relative z-10 text-7xl"
          style="
            font-variation-settings:
              'FILL' 0,
              'wght' 200;
          "
          >satellite_alt</span
        >
      </div>

      <div class="relative z-10 max-w-md space-y-3">
        <h2 class="font-headline text-on-surface text-3xl font-black uppercase tracking-tighter">
          Orbital Standby
        </h2>
        <p
          class="font-label text-on-surface-variant text-[10px] font-bold uppercase leading-relaxed tracking-[0.3em]"
        >
          No immediate deployments detected in the current window. <br />
          Mission control is monitoring deep space frequencies.
        </p>
      </div>

      <NuxtLink
        to="/missions"
        class="bg-surface-container-low border-outline-variant/10 hover:border-primary/50 font-label text-on-surface-variant hover:text-primary group flex items-center gap-4 rounded-xl border px-8 py-4 text-[10px] font-bold uppercase tracking-[0.4em] transition-all"
      >
        Access Archival Logs
        <span
          class="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1"
          >arrow_forward</span
        >
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
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(2deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}
</style>
