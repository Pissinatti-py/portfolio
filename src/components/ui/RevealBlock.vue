<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { onScrollFrame, prefersReducedMotion } from '@/composables/useParallax'

const props = withDefaults(
  defineProps<{ delay?: number; direction?: 'up' | 'left' | 'right' | 'scale' }>(),
  { delay: 0, direction: 'up' },
)

const el = ref<HTMLElement | null>(null)
// Reduced motion: revealed from the first frame, no observation at all.
const skip = prefersReducedMotion()
const isVisible = ref(skip)

let stop: (() => void) | undefined

onMounted(() => {
  if (skip || !el.value) return
  const node = el.value
  let done = false

  /*
   * This asks "is it at or above the fold?" every scroll frame, rather than
   * waiting to be told.
   *
   * An IntersectionObserver only notifies when the intersection ratio crosses
   * a threshold. A block that the page scrolls entirely past inside one frame
   * — a fast wheel, scrollTo, an anchor jump — goes not-intersecting straight
   * to not-intersecting. The ratio never changes, so no callback is ever
   * delivered and the block stays at opacity 0 for good. A position test
   * cannot miss it.
   */
  stop = onScrollFrame(() => {
    if (done) return
    if (node.getBoundingClientRect().top < window.innerHeight * 0.88) {
      done = true
      isVisible.value = true
      stop?.()
    }
  })

  // onScrollFrame runs the callback once synchronously, before `stop` exists —
  // so anything already in view on load unsubscribes here instead.
  if (done) stop?.()
})

onUnmounted(() => stop?.())

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
      isVisible
        ? 'opacity-100 translate-x-0 translate-y-0 scale-100'
        : `opacity-0 ${initial[props.direction]}`
    "
    :style="{ transitionDelay: skip ? '0ms' : `${props.delay}ms` }"
  >
    <slot />
  </div>
</template>
