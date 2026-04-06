<script setup lang="ts">
import { TelemetryStatus } from '@t-minus/ui';

defineProps<{
  cachedAt?: number;
  maxAge: number;
  label?: string;
}>();
</script>

<template>
  <TelemetryStatus v-bind="$props" />
</template>
