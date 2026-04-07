<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import { type OrbitalError, useOrbitalLink } from '~/composables/useOrbitalLink'
import { CACHE_POLICY, UI_CONFIG } from '~/lib/constants'

const { setStatus } = useOrbitalLink()
const route = useRoute()
const missionId = route.params.id

interface Launch {
  agency_launch_attempt_count_year?: number
  id: string
  image?: { image_url: string }
  info_urls?: {
    source?: string
    title?: string
    type?: { name?: string }
    url: string
  }[]
  launch_service_provider?: {
    administrator?: string
    consecutive_successful_launches?: number
    description?: string
    founding_year?: number
    info_url?: string
    logo?: { image_url: string }
    name: string
    pending_launches?: number
    successful_launches?: number
    total_launch_count?: number
    wiki_url?: string
  }
  mission?: {
    description?: string
    orbit?: {
      abbrev?: string
      celestial_body?: {
        atmosphere?: boolean
        description?: string
        gravity?: number
        image?: { image_url: string }
        mass?: number
        name?: string
      }
      name?: string
    }
  }
  mission_patches?: { image_url: string }[]
  name: string
  net: string
  orbital_launch_attempt_count?: number
  pad?: {
    image?: { image_url: string }
    location?: {
      celestial_body?: {
        atmosphere?: boolean
        description?: string
        gravity?: number
        image?: { image_url: string }
        mass?: number
        name?: string
      }
      description?: string
      name?: string
    }
    map_url?: string
    name?: string
  }
  probability?: number
  probability_weather?: number
  program?: { mission_patches?: { image_url: string }[]; name?: string }[]
  rocket?: {
    configuration?: {
      description?: string
      full_name?: string
      geo_capacity?: number
      gto_capacity?: number
      image?: { image_url: string }
      launch_cost?: number
      length?: number
      leo_capacity?: number
      name?: string
      successful_launches?: number
      to_thrust?: number
    }
    launcher_stage?: {
      landing?: { location?: { name?: string }; type?: { name?: string } }
      launcher?: { serial_number?: string }
      launcher_flight_number?: number
      reused?: boolean
    }[]
  }
  status?: { description?: string; name: string }
  updates?: {
    comment?: string
    created_on: string
    id: number
    info_url?: string
    profile_image?: string
  }[]
  vid_urls?: {
    description?: string
    feature_image?: string
    publisher?: string
    title?: string
    type?: { name?: string }
    url: string
  }[]
  window_end: string
  window_start: string
}

const {
  data: missionRaw,
  error: fetchError,
  pending,
  refresh
} = useSecureFetch<{ cachedAt: number; data: Launch }>(`/api/launch/${missionId}`, {
  lazy: true
})

const mission = computed(() => missionRaw.value?.data)
const cachedAt = computed(() => missionRaw.value?.cachedAt)

// Sync status with global link
watch(
  [pending, fetchError],
  () => {
    setStatus(pending.value, fetchError.value as null | OrbitalError, refresh)
  },
  { immediate: true }
)

const getTimeUntil = (dateString: string) => {
  if (!dateString) return { days: '00', hours: '00', minutes: '00', seconds: '00', total: 0 }
  const targetDate = new Date(dateString).getTime()
  const now = new Date().getTime()
  const difference = targetDate - now

  if (difference <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00', total: 0 }

  const daysVal = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hoursVal = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutesVal = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const secondsVal = Math.floor((difference % (1000 * 60)) / 1000)

  return {
    days: String(daysVal).padStart(2, '0'),
    hours: String(hoursVal).padStart(2, '0'),
    minutes: String(minutesVal).padStart(2, '0'),
    seconds: String(secondsVal).padStart(2, '0'),
    total: difference
  }
}

const countdown = ref({ days: '00', hours: '00', minutes: '00', seconds: '00', total: 0 })
let timer: null | ReturnType<typeof setInterval> = null

const isSticky = ref(false)

const handleScroll = () => {
  isSticky.value = window.scrollY > UI_CONFIG.THRESHOLDS.STICKY_HEADER
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  if (mission.value?.net) {
    countdown.value = getTimeUntil(mission.value.net)
    timer = setInterval(() => {
      if (mission.value?.net) {
        countdown.value = getTimeUntil(mission.value.net)
      }
    }, UI_CONFIG.INTERVALS.COUNTDOWN)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (timer) clearInterval(timer)
})

useHead({
  title: computed(() => `Mission Specs | ${mission.value?.name || 'Loading...'}`)
})

const defaultImage = UI_CONFIG.ASSETS.DEFAULT_MISSION_IMAGE
const rocketDefaultImage = UI_CONFIG.ASSETS.DEFAULT_ROCKET_IMAGE

// Advanced Data Parsing
const launcherStage = computed(() => mission.value?.rocket?.launcher_stage?.[0])
const core = computed(() => launcherStage.value?.launcher)
const landing = computed(() => launcherStage.value?.landing)
const missionPatch = computed(() => mission.value?.mission_patches?.[0]?.image_url)
const program = computed(() => mission.value?.program?.[0])

// Robust Celestial Data Source
const celestialBody = computed(() => {
  return mission.value?.mission?.orbit?.celestial_body?.mass
    ? mission.value.mission.orbit.celestial_body
    : mission.value?.pad?.location?.celestial_body
})

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return 'TBD'
  return new Date(dateStr).toLocaleString('en-US', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    timeZoneName: 'short',
    year: 'numeric'
  })
}

