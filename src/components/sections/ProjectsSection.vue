<script setup lang="ts">
import { computed, ref } from 'vue'
import { projects } from '@/data/projects'
import { t, tr, tProjectsShowAll } from '@/i18n'
import { vTilt } from '@/composables/useTilt'
import RevealBlock from '@/components/ui/RevealBlock.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const showAll = ref(false)
const activeTag = ref<string | null>(null)

const featured = computed(() => projects.filter((p) => p.featured))

const allTags = computed(() =>
  [...new Set(projects.flatMap((p) => p.stack))].sort((a, b) => a.localeCompare(b)),
)

// A tag filter overrides the featured/show-all model and shows every match.
const listed = computed(() => {
  if (activeTag.value) return projects.filter((p) => p.stack.includes(activeTag.value!))
  return showAll.value ? projects : featured.value
})

function selectTag(tag: string | null) {
  activeTag.value = activeTag.value === tag ? null : tag
}
</script>

<template>
  <section id="projetos" class="py-28 mx-auto max-w-5xl px-6 lg:px-10">
    <RevealBlock>
      <SectionHeading :label="t('section.projects.label')" :title="t('section.projects.title')" />
    </RevealBlock>

    <!-- Tech-tag filter -->
    <RevealBlock :delay="60">
      <div class="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-full border px-3 py-1 font-mono text-xs transition-colors duration-200"
          :class="
            activeTag === null
              ? 'border-[#a855f7] bg-[#a855f7]/10 text-[#c084fc]'
              : 'border-[#27272a] text-[#71717a] hover:border-[#a855f7]/40 hover:text-[#a1a1aa]'
          "
          @click="selectTag(null)"
        >
          {{ t('projects.filterAll') }}
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          type="button"
          class="rounded-full border px-3 py-1 font-mono text-xs transition-colors duration-200"
          :class="
            activeTag === tag
              ? 'border-[#a855f7] bg-[#a855f7]/10 text-[#c084fc]'
              : 'border-[#27272a] text-[#71717a] hover:border-[#a855f7]/40 hover:text-[#a1a1aa]'
          "
          @click="selectTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </RevealBlock>

    <TransitionGroup
      tag="div"
      name="bento"
      class="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:[grid-auto-flow:dense]"
    >
      <article
        v-for="(project, i) in listed"
        :key="project.id"
        v-tilt
        class="group flex h-full flex-col gap-4 rounded-xl border border-[#27272a] bg-[#18181c] p-6 transition-all duration-300 hover:border-[#a855f7]/50 hover:shadow-xl hover:shadow-black/20"
        :class="i === 0 ? 'lg:col-span-2' : ''"
      >
        <div class="flex items-start justify-between gap-2">
          <svg class="mt-0.5 h-8 w-8 shrink-0 text-[#a855f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <div class="flex items-center gap-3">
            <span
              v-if="!project.github"
              class="flex items-center gap-1 rounded border border-[#2c2c34] px-1.5 py-0.5 font-mono text-[10px] text-[#52525b]"
              :title="t('projects.privateTitle')"
            >
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {{ t('projects.private') }}
            </span>
            <a
              v-if="project.github"
              :href="project.github"
              target="_blank"
              rel="noopener"
              class="text-[#3f3f46] transition-colors hover:text-[#e4e4e7]"
              aria-label="GitHub"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              v-if="project.demo"
              :href="project.demo"
              target="_blank"
              rel="noopener"
              class="text-[#3f3f46] transition-colors hover:text-[#e4e4e7]"
              aria-label="Demo"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div class="flex-1">
          <h3 class="mb-2 text-base font-semibold transition-colors duration-200 group-hover:text-[#c084fc]">
            {{ tr(project.name) }}
          </h3>
          <p class="text-sm leading-relaxed text-[#71717a]">{{ tr(project.description) }}</p>
        </div>

        <ul class="mt-auto flex flex-wrap gap-1.5 pt-2">
          <li
            v-for="tech in project.stack"
            :key="tech"
            class="rounded border border-[#2c2c34] bg-[#222228] px-2 py-0.5 font-mono text-[10px] text-[#71717a]"
          >
            {{ tech }}
          </li>
        </ul>
      </article>
    </TransitionGroup>

    <RevealBlock v-if="activeTag === null" :delay="200">
      <div class="mt-10 text-center">
        <button
          class="rounded-lg border border-[#27272a] px-6 py-2.5 font-mono text-sm text-[#a855f7] transition-colors hover:border-[#a855f7]/50 hover:text-[#c084fc]"
          @click="showAll = !showAll"
        >
          {{ showAll ? t('projects.showLess') : tProjectsShowAll(projects.length) }}
        </button>
      </div>
    </RevealBlock>
  </section>
</template>

<style scoped>
.bento-enter-active,
.bento-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.bento-enter-from,
.bento-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
.bento-leave-active {
  position: absolute;
}
</style>
