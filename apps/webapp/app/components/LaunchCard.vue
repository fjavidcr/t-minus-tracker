<script setup lang="ts">
import { LaunchCard } from '@t-minus/ui';
import { resolveComponent } from 'vue';
import { UI_CONFIG } from '~/lib/constants';

const NuxtLink = resolveComponent('NuxtLink');

defineProps<{
  launch: any;
}>();

const config = {
  thresholds: { missionUrgencyDays: UI_CONFIG.THRESHOLDS.MISSION_URGENCY_DAYS },
  intervals: { uiRefresh: UI_CONFIG.INTERVALS.UI_REFRESH },
  assets: { defaultLaunchImage: UI_CONFIG.ASSETS.DEFAULT_LAUNCH_IMAGE }
};

const linkProps = (launch: any) => ({
  to: `/missions/${launch.id}`
});
</script>

<template>
  <LaunchCard 
    :launch="launch" 
    :link-component="NuxtLink" 
    :link-props="linkProps"
    :config="config"
  />
</template>
