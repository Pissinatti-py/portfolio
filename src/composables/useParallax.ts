import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* --- Shared scroll ticker -------------------------------------------------
   One scroll/resize listener and one rAF for the whole page, no matter how
   many parallax layers subscribe. Callbacks run inside the frame, so they are
   free to read layout and write transforms. */

type Sub = () => void

const subs = new Set<Sub>()
let frame = 0
let attached = false

function flush() {
  frame = 0
  for (const sub of subs) sub()
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(flush)
}

/** Subscribe to the shared scroll ticker. Returns an unsubscribe function. */
export function onScrollFrame(fn: Sub): () => void {
  subs.add(fn)
  if (!attached) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    attached = true
  }
  fn() // position correctly before the first scroll event
  return () => {
    subs.delete(fn)
    if (subs.size === 0 && attached) {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      attached = false
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }
  }
}

/**
 * Scroll-linked vertical offset.
 *
 * `speed` is in viewport-height units per full traversal: a layer with
 * speed 0.2 drifts 20vh slower than the page across the time it is on screen.
 * Negative values move against the scroll. Transform-only, so it never
 * triggers layout or contributes to CLS.
 */
export function useParallax(speed = 0.15) {
  const el: Ref<HTMLElement | null> = ref(null)
  let stop: (() => void) | undefined

  onMounted(() => {
    if (prefersReducedMotion() || !el.value) return
    const node = el.value
    node.style.willChange = 'transform'

    stop = onScrollFrame(() => {
      const rect = node.getBoundingClientRect()
      const vh = window.innerHeight
      // Skip work while off-screen, but keep the last transform so the layer
      // does not snap when it scrolls back in.
      if (rect.bottom < -vh * 0.5 || rect.top > vh * 1.5) return
      // -1 when the element sits a screen below the fold, +1 a screen above.
      const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh
      node.style.transform = `translate3d(0, ${progress * speed * 100}px, 0)`
    })
  })

  onUnmounted(() => stop?.())

  return { el }
}

