<script setup lang="ts">
import { useParallax } from '@/composables/useParallax'

const props = withDefaults(defineProps<{ speed?: number }>(), { speed: 0.15 })

const { el } = useParallax(props.speed)
</script>

<template>
  <div ref="el" data-parallax>
    <slot />
  </div>
</template>
