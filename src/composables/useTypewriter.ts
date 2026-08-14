import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { prefersReducedMotion } from './useParallax'

/**
 * Types `text` out character by character. Accepts a ref so the effect can
 * restart when the source string changes (e.g. on a language switch).
 * Under reduced motion the full string is shown immediately.
 */
export function useTypewriter(text: Ref<string> | string, speed = 60, startDelay = 400) {
  const source = typeof text === 'string' ? ref(text) : text
  const displayed = ref('')
  const done = ref(false)
  let timeout: ReturnType<typeof setTimeout>

  function run() {
    clearTimeout(timeout)
    const full = source.value

    if (prefersReducedMotion()) {
      displayed.value = full
      done.value = true
      return
    }

    displayed.value = ''
    done.value = false
    let i = 0
    timeout = setTimeout(function type() {
      displayed.value += full[i++]
      if (i < full.length) {
        timeout = setTimeout(type, speed)
      } else {
        done.value = true
      }
    }, startDelay)
  }

  onMounted(run)
  watch(source, run)
  onUnmounted(() => clearTimeout(timeout))

  return { displayed, done }
}
