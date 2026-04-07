<script setup lang="ts">
import { computed, watch } from 'vue'

import { useOrbitalLink } from '~/composables/useOrbitalLink'
import { CACHE_POLICY } from '~/lib/constants'

const { setStatus } = useOrbitalLink()

useHead({
  title: 'T-minus | Launch Calendar'
})

interface Launch {
  id: string
  launch_service_provider?: {
    name: string
  }
  mission?: {
    description: string
  }
  name: string
  net: string
}

// Fetch data from Nitro backend
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

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Calendar Logic
const now = new Date()
const currentMonthName = now.toLocaleString('en-US', { month: 'long' })
const currentYear = now.getFullYear()
const firstDayOfMonth = new Date(currentYear, now.getMonth(), 1).getDay()
const totalDays = new Date(currentYear, now.getMonth() + 1, 0).getDate()

// Array of 42 cells (6 weeks) to cover any month
const calendarCells = computed(() => {
  const cells = []
  const prevMonthLastDay = new Date(currentYear, now.getMonth(), 0).getDate()

  // Padding from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    cells.push({
      day: prevMonthLastDay - i,
      fullDate: new Date(currentYear, now.getMonth() - 1, prevMonthLastDay - i),
      month: 'prev'
    })
  }

  // Days of current month
  for (let i = 1; i <= totalDays; i++) {
    cells.push({
      day: i,
      fullDate: new Date(currentYear, now.getMonth(), i),
      month: 'current'
    })
  }

  // Padding for next month
  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    cells.push({
      day: i,
      fullDate: new Date(currentYear, now.getMonth() + 1, i),
      month: 'next'
    })
  }

  return cells
})

const getEventsForDate = (date: Date) => {
  if (!launches.value) return []
  return launches.value.filter((l) => {
    const launchDate = new Date(l.net)
    return (
      launchDate.getDate() === date.getDate() &&
      launchDate.getMonth() === date.getMonth() &&
      launchDate.getFullYear() === date.getFullYear()
    )
  })
}

const getAgencyColor = (agency: string | undefined) => {
  if (agency?.includes('NASA')) return 'bg-primary'
  if (agency?.includes('SpaceX')) return 'bg-tertiary'
  if (agency?.includes('ESA')) return 'bg-secondary'
  return 'bg-secondary'
}

const getAgencyBadge = (agency: string | undefined) => {
  if (agency?.includes('NASA')) return 'NASA'
  if (agency?.includes('SpaceX')) return 'SPX'
  if (agency?.includes('ESA')) return 'ESA'
  return 'GEN'
}
</script>

