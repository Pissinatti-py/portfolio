<script setup lang="ts">
import { useIntersection } from '@/composables/useIntersection'

const props = withDefaults(
  defineProps<{ delay?: number; direction?: 'up' | 'left' | 'right' }>(),
  { delay: 0, direction: 'up' },
)

const { el, isVisible } = useIntersection()

const initial: Record<string, string> = {
  up: 'translate-y-8',
  left: '-translate-x-8',
  right: 'translate-x-8',
}
</script>

<template>
  <div
    ref="el"
    class="transition-all duration-700 ease-out"
    :class="[
      isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${initial[props.direction]}`,
    ]"
    :style="{ transitionDelay: `${props.delay}ms` }"
  >
    <slot />
  </div>
</template>
