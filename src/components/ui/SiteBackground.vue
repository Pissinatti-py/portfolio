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
let loopId = 0

/** How fast each thing chases the pointer, per frame. The layers lag on
 *  purpose — that weight is what sells the depth. The light does not: a
 *  spotlight that trails behind the cursor reads as lag, not as craft. */
const LAYER_EASE = 0.08
const SPOT_EASE = 0.2

onMounted(() => {
  if (prefersReducedMotion() || !root.value) return
  const node = root.value

  stop = onScrollFrame(() => {
    const y = window.scrollY
    const max = document.documentElement.scrollHeight - window.innerHeight

    // Progress drives the two tall strips, so their travel stays correct
    // whatever the page ends up measuring.
    node.style.setProperty('--p', max > 0 ? String(Math.min(1, y / max)) : '0')

    node.style.setProperty('--gf', String(-wrap(y * 0.03, 128)))
    node.style.setProperty('--gy', String(-wrap(y * 0.06, 64)))
    node.style.setProperty('--n1', String(-wrap(y * 0.1, 140)))
    node.style.setProperty('--n2', String(-wrap(y * 0.22, 92)))
  })

  // Pointer state: a target set by the event, and a value that chases it.
  // Seeded at the viewport centre so a touch device — which never fires
  // mousemove — still gets the grid lit somewhere sensible.
  let tx = 0
  let ty = 0
  let tpx = window.innerWidth / 2
  let tpy = window.innerHeight / 2
  let cx = 0
  let cy = 0
  let cpx = tpx
  let cpy = tpy

  function tick() {
    cx += (tx - cx) * LAYER_EASE
    cy += (ty - cy) * LAYER_EASE
    cpx += (tpx - cpx) * SPOT_EASE
    cpy += (tpy - cpy) * SPOT_EASE

    node.style.setProperty('--mx', cx.toFixed(4))
    node.style.setProperty('--my', cy.toFixed(4))
    node.style.setProperty('--px', cpx.toFixed(1))
    node.style.setProperty('--py', cpy.toFixed(1))

    // Self-terminating: once it has caught up there is nothing to animate,
    // so the loop costs nothing at rest.
    const settled =
      Math.abs(tx - cx) < 0.0004 &&
      Math.abs(ty - cy) < 0.0004 &&
      Math.abs(tpx - cpx) < 0.4 &&
      Math.abs(tpy - cpy) < 0.4

    loopId = settled ? 0 : requestAnimationFrame(tick)
  }

  onMove = (e: MouseEvent) => {
    tx = e.clientX / window.innerWidth - 0.5
    ty = e.clientY / window.innerHeight - 0.5
    tpx = e.clientX
    tpy = e.clientY
    // Always re-request rather than guarding on loopId: a frame requested while
    // the tab was hidden stays pending, and a `if (!loopId)` guard would then
    // refuse to restart the loop until it finally fired.
    if (loopId) cancelAnimationFrame(loopId)
    loopId = requestAnimationFrame(tick)
  }
  window.addEventListener('mousemove', onMove, { passive: true })

  tick() // seed the custom properties before the first pointer event
})

onUnmounted(() => {
  stop?.()
  if (onMove) window.removeEventListener('mousemove', onMove)
  if (loopId) cancelAnimationFrame(loopId)
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

    <!-- 2 — blueprint grid on two planes. Vignette lives on the wrapper so it
         stays put relative to the viewport while the tiles underneath scroll. -->
    <div class="vignette">
      <div class="grid-far" data-parallax />
      <div class="grid-base blueprint" data-parallax />
    </div>

    <!-- 3 — node field, two densities at two depths. -->
    <div class="vignette">
      <div class="nodes nodes-far" data-parallax />
      <div class="nodes nodes-near" data-parallax />
    </div>

    <!-- 4 — the lit plane. Same tiles as above at the same rates, drawn bold
         and glowing, revealed only inside a circle that follows the cursor.
         The mask sits on the wrapper and the parallax on the tiles, so the
         light stays under the pointer while the grid scrolls beneath it. -->
    <div class="spot">
      <div class="grid-hot" data-parallax />
      <div class="nodes-hot" data-parallax />
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
  --px: 0;
  --py: 0;
  --gf: 0;
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
    calc(var(--mx) * 70px),
    calc(var(--p) * -100vh + var(--my) * 70px),
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

/* --- 2. blueprint grid, two planes --------------------------------------- */

.grid-far,
.grid-base,
.grid-hot {
  position: absolute;
  inset: -160px;
  will-change: transform;
}

/* Coarser, dimmer, slower — the plane behind the working grid. */
.grid-far {
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--color-border) 55%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--color-border) 55%, transparent) 1px, transparent 1px);
  background-size: 128px 128px;
  transform: translate3d(
    calc(var(--mx) * -14px),
    calc(var(--gf) * 1px + var(--my) * -14px),
    0
  );
}

.grid-base {
  transform: translate3d(
    calc(var(--mx) * -30px),
    calc(var(--gy) * 1px + var(--my) * -30px),
    0
  );
}

/* The lit grid. Its transform must match .grid-base exactly, or the glowing
   lines drift off the lines they are supposed to be lighting.

   The halo is baked into the gradient — a 1px core falling off over 8px —
   rather than done with filter: blur(), which would repaint a full-viewport
   layer every time the pointer moves. Verticals carry the purple, horizontals
   the blue, so the two tones are woven through the grid itself. */
.grid-hot {
  background-image:
    linear-gradient(
      to right,
      transparent 0,
      color-mix(in srgb, var(--color-primary-light) 85%, transparent) 1px,
      color-mix(in srgb, var(--color-primary) 32%, transparent) 3px,
      transparent 8px
    ),
    linear-gradient(
      to bottom,
      transparent 0,
      color-mix(in srgb, var(--color-accent-light) 85%, transparent) 1px,
      color-mix(in srgb, var(--color-accent) 32%, transparent) 3px,
      transparent 8px
    );
  background-size: 64px 64px;
  transform: translate3d(
    calc(var(--mx) * -30px),
    calc(var(--gy) * 1px + var(--my) * -30px),
    0
  );
}

/* Circle of light that follows the cursor. */
.spot {
  position: absolute;
  inset: 0;
  mask-image: radial-gradient(
    circle 340px at calc(var(--px) * 1px) calc(var(--py) * 1px),
    #000 0%,
    rgba(0, 0, 0, 0.72) 34%,
    transparent 72%
  );
}

.nodes-hot {
  position: absolute;
  inset: -160px;
  will-change: transform;
  background-image: radial-gradient(
    circle at center,
    var(--color-primary-light) 1.4px,
    transparent 2.4px
  );
  background-size: 92px 92px;
  /* Must match .nodes-near, for the same reason .grid-hot matches .grid-base. */
  transform: translate3d(
    calc(var(--mx) * -85px),
    calc(var(--n2) * 1px + var(--my) * -85px),
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
    calc(var(--mx) * -45px),
    calc(var(--n1) * 1px + var(--my) * -45px),
    0
  );
}

.nodes-near {
  background-size: 92px 92px;
  opacity: 0.3;
  transform: translate3d(
    calc(var(--mx) * -85px),
    calc(var(--n2) * 1px + var(--my) * -85px),
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

  /* No pointer loop runs, so the light would be frozen wherever it seeded. */
  .spot {
    display: none;
  }
}
</style>
