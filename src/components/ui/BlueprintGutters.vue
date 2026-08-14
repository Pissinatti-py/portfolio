<script setup lang="ts">
/**
 * Engineering-drawing margins.
 *
 * The page's content column is `max-w-page` everywhere, so on a wide viewport
 * there is a band either side of it. It fills with a drafting blueprint
 * receding into depth: three grid planes at three tile sizes and three scroll
 * speeds, plus dimension marks riding a taller strip.
 *
 * The band is measured from `--gutter-edge`, which is narrower than the column —
 * so the column's outer edge deliberately sits over the inner part of it. The
 * horizontal fade is what keeps that overlap readable: the grid is nearly gone
 * by the point the content covers it.
 *
 * Everything here is scroll-linked. Nothing animates on its own, so the page is
 * perfectly still while someone is reading and the layer costs nothing at rest.
 */
import { onMounted, onUnmounted, ref } from "vue";
import { onScrollFrame, prefersReducedMotion } from "@/composables/useParallax";

const root = ref<HTMLElement | null>(null);

/** Tile sizes in px. Coarser + brighter + faster reads as nearer.
 *  These must match the `background-size` values in the style block below. */
const FINE = 14;
const MID = 42;
const COARSE = 84;

/** Keeps a tiled layer within one tile of origin — a repeating pattern shifted
 *  by a whole tile is indistinguishable from an unshifted one, so the travel
 *  never has to be bounded. */
const wrap = (v: number, m: number) => ((v % m) + m) % m;

type Kind = "vdim" | "hdim" | "radius" | "section" | "centre" | "crop" | "note";
interface Anno {
  /** Position down the 400vh strip, as a percentage of it. */
  y: number;
  kind: Kind;
  label?: string;
}

const SIDES = ["l", "r"] as const;

/* The two gutters carry different marks at different depths, so they never read
   as a copy-paste. Mirroring one SVG with scaleX(-1) would be cheaper but would
   reverse every label. */

const leftAnnos: Anno[] = [
  { y: 3, kind: "crop" },
  { y: 9, kind: "vdim", label: "240" },
  { y: 24, kind: "note", label: "SCALE 1:2" },
  { y: 31, kind: "centre" },
  { y: 46, kind: "radius", label: "R12" },
  { y: 59, kind: "hdim", label: "96" },
  { y: 70, kind: "note", label: "±0.05" },
  { y: 83, kind: "vdim", label: "128" },
  { y: 96, kind: "crop" },
];

const rightAnnos: Anno[] = [
  { y: 6, kind: "note", label: "Ø8.4" },
  { y: 14, kind: "hdim", label: "64" },
  { y: 28, kind: "section", label: "A—A" },
  { y: 40, kind: "centre" },
  { y: 55, kind: "vdim", label: "312" },
  { y: 69, kind: "radius", label: "R6" },
  { y: 80, kind: "note", label: "REV 03" },
  { y: 91, kind: "hdim", label: "48" },
];

let stop: (() => void) | undefined;

onMounted(() => {
  if (prefersReducedMotion() || !root.value) return;
  const node = root.value;

  stop = onScrollFrame(() => {
    const y = window.scrollY;

    // Pixel offsets, not page progress: a repeating grid needs a constant drift
    // rate, and progress would tie its speed to however long the page happens
    // to measure.
    node.style.setProperty("--g1", String(-wrap(y * 0.05, FINE)));
    node.style.setProperty("--g2", String(-wrap(y * 0.12, MID)));
    node.style.setProperty("--g3", String(-wrap(y * 0.24, COARSE)));

    // The marks are the opposite case. They ride a 400vh strip travelling 300vh,
    // so progress is exactly right — it is what puts different marks on screen
    // at different scroll depths instead of looping the same few.
    const max = document.documentElement.scrollHeight - window.innerHeight;
    node.style.setProperty("--p", max > 0 ? String(Math.min(1, y / max)) : "0");
  });
});

onUnmounted(() => stop?.());
</script>

