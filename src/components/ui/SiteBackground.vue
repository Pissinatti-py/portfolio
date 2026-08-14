<script setup lang="ts">
/**
 * The page's single background layer — fixed, behind everything, continuous
 * from the hero to the footer.
 *
 * Four depths move at different rates:
 *   aurora  — three blurred masses; scrolling walks the page past them, so the
 *             colour goes purple → navy → purple without animating any colour
 *   grid    — the blueprint tile
 *   nodes   — two densities of dim dots, the actual sense of depth
 *   traces  — long wires with a packet running down them, the same motif the
 *             project cover art uses
 *
 * One scroll subscriber and one pointer handler drive all of it by writing
 * custom properties; every layer is plain CSS reading those. Per-layer
 * composables would mean a getBoundingClientRect per layer per frame on
 * elements that never move relative to the viewport.
 */
import { onMounted, onUnmounted, ref } from 'vue'
import { onScrollFrame, prefersReducedMotion } from '@/composables/useParallax'

const root = ref<HTMLElement | null>(null)

/** Long wires crossing the full 4000-unit strip, so which ones you see changes as you scroll. */
const traces = [
  { d: 'M-60 300 L1060 170', navy: false, dur: 13, delay: 0 },
  { d: 'M-60 780 L1060 1010', navy: true, dur: 17, delay: 2.5 },
  { d: 'M-60 1460 L1060 1250', navy: false, dur: 15, delay: 6 },
  { d: 'M-60 1960 L1060 2140', navy: true, dur: 19, delay: 1 },
  { d: 'M-60 2540 L1060 2350', navy: false, dur: 16, delay: 8 },
  { d: 'M-60 3080 L1060 3300', navy: true, dur: 14, delay: 4 },
  { d: 'M-60 3640 L1060 3470', navy: false, dur: 18, delay: 10 },
]

/** Keep tiled layers within one tile of origin — a repeating pattern shifted by
 *  a whole tile is indistinguishable, so the travel never has to be bounded. */
const wrap = (v: number, m: number) => ((v % m) + m) % m

let stop: (() => void) | undefined
let onMove: ((e: MouseEvent) => void) | undefined
let frameId = 0

onMounted(() => {
  if (prefersReducedMotion() || !root.value) return
  const node = root.value

  stop = onScrollFrame(() => {
    const y = window.scrollY
    const max = document.documentElement.scrollHeight - window.innerHeight

    // Progress drives the two tall strips, so their travel stays correct
    // whatever the page ends up measuring.
    node.style.setProperty('--p', max > 0 ? String(Math.min(1, y / max)) : '0')

    node.style.setProperty('--gy', String(-wrap(y * 0.06, 64)))
    node.style.setProperty('--n1', String(-wrap(y * 0.1, 140)))
    node.style.setProperty('--n2', String(-wrap(y * 0.22, 92)))
  })

  onMove = (e: MouseEvent) => {
    if (frameId) return
    frameId = requestAnimationFrame(() => {
      frameId = 0
      node.style.setProperty('--mx', (e.clientX / window.innerWidth - 0.5).toFixed(3))
      node.style.setProperty('--my', (e.clientY / window.innerHeight - 0.5).toFixed(3))
    })
  }
  window.addEventListener('mousemove', onMove, { passive: true })
})

onUnmounted(() => {
  stop?.()
  if (onMove) window.removeEventListener('mousemove', onMove)
  if (frameId) cancelAnimationFrame(frameId)
})
</script>

