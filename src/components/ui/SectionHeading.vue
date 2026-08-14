<script setup lang="ts">
import { computed } from 'vue'
import Parallax from './Parallax.vue'
import RevealBlock from './RevealBlock.vue'

const props = defineProps<{ label: string; title: string; intro?: string }>()

/** Labels read "01 — Selected work"; the numeral is reused as the backdrop. */
const numeral = computed(() => props.label.match(/^\d+/)?.[0] ?? '')
const rest = computed(() => props.label.replace(/^\d+\s*—\s*/, ''))
</script>

<template>
  <div class="relative mb-14">
    <!-- Oversized numeral drifting faster than the copy in front of it. Offsets
         are tuned so the glyph clears the eyebrow even at the extremes of its
         ±35px parallax travel. -->
    <Parallax
      :speed="0.35"
      class="pointer-events-none absolute -top-28 -left-5 select-none sm:-top-40 sm:-left-10"
      aria-hidden="true"
    >
      <span class="font-mono text-[7rem] leading-none font-bold text-white/[0.04] sm:text-[11rem]">
        {{ numeral }}
      </span>
    </Parallax>

    <RevealBlock class="relative">
      <p class="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-primary uppercase">
        <span class="h-px w-8 bg-primary/50" />
        {{ rest }}
      </p>
      <h2 class="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-text sm:text-4xl">
        {{ title }}
      </h2>
      <p v-if="intro" class="mt-4 max-w-xl text-base leading-relaxed text-text-muted">
        {{ intro }}
      </p>
    </RevealBlock>
  </div>
</template>
