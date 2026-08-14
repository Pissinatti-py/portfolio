<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { personal } from '@/data/personal'
import { projects } from '@/data/projects'
import { t, toggleLocale, tSwitchLanguage, type I18nKey } from '@/i18n'
import { useCommandPalette } from '@/composables/useCommandPalette'
import Icon from './Icon.vue'

const { open, closePalette } = useCommandPalette()

interface Command {
  id: string
  label: string
  group: string
  hint?: string
  run: () => void
}

const query = ref('')
const activeIndex = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

function goToSection(id: string) {
  closePalette()
  const el = document.getElementById(id)
  if (!el) return
  history.replaceState(null, '', `#${id}`)
  el.scrollIntoView({ behavior: 'smooth' })
}

function openExternal(url: string) {
  closePalette()
  window.open(url, '_blank', 'noopener')
}

const NAV: { id: string; key: I18nKey }[] = [
  { id: 'build', key: 'nav.build' },
  { id: 'work', key: 'nav.work' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'skills', key: 'nav.skills' },
  { id: 'about', key: 'nav.about' },
  { id: 'contact', key: 'nav.contact' },
]

// `t()` reads the reactive locale, so this whole list recomputes on switch.
const commands = computed<Command[]>(() => {
  const goto = t('palette.group.goto')
  const actions = t('palette.group.actions')
  const work = t('nav.work')

  return [
    ...NAV.map((s) => ({
      id: s.id,
      label: t(s.key),
      group: goto,
      run: () => goToSection(s.id),
    })),
    // Repos are searchable by name and by stack, so "rust" or "celery" finds them.
    ...projects
      .filter((p) => p.github)
      .map((p) => ({
        id: `repo-${p.id}`,
        label: p.name,
        group: work,
        hint: p.stack.slice(0, 3).join(' · '),
        run: () => openExternal(p.github!),
      })),
    { id: 'lang', label: tSwitchLanguage(), group: actions, run: () => toggleLocale() },
    {
      id: 'github',
      label: t('palette.social.github'),
      group: actions,
      run: () => openExternal(personal.github),
    },
    {
      id: 'github2',
      label: t('palette.social.github2'),
      group: actions,
      run: () => openExternal(personal.githubEarly),
    },
    {
      id: 'linkedin',
      label: t('palette.social.linkedin'),
      group: actions,
      run: () => openExternal(personal.linkedin),
    },
    {
      id: 'email',
      label: t('palette.social.email'),
      group: actions,
      run: () => openExternal(personal.emailUrl),
    },
  ]
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return commands.value
  return commands.value.filter((c) => `${c.label} ${c.hint ?? ''}`.toLowerCase().includes(q))
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

// Escape lives here rather than in the composable: it has to read the same
// `open` the template renders from, and the keydown handler on the overlay only
// fires while focus is inside it.
function onEscape(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  e.preventDefault()
  closePalette()
}

watch(open, (isOpen) => {
  if (isOpen) {
    query.value = ''
    activeIndex.value = 0
    document.addEventListener('keydown', onEscape)
    nextTick(() => inputEl.value?.focus())
  } else {
    document.removeEventListener('keydown', onEscape)
  }
})

onUnmounted(() => document.removeEventListener('keydown', onEscape))

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
      class="fixed inset-0 z-100 flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm"
      @click.self="closePalette"
      @keydown.esc.prevent="closePalette"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.enter.prevent="runActive"
    >
      <div
        class="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface-1 shadow-2xl shadow-black/50"
      >
        <div class="flex items-center gap-3 border-b border-border px-4">
          <Icon name="search" :size="16" class="text-text-dim" />
          <input
            ref="inputEl"
            v-model="query"
            type="text"
            :placeholder="t('palette.placeholder')"
            class="flex-1 bg-transparent py-3.5 text-sm text-text placeholder:text-text-dim focus:outline-none"
          />
          <kbd class="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-dim">
            esc
          </kbd>
        </div>

        <div class="max-h-[52vh] overflow-y-auto py-2">
          <p v-if="flat.length === 0" class="px-4 py-6 text-center text-sm text-text-dim">
            {{ t('palette.empty') }}
          </p>

          <div v-for="group in groups" :key="group.name" class="px-2 py-1">
            <p class="px-2 pt-2 pb-1 font-mono text-[10px] tracking-widest text-text-dim uppercase">
              {{ group.name }}
            </p>
            <button
              v-for="cmd in group.items"
              :key="cmd.id"
              type="button"
              class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
              :class="
                indexOf(cmd) === activeIndex
                  ? 'bg-surface-2 text-white'
                  : 'text-text-body hover:bg-surface-2/50'
              "
              @click="cmd.run()"
              @mouseenter="activeIndex = indexOf(cmd)"
            >
              <span
                class="h-1.5 w-1.5 shrink-0 rounded-full"
                :class="indexOf(cmd) === activeIndex ? 'bg-primary' : 'bg-text-subtle'"
              />
              <span class="truncate">{{ cmd.label }}</span>
              <span
                v-if="cmd.hint"
                class="ml-auto shrink-0 truncate pl-3 font-mono text-[10px] text-text-subtle"
              >
                {{ cmd.hint }}
              </span>
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
