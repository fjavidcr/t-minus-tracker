<script setup lang="ts">
import { TelemetryStatus } from '@t-minus/ui'

defineProps<{
  cachedAt?: number
  label?: string
  maxAge: number
}>()
</script>

<template>
  <TelemetryStatus v-bind="$props" />
</template>
