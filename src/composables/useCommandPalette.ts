import { ref } from 'vue'

// Module-scoped state shared across all importers (same pattern as i18n.ts).
const open = ref(false)

export function openPalette() {
  open.value = true
}

export function closePalette() {
  open.value = false
}

export function togglePalette() {
  open.value = !open.value
}

let bound = false

/**
 * Registers the ⌘K / Ctrl-K toggle once, regardless of how many components
 * import this composable. Escape is handled inside `CommandPalette.vue` — it
 * needs to read the same `open` the template renders from.
 */
function ensureGlobalKeybind() {
  if (bound || typeof window === 'undefined') return
  bound = true
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      togglePalette()
    }
  })
}

ensureGlobalKeybind()

export function useCommandPalette() {
  return { open, openPalette, closePalette, togglePalette }
}
