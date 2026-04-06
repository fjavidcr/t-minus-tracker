<script setup lang="ts">
import { Button } from '@t-minus/ui';
import type { PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

interface Props extends PrimitiveProps {
  variant?: any;
  size?: any;
  class?: HTMLAttributes['class'];
}

defineProps<Props>();
</script>

<template>
  <Button v-bind="$props">
    <slot />
  </Button>
</template>