const formatCurrency = (value: number | undefined) => {
  if (!value) return 'TBD'
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency'
  }).format(value)
}

const formatNumber = (value: number | string | undefined, unit: string = '') => {
  if (!value) return 'TBD'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return 'TBD'
  return new Intl.NumberFormat('en-US').format(num) + (unit ? ` ${unit}` : '')
}

// Action Helpers
const generateCalendarLink = () => {
  if (!mission.value?.net) return '#'
  const name = encodeURIComponent(`T-minus: ${mission.value.name}`)
  const description = encodeURIComponent(mission.value.mission?.description || '')
  const location = encodeURIComponent(mission.value.pad?.name || '')

  const startDate = new Date(mission.value.net).toISOString().replace(/-|:|\.\d+/g, '')
  const endDate = new Date(new Date(mission.value.net).getTime() + 3600000)
    .toISOString()
    .replace(/-|:|\.\d+/g, '')

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${name}&details=${description}&location=${location}&dates=${startDate}/${endDate}`
}

const shareStatus = ref('COPY LINK')
const isShareMenuOpen = ref(false)

const socialLinks = computed(() => {
  const links = {
    linkedin: '',
    twitter: '',
    whatsapp: ''
  }
  if (!mission.value) return links
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const text = encodeURIComponent(`Tracking the ${mission.value.name} launch on T-minus! 🚀`)

  links.linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  links.twitter = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`
  links.whatsapp = `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(url)}`

  return links
})

const shareMission = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    shareStatus.value = 'COPIED'
    setTimeout(() => {
      shareStatus.value = 'COPY LINK'
      isShareMenuOpen.value = false
    }, 2000)
  })
}

const toggleShareMenu = () => {
  isShareMenuOpen.value = !isShareMenuOpen.value
}

// Structured Data for SEO (Rich Snippets)
const structuredData = computed(() => {
  if (!mission.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    description: mission.value.mission?.description || mission.value.status?.description,
    image: mission.value.image?.image_url || defaultImage,
    location: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: mission.value.pad?.location?.name
      },
      name: mission.value.pad?.name
    },
    name: mission.value.name,
    organizer: {
      '@type': 'Organization',
      logo: mission.value.launch_service_provider?.logo?.image_url,
      name: mission.value.launch_service_provider?.name
    },
    startDate: mission.value.net
  }
})

useHead({
  script: [
    {
      innerHTML: computed(() => JSON.stringify(structuredData.value)),
      type: 'application/ld+json'
    }
  ]
})
</script>

