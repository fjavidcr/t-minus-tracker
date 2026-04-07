<script setup lang="ts">
import { cn } from '@t-minus/utils'
import { type Component, computed, onMounted, onUnmounted, ref } from 'vue'

interface Launch {
  id: string
  image?: {
    image_url?: string
    thumbnail_url?: string
  }
  launch_service_provider?: {
    name?: string
  }
  name?: string
  net: string
  pad?: {
    location?: {
      name?: string
    }
  }
}

const props = defineProps<{
  config?: {
    assets: { defaultLaunchImage: string }
    intervals: { uiRefresh: number }
    thresholds: { missionUrgencyDays: number }
  }
  launch: Launch
  linkComponent?: Component | string
  linkProps?: (launch: Launch) => Record<string, unknown>
}>()

const defaultConfig = {
  assets: {
    defaultLaunchImage:
      'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80'
  },
  intervals: { uiRefresh: 60000 },
  thresholds: { missionUrgencyDays: 3 }
}

const activeConfig = computed(() => ({ ...defaultConfig, ...props.config }))

const getTimeUntil = (dateString: string) => {
  const targetDate = new Date(dateString).getTime()
  const now = new Date().getTime()
  const difference = targetDate - now

  if (difference <= 0) return { isUrgent: false, label: 'LAUNCHED' }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const isUrgent = days <= activeConfig.value.thresholds.missionUrgencyDays

  return {
    isUrgent,
    label: `T-Minus ${days}d`
  }
}

const tMinusData = ref({ isUrgent: false, label: 'CALCULATING' })
let interval: null | ReturnType<typeof setInterval> = null

onMounted(() => {
  tMinusData.value = getTimeUntil(props.launch.net)
  interval = setInterval(() => {
    tMinusData.value = getTimeUntil(props.launch.net)
  }, activeConfig.value.intervals.uiRefresh)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const LinkComp = computed(() => props.linkComponent || 'a')
const getLinkProps = (launch: Launch) =>
  props.linkProps ? props.linkProps(launch) : { href: `/missions/${launch.id}` }
</script>

<template>
  <div
    :class="
      cn(
        'bg-surface-container-low border-outline-variant/10 group relative flex flex-col overflow-hidden rounded-xl border backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(11,61,145,0.1)]',
        $attrs.class as string
      )
    "
  >
    <div class="relative h-52 overflow-hidden">
      <img
        :src="
          launch.image?.image_url ||
          launch.image?.thumbnail_url ||
          activeConfig.assets.defaultLaunchImage
        "
        :alt="launch.name"
        class="h-full w-full object-cover contrast-125 grayscale-[0.2] transition-transform duration-1000 group-hover:scale-105"
      />
      <div class="absolute left-4 top-4 max-w-[80%]">
        <div
          class="bg-surface-container/90 text-on-surface font-label truncate px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest backdrop-blur"
        >
          {{ launch.name?.split('|')?.[1] || launch.name }}
        </div>
      </div>
      <div class="absolute bottom-4 right-4">
        <span
          v-if="tMinusData.isUrgent"
          class="bg-secondary text-on-secondary font-label rounded px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest shadow-[0_4px_14px_rgba(252,61,33,0.4)]"
        >
          {{ tMinusData.label }}
        </span>
        <span
          v-else
          class="bg-surface-container-highest/90 text-on-surface-variant font-label rounded px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest backdrop-blur"
        >
          {{ tMinusData.label }}
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col space-y-6 p-8">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <p
            class="text-secondary font-label mb-1 text-[0.65rem] font-bold uppercase tracking-[0.2em]"
          >
            Agency
          </p>
          <p
            class="text-on-surface font-body line-clamp-1 text-xs font-bold uppercase tracking-wide"
            :title="launch.launch_service_provider?.name"
          >
            {{ launch.launch_service_provider?.name || 'Unknown' }}
          </p>
        </div>
        <div class="flex-1 text-right">
          <p
            class="text-secondary font-label mb-1 text-[0.65rem] font-bold uppercase tracking-[0.2em]"
          >
            Launch Site
          </p>
          <p
            class="text-on-surface font-body line-clamp-1 text-xs font-bold uppercase tracking-wide"
            :title="launch.pad?.location?.name"
          >
            {{ launch.pad?.location?.name?.split(',')[0] || 'Unknown' }}
          </p>
        </div>
      </div>

      <div class="mt-auto">
        <component
          :is="LinkComp"
          v-bind="getLinkProps(launch)"
          class="bg-primary text-on-primary font-label block w-full cursor-pointer rounded-lg py-3.5 text-center text-[0.65rem] font-bold uppercase tracking-[0.2em] shadow-[0_8px_20px_-8px_rgba(11,61,145,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(11,61,145,0.7)] hover:brightness-110 active:scale-[0.98]"
        >
          MISSION SPECS
        </component>
      </div>
    </div>
  </div>
</template>