<template>
  <div ref="root" class="gutters">
    <div
      v-for="side in SIDES"
      :key="side"
      class="gutter"
      :class="`gutter-${side}`"
    >
      <!-- The horizontal fade needs its own element: it has to intersect with
           the vertical one on .gutter, and nesting achieves that without
           mask-composite, whose fallback is `add` — that would stamp the
           pattern across the strip rather than degrade quietly.

           Only the grid is inside it. The marks sit outside, or the same fade
           that is meant to dissolve the grid would eat their labels. -->
      <div class="fade">
        <div class="plane fine" data-parallax />
        <div class="plane mid" data-parallax />
        <div class="plane coarse" data-parallax />
      </div>

      <div class="annos" data-parallax>
        <div
          v-for="(a, i) in side === 'l' ? leftAnnos : rightAnnos"
          :key="i"
          class="anno"
          :style="{ top: `${a.y}%` }"
        >
          <!-- vertical dimension: extension ticks, dimension line, arrowheads -->
          <svg
            v-if="a.kind === 'vdim'"
            width="34"
            height="92"
            viewBox="0 0 34 92"
            fill="none"
            stroke="currentColor"
          >
            <path d="M2 6h14M2 86h14" stroke-opacity="0.5" />
            <path d="M9 8v76" />
            <path
              d="M6.5 13 9 7l2.5 6M6.5 79 9 85l2.5-6"
              fill="currentColor"
              stroke="none"
            />
          </svg>

          <!-- horizontal dimension. Kept narrow: this is the widest mark, and
               it plus its label has to fit the gutter at the breakpoint where
               marks first appear. -->
          <svg
            v-else-if="a.kind === 'hdim'"
            width="56"
            height="14"
            viewBox="0 0 56 14"
            fill="none"
            stroke="currentColor"
          >
            <path d="M3 3v8M53 3v8" stroke-opacity="0.5" />
            <path d="M3 7h50" />
            <path
              d="M8 4.5 3 7l5 2.5M48 4.5 53 7l-5 2.5"
              fill="currentColor"
              stroke="none"
            />
          </svg>

          <!-- radius callout: arc, leader from centre, centre dot -->
          <svg
            v-else-if="a.kind === 'radius'"
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="none"
            stroke="currentColor"
          >
            <path d="M3 43A40 40 0 0 1 43 3" stroke-opacity="0.75" />
            <path d="M23 23 40 8" stroke-opacity="0.5" />
            <circle cx="23" cy="23" r="1.4" fill="currentColor" stroke="none" />
          </svg>

          <!-- section marker -->
          <svg
            v-else-if="a.kind === 'section'"
            width="52"
            height="20"
            viewBox="0 0 52 20"
            fill="none"
            stroke="currentColor"
          >
            <path d="M2 10h12M38 10h12" stroke-width="1.75" />
            <path
              d="M14 4v12M38 4v12"
              stroke-width="1.75"
              stroke-opacity="0.6"
            />
          </svg>

          <!-- centre line: the dash-dot pattern is the drafting tell -->
          <svg
            v-else-if="a.kind === 'centre'"
            width="18"
            height="110"
            viewBox="0 0 18 110"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M9 2v106"
              stroke-dasharray="14 4 2.5 4"
              stroke-opacity="0.7"
            />
          </svg>

          <!-- registration mark -->
          <svg
            v-else-if="a.kind === 'crop'"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
          >
            <path d="M8 0v16M0 8h16" stroke-opacity="0.6" />
          </svg>

          <!-- `note` has no glyph; the label is the whole mark. -->
          <span v-if="a.label" class="label">{{ a.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gutters {
  position: absolute;
  inset: 0;
}

/* Only worth drawing where there is room left after the overlap. At 82rem the
   gutter is 5.5rem and the content covers 2.5rem of it, leaving 3rem clear;
   any narrower and the overlap is most of the band. Below this the layer is
   simply absent, and phones and tablets keep the plain edge gradient. */
@media (width < 82rem) {
  .gutters {
    display: none;
  }
}

.gutter {
  position: absolute;
  top: 0;
  bottom: 0;
  overflow: hidden;

  /* Measured from --gutter-edge, not from the content column. The column is
     wider than that line, so its outer 3rem each side sits on top of the
     gutter — the overlap is deliberate, and it is the gap between the two
     tokens in style.css rather than a number tuned here.

     100% of .site-bg rather than 100vw: vw includes the classic scrollbar in
     Chrome, which would shift the gutter a few px. */
  width: max(0px, calc((100% - var(--gutter-edge)) / 2));

  /* Vertical fade, so the strips do not butt against the viewport edges. */
  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 10%,
    #000 90%,
    transparent 100%
  );
}

.gutter-l {
  left: 0;
}

.gutter-r {
  right: 0;
}

.fade {
  position: absolute;
  inset: 0;
}

/* Dissolve toward the content column instead of stopping at its edge. Starting
   at 55% rather than 70% now that the column overlaps the inner part of the
   gutter: the grid has to be most of the way gone by the time it passes under
   the content, not just beginning to fade. */
.gutter-l .fade {
  mask-image: linear-gradient(to right, #000 0, #000 55%, transparent 100%);
}

.gutter-r .fade {
  mask-image: linear-gradient(to left, #000 0, #000 55%, transparent 100%);
}

/* Overscanned vertically, so translating never drags an edge into view. */
.plane {
  position: absolute;
  top: -120px;
  right: 0;
  bottom: -120px;
  left: 0;
  will-change: transform;
}

/* Vertical grid lines are invariant under vertical translation, so they look
   static no matter what factor drives them. That is correct and physical: the
   verticals carry the graph-paper character, the horizontals carry the depth.
   All the visible parallax is in the horizontal lines. */
.fine {
  background-image:
    linear-gradient(
      to right,
      color-mix(in srgb, var(--color-primary-light) 12%, transparent) 0 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-primary-light) 12%, transparent) 0 1px,
      transparent 1px
    );
  background-size: 11px 11px;
  transform: translate3d(0, calc(var(--g1, 0) * 1px), 0);
}

.mid {
  background-image:
    linear-gradient(
      to right,
      color-mix(in srgb, var(--color-primary-light) 21%, transparent) 0 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-primary-light) 21%, transparent) 0 1px,
      transparent 1px
    );
  background-size: 33px 33px;
  transform: translate3d(0, calc(var(--g2, 0) * 1px), 0);
}