<template>
  <main class="bg-surface min-h-[calc(100vh-64px)] flex-1 overflow-y-auto pb-12">
    <template v-if="mission">
      <!-- Hero Mission Section -->
      <section
        class="bg-surface-container-lowest relative flex h-[680px] items-center overflow-visible px-12"
      >
        <!-- Background Image: Spectacular & Vibrant -->
        <img
          class="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-1000"
          :src="mission.image?.image_url || defaultImage"
          :alt="`Cinematic view of ${mission.name} mission`"
        />
        <div
          class="from-surface via-surface/20 absolute inset-0 bg-gradient-to-r to-transparent"
        ></div>
        <div
          class="from-surface absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
        ></div>

        <!-- Mission Patch: Floating safely below Navigation -->
        <div
          v-if="missionPatch"
          class="pointer-events-none absolute right-12 top-14 z-[110] hidden transition-all duration-1000 lg:block"
        >
          <img
            :src="missionPatch"
            class="animate-float h-52 w-52 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            :alt="`Official Mission Patch for ${mission.name}`"
          />
        </div>

        <div class="relative z-10 grid w-full grid-cols-12 gap-8">
          <div class="col-span-12 lg:col-span-7">
            <!-- Badges & Context -->
            <div
              class="font-label mb-6 flex flex-wrap items-center gap-3 text-[9px] font-black uppercase tracking-widest"
            >
              <span
                class="bg-secondary text-on-secondary shadow-secondary/20 rounded-full px-3 py-1 shadow-lg"
                >{{ mission.status?.name || 'ACTIVE' }}</span
              >
              <span
                v-if="program"
                class="bg-primary/80 text-on-primary border-primary/30 shadow-primary/20 rounded-full border px-3 py-1 shadow-lg backdrop-blur-md"
                >{{ program.name }}</span
              >
              <span
                v-if="mission.probability"
                class="bg-surface/60 text-on-surface border-outline-variant/30 rounded-full border px-3 py-1 backdrop-blur-sm"
                >WX PROB: {{ mission.probability }}%</span
              >
              <span
                class="text-on-surface bg-surface/40 rounded-full px-3 py-1 font-bold backdrop-blur-sm"
                >NODE_ID: {{ mission.id?.slice(0, 8).toUpperCase() }}</span
              >

              <!-- Telemetry Link -->
              <TelemetryStatus
                v-if="cachedAt"
                :cached-at="cachedAt"
                :max-age="CACHE_POLICY.MAX_AGE.DETAIL"
                label="Orbital Sync"
                class="ml-2"
              />
            </div>

            <h1
              class="font-headline text-on-surface group mb-4 text-6xl font-black uppercase leading-[0.85] tracking-tighter drop-shadow-2xl lg:text-8xl"
            >
              {{ mission.name.split('|')[0] }}<br />
              <span class="mission-text-stroke border-primary line-clamp-1">{{
                mission.name.split('|')[1] || mission.name
              }}</span>
            </h1>

            <p
              class="text-on-surface-variant font-body mb-10 line-clamp-3 max-w-xl text-lg font-light tracking-wide"
            >
              {{
                mission.mission?.description ||
                mission.status?.description ||
                'No mission description available.'
              }}
            </p>

            <div
              class="font-label flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest"
            >
              <a
                v-if="mission?.vid_urls?.length"
                :href="mission.vid_urls[0]?.url"
                target="_blank"
                class="bg-primary text-on-primary shadow-primary/20 flex cursor-pointer items-center gap-3 rounded-lg px-8 py-4 shadow-xl transition-all active:scale-95"
              >
                <span
                  class="material-symbols-outlined text-lg"
                  style="font-variation-settings: 'FILL' 1"
                  >play_circle</span
                >
                LIVE STREAM
              </a>
              <a
                :href="generateCalendarLink()"
                target="_blank"
                class="bg-surface-variant/20 hover:bg-surface-variant/40 border-outline-variant/20 text-on-surface flex items-center gap-3 rounded-lg border px-8 py-4 transition-colors active:scale-95"
              >
                <span class="material-symbols-outlined text-lg">calendar_add_on</span>
                ADD TO CALENDAR
              </a>
              <div class="relative">
                <button
                  class="bg-surface-variant/10 hover:bg-surface-variant/30 border-outline-variant/10 text-on-surface-variant hover:text-on-surface group flex items-center gap-2 rounded-lg border px-8 py-4 transition-all active:scale-95"
                  @click="toggleShareMenu"
                >
                  <span
                    class="material-symbols-outlined text-lg transition-transform group-hover:rotate-12"
                    >share</span
                  >
                  <span class="uppercase">Share</span>
                </button>

                <!-- Social Share HUD Popover -->
                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="transform scale-95 opacity-0 -translate-y-2"
                  enter-to-class="transform scale-100 opacity-100 translate-y-0"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="transform scale-100 opacity-100 translate-y-0"
                  leave-to-class="transform scale-95 opacity-0 -translate-y-2"
                >
                  <div
                    v-if="isShareMenuOpen"
                    class="bg-surface/90 border-outline-variant/20 absolute bottom-full left-0 z-[120] mb-4 w-56 rounded-xl border p-2 shadow-2xl backdrop-blur-2xl"
                  >
                    <div class="space-y-1">
                      <a
                        :href="socialLinks.twitter"
                        target="_blank"
                        class="hover:bg-surface-variant/20 group flex items-center gap-3 rounded-lg px-4 py-3 transition-colors"
                      >
                        <span
                          class="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-lg"
                          >rocket_launch</span
                        >
                        <span
                          class="text-on-surface text-[10px] font-black uppercase tracking-widest"
                          >Share on X</span
                        >
                      </a>
                      <a
                        :href="socialLinks.linkedin"
                        target="_blank"
                        class="hover:bg-surface-variant/20 group flex items-center gap-3 rounded-lg px-4 py-3 transition-colors"
                      >
                        <span
                          class="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-lg"
                          >groups_2</span
                        >
                        <span
                          class="text-on-surface text-[10px] font-black uppercase tracking-widest"
                          >LinkedIn</span
                        >
                      </a>
                      <a
                        :href="socialLinks.whatsapp"
                        target="_blank"
                        class="hover:bg-surface-variant/20 group flex items-center gap-3 rounded-lg px-4 py-3 transition-colors"
                      >
                        <span
                          class="material-symbols-outlined text-on-surface-variant text-lg group-hover:text-[#25D366]"
                          >chat</span
                        >
                        <span
                          class="text-on-surface text-[10px] font-black uppercase tracking-widest"
                          >WhatsApp</span
                        >
                      </a>
                      <div class="bg-outline-variant/10 mx-2 my-1 h-px"></div>
                      <button
                        class="hover:bg-surface-variant/20 group flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors"
                        @click="shareMission"
                      >
                        <span
                          class="material-symbols-outlined text-on-surface-variant group-hover:text-secondary text-lg"
                          >content_copy</span
                        >
                        <span
                          class="text-on-surface text-[10px] font-black uppercase tracking-widest"
                          >{{ shareStatus }}</span
                        >
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <!-- Countdown & Critical Window -->
          <div class="relative col-span-12 flex flex-col justify-center lg:col-span-5">
            <div
              class="bg-surface-variant/10 border-outline-variant/10 relative overflow-hidden rounded-xl border p-8 shadow-2xl backdrop-blur-xl"
            >
              <!-- Glow corner -->
              <div class="bg-secondary/10 absolute -right-10 -top-10 h-32 w-32 blur-3xl"></div>

              <p
                class="text-on-surface-variant font-label mb-6 text-center text-[9px] font-black uppercase tracking-[0.4em]"
              >
                T-MINUS TO IGNITION
              </p>

              <div
                v-if="countdown.total > 0"
                class="font-headline mb-8 flex items-baseline justify-between gap-2 tabular-nums"
              >
                <div class="text-center">
                  <div class="text-on-surface text-4xl font-black">{{ countdown.days }}</div>
                  <div class="text-secondary font-label mt-2 text-[9px] font-black uppercase">
                    Days
                  </div>
                </div>
                <div class="text-outline-variant/30 text-3xl font-black leading-none">:</div>
                <div class="text-center">
                  <div class="text-on-surface text-4xl font-black">{{ countdown.hours }}</div>
                  <div class="text-secondary font-label mt-2 text-[9px] font-black uppercase">
                    Hrs
                  </div>
                </div>
                <div class="text-outline-variant/30 text-3xl font-black leading-none">:</div>
                <div class="text-center">
                  <div class="text-on-surface text-4xl font-black">{{ countdown.minutes }}</div>
                  <div class="text-secondary font-label mt-2 text-[9px] font-black uppercase">
                    Min
                  </div>
                </div>
                <div class="text-outline-variant/30 text-3xl font-black leading-none">:</div>
                <div class="text-center">
                  <div class="text-secondary text-4xl font-black">{{ countdown.seconds }}</div>
                  <div class="text-secondary font-label mt-2 text-[9px] font-black uppercase">
                    Sec
                  </div>
                </div>
              </div>
              <div v-else class="mb-8 py-4 text-center">
                <h3 class="font-headline text-on-surface text-3xl font-black uppercase">
                  LIFT OFF
                </h3>
              </div>

              <div class="space-y-4">
                <div
                  class="text-on-surface-variant font-label flex justify-between text-[8px] font-black uppercase tracking-widest"
                >
                  <span>Launch Window Start</span>
                  <span>{{ formatDate(mission.window_start) }}</span>
                </div>
                <div class="bg-surface-container-highest h-1 w-full overflow-hidden rounded-full">
                  <div
                    class="bg-secondary h-full animate-pulse shadow-[0_0_10px_rgba(252,61,33,0.5)]"
                    style="width: 100%"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Technical Dossier Grid -->
      <section class="space-y-12 p-4 md:p-12">
        <!-- Main Technical Bento -->
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <!-- Booster & Reusability Card -->
          <div
            class="bg-surface-container-low border-outline-variant/10 group relative flex flex-col overflow-hidden rounded-xl border p-8 lg:col-span-4"
          >
            <div
              class="absolute -bottom-4 -right-4 opacity-5 transition-transform duration-700 group-hover:rotate-12"
            >
              <span class="material-symbols-outlined text-9xl">autorenew</span>
            </div>

            <p
              class="text-secondary font-label mb-1 text-[10px] font-black uppercase tracking-widest"
            >
              Booster Telemetry
            </p>
            <h3
              class="font-headline text-on-surface mb-8 text-2xl font-black uppercase tracking-tight"
            >
              Stage 01 Recovery
            </h3>

            <div class="flex-1 space-y-6">
              <div
                class="border-outline-variant/10 flex items-center justify-between border-b py-4"
              >
                <span
                  class="text-on-surface-variant font-label text-xs font-bold uppercase tracking-widest"
                  >SerialNumber</span
                >
                <span class="text-on-surface text-sm font-black">{{
                  core?.serial_number || 'TBD'
                }}</span>
              </div>
              <div
                class="border-outline-variant/10 flex items-center justify-between border-b py-4"
              >
                <span
                  class="text-on-surface-variant font-label text-xs font-bold uppercase tracking-widest"
                  >Flight Count</span
                >
                <div class="flex items-center gap-2">
                  <span class="text-on-surface text-sm font-black">{{
                    launcherStage?.reused
                      ? launcherStage.launcher_flight_number + 'th Flight'
                      : 'Maiden Flight'
                  }}</span>
                  <span
                    v-if="launcherStage?.reused"
                    class="bg-primary/20 text-primary rounded px-2 py-0.5 text-[8px] font-black"
                    >FLIGHT PROVEN</span
                  >
                </div>
              </div>
              <div
                class="border-outline-variant/10 flex items-center justify-between border-b py-4"
              >
                <span
                  class="text-on-surface-variant font-label text-xs font-bold uppercase tracking-widest"
                  >Landing Target</span
                >
                <span
                  class="text-secondary ml-4 line-clamp-1 text-right text-sm font-black uppercase"
                  >{{ landing?.location?.name || 'Ocean Splashdown' }}</span
                >
              </div>
              <div class="border-outline-variant/10 border-b pb-4 pt-4">
                <p
                  class="text-on-surface-variant font-label mb-2 text-[9px] font-black uppercase tracking-widest"
                >
                  Recovery Method
                </p>
                <p class="text-on-surface font-body text-xs leading-relaxed">
                  {{ landing?.type?.name || 'Direct recovery or non-reusable profile.' }}
                </p>
              </div>
              <!-- Added Target Orbit context -->
              <div class="pt-4">
                <p
                  class="text-secondary font-label mb-2 text-[9px] font-black uppercase tracking-widest"
                >
                  Orbital Destination
                </p>
                <p class="text-on-surface text-sm font-black uppercase">
                  {{ mission.mission?.orbit?.name || 'Unknown Orbit' }}
                </p>
                <p class="text-on-surface-variant mt-1 text-[8px] font-bold uppercase">
                  {{ mission.mission?.orbit?.abbrev }} Profile
                </p>
              </div>
            </div>
          </div>

          <!-- Configuration & Diagram -->
          <div
            class="bg-surface-container-low border-outline-variant/10 group flex flex-col gap-12 rounded-xl border p-8 md:flex-row lg:col-span-8"
          >
            <div class="flex w-full flex-col md:w-1/3">
              <p
                class="text-secondary font-label mb-1 text-[10px] font-black uppercase tracking-widest"
              >
                Vehicle Configuration
              </p>
              <h3
                class="font-headline text-on-surface mb-8 text-2xl font-black uppercase tracking-tight"
              >
                {{ mission.rocket?.configuration?.full_name }}
              </h3>
              <div class="flex flex-1 items-center justify-center p-4">
                <img
                  class="h-[380px] object-contain brightness-125 grayscale transition-all duration-1000 group-hover:brightness-100"
                  :src="mission.rocket?.configuration?.image?.image_url || rocketDefaultImage"
                />
              </div>
            </div>
            <div class="flex w-full flex-col space-y-10 pt-4 md:w-2/3">
              <div class="grid grid-cols-2 gap-6">
                <div class="bg-surface-container border-outline-variant/10 rounded-lg border p-6">
                  <p
                    class="text-on-surface-variant font-label mb-2 text-[9px] font-black uppercase tracking-widest"
                  >
                    Orbital Attempt
                  </p>
                  <p class="text-primary font-headline text-3xl font-black tabular-nums">
                    #{{ mission.orbital_launch_attempt_count }}
                  </p>
                  <p class="text-on-surface-variant/60 mt-1 text-[8px] font-black uppercase">
                    Global History Total
                  </p>
                </div>
                <div class="bg-surface-container border-outline-variant/10 rounded-lg border p-6">
                  <p
                    class="text-on-surface-variant font-label mb-2 text-[9px] font-black uppercase tracking-widest"
                  >
                    Agency YTD
                  </p>
                  <p class="text-primary font-headline text-3xl font-black tabular-nums">
                    {{ mission.agency_launch_attempt_count_year }}
                  </p>
                  <p class="text-on-surface-variant/60 mt-1 text-[8px] font-black uppercase">
                    Attemps in {{ new Date().getFullYear() }}
                  </p>
                </div>
              </div>

              <div class="space-y-6">
                <div class="border-primary/30 border-l-2 py-1 pl-6">
                  <h4
                    class="text-on-surface-variant font-label mb-2 text-[10px] font-black uppercase tracking-widest"
                  >
                    Configuration Details
                  </h4>
                  <p class="font-body text-on-surface line-clamp-4 text-sm leading-relaxed">
                    {{
                      mission.rocket?.configuration?.description ||
                      'No detailed vehicle description available.'
                    }}
                  </p>
                </div>

                <!-- Added Capacity Specs -->
                <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div
                    v-for="cap in [
                      {
                        l: 'LEO CAP',
                        v: formatNumber(mission.rocket?.configuration?.leo_capacity, 'kg')
                      },
                      {
                        l: 'GTO CAP',
                        v: formatNumber(mission.rocket?.configuration?.gto_capacity, 'kg')
                      },
                      {
                        l: 'GEO CAP',
                        v: formatNumber(mission.rocket?.configuration?.geo_capacity, 'kg')
                      },
                      { l: 'HEIGHT', v: formatNumber(mission.rocket?.configuration?.length, 'm') }
                    ]"
                    :key="cap.l"
                    class="bg-surface-container/50 border-outline-variant/10 rounded-lg border p-4 text-center"
                  >
                    <p class="text-on-surface text-xs font-black uppercase">{{ cap.v }}</p>
                    <p class="text-on-surface-variant mt-1 text-[7px] font-black uppercase">
                      {{ cap.l }}
                    </p>
                  </div>
                </div>

                <div class="bg-surface-container/30 border-outline-variant/5 rounded-xl border p-6">
                  <div class="mb-6 flex items-center justify-between">
                    <p
                      class="text-on-surface font-label text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                      Systems Health
                    </p>
                    <span class="text-[9px] font-black text-[#00FF41]">NOMINAL STATUS</span>
                  </div>
                  <div class="grid grid-cols-3 gap-8">
                    <div
                      v-for="stat in [
                        {
                          l: 'Max Thrust',
                          v: formatNumber(mission.rocket?.configuration?.to_thrust, 'kN'),
                          u: 'UNIT'
                        },
                        {
                          l: 'Launch Cost',
                          v: formatCurrency(mission.rocket?.configuration?.launch_cost),
                          u: 'USD'
                        },
                        {
                          l: 'Success MSN',
                          v: mission.rocket?.configuration?.successful_launches,
                          u: 'LOG'
                        }
                      ]"
                      :key="stat.l"
                      class="text-center"
                    >
                      <p class="text-on-surface font-headline mb-1 text-xl font-black tabular-nums">
                        {{ stat.v }}
                      </p>
                      <p
                        class="text-on-surface-variant font-label text-[8px] font-black uppercase tracking-widest"
                      >
                        {{ stat.l }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Updates Timeline & Provider -->
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <!-- Launch Updates Feed -->
          <div
            class="bg-surface-container-low border-outline-variant/10 rounded-xl border p-8 lg:col-span-8"
          >
            <div class="mb-10 flex items-center justify-between">
              <div>
                <p
                  class="text-secondary font-label mb-1 text-[10px] font-black uppercase tracking-widest"
                >
                  Intelligence Feed
                </p>
                <h3
                  class="font-headline text-on-surface text-2xl font-black uppercase tracking-tight"
                >
                  Mission Updates
                </h3>
              </div>
              <div class="flex animate-pulse items-center gap-2">
                <span class="bg-secondary h-2 w-2 rounded-full"></span>
                <span class="text-secondary text-[9px] font-black tracking-widest"
                  >LIVE DATA SYNC</span
                >
              </div>
            </div>

            <div class="space-y-12">
              <div
                v-for="update in mission.updates?.slice(0, 3) || []"
                :key="update.id"
                class="group flex gap-8"
              >
                <div class="flex flex-col items-center">
                  <div
                    v-if="update.profile_image"
                    class="border-outline-variant/20 mb-2 h-8 w-8 overflow-hidden rounded-full border"
                  >
                    <img :src="update.profile_image" class="h-full w-full object-cover" />
                  </div>
                  <div
                    v-else
                    class="bg-primary mt-1 h-1.5 w-1.5 rounded-full shadow-[0_0_8px_#0B3D91]"
                  ></div>
                  <div class="bg-outline-variant/20 my-2 w-px flex-1"></div>
                </div>
                <div class="pb-1">
                  <p
                    class="text-secondary font-label mb-2 text-[9px] font-black uppercase tracking-widest"
                  >
                    {{ formatDate(update.created_on) }}
                  </p>
                  <p class="text-on-surface mb-2 text-sm font-bold leading-snug">
                    {{ update.comment }}
                  </p>
                  <p class="text-on-surface-variant font-body text-xs">
                    Source:
                    <span class="text-primary">{{
                      update.info_url ? update.info_url.split('/')[2] : 'Ground Control'
                    }}</span>
                  </p>
                </div>
              </div>
              <div
                v-if="!mission.updates?.length"
                class="border-outline-variant/10 rounded-xl border-2 border-dashed py-12 text-center"
              >
                <span class="material-symbols-outlined text-outline-variant/20 mb-4 text-4xl"
                  >analytics</span
                >
                <p class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">
                  No critical status updates reported yet.
                </p>
              </div>
            </div>
          </div>

          <!-- Provider Quick Stats -->
          <div
            class="bg-surface-container-low border-outline-variant/10 flex flex-col rounded-xl border p-8 lg:col-span-4"
          >
            <p
              class="text-secondary font-label mb-1 text-[10px] font-black uppercase tracking-widest"
            >
              Agency Profile
            </p>
            <h3
              class="font-headline text-on-surface mb-8 text-xl font-black uppercase tracking-tight"
            >
              {{ mission.launch_service_provider?.name }}
            </h3>

            <div class="mb-8 flex flex-1 items-center justify-center">
              <img
                v-if="mission.launch_service_provider?.logo"
                :src="mission.launch_service_provider.logo.image_url"
                class="max-h-24 object-contain grayscale transition-all hover:grayscale-0"
              />
            </div>

            <div class="border-outline-variant/10 space-y-4 border-t pt-4">
              <div class="flex items-center justify-between">
                <span class="text-on-surface-variant font-label text-[9px] font-black uppercase"
                  >Total Missions</span
                >
                <span class="text-on-surface text-sm font-black tabular-nums">{{
                  mission.launch_service_provider?.total_launch_count
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-on-surface-variant font-label text-[9px] font-black uppercase"
                  >Established</span
                >
                <span class="text-on-surface text-sm font-black tabular-nums">{{
                  mission.launch_service_provider?.founding_year || 'N/A'
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Agency, Location & Celestial Data -->
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <!-- Expanded Agency Knowledge Base -->
          <div
            class="bg-surface-container-low border-outline-variant/10 rounded-xl border p-8 lg:col-span-8"
          >
            <div class="mb-8 flex items-center justify-between">
              <div>
                <p
                  class="text-secondary font-label mb-1 text-[10px] font-black uppercase tracking-widest"
                >
                  Agency Knowledge Base
                </p>
                <h3
                  class="font-headline text-on-surface text-2xl font-black uppercase tracking-tight"
                >
                  {{ mission.launch_service_provider?.name }}
                </h3>
              </div>
              <img
                v-if="mission.launch_service_provider?.logo"
                :src="mission.launch_service_provider.logo.image_url"
                class="h-12 object-contain opacity-50 grayscale"
              />
            </div>

            <div class="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div class="space-y-6">
                <p class="font-body text-on-surface-variant text-sm leading-relaxed">
                  {{ mission.launch_service_provider?.description }}
                </p>
                <div class="flex flex-wrap gap-4 pt-4">
                  <a
                    v-if="mission.launch_service_provider?.info_url"
                    :href="mission.launch_service_provider.info_url"
                    target="_blank"
                    class="text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:underline"
                  >
                    OFFICIAL SITE <span class="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                  <a
                    v-if="mission.launch_service_provider?.wiki_url"
                    :href="mission.launch_service_provider.wiki_url"
                    target="_blank"
                    class="text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:underline"
                  >
                    WIKIPEDIA <span class="material-symbols-outlined text-xs">library_books</span>
                  </a>
                </div>
              </div>

              <div
                class="bg-surface-container/30 border-outline-variant/5 space-y-6 rounded-xl border p-6"
              >
                <h4
                  class="text-on-surface font-label text-[10px] font-black uppercase tracking-[0.2em]"
                >
                  Operational Record
                </h4>
                <div class="space-y-4">
                  <div
                    v-for="rec in [
                      {
                        l: 'Successful Missions',
                        v: mission.launch_service_provider?.successful_launches,
                        c: 'text-primary'
                      },
                      {
                        l: 'Consecutive Success',
                        v: mission.launch_service_provider?.consecutive_successful_launches,
                        c: 'text-[#00FF41]'
                      },
                      {
                        l: 'Pending Operations',
                        v: mission.launch_service_provider?.pending_launches,
                        c: 'text-on-surface'
                      }
                    ]"
                    :key="rec.l"
                    class="border-outline-variant/10 flex items-center justify-between border-b pb-2"
                  >
                    <span
                      class="text-on-surface-variant font-label text-[9px] font-bold uppercase"
                      >{{ rec.l }}</span
                    >
                    <span class="text-lg font-black tabular-nums" :class="rec.c">{{ rec.v }}</span>
                  </div>
                </div>
                <div class="pt-2">
                  <p
                    class="text-on-surface-variant font-label mb-1 text-[9px] font-black uppercase"
                  >
                    Leadership
                  </p>
                  <p class="text-on-surface text-xs font-bold">
                    {{ mission.launch_service_provider?.administrator || 'Classified' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Celestial & Environmental Data -->
          <div class="flex flex-col gap-8 lg:col-span-4">
            <!-- Celestial Body: Academic Context -->
            <div
              v-if="celestialBody"
              class="bg-surface-container-low border-outline-variant/10 group relative flex-1 overflow-hidden rounded-xl border p-8"
            >
              <div
                class="bg-primary/5 group-hover:bg-primary/10 absolute -right-10 -top-10 h-48 w-48 rounded-full blur-3xl transition-colors"
              ></div>

              <p
                class="text-secondary font-label mb-4 text-[10px] font-black uppercase tracking-widest"
              >
                Celestial Mechanics
              </p>
              <div class="mb-6 flex items-center gap-4">
                <img
                  v-if="celestialBody.image?.image_url"
                  :src="celestialBody.image.image_url"
                  class="animate-float h-16 w-16 rounded-full object-cover shadow-2xl"
                />
                <div>
                  <h3
                    class="font-headline text-on-surface text-xl font-black uppercase tracking-tight"
                  >
                    {{ celestialBody.name }}
                  </h3>
                  <p class="text-on-surface-variant font-label text-[9px] font-bold uppercase">
                    Target Gravitational Well
                  </p>
                </div>
              </div>

              <div class="font-label space-y-4 text-[10px]">
                <div class="border-outline-variant/10 flex justify-between border-b pb-2">
                  <span class="text-on-surface-variant uppercase">Mass Index</span>
                  <span v-if="celestialBody.mass" class="text-on-surface font-black"
                    >{{ celestialBody.mass.toExponential(2) }} kg</span
                  >
                  <span v-else class="text-on-surface font-black">TBD</span>
                </div>
                <div class="border-outline-variant/10 flex justify-between border-b pb-2">
                  <span class="text-on-surface-variant uppercase">Gravitational Pull</span>
                  <span v-if="celestialBody.gravity" class="text-on-surface font-black"
                    >{{ celestialBody.gravity }} m/s²</span
                  >
                  <span v-else class="text-on-surface font-black">TBD</span>
                </div>
                <div class="border-outline-variant/10 flex justify-between border-b pb-2">
                  <span class="text-on-surface-variant uppercase">Atmosphere</span>
                  <span class="text-on-surface font-black uppercase">{{
                    celestialBody.atmosphere ? 'DETECTED' : 'VACUUM'
                  }}</span>
                </div>
              </div>

              <p
                class="text-on-surface-variant font-body mt-6 line-clamp-3 text-[10px] leading-relaxed opacity-60"
              >
                {{ celestialBody.description }}
              </p>
            </div>

            <!-- Operational Site Map -->
            <div
              class="bg-surface-container-low border-outline-variant/10 group rounded-xl border p-8"
            >
              <div class="mb-6 flex items-center justify-between">
                <div>
                  <p
                    class="text-on-surface-variant font-label text-[10px] font-black uppercase tracking-widest"
                  >
                    Ground Segment
                  </p>
                  <p class="font-body text-on-surface text-xs font-bold uppercase">
                    {{ mission.pad?.name }}
                  </p>
                </div>
                <a
                  v-if="mission.pad?.map_url"
                  :href="mission.pad.map_url"
                  target="_blank"
                  class="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary flex h-10 w-10 items-center justify-center rounded-lg transition-all"
                >
                  <span class="material-symbols-outlined">map</span>
                </a>
              </div>
              <div
                class="bg-surface-container relative mb-4 aspect-video overflow-hidden rounded-lg"
              >
                <img
                  v-if="mission.pad?.image?.image_url"
                  :src="mission.pad.image.image_url"
                  class="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0"
                />
                <div class="from-surface/80 absolute inset-0 bg-gradient-to-t to-transparent"></div>
                <div class="absolute bottom-3 left-3 flex items-center gap-2">
                  <span class="material-symbols-outlined text-secondary text-sm">location_on</span>
                  <span class="text-[8px] font-black uppercase tracking-widest text-white">{{
                    mission.pad?.location?.name
                  }}</span>
                </div>
              </div>
              <p class="text-on-surface-variant font-body line-clamp-2 text-[9px] leading-relaxed">
                {{ mission.pad?.location?.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Multimedia Coverage Hub -->
        <div
          v-if="mission.vid_urls?.length || mission.info_urls?.length"
          class="bg-surface-container-low border-outline-variant/10 rounded-xl border p-8"
        >
          <div class="mb-8 flex items-center gap-4">
            <span class="material-symbols-outlined text-secondary text-3xl">broadcast_on_home</span>
            <div>
              <p
                class="text-secondary font-label mb-1 text-[10px] font-black uppercase tracking-widest"
              >
                Multimedia Coverage
              </p>
              <h3
                class="font-headline text-on-surface text-2xl font-black uppercase tracking-tight"
              >
                Mission Broadcasts & Resources
              </h3>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="vid in mission.vid_urls"
              :key="vid.url"
              class="bg-surface-container/50 border-outline-variant/10 group flex flex-col rounded-xl border p-6"
            >
              <div
                class="bg-surface-container relative mb-4 aspect-video overflow-hidden rounded-lg"
              >
                <img
                  v-if="vid.feature_image"
                  :src="vid.feature_image"
                  class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <span class="material-symbols-outlined text-5xl text-white">play_circle</span>
                </div>
                <span
                  v-if="vid.type?.name"
                  class="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white"
                  >{{ vid.type.name }}</span
                >
              </div>
              <h4 class="text-on-surface mb-2 line-clamp-1 text-sm font-black uppercase">
                {{ vid.title }}
              </h4>
              <p
                class="text-on-surface-variant font-body mb-6 line-clamp-3 text-[10px] leading-relaxed"
              >
                {{ vid.description }}
              </p>
              <div class="mt-auto flex items-center justify-between">
                <span class="text-secondary text-[8px] font-black uppercase tracking-widest">{{
                  vid.publisher
                }}</span>
                <a
                  :href="vid.url"
                  target="_blank"
                  class="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary rounded-lg p-2 transition-all"
                >
                  <span class="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>

            <!-- Info Links as smaller cards -->
            <div
              v-for="info in mission.info_urls"
              :key="info.url"
              class="bg-surface-container/50 border-outline-variant/10 group flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-all hover:border-solid"
            >
              <span
                class="material-symbols-outlined text-primary mb-4 text-3xl transition-transform group-hover:rotate-12"
                >article</span
              >
              <h4 class="text-on-surface mb-1 text-xs font-black uppercase">
                {{ info.title || info.source }}
              </h4>
              <p
                class="text-on-surface-variant font-label mb-4 text-[8px] uppercase tracking-widest"
              >
                {{ info.type?.name || 'External Resource' }}
              </p>
              <a
                :href="info.url"
                target="_blank"
                class="bg-surface-container text-on-surface-variant hover:bg-primary hover:text-on-primary w-full rounded-lg py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all"
              >
                ACCESS DOCUMENT
              </a>
            </div>
          </div>
        </div>
      </section>
      <!-- Sticky Information Bar (Dashboard HUD) -->
      <nav
        class="bg-surface/95 border-outline-variant/10 fixed left-0 top-20 z-[90] flex h-16 w-full transform items-center justify-between border-b px-12 backdrop-blur-2xl transition-all duration-500 ease-in-out"
        :class="
          isSticky
            ? 'translate-y-0 opacity-100 shadow-xl'
            : 'pointer-events-none -translate-y-full opacity-0'
        "
      >
        <div class="flex items-center gap-6">
          <!-- Mini Mission Patch -->
          <img
            v-if="missionPatch"
            :src="missionPatch"
            class="h-10 w-10 object-contain drop-shadow-md"
          />

          <div class="flex flex-col">
            <h1
              class="font-headline text-on-surface text-lg font-black uppercase leading-none tracking-tighter"
            >
              {{ mission.name.split('|')[0] }}
            </h1>
            <p class="mission-text-stroke text-[9px] font-black uppercase tracking-widest">
              {{ mission.name.split('|')[1] || 'Primary Operation' }}
            </p>
          </div>
        </div>

        <div
          class="font-label flex items-center gap-12 text-[9px] font-black uppercase tracking-[0.2em]"
        >
          <div class="flex items-center gap-6 tabular-nums">
            <div class="flex items-center gap-1.5">
              <span class="text-on-surface">{{ countdown.days }}</span>
              <span class="text-secondary opacity-60">DAYS</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-on-surface">{{ countdown.hours }}</span>
              <span class="text-secondary opacity-60">HRS</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-on-surface">{{ countdown.minutes }}</span>
              <span class="text-secondary opacity-60">MIN</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-secondary drop-shadow-[0_0_8px_rgba(252,61,33,0.5)]">{{
                countdown.seconds
              }}</span>
              <span class="text-secondary opacity-60">SEC</span>
            </div>
          </div>

          <div class="border-outline-variant/20 hidden items-center gap-3 border-l pl-12 md:flex">
            <span class="bg-secondary h-2 w-2 animate-pulse rounded-full"></span>
            <span class="text-on-surface-variant font-black">Live Telemetry</span>
          </div>
        </div>
      </nav>
    </template>
  </main>
</template>

<style scoped>
.mission-text-stroke {
  color: transparent;
  -webkit-text-stroke: 1.5px #0b3d91;
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
  animation: float 6s ease-in-out infinite;
}
</style>
