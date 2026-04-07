<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@t-minus/utils'
import { Primitive, type PrimitiveProps } from 'reka-ui'

import { type ButtonVariants, buttonVariants } from './buttonVariants'

interface Props extends PrimitiveProps {
  class?: HTMLAttributes['class']
  size?: ButtonVariants['size']
  variant?: ButtonVariants['variant']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  class: '',
  size: 'default',
  variant: 'default'
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
