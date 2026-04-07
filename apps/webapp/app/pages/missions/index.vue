<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useOrbitalLink } from '~/composables/useOrbitalLink'
import { CACHE_POLICY } from '~/lib/constants'

const { setStatus } = useOrbitalLink()

// SEO Meta Data
useSeoMeta({
  description: 'Explora el archivo completo de misiones espaciales próximas y recientes.',
  ogTitle: 'Missions Archive - T-minus',
  title: 'Missions Archive - T-minus'
})

interface Launch {
  id: string
  image?: { image_url: string }
  launch_service_provider?: { logo?: { image_url: string }; name: string }
  name: string
  net: string
  pad?: { name: string }
  program?: { mission_patches?: { image_url: string }[] }[]
  rocket?: { configuration?: { name: string } }
  status?: { name: string }
}

interface MissionsResponse {
  cachedAt: number
  data: {
    count: number
    next: null | string
    previous: null | string
    results: Launch[]
  }
}

// Pagination State
const limit = ref(12)
const offset = ref(0)

// Fetch data from Nitro backend with reactive query parameters and lazy loading
const route = useRoute()
const selectedAgency = ref(
  (route.query.lsp__name as string) || (route.query.lsp__id ? 'Others' : '')
)
const queryParams = computed(() => {
  const q: Record<string, number | string> = {
    limit: limit.value,
    offset: offset.value
  }

  if (selectedAgency.value === 'Others') {
    // Other major agencies: Roscosmos (63), JAXA (37), ISRO (31), CASC (17), Blue Origin (141), Rocket Lab (147), ULA (124), etc.
    q.lsp__id = '63,37,31,17,141,147,124'
  } else if (selectedAgency.value !== '') {
    q.lsp__abbrev = selectedAgency.value
  }

  return q
})

const {
  data: missionsRaw,
  error,
  pending,
  refresh
} = useSecureFetch<MissionsResponse>('/api/missions-archive', {
  lazy: true,
  query: queryParams,
  watch: [offset, selectedAgency] // Re-fetch when offset or filter changes
})

const missions = computed(() => missionsRaw.value?.data)
const cachedAt = computed(() => missionsRaw.value?.cachedAt)

// Sync status with global link
watch(
  [pending, error],
  () => {
    setStatus(pending.value, error.value, refresh)
  },
  { immediate: true }
)

// Page Actions
const setAgency = (agency: string) => {
  selectedAgency.value = agency
  offset.value = 0 // Reset pagination
}

const searchQuery = ref('')

// Filter on the current page's results
const filteredMissions = computed(() => {
  if (!missions.value?.results) return []
  if (!searchQuery.value) return missions.value.results

  const query = searchQuery.value.toLowerCase()
  return missions.value.results.filter(
    (m: Launch) =>
      m.name?.toLowerCase().includes(query) ||
      m.launch_service_provider?.name?.toLowerCase().includes(query) ||
      m.rocket?.configuration?.name?.toLowerCase().includes(query)
  )
})

// Pagination Handlers
const totalRecords = computed(() => missions.value?.count || 0)
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value))
const currentPage = computed(() => Math.floor(offset.value / limit.value) + 1)

const nextPage = () => {
  if (offset.value + limit.value < totalRecords.value) {
    offset.value += limit.value
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }
}

const prevPage = () => {
  if (offset.value > 0) {
    offset.value = Math.max(0, offset.value - limit.value)
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }
}

const padZero = (num: number) => num.toString().padStart(2, '0')
</script>

