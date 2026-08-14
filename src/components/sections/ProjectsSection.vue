<script setup lang="ts">
import { computed, ref } from 'vue'
import { projects, TAGS, type Tag } from '@/data/projects'
import { t, tProjectsShowAll, tr } from '@/i18n'
import { vTilt } from '@/composables/useTilt'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ProjectArt from '@/components/ui/ProjectArt.vue'
import Parallax from '@/components/ui/Parallax.vue'
import Icon from '@/components/ui/Icon.vue'

const activeTag = ref<Tag | null>(null)
const showAll = ref(false)

/** A tag filter searches everything; otherwise the featured six lead. */
const visible = computed(() => {
  if (activeTag.value) return projects.filter((p) => p.tags.includes(activeTag.value!))
  return showAll.value ? projects : projects.filter((p) => p.featured)
})

function toggleTag(tag: Tag | null) {
  activeTag.value = activeTag.value === tag ? null : tag
}
</script>

<template>
  <section id="work" class="relative mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-36">
    <SectionHeading
      :label="t('section.work.label')"
      :title="t('section.work.title')"
      :intro="t('section.work.intro')"
    />

    <div class="mb-10 flex flex-wrap gap-2">
      <button
        type="button"
        class="rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors"
        :class="
          activeTag === null
            ? 'border-primary/50 bg-primary/10 text-primary-light'
            : 'border-border text-text-dim hover:border-text-subtle hover:text-text-body'
        "
        @click="toggleTag(null)"
      >
        {{ t('projects.filterAll') }}
      </button>
      <button
        v-for="tag in TAGS"
        :key="tag"
        type="button"
        class="rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors"
        :class="
          activeTag === tag
            ? 'border-primary/50 bg-primary/10 text-primary-light'
            : 'border-border text-text-dim hover:border-text-subtle hover:text-text-body'
        "
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <TransitionGroup
      name="bento"
      tag="div"
      class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      appear
    >
      <component
        :is="project.github ? 'a' : 'div'"
        v-for="(project, i) in visible"
        :key="project.id"
        v-tilt
        :href="project.github"
        :target="project.github ? '_blank' : undefined"
        :rel="project.github ? 'noopener noreferrer' : undefined"
        class="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-1/70 transition-[border-color,box-shadow] duration-300 hover:border-primary-light/40 hover:shadow-[0_0_50px_-14px_var(--color-primary),0_14px_44px_-22px_var(--color-accent)]"
        :class="i === 0 && !activeTag ? 'lg:col-span-2' : ''"
      >
        <!-- Cover art drifts a little against the card frame while scrolling. -->
        <div class="relative h-36 overflow-hidden border-b border-border">
          <Parallax :speed="0.08" class="absolute -inset-y-6 inset-x-0">
            <ProjectArt :motif="project.motif" :seed="project.id" class="h-full w-full" />
          </Parallax>
          <div class="absolute inset-0 bg-gradient-to-t from-surface-1/90 via-transparent to-transparent" />

          <span
            v-if="project.account"
            class="absolute top-3 right-3 rounded-full border border-border bg-surface/80 px-2.5 py-1 font-mono text-[10px] text-text-dim backdrop-blur"
          >
            @{{ project.account }}
          </span>
          <span
            v-else
            class="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-2.5 py-1 font-mono text-[10px] text-text-dim backdrop-blur"
            :title="t('projects.privateTitle')"
          >
            <Icon name="lock" :size="10" />
            {{ t('projects.private') }}
          </span>
        </div>

        <div class="flex flex-1 flex-col p-5">
          <h3 class="flex items-center gap-2 font-mono text-base font-semibold text-text">
            {{ project.name }}
            <Icon
              v-if="project.github"
              name="external"
              :size="13"
              class="text-text-subtle transition-all group-hover:translate-x-0.5 group-hover:text-primary-light"
            />
          </h3>

          <p class="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
            {{ tr(project.description) }}
          </p>

          <ul class="mt-5 flex flex-wrap gap-1.5">
            <li
              v-for="tech in project.stack"
              :key="tech"
              class="rounded-md border border-border bg-surface-2/60 px-2 py-0.5 font-mono text-[10px] text-text-dim"
            >
              {{ tech }}
            </li>
          </ul>
        </div>
      </component>
    </TransitionGroup>

    <p v-if="visible.length === 0" class="py-12 text-center text-sm text-text-dim">
      {{ t('projects.empty') }}
    </p>

    <div v-if="!activeTag" class="mt-12 flex justify-center">
      <button
        type="button"
        class="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-mono text-xs text-text-body transition-colors hover:border-primary/50 hover:text-text"
        @click="showAll = !showAll"
      >
        {{ showAll ? t('projects.showLess') : tProjectsShowAll(projects.length) }}
        <Icon
          name="arrowDown"
          :size="14"
          class="transition-transform duration-300"
          :class="showAll ? 'rotate-180' : 'group-hover:translate-y-0.5'"
        />
      </button>
    </div>
  </section>
</template>

<style scoped>
.bento-move,
.bento-enter-active,
.bento-leave-active {
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.bento-enter-from,
.bento-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(12px);
}
.bento-leave-active {
  position: absolute;
}
</style>
