<script setup lang="ts">
/**
 * The page's single background layer — fixed, behind everything, continuous
 * from the hero to the footer.
 *
 * Four depths move at different rates:
 *   aurora  — three blurred masses; scrolling walks the page past them, so the
 *             colour goes purple → navy → purple without animating any colour
 *   grid    — one blueprint tile, dim at rest and lit around the cursor
 *   nodes   — two densities of dim dots, the actual sense of depth
 *   traces  — long wires with a packet running down them, the same motif the
 *             project cover art uses
 *
 * One scroll subscriber and one pointer handler drive all of it by writing
 * custom properties; every layer is plain CSS reading those. Per-layer
 * composables would mean a getBoundingClientRect per layer per frame on
 * elements that never move relative to the viewport.
 */
import { onMounted, onUnmounted, ref } from "vue";
import { onScrollFrame, prefersReducedMotion } from "@/composables/useParallax";

const root = ref<HTMLElement | null>(null);

/** Long wires crossing the full 4000-unit strip, so which ones you see changes as you scroll. */
const traces = [
  { d: "M-60 300 L1060 170", navy: false, dur: 13, delay: 0 },
  { d: "M-60 780 L1060 1010", navy: true, dur: 17, delay: 2.5 },
  { d: "M-60 1460 L1060 1250", navy: false, dur: 15, delay: 6 },
  { d: "M-60 1960 L1060 2140", navy: true, dur: 19, delay: 1 },
  { d: "M-60 2540 L1060 2350", navy: false, dur: 16, delay: 8 },
  { d: "M-60 3080 L1060 3300", navy: true, dur: 14, delay: 4 },
  { d: "M-60 3640 L1060 3470", navy: false, dur: 18, delay: 10 },
];

/** Keep tiled layers within one tile of origin — a repeating pattern shifted by
 *  a whole tile is indistinguishable, so the travel never has to be bounded. */
const wrap = (v: number, m: number) => ((v % m) + m) % m;

/** Must match `background-size` on .grid in the style block below. */
const GRID_TILE = 40;

/* --- Star field ----------------------------------------------------------
   One dot per tile puts every star exactly one tile from its neighbours, which
   is a lattice, not a sky. Instead each tile holds many stars at irregular
   positions with varied size and brightness, and the two planes use different
   tile periods so they never line up the same way twice.

   The tile is also the wrap modulus for the scroll offset, so it is defined
   once here and bound into the style — no CSS/JS pair to keep in sync. */

const FAR_TILE = 420;
const NEAR_TILE = 300;

/** mulberry32 — deterministic, so the sky is the same on every load. */
function prng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
}

function makeStars(
  count: number,
  tile: number,
  seed: number,
  minR: number,
  maxR: number,
): Star[] {
  const rand = prng(seed);
  return Array.from({ length: count }, () => ({
    x: +(rand() * tile).toFixed(1),
    y: +(rand() * tile).toFixed(1),
    r: +(minR + rand() * (maxR - minR)).toFixed(2),
    a: +(0.25 + rand() * 0.75).toFixed(2),
  }));
}

/** `alpha` scales every star, so the lit copy can reuse the dim one's geometry. */
function field(stars: Star[], color: string, alpha = 1): string {
  return stars
    .map(
      (s) =>
        `radial-gradient(circle ${s.r}px at ${s.x}px ${s.y}px,` +
        ` color-mix(in srgb, ${color} ${Math.round(s.a * alpha * 100)}%, transparent) 0 60%,` +
        ` transparent 100%)`,
    )
    .join(",");
}

const farStars = makeStars(26, FAR_TILE, 0x5eed, 0.6, 1.3);
const nearStars = makeStars(16, NEAR_TILE, 0xc0ffee, 0.9, 1.9);

