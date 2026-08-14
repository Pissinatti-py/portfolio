<script setup lang="ts">
/**
 * The page's only background layer — fixed, behind everything, continuous from
 * the hero to the footer.
 *
 * Three blurred masses sit on a strip twice the viewport's height. Scrolling
 * translates that strip one viewport upward, so the page walks past them and
 * the colour goes purple → navy → purple. No colour is ever animated: the
 * shift is pure position, which is why the whole effect costs one custom
 * property per frame and never repaints a gradient.
 *
 * There used to be six more layers here — a lit grid, two star planes, a
 * cursor spotlight, signal traces. Together they read as mud rather than
 * depth, and the brightest parts landed in the empty right half of the page
 * where there is no content. One idea, executed once, is worth more.
 */
import { onMounted, onUnmounted, ref } from "vue";
import { onScrollFrame, prefersReducedMotion } from "@/composables/useParallax";
import BlueprintGutters from "@/components/ui/BlueprintGutters.vue";

const root = ref<HTMLElement | null>(null);

let stop: (() => void) | undefined;

onMounted(() => {
  if (prefersReducedMotion() || !root.value) return;
  const node = root.value;

  stop = onScrollFrame(() => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    // Progress, not pixels — the travel stays correct whatever the page ends
    // up measuring.
    node.style.setProperty("--p", max > 0 ? String(Math.min(1, y / max)) : "0");
  });
});

onUnmounted(() => stop?.());
</script>

<template>
  <!-- .grain is not a second decorative layer: a 140px-blurred gradient across
       a dark viewport bands visibly on 8-bit displays, and the feTurbulence
       overlay is what hides it. Texture serving the gradient. -->
  <div ref="root" class="site-bg grain" aria-hidden="true">
    <div class="aurora" data-parallax>
      <span class="blob blob-a" />
      <span class="blob blob-b" />
      <span class="blob blob-c" />
    </div>

    <!-- Nested here rather than in App.vue so the background stays one entry
         point, and so the gutters inherit this element's viewport-fixed box,
         clipping and containment. -->
    <BlueprintGutters />
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
}

/* 200vh of strip travelling 100vh puts a different mass in the middle of the
   viewport at the top, the middle and the bottom of the page. */
.aurora {
  position: absolute;
  top: 0;
  left: -8%;
  right: -8%;
  height: 200vh;
  will-change: transform;
  transform: translate3d(0, calc(var(--p) * -100vh), 0);
}

.blob {
  position: absolute;
  display: block;
  border-radius: 50%;
  translate: -50% -50%;
  filter: blur(140px);
}

/* `top` picks the strip's 25% / 50% / 75% marks — precisely the points that sit
   mid-viewport at the top, middle and end of the page.

   `left` puts each mass on a viewport edge rather than behind the column of
   text. The strip is 116% wide (it bleeds 8% past each side), so the viewport's
   own edges land at 8/116 ≈ 7% and 108/116 ≈ 93% of it. Centring a blob there
   leaves half of it off-screen, which is the point: what reaches the page is the
   soft outer falloff, not the hot middle.

   Left, right, left — so scrolling swings the glow across the page and back
   rather than parking it anywhere. */
.blob-a {
  top: 25%;
  left: 7%;
  width: 46rem;
  height: 40rem;
  background: var(--color-primary);
  opacity: 0.2;
}

.blob-b {
  top: 50%;
  left: 93%;
  width: 44rem;
  height: 44rem;
  background: var(--color-accent);
  opacity: 0.22;
}

.blob-c {
  top: 75%;
  left: 7%;
  width: 48rem;
  height: 40rem;
  background: var(--color-primary-dark);
  opacity: 0.19;
}
</style>
