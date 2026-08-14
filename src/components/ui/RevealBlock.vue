<script setup lang="ts">
import { useIntersection } from '@/composables/useIntersection'
import { prefersReducedMotion } from '@/composables/useParallax'

const props = withDefaults(
  defineProps<{ delay?: number; direction?: 'up' | 'left' | 'right' | 'scale' }>(),
  { delay: 0, direction: 'up' },
)

const { el, isVisible } = useIntersection()

// Reduced motion: render revealed from the first frame rather than relying on
// the observer ever firing.
const skip = prefersReducedMotion()

const initial: Record<string, string> = {
  up: 'translate-y-8',
  left: '-translate-x-8',
  right: 'translate-x-8',
  scale: 'scale-95',
}
</script>

<template>
  <div
    ref="el"
    class="transition-all duration-700 ease-out"
    :class="
      isVisible || skip
        ? 'opacity-100 translate-x-0 translate-y-0 scale-100'
        : `opacity-0 ${initial[props.direction]}`
    "
    :style="{ transitionDelay: skip ? '0ms' : `${props.delay}ms` }"
  >
    <slot />
  </div>
</template>