const farStyle = {
  backgroundImage: field(farStars, "var(--color-text-subtle)"),
  backgroundSize: `${FAR_TILE}px ${FAR_TILE}px`,
};
const nearStyle = {
  backgroundImage: field(nearStars, "var(--color-text-muted)"),
  backgroundSize: `${NEAR_TILE}px ${NEAR_TILE}px`,
};
// Same geometry as .nodes-near, brighter — or the lit dots land beside the dim
// ones instead of on them.
const hotStyle = {
  backgroundImage: field(nearStars, "var(--color-primary-light)"),
  backgroundSize: `${NEAR_TILE}px ${NEAR_TILE}px`,
};

/* --- Cursor star ----------------------------------------------------------
   Eight rays as a conic gradient, intersected with a radial falloff. Cardinals
   get full alpha and diagonals ~0.55; multiplied by the same falloff the weaker
   diagonals reach zero sooner, so they read as the shorter four rays without
   needing a second falloff layer (the composite chain is linear — two
   independent intersect pairs are not expressible). */
const RAY_HALF_WIDTH = 13;

/** Diagonals sit below the cardinals so the same falloff extinguishes them
 *  sooner. Not too far below: a diagonal ray crossing a rectangular grid only
 *  lights short segments of horizontal and vertical lines, so it needs more
 *  alpha than a cardinal to read as a ray at all. */
const DIAGONAL_ALPHA = 0.72;

const conicRays = (() => {
  // The 0deg ray is split across the seam: its falling half opens the list and
  // its rising half closes it, so 0deg and 360deg meet at the same value and
  // the ray is symmetric rather than clipped.
  const stops: string[] = [
    `rgba(0,0,0,1) 0deg`,
    `transparent ${RAY_HALF_WIDTH}deg`,
  ];
  for (let i = 1; i < 8; i++) {
    const angle = i * 45;
    const alpha = i % 2 === 0 ? 1 : DIAGONAL_ALPHA;
    stops.push(
      `transparent ${angle - RAY_HALF_WIDTH}deg`,
      `rgba(0,0,0,${alpha}) ${angle}deg`,
      `transparent ${angle + RAY_HALF_WIDTH}deg`,
    );
  }
  stops.push(`transparent ${360 - RAY_HALF_WIDTH}deg`, `rgba(0,0,0,1) 360deg`);
  return stops.join(",");
})();

let stop: (() => void) | undefined;
let onMove: ((e: MouseEvent) => void) | undefined;
let loopId = 0;

/** How fast each thing chases the pointer, per frame. The layers lag on
 *  purpose — that weight is what sells the depth. The light does not: a
 *  spotlight that trails behind the cursor reads as lag, not as craft. */
const LAYER_EASE = 0.08;
const SPOT_EASE = 0.2;

onMounted(() => {
  if (prefersReducedMotion() || !root.value) return;
  const node = root.value;

  stop = onScrollFrame(() => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    // Progress drives the two tall strips, so their travel stays correct
    // whatever the page ends up measuring.
    node.style.setProperty("--p", max > 0 ? String(Math.min(1, y / max)) : "0");

    node.style.setProperty("--gy", String(-wrap(y * 0.06, GRID_TILE)));
    node.style.setProperty("--n1", String(-wrap(y * 0.1, FAR_TILE)));
    node.style.setProperty("--n2", String(-wrap(y * 0.22, NEAR_TILE)));
  });

  // Pointer state: a target set by the event, and a value that chases it.
  // Seeded at the viewport centre so a touch device — which never fires
  // mousemove — still gets the grid lit somewhere sensible.
  let tx = 0;
  let ty = 0;
  let tpx = window.innerWidth / 2;
  let tpy = window.innerHeight / 2;
  let cx = 0;
  let cy = 0;
  let cpx = tpx;
  let cpy = tpy;

  function tick() {
    cx += (tx - cx) * LAYER_EASE;
    cy += (ty - cy) * LAYER_EASE;
    cpx += (tpx - cpx) * SPOT_EASE;
    cpy += (tpy - cpy) * SPOT_EASE;

    node.style.setProperty("--mx", cx.toFixed(4));
    node.style.setProperty("--my", cy.toFixed(4));
    node.style.setProperty("--px", cpx.toFixed(1));
    node.style.setProperty("--py", cpy.toFixed(1));

    // Self-terminating: once it has caught up there is nothing to animate,
    // so the loop costs nothing at rest.
    const settled =
      Math.abs(tx - cx) < 0.0004 &&
      Math.abs(ty - cy) < 0.0004 &&
      Math.abs(tpx - cpx) < 0.4 &&
      Math.abs(tpy - cpy) < 0.4;

    loopId = settled ? 0 : requestAnimationFrame(tick);
  }

  onMove = (e: MouseEvent) => {
    tx = e.clientX / window.innerWidth - 0.5;
    ty = e.clientY / window.innerHeight - 0.5;
    tpx = e.clientX;
    tpy = e.clientY;
    // Always re-request rather than guarding on loopId: a frame requested while
    // the tab was hidden stays pending, and a `if (!loopId)` guard would then
    // refuse to restart the loop until it finally fired.
    if (loopId) cancelAnimationFrame(loopId);
    loopId = requestAnimationFrame(tick);
  };
  window.addEventListener("mousemove", onMove, { passive: true });

  tick(); // seed the custom properties before the first pointer event
});