<template>
  <div ref="root" class="site-bg grain" aria-hidden="true">
    <!-- 1 — aurora. 200vh of strip travelling 100vh puts a different mass on
         screen at the top, middle and bottom of the page. -->
    <div class="aurora" data-parallax>
      <span class="blob blob-a" />
      <span class="blob blob-b" />
      <span class="blob blob-c" />
    </div>

    <!-- 2 — blueprint grid. Vignette lives on the wrapper so it stays put
         relative to the viewport while the tile underneath scrolls. -->
    <div class="vignette">
      <div class="grid-layer blueprint" data-parallax />
    </div>

    <!-- 3 — node field, two densities at two depths. -->
    <div class="vignette">
      <div class="nodes nodes-far" data-parallax />
      <div class="nodes nodes-near" data-parallax />
    </div>

    <!-- 4 — signal traces: a dim wire, and a packet running along it. -->
    <svg
      class="traces"
      data-parallax
      viewBox="0 0 1000 4000"
      preserveAspectRatio="none"
      fill="none"
    >
      <g v-for="(t, i) in traces" :key="i" :class="t.navy ? 'navy' : 'purple'">
        <path :d="t.d" class="wire" vector-effect="non-scaling-stroke" />
        <path
          :d="t.d"
          class="packet"
          vector-effect="non-scaling-stroke"
          :style="{ animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s` }"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.site-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  contain: layout paint;

  --p: 0;
  --mx: 0;
  --my: 0;
  --gy: 0;
  --n1: 0;
  --n2: 0;
}

/* Keeps every tiled layer off the hard edges of the viewport. */
.vignette {
  position: absolute;
  inset: 0;
  mask-image: radial-gradient(ellipse 85% 65% at 50% 45%, #000 25%, transparent 78%);
}

/* --- 1. aurora ---------------------------------------------------------- */

.aurora {
  position: absolute;
  top: 0;
  left: -8%;
  right: -8%;
  height: 200vh;
  will-change: transform;
  transform: translate3d(
    calc(var(--mx) * 26px),
    calc(var(--p) * -100vh + var(--my) * 26px),
    0
  );
}

.blob {
  position: absolute;
  display: block;
  border-radius: 50%;
  translate: -50% -50%;
  filter: blur(140px);
}

/* Positions are the strip's 25% / 50% / 75% marks — the points that sit in the
   middle of the viewport at the top, middle and bottom of the page. */
.blob-a {
  top: 25%;
  left: 24%;
  width: 46rem;
  height: 40rem;
  background: var(--color-primary);
  opacity: 0.2;
}

.blob-b {
  top: 50%;
  left: 76%;
  width: 44rem;
  height: 44rem;
  background: var(--color-accent);
  opacity: 0.22;
}

.blob-c {
  top: 75%;
  left: 36%;
  width: 48rem;
  height: 40rem;
  background: var(--color-primary-dark);
  opacity: 0.18;
}

/* --- 2. blueprint grid --------------------------------------------------- */

.grid-layer {
  position: absolute;
  inset: -160px;
  will-change: transform;
  transform: translate3d(
    calc(var(--mx) * -12px),
    calc(var(--gy) * 1px + var(--my) * -12px),
    0
  );
}

/* --- 3. node field ------------------------------------------------------- */

.nodes {
  position: absolute;
  inset: -160px;
  will-change: transform;
  background-image: radial-gradient(
    circle at center,
    var(--color-text-subtle) 1px,
    transparent 1.6px
  );
}

.nodes-far {
  background-size: 140px 140px;
  opacity: 0.55;
  transform: translate3d(
    calc(var(--mx) * -18px),
    calc(var(--n1) * 1px + var(--my) * -18px),
    0
  );
}

.nodes-near {
  background-size: 92px 92px;
  opacity: 0.3;
  transform: translate3d(
    calc(var(--mx) * -34px),
    calc(var(--n2) * 1px + var(--my) * -34px),
    0
  );
}

/* --- 4. signal traces ---------------------------------------------------- */

.traces {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 400vh;
  will-change: transform;
  transform: translate3d(0, calc(var(--p) * -300vh), 0);
}

.purple {
  stroke: var(--color-primary);
}

.navy {
  stroke: var(--color-accent-light);
}

.wire {
  stroke-width: 1;
  opacity: 0.09;
}

/* Dash + gap total matches the keyframe offset, so the packet loops seamlessly:
   it crosses, leaves, and the long gap is the wait before the next one. */
.packet {
  stroke-width: 1.5;
  stroke-dasharray: 70 3200;
  opacity: 0.45;
  animation-name: fly;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes fly {
  to {
    stroke-dashoffset: -3270;
  }
}

@media (prefers-reduced-motion: reduce) {
  .packet {
    animation: none;
    opacity: 0.12;
  }
}
</style>