<template>
  <main
    class="bg-surface flex min-h-[calc(100vh-80px)] flex-1 flex-col overflow-hidden md:flex-row"
  >
    <!-- Calendar View -->
    <section class="custom-scrollbar flex-1 overflow-y-auto p-4 md:p-8">
      <div
        v-if="!pending"
        class="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"
      >
        <div>
          <div
            class="font-label text-on-surface-variant mb-2 text-[10px] font-medium uppercase tracking-[0.3em]"
          >
            Classification: Schedule-Alpha
          </div>
          <h1
            class="text-on-surface font-headline text-4xl font-black uppercase leading-none tracking-tighter"
          >
            {{ currentMonthName }} {{ currentYear }}
          </h1>
        </div>
        <div class="bg-surface-container font-label flex items-center gap-2 rounded-lg p-1">
          <button
            class="bg-primary text-on-primary rounded-lg px-6 py-2 text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all focus:outline-none"
          >
            Month
          </button>
          <button
            class="text-on-surface-variant hover:text-on-surface px-6 py-2 text-[10px] font-bold uppercase tracking-wider transition-all focus:outline-none"
          >
            Week
          </button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div v-if="!pending" class="font-label mb-8 flex flex-wrap gap-4">
        <div
          class="bg-surface-container-low border-outline-variant/10 flex items-center gap-2 rounded-lg border px-3 py-1.5"
        >
          <span
            class="bg-primary h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(11,61,145,0.6)]"
          ></span>
          <span class="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest"
            >NASA</span
          >
        </div>
        <div
          class="bg-surface-container-low border-outline-variant/10 flex items-center gap-2 rounded-lg border px-3 py-1.5"
        >
          <span
            class="bg-secondary h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(252,61,33,0.6)]"
          ></span>
          <span class="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest"
            >ESA</span
          >
        </div>
        <div
          class="bg-surface-container-low border-outline-variant/10 flex items-center gap-2 rounded-lg border px-3 py-1.5"
        >
          <span
            class="bg-tertiary h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(173,203,218,0.6)]"
          ></span>
          <span class="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest"
            >SpaceX</span
          >
        </div>
        <button
          class="text-primary ml-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
        >
          <span class="material-symbols-outlined text-sm">filter_list</span>
          Advanced Filters
        </button>
      </div>

      <!-- Calendar Grid -->
      <div
        v-if="!pending"
        class="bg-outline-variant/10 border-outline-variant/10 grid grid-cols-7 gap-px overflow-hidden rounded-xl border"
      >
        <!-- Days Header -->
        <div
          v-for="day in days"
          :key="day"
          class="bg-surface-container-low border-outline-variant/10 border-b py-3 text-center"
        >
          <span
            class="text-on-surface-variant font-label text-[10px] font-black uppercase tracking-[0.2em]"
            >{{ day }}</span
          >
        </div>

        <!-- Calendar Days -->
        <div
          v-for="(cell, idx) in calendarCells"
          :key="idx"
          :class="[
            'bg-surface hover:bg-surface-container/30 group flex min-h-[140px] flex-col gap-2 p-3 transition-colors',
            cell.month !== 'current' ? 'opacity-20' : ''
          ]"
        >
          <span
            class="font-label text-[11px] font-bold"
            :class="
              cell.fullDate.toDateString() === now.toDateString()
                ? 'text-secondary'
                : 'text-on-surface-variant'
            "
          >
            {{ cell.day }}
          </span>

          <!-- Dynamic Events -->
          <template v-for="event in getEventsForDate(cell.fullDate)" :key="event.id">
            <NuxtLink
              :to="`/missions/${event.id}`"
              class="font-label truncate rounded-sm p-1.5 text-[8px] font-bold uppercase tracking-tighter shadow-sm transition-all hover:scale-[1.02]"
              :class="[getAgencyColor(event.launch_service_provider?.name), 'text-white']"
            >
              {{ event.name.split('|')[1] || event.name }}
            </NuxtLink>
          </template>
        </div>
      </div>
    </section>

    <!-- Upcoming Milestones Side Panel -->
    <aside
      class="bg-surface-container-low border-outline-variant/5 custom-scrollbar flex w-full flex-col gap-8 overflow-y-auto border-l p-8 md:w-80 lg:w-96"
    >
      <div>
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h2 class="text-on-surface font-headline text-sm font-black uppercase tracking-tight">
              Telemetry Log
            </h2>
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
          <div
            v-for="launch in launches?.slice(0, 5)"
            :key="launch.id"
            class="group relative cursor-pointer"
          >
            <NuxtLink :to="`/missions/${launch.id}`" class="flex items-start gap-4">
              <div
                class="bg-surface-container ring-outline-variant/10 group-hover:ring-primary/50 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 transition-all"
              >
                <span class="material-symbols-outlined text-primary text-lg">rocket</span>
              </div>
              <div class="flex-1">
                <div class="font-label mb-1 flex items-start justify-between">
                  <span
                    class="text-[9px] font-black uppercase tracking-widest"
                    :class="
                      getAgencyColor(launch.launch_service_provider?.name).replace('bg-', 'text-')
                    "
                    >{{ getAgencyBadge(launch.launch_service_provider?.name) }}</span
                  >
                  <span class="text-on-surface-variant text-[9px] font-bold">{{
                    new Date(launch.net).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })
                  }}</span>
                </div>
                <h3
                  class="text-on-surface font-headline mb-1 line-clamp-1 text-[11px] font-bold uppercase tracking-tight"
                >
                  {{ launch.name }}
                </h3>
                <p
                  class="text-on-surface-variant font-body line-clamp-2 text-[10px] leading-relaxed"
                >
                  {{ launch.mission?.description || 'Orbital deployment sequence initiated.' }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- System Diagnostics -->
      <div class="border-outline-variant/10 mt-auto space-y-6 border-t pt-8">
        <div>
          <h4
            class="text-on-surface-variant font-label mb-6 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            Launch Site Status
          </h4>
          <div class="space-y-4">
            <div class="space-y-2">
              <div class="font-label flex items-center justify-between">
                <span class="text-on-surface text-[10px] font-bold uppercase tracking-tight"
                  >KSC LC-39B</span
                >
                <span class="text-secondary text-[9px] font-black uppercase tracking-widest"
                  >Go for Launch</span
                >
              </div>
              <div class="bg-surface-container h-1 w-full overflow-hidden rounded-full">
                <div class="bg-secondary h-full w-[92%] shadow-[0_0_8px_rgba(252,61,33,0.4)]"></div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="font-label flex items-center justify-between">
                <span class="text-on-surface text-[10px] font-bold uppercase tracking-tight"
                  >Vandenberg SLC-4E</span
                >
                <span class="text-primary text-[9px] font-black uppercase tracking-widest"
                  >Nominal</span
                >
              </div>
              <div class="bg-surface-container h-1 w-full overflow-hidden rounded-full">
                <div class="bg-primary h-full w-[75%] shadow-[0_0_8px_rgba(11,61,145,0.4)]"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-surface-container border-outline-variant/10 rounded-xl border p-4">
          <div class="mb-3 flex items-center gap-3">
            <div class="bg-secondary h-2 w-2 animate-pulse rounded-full"></div>
            <span
              class="text-on-surface font-label text-[10px] font-black uppercase tracking-widest"
              >Live Telemetry</span
            >
          </div>
          <div
            class="bg-surface-container-low group relative aspect-video overflow-hidden rounded-lg"
          >
            <img
              alt="Rocket Cam"
              class="h-full w-full object-cover opacity-60 mix-blend-luminosity grayscale transition-all duration-700 group-hover:grayscale-0"
              src="https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop"
            />
            <div
              class="from-surface-container absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
            ></div>
            <div
              class="font-label text-on-surface-variant absolute bottom-2 left-2 right-2 flex items-end justify-between text-[8px] font-bold uppercase tracking-widest"
            >
              <span>Pad Cam 09-B</span>
              <span class="material-symbols-outlined text-secondary text-xs">videocam</span>
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