<template>
  <div class="space-y-12 p-4 md:p-8 lg:p-12">
    <!-- Header Section -->
    <header class="border-outline-variant/10 relative space-y-6 overflow-hidden border-b pb-12">
      <!-- Background Glow -->
      <div
        class="pointer-events-none absolute -left-10 -top-10 h-[300px] w-[400px] bg-[radial-gradient(ellipse_at_center,rgba(252,61,33,0.05)_0%,transparent_70%)]"
      ></div>

      <div class="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p
            class="text-secondary font-label mb-2 animate-pulse text-[10px] font-black uppercase tracking-[0.2em]"
          >
            Terminal Access: Database Query
          </p>
          <h1
            class="text-on-surface font-headline text-4xl font-black uppercase leading-none tracking-tighter lg:text-6xl"
          >
            Mission Archive
          </h1>
        </div>

        <div
          class="text-on-surface-variant font-label bg-surface-container-low border-outline-variant/5 flex items-center gap-4 rounded border px-4 py-2 text-[10px] uppercase tracking-widest"
        >
          <span class="border-outline-variant/20 flex items-center gap-2 border-r pr-4"
            ><span class="bg-secondary h-2 w-2 rounded-full"></span> {{ totalRecords }} Records
            Found</span
          >
          <TelemetryStatus
            v-if="cachedAt"
            :cached-at="cachedAt"
            :max-age="CACHE_POLICY.MAX_AGE.MISSIONS"
            class="scale-90"
          />
        </div>
      </div>

      <!-- Search Bar & Filters -->
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center">
        <div class="font-label group relative max-w-2xl flex-1">
          <span
            class="material-symbols-outlined text-outline group-focus-within:text-secondary absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
            >search</span
          >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="SEARCH ARCHIVE (ID, AGENCY, ROCKET)..."
            class="bg-surface-container-low border-outline-variant/20 text-on-surface focus:border-secondary/50 focus:ring-secondary/20 placeholder:text-outline-variant/50 w-full rounded-xl border py-4 pl-12 pr-6 text-xs font-bold uppercase tracking-widest transition-all focus:outline-none focus:ring-1"
          />
        </div>

        <div
          class="bg-surface-container-low font-label border-outline-variant/5 flex gap-1 rounded-lg border p-1"
        >
          <button
            :class="[
              'rounded-md px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all focus:outline-none',
              selectedAgency === ''
                ? 'bg-primary text-on-primary shadow-primary/20 bg-glow shadow-lg'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
            ]"
            @click="setAgency('')"
          >
            All
          </button>
          <button
            :class="[
              'rounded-md px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all focus:outline-none',
              selectedAgency === 'NASA'
                ? 'bg-primary text-on-primary shadow-primary/20 bg-glow shadow-lg'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
            ]"
            @click="setAgency('NASA')"
          >
            NASA
          </button>
          <button
            :class="[
              'rounded-md px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all focus:outline-none',
              selectedAgency === 'SpaceX'
                ? 'bg-primary text-on-primary shadow-primary/20 bg-glow shadow-lg'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
            ]"
            @click="setAgency('SpaceX')"
          >
            SpaceX
          </button>
          <button
            :class="[
              'rounded-md px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all focus:outline-none',
              selectedAgency === 'ESA'
                ? 'bg-primary text-on-primary shadow-primary/20 bg-glow shadow-lg'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
            ]"
            @click="setAgency('ESA')"
          >
            ESA
          </button>
          <button
            :class="[
              'rounded-md px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all focus:outline-none',
              selectedAgency === 'Others'
                ? 'bg-primary text-on-primary shadow-primary/20 bg-glow shadow-lg'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
            ]"
            @click="setAgency('Others')"
          >
            Others
          </button>
        </div>
      </div>
    </header>

    <!-- Loaded State -->
    <template v-if="!pending">
      <div
        v-if="filteredMissions.length > 0"
        class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <LaunchCard v-for="mission in filteredMissions" :key="mission.id" :launch="mission" />
      </div>

      <!-- No Results -->
      <div
        v-else
        class="bg-surface-container-low/30 border-outline-variant/20 flex h-64 flex-col items-center justify-center space-y-4 rounded-xl border border-dashed text-center opacity-50"
      >
        <span class="material-symbols-outlined text-6xl">search_off</span>
        <p class="font-label text-[10px] font-bold uppercase tracking-[0.3em]">
          No records found Matching Query
        </p>
      </div>

      <!-- Pagination Controls -->
      <div
        class="border-outline-variant/10 mt-12 flex items-center justify-center gap-8 border-t py-8"
      >
        <button
          :disabled="offset === 0"
          class="bg-surface-container-low border-outline-variant/10 font-label hover:border-secondary/30 group flex items-center gap-2 rounded-lg border px-6 py-3 text-[9px] font-bold uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-20"
          @click="prevPage"
        >
          <span
            class="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1"
            >arrow_back</span
          >
          Previous
        </button>

        <div class="flex flex-col items-center gap-2">
          <span class="text-on-surface font-label text-[10px] font-bold uppercase tracking-[0.3em]"
            >Page</span
          >
          <span class="font-headline text-secondary text-2xl font-black tabular-nums"
            >{{ padZero(currentPage) }}
            <span class="text-on-surface-variant text-xs font-bold opacity-40"
              >/ {{ padZero(totalPages) }}</span
            ></span
          >
        </div>

        <button
          :disabled="offset + limit >= totalRecords"
          class="bg-surface-container-low border-outline-variant/10 font-label hover:border-secondary/30 group flex items-center gap-2 rounded-lg border px-6 py-3 text-[9px] font-bold uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-20"
          @click="nextPage"
        >
          Next
          <span
            class="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1"
            >arrow_forward</span
          >
        </button>
      </div>
    </template>

    <!-- Archival Footer Info -->
    <footer
      class="border-outline-variant/5 text-on-surface-variant font-label flex items-center justify-between border-t pt-8 text-[8px] font-bold uppercase tracking-widest opacity-40"
    >
      <span>Propagated from LL.TheSpaceDevs.com</span>
      <span>T-minus Archive Index Rev: 2.3.0</span>
    </footer>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
.font-body {
  font-family: 'Geist Sans', sans-serif;
}
.font-label {
  font-family: 'Lexend', sans-serif;
}
</style>
