<script setup lang="ts">
/**
 * The portrait. Completely static until you hover it.
 *
 * Hovering wipes colour in from the top with a scan line riding the boundary,
 * lifts the photo slightly, and lights the offset frame — which also drifts
 * *against* the cursor. The frame sits behind the photo, so pushing it the other
 * way is what opens a gap and reads as depth rather than as a sliding element.
 *
 * Leaving unwinds all of it, so rest is always one known state and a second
 * hover replays the whole thing. That reversal is why the colour wipe is a
 * `transition` on a registered custom property rather than a keyframe animation:
 * an animation would need `animation-direction` plus a re-trigger to come back,
 * and a remount hack to restart at all.
 */
import { ref } from 'vue'
import { prefersReducedMotion } from '@/composables/useParallax'

defineProps<{ src: string; alt: string }>()

const skip = prefersReducedMotion()

const wrap = ref<HTMLElement | null>(null)

/** Frame travel, in px. The cursor offset is normalised against the half-size,
 *  so a pointer inside the element can never ask for more than this. */
const MAX = 8

function onMove(e: MouseEvent) {
  const node = wrap.value
  if (skip || !node) return
  const r = node.getBoundingClientRect()
  const fx = -((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * MAX
  const fy = -((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * MAX
  node.style.setProperty('--fx', fx.toFixed(1))
  node.style.setProperty('--fy', fy.toFixed(1))
}

function onLeave() {
  const node = wrap.value
  if (!node) return
  // The frame's transition eases it home; nothing to animate in JS.
  node.style.setProperty('--fx', '0')
  node.style.setProperty('--fy', '0')
}
</script>

<template>
  <div
    ref="wrap"
    class="portrait relative mx-auto w-56 sm:w-64 lg:w-full"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <span
      class="frame absolute inset-0 rounded-2xl border"
      aria-hidden="true"
    />

    <div class="relative overflow-hidden rounded-2xl border border-border">
      <img
        :src="src"
        :alt="alt"
        width="320"
        height="320"
        loading="lazy"
        decoding="async"
        class="photo block w-full object-cover grayscale"
      />

      <!-- Colour copy, wiped in from the top. Same URL as the base, so it costs
           no extra request. Masked out entirely at rest. -->
      <img
        :src="src"
        alt=""
        aria-hidden="true"
        width="320"
        height="320"
        decoding="async"
        class="photo decode absolute inset-0 block w-full object-cover"
      />

      <!-- The track is what moves; the line inside it only fades. Percentage
           translateY resolves against the track, which is the portrait's
           height — a 2px line has no useful height to translate by. Driving it
           from the same --decode as the mask welds the line to the colour edge,
           so there is no second timing to keep in sync. -->
      <span class="scan-track pointer-events-none absolute inset-0" aria-hidden="true">
        <span class="scan absolute inset-x-0 top-0 block h-0.5" />
      </span>
    </div>
  </div>
</template>

<style scoped>
/* Registering it is what makes it interpolate — an unregistered custom property
   neither animates nor transitions. `inherits` is on because both the mask and
   the scan track read it from the wrapper. */
@property --decode {
  syntax: '<percentage>';
  inherits: true;
  initial-value: 0%;
}

/* Rest is -8%, not 0%: the mask's 6% feather is still partly opaque at 0, which
   would leave a band of the colour copy showing. Negative puts both gradient
   stops at or below zero, and CSS clamps out-of-order stops to the preceding
   one, so the mask resolves fully transparent. */
.portrait {
  --decode: -8%;
  transition: --decode 700ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scoped :hover rather than Tailwind's group-hover: ProjectArt.vue carries
   `:global(.group:hover)` rules, so putting `group` on this wrapper would be a
   trap for whoever nests the two later. */
.portrait:hover {
  --decode: 106%;
}

.decode {
  mask-image: linear-gradient(
    to bottom,
    #000 0,
    #000 var(--decode),
    transparent calc(var(--decode) + 6%)
  );
}

/* Both copies scale together, or the colour one would drift off the grayscale
   one mid-hover. */
.photo {
  transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

.portrait:hover .photo {
  transform: scale(1.03);
}

/* The eased transition is the whole difference between "drifts" and "snaps" —
   writing a transform from a mousemove handler with nothing to smooth it is
   what makes a cursor effect feel cheap. */
.frame {
  border-color: color-mix(in srgb, var(--color-primary) 50%, transparent);
  transform: translate3d(
    calc(12px + var(--fx, 0) * 1px),
    calc(12px + var(--fy, 0) * 1px),
    0
  );
  transition:
    transform 400ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color 400ms ease,
    box-shadow 400ms ease;
}

.portrait:hover .frame {
  border-color: var(--color-primary);
  box-shadow: 0 0 30px -8px var(--color-primary);
}

.scan-track {
  transform: translateY(var(--decode));
}

.scan {
  opacity: 0;
  background: linear-gradient(
    to right,
    transparent,
    var(--color-primary-light),
    transparent
  );
  box-shadow: 0 0 14px 2px
    color-mix(in srgb, var(--color-primary) 55%, transparent);
  transition: opacity 250ms ease;
}

.portrait:hover .scan {
  opacity: 1;
}

/* The global rule clamps every transition to 0.01ms, so colour simply arrives on
   hover. The line is the one thing that has to go: instant would teleport it to
   the bottom edge rather than sweep. */
@media (prefers-reduced-motion: reduce) {
  .scan-track {
    display: none;
  }
}
</style>
