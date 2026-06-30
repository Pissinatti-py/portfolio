<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { personal } from '@/data/personal'
import { t, toggleLocale, tSwitchLanguage } from '@/i18n'
import { useCommandPalette } from '@/composables/useCommandPalette'

const { open, closePalette } = useCommandPalette()

interface Command {
  id: string
  label: string
  group: string
  run: () => void
}

const query = ref('')
const activeIndex = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

function goToSection(id: string) {
  closePalette()
  const el = document.getElementById(id)
  if (el) {
    history.replaceState(null, '', `#${id}`)
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function openExternal(url: string) {
  closePalette()
  window.open(url, '_blank', 'noopener')
}

// `t()` / `tSwitchLanguage()` read the reactive locale, so this recomputes on switch.
const commands = computed<Command[]>(() => {
  const goto = t('palette.group.goto')
  const actions = t('palette.group.actions')
  return [
    { id: 'about', label: t('nav.about'), group: goto, run: () => goToSection('sobre') },
    { id: 'projects', label: t('nav.projects'), group: goto, run: () => goToSection('projetos') },
    { id: 'skills', label: t('nav.skills'), group: goto, run: () => goToSection('skills') },
    { id: 'experience', label: t('nav.experience'), group: goto, run: () => goToSection('experiencia') },
    { id: 'contact', label: t('nav.contact'), group: goto, run: () => goToSection('contato') },
    { id: 'lang', label: tSwitchLanguage(), group: actions, run: () => toggleLocale() },
    { id: 'github', label: t('palette.social.github'), group: actions, run: () => openExternal(personal.github) },
    { id: 'linkedin', label: t('palette.social.linkedin'), group: actions, run: () => openExternal(personal.linkedin) },
    { id: 'email', label: t('palette.social.email'), group: actions, run: () => openExternal(`mailto:${personal.email}`) },
  ]
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return commands.value
  return commands.value.filter((c) => c.label.toLowerCase().includes(q))
})

// Grouped view for rendering, preserving filtered order.
const groups = computed(() => {
  const map = new Map<string, Command[]>()
  for (const c of filtered.value) {
    if (!map.has(c.group)) map.set(c.group, [])
    map.get(c.group)!.push(c)
  }
  return [...map.entries()].map(([name, items]) => ({ name, items }))
})

// Flattened order must match the grouped render order so arrow nav lines up.
const flat = computed(() => groups.value.flatMap((g) => g.items))

watch(query, () => (activeIndex.value = 0))

watch(open, (isOpen) => {
  if (isOpen) {
    query.value = ''
    activeIndex.value = 0
    nextTick(() => inputEl.value?.focus())
  }
})

function move(delta: number) {
  const n = flat.value.length
  if (n === 0) return
  activeIndex.value = (activeIndex.value + delta + n) % n
}

function runActive() {
  flat.value[activeIndex.value]?.run()
}

function indexOf(cmd: Command) {
  return flat.value.indexOf(cmd)
}
</script>

<template>
  <Transition name="palette">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[18vh] bg-black/60 backdrop-blur-sm"
      @click.self="closePalette"
      @keydown.esc.prevent="closePalette"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.enter.prevent="runActive"
    >
      <div
        class="w-full max-w-lg overflow-hidden rounded-xl border border-[#27272a] bg-[#18181c] shadow-2xl shadow-black/50"
      >
        <div class="flex items-center gap-3 border-b border-[#27272a] px-4">
          <svg class="w-4 h-4 text-[#52525b] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            ref="inputEl"
            v-model="query"
            type="text"
            :placeholder="t('palette.placeholder')"
            class="flex-1 bg-transparent py-3.5 text-sm text-[#e4e4e7] placeholder:text-[#52525b] focus:outline-none"
          />
          <kbd class="font-mono text-[10px] text-[#52525b] border border-[#27272a] rounded px-1.5 py-0.5">
            esc
          </kbd>
        </div>

        <div class="max-h-[50vh] overflow-y-auto py-2">
          <p v-if="flat.length === 0" class="px-4 py-6 text-center text-sm text-[#52525b]">
            {{ t('palette.empty') }}
          </p>

          <div v-for="group in groups" :key="group.name" class="px-2 py-1">
            <p class="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-[#52525b]">
              {{ group.name }}
            </p>
            <button
              v-for="cmd in group.items"
              :key="cmd.id"
              type="button"
              class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
              :class="
                indexOf(cmd) === activeIndex
                  ? 'bg-[#222228] text-white'
                  : 'text-[#a1a1aa] hover:bg-[#1f1f24]'
              "
              @click="cmd.run()"
              @mouseenter="activeIndex = indexOf(cmd)"
            >
              <span
                class="h-1.5 w-1.5 shrink-0 rounded-full"
                :class="indexOf(cmd) === activeIndex ? 'bg-[#a855f7]' : 'bg-[#3f3f46]'"
              />
              {{ cmd.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.18s ease;
}
.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}
</style>