onUnmounted(() => {
  stop?.();
  if (onMove) window.removeEventListener("mousemove", onMove);
  if (loopId) cancelAnimationFrame(loopId);
});
</script>

<template>
  <div
    ref="root"
    class="site-bg grain"
    :style="{ '--rays': conicRays }"
    aria-hidden="true"
  >
    <!-- 1 — aurora. 200vh of strip travelling 100vh puts a different mass on
         screen at the top, middle and bottom of the page. -->
    <div class="aurora" data-parallax>
      <span class="blob blob-a" />
      <span class="blob blob-b" />
      <span class="blob blob-c" />
    </div>

    <!-- 2 — node field, two densities at two depths. Dots, not lines, so the
         two planes read as depth instead of as a doubled grid. -->
    <div class="vignette">
      <div class="nodes nodes-far" :style="farStyle" data-parallax />
      <div class="nodes nodes-near" :style="nearStyle" data-parallax />
    </div>

    <!-- 3 — the grid. Exactly one, drawn bright once; the cursor mask carries
         it from a dim floor up to full strength, so "lit near the pointer" is
         a mask gradient rather than a second copy stacked on the first.
         Vignette (viewport edges) and spot (cursor) nest so both masks apply;
         the parallax is on the tile inside, so the light stays under the
         pointer while the grid scrolls beneath it. -->
    <div class="vignette">
      <div class="spot">
        <div class="grid" data-parallax />
        <div class="nodes-hot" :style="hotStyle" data-parallax />
      </div>
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
          :style="{
            animationDuration: `${t.dur}s`,
            animationDelay: `${t.delay}s`,
          }"
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
  --gy: 0;
  --n1: 0;
  --n2: 0;
}

/* Fades every tiled layer out before it reaches the viewport edge.
   The radii matter: the fade finishes at `transparent-stop x radius` from the
   centre, so 90% x 54% = 48.6% horizontally (x = 1.4% .. 98.6%) and
   90% x 48% = 43.2% from a 46% centre vertically (y = 2.8% .. 89.2%). Both
   land inside the frame — a wider ellipse finishes its fade off-screen and no
   vignette is visible at all. */
