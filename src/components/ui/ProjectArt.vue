<script setup lang="ts">
/**
 * Generated cover art. Eight abstract motifs, each drawn from the project's
 * actual architecture idea, seeded by the project id so two projects sharing a
 * motif still look different. Pure SVG — no image files, no build step, and it
 * inherits the theme because everything is drawn in `currentColor`.
 *
 * Animation is ambient and slow; the card's `group` hover speeds it up.
 */
import { computed } from 'vue'
import type { Motif } from '@/data/projects'

const props = defineProps<{ motif: Motif; seed: string }>()

/** djb2 — deterministic, tiny, good enough to spread a dozen ids. */
function hash(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return h
}

const s = computed(() => hash(props.seed))
/** Seeded value in [0, n). */
const pick = (i: number, n: number) => Math.floor(s.value / Math.pow(7, i)) % n

const rows = computed(() => 3 + pick(1, 2))
const drift = computed(() => pick(2, 24) - 12)
const tilt = computed(() => pick(3, 14) - 7)

/** Fully-connected node lattice for the `neural` motif. */
const layers = computed(() => {
  const cols = [3, 4 + pick(4, 2), 2]
  return cols.map((count, c) =>
    Array.from({ length: count }, (_, r) => ({
      x: 70 + c * 90,
      y: 80 + (r - (count - 1) / 2) * 26,
    })),
  )
})

const edges = computed(() =>
  layers.value.slice(0, -1).flatMap((col, c) =>
    col.flatMap((a) => layers.value[c + 1].map((b) => ({ a, b }))),
  ),
)

/** Candlestick-ish series for the `wave` motif. */
const series = computed(() =>
  Array.from({ length: 14 }, (_, i) => {
    const n = Math.sin(i * 0.75 + s.value % 10) * 0.5 + Math.sin(i * 0.31) * 0.5
    return { x: 24 + i * 20, y: 80 - n * 34 }
  }),
)

