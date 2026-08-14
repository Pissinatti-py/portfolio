<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { personal } from '@/data/personal'
import { t, type I18nKey } from '@/i18n'
import { onScrollFrame } from '@/composables/useParallax'
import { useCommandPalette } from '@/composables/useCommandPalette'
import LanguageToggle from './LanguageToggle.vue'
import Icon from '@/components/ui/Icon.vue'

const { openPalette } = useCommandPalette()

const sections: { id: string; key: I18nKey }[] = [
  { id: 'build', key: 'nav.build' },
  { id: 'work', key: 'nav.work' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'skills', key: 'nav.skills' },
  { id: 'about', key: 'nav.about' },
  { id: 'contact', key: 'nav.contact' },
]

const active = ref('')
const scrolled = ref(false)
const progress = ref(0)
const menuOpen = ref(false)

let stop: (() => void) | undefined

onMounted(() => {
  stop = onScrollFrame(() => {
    const y = window.scrollY
    scrolled.value = y > 24

    const max = document.documentElement.scrollHeight - window.innerHeight
    progress.value = max > 0 ? Math.min(1, y / max) : 0

    // Walk backwards: the last section whose top has passed the nav is active.
    let current = ''
    for (const { id } of sections) {
      const el = document.getElementById(id)
      if (el && el.offsetTop - 120 <= y) current = id
    }
    active.value = current
  })
})

onUnmounted(() => stop?.())

function go(id: string) {
  menuOpen.value = false
  const el = document.getElementById(id)
  if (!el) return
  history.replaceState(null, '', `#${id}`)
  el.scrollIntoView({ behavior: 'smooth' })
}

const isMac = computed(
  () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform),
)
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
    :class="scrolled ? 'border-b border-border bg-surface/80 backdrop-blur-xl' : 'border-b border-transparent'"
  >
    <!-- Reading progress. Scale-only, so it never triggers layout. -->
    <div
      class="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-accent via-primary to-primary-light"
      :style="{ transform: `scaleX(${progress})` }"
    />

    <nav class="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:px-8">
      <a
        href="#top"
        class="group flex items-center gap-2.5 font-mono text-sm font-semibold tracking-tight"
        @click.prevent="go('top')"
      >
        <span
          class="grid h-7 w-7 place-items-center rounded-md border border-primary/40 bg-primary/10 text-[11px] text-primary transition-colors group-hover:bg-primary/20"
        >
          {{ personal.initials }}
        </span>
        <span class="hidden text-text sm:inline">marcus<span class="text-primary">.</span></span>
      </a>

      <ul class="ml-auto hidden items-center gap-1 md:flex">
        <li v-for="sec in sections" :key="sec.id">
          <a
            :href="`#${sec.id}`"
            class="relative rounded-md px-3 py-1.5 text-sm transition-colors"
            :class="active === sec.id ? 'text-text' : 'text-text-muted hover:text-text-body'"
            @click.prevent="go(sec.id)"
          >
            {{ t(sec.key) }}
            <span
              v-if="active === sec.id"
              class="absolute inset-x-3 -bottom-0.5 h-px bg-primary"
            />
          </a>
        </li>
      </ul>

      <div class="ml-auto flex items-center gap-2 md:ml-2">
        <button
          type="button"
          class="hidden items-center gap-2 rounded-full border border-border bg-surface-1/80 px-3 py-1.5 font-mono text-[11px] text-text-dim transition-colors hover:border-primary/40 hover:text-text-body sm:flex"
          @click="openPalette()"
        >
          <Icon name="search" :size="12" />
          <kbd class="tracking-wider">{{ isMac ? '⌘' : 'ctrl' }} K</kbd>
        </button>

        <LanguageToggle />

        <button
          type="button"
          class="grid h-8 w-8 place-items-center rounded-md border border-border text-text-body md:hidden"
          :aria-label="menuOpen ? t('nav.close') : t('nav.menu')"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <Icon :name="menuOpen ? 'close' : 'menu'" :size="18" />
        </button>
      </div>
    </nav>

    <Transition name="sheet">
      <ul
        v-if="menuOpen"
        class="border-t border-border bg-surface/95 px-5 py-3 backdrop-blur-xl md:hidden"
      >
        <li v-for="sec in sections" :key="sec.id">
          <a
            :href="`#${sec.id}`"
            class="flex items-center justify-between py-3 text-base"
            :class="active === sec.id ? 'text-primary' : 'text-text-body'"
            @click.prevent="go(sec.id)"
          >
            {{ t(sec.key) }}
            <Icon name="arrowRight" :size="16" class="opacity-40" />
          </a>
        </li>
      </ul>
    </Transition>
  </header>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
