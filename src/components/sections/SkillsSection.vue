<script setup lang="ts">
import { skills } from '@/data/skills'
import { t, tr } from '@/i18n'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import RevealBlock from '@/components/ui/RevealBlock.vue'
</script>

<template>
  <section id="skills" class="relative overflow-hidden py-28 sm:py-36">
    <div class="blueprint absolute inset-0 opacity-40" aria-hidden="true" />

    <div class="relative mx-auto max-w-6xl px-5 sm:px-8">
      <SectionHeading :label="t('section.skills.label')" :title="t('section.skills.title')" />

      <!-- One reveal for the whole grid: the `gap-px` hairlines come from the
           container's background, so fading cells individually would flash a
           solid slab. -->
      <RevealBlock>
        <div
          class="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
        >
          <div
            v-for="(group, i) in skills"
            :key="group.category.en"
            class="group bg-surface p-6 transition-colors duration-300 hover:bg-surface-1"
          >
            <p class="flex items-baseline gap-2 font-mono text-[11px] tracking-widest text-primary uppercase">
              <span class="text-text-subtle">{{ String(i + 1).padStart(2, '0') }}</span>
              {{ tr(group.category) }}
            </p>
            <ul class="mt-4 space-y-1.5">
              <li
                v-for="item in group.items"
                :key="item"
                class="text-sm text-text-muted transition-colors group-hover:text-text-body"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </RevealBlock>
    </div>
  </section>
</template>
