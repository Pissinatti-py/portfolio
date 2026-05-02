import { onMounted, onUnmounted, ref } from 'vue'

export function useTypewriter(text: string, speed = 60, startDelay = 400) {
  const displayed = ref('')
  const done = ref(false)
  let timeout: ReturnType<typeof setTimeout>

  onMounted(() => {
    let i = 0
    timeout = setTimeout(function type() {
      displayed.value += text[i++]
      if (i < text.length) {
        timeout = setTimeout(type, speed)
      } else {
        done.value = true
      }
    }, startDelay)
  })

  onUnmounted(() => clearTimeout(timeout))

  return { displayed, done }
}