const wavePath = computed(() =>
  series.value.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y.toFixed(1)}`).join(' '),
)
</script>

<template>
  <svg
    viewBox="0 0 320 160"
    class="h-full w-full text-primary"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <radialGradient :id="`glow-${seed}`" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stop-color="currentColor" stop-opacity="0.22" />
        <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
      </radialGradient>
      <linearGradient :id="`fade-${seed}`" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="currentColor" stop-opacity="0.9" />
        <stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0.7" />
      </linearGradient>
    </defs>

    <rect width="320" height="160" fill="var(--color-surface)" />
    <rect width="320" height="160" :fill="`url(#glow-${seed})`" />

    <!-- Hairline grid, common to every motif — reads as a technical drawing. -->
    <g stroke="currentColor" stroke-opacity="0.09" stroke-width="1">
      <path v-for="i in 7" :key="`v${i}`" :d="`M${i * 40} 0V160`" />
      <path v-for="i in 3" :key="`h${i}`" :d="`M0 ${i * 40}H320`" />
    </g>

    <g :transform="`rotate(${tilt / 3} 160 80)`">
      <!-- queue: packets marching into a single sink -->
      <g v-if="motif === 'queue'" stroke="currentColor" fill="none" stroke-width="2">
        <rect
          v-for="i in 5"
          :key="i"
          :x="18 + (i - 1) * 34"
          :y="66 + ((i + pick(5, 3)) % 3) * 6"
          width="24"
          height="28"
          rx="3"
          :stroke-opacity="0.3 + i * 0.12"
        />
        <path class="march" d="M196 80H262" stroke-dasharray="5 7" />
        <circle cx="282" cy="80" r="18" stroke="var(--color-accent)" stroke-opacity="0.8" />
        <path d="M275 80h14M282 73v14" stroke="var(--color-accent)" stroke-opacity="0.5" />
      </g>

      <!-- graph: agent loop — nodes, edges, one live node -->
      <g v-else-if="motif === 'graph'" fill="none" stroke="currentColor" stroke-width="2">
        <path
          class="march"
          :d="`M60 ${80 + drift / 3}C110 20 210 140 260 ${80 - drift / 3}`"
          stroke-dasharray="6 8"
          stroke-opacity="0.55"
        />
        <path d="M60 80h60M180 80h80" stroke-opacity="0.25" />
        <circle cx="60" cy="80" r="10" stroke-opacity="0.55" />
        <circle cx="150" cy="80" r="22" stroke-opacity="0.9" />
        <circle class="pulse" cx="150" cy="80" r="22" stroke="var(--color-accent)" />
        <circle cx="150" cy="80" r="5" fill="currentColor" stroke="none" />
        <circle cx="260" cy="80" r="10" stroke-opacity="0.55" />
        <path d="M150 42a38 38 0 0 1 0 76" stroke-opacity="0.35" />
      </g>

      <!-- stream: broadcast arcs fanning out to listeners -->
      <g v-else-if="motif === 'stream'" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="52" cy="80" r="7" fill="currentColor" stroke="none" />
        <path
          v-for="i in 4"
          :key="i"
          class="pulse"
          :style="{ animationDelay: `${i * 0.45}s` }"
          :d="`M${52 + i * 26} ${80 - i * 20}A${i * 26} ${i * 26} 0 0 1 ${52 + i * 26} ${80 + i * 20}`"
          :stroke-opacity="0.7 - i * 0.12"
        />
        <path
          v-for="i in 3"
          :key="`l${i}`"
          class="march"
          :d="`M180 ${52 + (i - 1) * 28}H292`"
          stroke-dasharray="4 8"
          stroke="var(--color-accent)"
          stroke-opacity="0.5"
        />
      </g>

      <!-- layers: stacked slabs, a clean-architecture stack -->
      <g v-else-if="motif === 'layers'" stroke="currentColor" fill="none" stroke-width="2">
        <g v-for="i in 4" :key="i">
          <path
            :d="`M${100 + (i - 1) * 6 + drift / 4} ${132 - (i - 1) * 24}l60-22 60 22-60 22Z`"
            :stroke-opacity="0.25 + i * 0.17"
            :fill="i === 4 ? 'currentColor' : 'none'"
            :fill-opacity="i === 4 ? 0.08 : 0"
          />
        </g>
        <path class="march" d="M42 132V52h44" stroke-dasharray="5 6" stroke-opacity="0.4" />
      </g>

      <!-- neural: fully connected lattice -->
      <g v-else-if="motif === 'neural'" stroke="currentColor" fill="none">
        <path
          v-for="(e, i) in edges"
          :key="i"
          :d="`M${e.a.x} ${e.a.y}L${e.b.x} ${e.b.y}`"
          stroke-width="1"
          :stroke-opacity="0.1 + ((i * 37) % 20) / 60"
        />
        <template v-for="(col, c) in layers" :key="c">
          <circle
            v-for="(n, r) in col"
            :key="`${c}-${r}`"
            :cx="n.x"
            :cy="n.y"
            r="5"
            fill="var(--color-surface)"
            :stroke="c === 1 ? 'var(--color-accent)' : 'currentColor'"
            stroke-width="2"
          />
        </template>
      </g>

      <!-- wave: a forecast series with its trailing prediction -->
      <g v-else-if="motif === 'wave'" fill="none" stroke-width="2">
        <path :d="wavePath" :stroke="`url(#fade-${seed})`" />
        <path
          class="march"
          :d="wavePath"
          stroke="var(--color-accent)"
          stroke-dasharray="3 60"
          stroke-opacity="0.9"
        />
        <path d="M24 130h272" stroke="currentColor" stroke-opacity="0.2" />
        <circle
          v-for="(p, i) in series"
          :key="i"
          :cx="p.x"
          :cy="p.y"
          r="2"
          fill="currentColor"
          fill-opacity="0.5"
        />
      </g>

      <!-- grid: a tenant matrix, a handful of cells lit -->
      <g v-else-if="motif === 'grid'" stroke="currentColor" stroke-width="1.5">
        <template v-for="r in rows" :key="r">
          <rect
            v-for="c in 8"
            :key="`${r}-${c}`"
            :x="24 + (c - 1) * 34"
            :y="80 - (rows * 30) / 2 + (r - 1) * 30"
            width="26"
            height="22"
            rx="3"
            fill="currentColor"
            :fill-opacity="(s + r * 13 + c * 7) % 5 === 0 ? 0.35 : 0.04"
            :stroke-opacity="(s + r * 13 + c * 7) % 5 === 0 ? 0.8 : 0.2"
          />
        </template>
      </g>

      <!-- lock: one issuer, verification rays out to the fleet -->
      <g v-else fill="none" stroke="currentColor" stroke-width="2">
        <path
          v-for="i in 6"
          :key="i"
          class="march"
          :d="`M160 80L${160 + Math.cos((i * Math.PI) / 3 + tilt / 10) * 130} ${80 + Math.sin((i * Math.PI) / 3 + tilt / 10) * 66}`"
          stroke-dasharray="4 8"
          stroke-opacity="0.3"
          :style="{ animationDelay: `${i * 0.2}s` }"
        />
        <circle cx="160" cy="80" r="34" fill="var(--color-surface)" stroke-opacity="0.9" />
        <path d="M148 76v-6a12 12 0 0 1 24 0v6" stroke-opacity="0.85" />
        <rect x="144" y="76" width="32" height="24" rx="4" stroke="var(--color-accent)" />
        <circle class="pulse" cx="160" cy="86" r="3.5" fill="currentColor" stroke="none" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.pulse {
  transform-box: fill-box;
  transform-origin: center;
}

/* Motion only on hover: at rest the art is a still drawing. Cards carry
   `group`, so the whole tile is the trigger, not the SVG alone. */
:global(.group:hover) .march {
  animation: march 1.6s linear infinite;
}
:global(.group:hover) .pulse {
  animation: pulse 1.8s ease-in-out infinite;
}

@keyframes march {
  to {
    stroke-dashoffset: -64;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.94);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.06);
  }
}

@media (prefers-reduced-motion: reduce) {
  :global(.group:hover) .march,
  :global(.group:hover) .pulse {
    animation: none;
  }
}
</style>
