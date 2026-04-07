<script setup lang="ts">
import { LaunchCard } from '@t-minus/ui'
import { resolveComponent } from 'vue'

import { UI_CONFIG } from '~/lib/constants'

const NuxtLink = resolveComponent('NuxtLink')

interface Launch {
  id: string
  net: string
}

defineProps<{
  launch: Launch
}>()

const config = {
  assets: { defaultLaunchImage: UI_CONFIG.ASSETS.DEFAULT_LAUNCH_IMAGE },
  intervals: { uiRefresh: UI_CONFIG.INTERVALS.UI_REFRESH },
  thresholds: { missionUrgencyDays: UI_CONFIG.THRESHOLDS.MISSION_URGENCY_DAYS }
}

const linkProps = (launch: Launch) => ({
  to: `/missions/${launch.id}`
})
</script>

<template>
  <LaunchCard
    :launch="launch"
    :link-component="NuxtLink"
    :link-props="linkProps"
    :config="config"
  />
</template>