.vignette {
  position: absolute;
  inset: 0;
  mask-image: radial-gradient(
    ellipse 54% 48% at 50% 46%,
    #000 0,
    #000 30%,
    rgba(0, 0, 0, 0.4) 66%,
    transparent 90%
  );
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

/* --- 2. the grid --------------------------------------------------------- */

/* One grid, drawn at full strength. Each line sits at the CENTRE of its tile
   with a symmetric halo, so the glow spreads evenly either side of the line
   instead of trailing off to one side — and, being centred, it needs no
   wrap-around stops.

   The halo is baked into the gradient rather than done with filter: blur(),
   which would repaint a full-viewport layer on every pointer move. Verticals
   carry the purple, horizontals the blue.

   GRID_TILE in the script must match the 40px background-size below. */
.grid {
  position: absolute;
  inset: -160px;
  will-change: transform;
  background-image:
    linear-gradient(
      to right,
      transparent 14px,
      color-mix(in srgb, var(--color-primary) 24%, transparent) 18px,
      var(--color-primary-light) 19.5px,
      var(--color-primary-light) 20.5px,
      color-mix(in srgb, var(--color-primary) 24%, transparent) 22px,
      transparent 26px
    ),
    linear-gradient(
      to bottom,
      transparent 14px,
      color-mix(in srgb, var(--color-accent) 24%, transparent) 18px,
      var(--color-accent-light) 19.5px,
      var(--color-accent-light) 20.5px,
      color-mix(in srgb, var(--color-accent) 24%, transparent) 22px,
      transparent 26px
    );
  background-size: 40px 40px;
  transform: translate3d(
    calc(var(--mx) * -30px),
    calc(var(--gy) * 1px + var(--my) * -30px),
    0
  );
}

/* The cursor light. This does not reveal a second copy of the grid — it takes
   the single grid from a dim resting floor up to full strength, which is why
   there is nothing to misalign.

   Plain circle by default; the star below needs mask-composite, and without it
   every layer would fall back to `add` — stamping the ray pattern across the
   whole viewport rather than degrading quietly. */
.spot {
  position: absolute;
  inset: 0;
  mask-image: radial-gradient(
    circle 340px at calc(var(--px) * 1px) calc(var(--py) * 1px),
    #000 0%,
    rgba(0, 0, 0, 0.7) 30%,
    rgba(0, 0, 0, 0.2) 62%,
    rgba(0, 0, 0, 0.07) 84%,
    rgba(0, 0, 0, 0.07) 100%
  );
}

/* Eight-point star: rays ∩ falloff, then a solid core, then the resting floor.
   Order is load-bearing — the intersect has to happen before the floor is
   added, or the ray pattern gets stamped across the entire viewport. */
@supports (mask-composite: intersect) {
  .spot {
    mask-image:
      /* floor — the grid at rest */
      linear-gradient(rgba(0, 0, 0, 0.07), rgba(0, 0, 0, 0.07)),
      /* core — keeps the middle solid so the star is not hollow */
        radial-gradient(
          circle 88px at calc(var(--px) * 1px) calc(var(--py) * 1px),
          #000 0%,
          rgba(0, 0, 0, 0.55) 46%,
          transparent 100%
        ),
      /* rays — cardinals at full alpha, diagonals at 0.55 so the same falloff
         extinguishes them sooner and they read as the shorter four */
        conic-gradient(
          from 0deg at calc(var(--px) * 1px) calc(var(--py) * 1px),
          var(--rays)
        ),
      /* falloff — five stops, reaching 460px */
        radial-gradient(
          circle 460px at calc(var(--px) * 1px) calc(var(--py) * 1px),
          #000 0%,
          rgba(0, 0, 0, 0.78) 18%,
          rgba(0, 0, 0, 0.42) 42%,
          rgba(0, 0, 0, 0.16) 66%,
          transparent 100%
        );
    mask-composite: add, add, intersect, add;
  }
}

.nodes-hot {
  position: absolute;
  inset: -160px;
  will-change: transform;
  /* Must match .nodes-near exactly, or the lit dots sit beside the dim ones
     instead of on them — same star list, same tile, brighter colour. */
  transform: translate3d(
    calc(var(--mx) * -85px),
    calc(var(--n2) * 1px + var(--my) * -85px),
    0
  );
}

/* --- 3. node field ------------------------------------------------------- */

/* background-image and background-size are bound from the script — the tile is
   also the scroll wrap modulus, so it lives in exactly one place. */
.nodes {
  position: absolute;
  inset: -160px;
  will-change: transform;
}

.nodes-far {
  opacity: 0.55;
  transform: translate3d(
    calc(var(--mx) * -45px),
    calc(var(--n1) * 1px + var(--my) * -45px),
    0
  );
}

.nodes-near {
  opacity: 0.45;
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
