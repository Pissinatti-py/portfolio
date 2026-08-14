import type { Directive } from 'vue'
import { prefersReducedMotion } from './useParallax'

const STRENGTH = 0.3 // fraction of cursor offset the element follows

interface MagneticEl extends HTMLElement {
  _magMove?: (e: MouseEvent) => void
  _magLeave?: () => void
}

/**
 * `v-magnetic` — nudges an element toward the cursor while hovering.
 * Applied per-element (works in `v-for`); inert under reduced motion.
 */
export const vMagnetic: Directive<MagneticEl> = {
  mounted(el) {
    if (prefersReducedMotion()) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - (rect.left + rect.width / 2)) * STRENGTH
      const y = (e.clientY - (rect.top + rect.height / 2)) * STRENGTH
      el.style.transform = `translate(${x}px, ${y}px)`
    }
    const onLeave = () => {
      el.style.transform = ''
    }

    el.style.willChange = 'transform'
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    el._magMove = onMove
    el._magLeave = onLeave
  },
  unmounted(el) {
    if (el._magMove) el.removeEventListener('mousemove', el._magMove)
    if (el._magLeave) el.removeEventListener('mouseleave', el._magLeave)
  },
}