.coarse {
  background-image:
    linear-gradient(
      to right,
      color-mix(in srgb, var(--color-accent-light) 34%, transparent) 0 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-accent-light) 34%, transparent) 0 1px,
      transparent 1px
    );
  background-size: 66px 66px;
  transform: translate3d(0, calc(var(--g3, 0) * 1px), 0);
}

/* 400vh of strip travelling 300vh, so which marks you see changes as you go. */
.annos {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 400vh;
  color: var(--color-primary-light);
  will-change: transform;
  transform: translate3d(0, calc(var(--p, 0) * -300vh), 0);
}

/* Marks need more gutter than the grid does, so they start one step later.
   86rem leaves a 7.5rem gutter — 2.5rem overlapped, 5rem clear, which fits the
   widest mark (hdim at 56px plus a 7px gap, a label and the 14px inset). 90rem
   was too conservative: it hid them at 1412px, which is what a 1440px laptop
   actually reports once browser chrome is taken out. */
@media (width < 86rem) {
  .annos {
    display: none;
  }
}

.anno {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 7px;
  /* Higher than a full-width layer could get away with. That is the dividend of
     the margins-only placement: nothing here is ever behind text. */
  opacity: 0.6;
}

/* Aligned to the outer edge, where the horizontal mask is still opaque. */
.gutter-l .anno {
  left: 14px;
}

.gutter-r .anno {
  right: 14px;
  flex-direction: row-reverse;
}

.label {
  color: var(--color-accent-light);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  white-space: nowrap;
}
</style>
