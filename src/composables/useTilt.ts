import type { Directive } from 'vue'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const MAX = 7 // max rotation in degrees
const SCALE = 1.02

interface TiltEl extends HTMLElement {
  _tiltMove?: (e: MouseEvent) => void
  _tiltLeave?: () => void
}

/**
 * `v-tilt` — 3D tilt that follows the cursor, applied per-element so it works
 * inside `v-for`. Fully inert when the user prefers reduced motion.
 */
export const vTilt: Directive<TiltEl> = {
  mounted(el) {
    if (prefersReducedMotion()) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform =
        `perspective(800px) rotateX(${-py * MAX * 2}deg) rotateY(${px * MAX * 2}deg) scale(${SCALE})`
    }
    const onLeave = () => {
      el.style.transform = ''
    }

    el.style.willChange = 'transform'
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    el._tiltMove = onMove
    el._tiltLeave = onLeave
  },
  unmounted(el) {
    if (el._tiltMove) el.removeEventListener('mousemove', el._tiltMove)
    if (el._tiltLeave) el.removeEventListener('mouseleave', el._tiltLeave)
  },
}
