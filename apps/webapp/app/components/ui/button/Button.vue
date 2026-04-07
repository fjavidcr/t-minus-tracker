<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { Button } from '@t-minus/ui'

interface Props extends PrimitiveProps {
  class?: HTMLAttributes['class']
  size?: 'default' | 'icon' | 'lg' | 'sm'
  variant?: 'default' | 'destructive' | 'ghost' | 'link' | 'outline' | 'secondary'
}

withDefaults(defineProps<Props>(), {
  as: 'button',
  class: '',
  size: 'default',
  variant: 'default'
})
</script>

<template>
  <Button v-bind="$props">
    <slot />
  </Button>
</template>
