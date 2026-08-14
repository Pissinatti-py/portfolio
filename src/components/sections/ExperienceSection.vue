<script setup lang="ts">
import { experience } from '@/data/experience'
import { t, tr } from '@/i18n'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import RevealBlock from '@/components/ui/RevealBlock.vue'
import Parallax from '@/components/ui/Parallax.vue'
</script>

<template>
  <section id="experience" class="relative mx-auto max-w-page px-5 py-28 sm:px-8 sm:py-36">
    <SectionHeading :label="t('section.experience.label')" :title="t('section.experience.title')" />

    <ol class="relative">
      <!-- The spine, fading out at both ends. -->
      <span
        class="absolute top-2 bottom-2 left-0 w-px bg-[linear-gradient(to_bottom,transparent,var(--color-primary)_22%,var(--color-accent)_78%,transparent)] lg:left-[9.5rem]"
        aria-hidden="true"
      />

      <li v-for="(job, i) in experience" :key="job.id" class="relative pb-14 last:pb-0">
        <RevealBlock :delay="i * 90">
          <div class="grid gap-x-8 gap-y-3 lg:grid-cols-[7.5rem_1fr]">
            <!-- Year lags behind the entry it labels. -->
            <Parallax :speed="-0.14" class="hidden lg:block">
              <span class="font-mono text-2xl font-bold text-text-subtle">{{ job.year }}</span>
            </Parallax>

            <div class="relative pl-8 lg:pl-10">
              <span
                class="absolute top-2 left-0 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary bg-surface"
                aria-hidden="true"
              />

              <p class="font-mono text-xs tracking-wide text-primary-light">{{ tr(job.period) }}</p>
              <h3 class="mt-2 text-xl font-semibold text-text">
                {{ tr(job.role) }}
                <span class="text-text-dim">·</span>
                <span class="text-primary-light">{{ job.company }}</span>
              </h3>
              <p class="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
                {{ tr(job.description) }}
              </p>
              <ul class="mt-5 flex flex-wrap gap-1.5">
                <li
                  v-for="tech in job.stack"
                  :key="tech"
                  class="rounded-md border border-border bg-surface-1 px-2 py-0.5 font-mono text-[10px] text-text-dim"
                >
                  {{ tech }}
                </li>
              </ul>
            </div>
          </div>
        </RevealBlock>
      </li>
    </ol>
  </section>
</template>
