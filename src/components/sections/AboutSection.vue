<script setup lang="ts">
import { computed } from 'vue'
import avatar from '@/assets/avatar.webp'
import { personal } from '@/data/personal'
import { t, tr } from '@/i18n'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import RevealBlock from '@/components/ui/RevealBlock.vue'
import Parallax from '@/components/ui/Parallax.vue'
import Icon from '@/components/ui/Icon.vue'

const paragraphs = computed(() => tr(personal.about).split('\n\n'))

const accounts = [
  { url: personal.github, handle: '@Pissinatti-py', note: 'links.currentWork' },
  { url: personal.githubEarly, handle: '@Chuckpy', note: 'links.earlyWork' },
] as const
</script>

<template>
  <section id="about" class="relative mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-36">
    <SectionHeading :label="t('section.about.label')" :title="t('section.about.title')" />

    <div class="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
      <div class="order-2 lg:order-1">
        <RevealBlock v-for="(para, i) in paragraphs" :key="i" :delay="i * 100">
          <p class="mb-5 max-w-2xl text-base leading-relaxed text-text-body">{{ para }}</p>
        </RevealBlock>

        <RevealBlock :delay="300">
          <div class="mt-8 flex flex-wrap gap-3">
            <a
              v-for="acc in accounts"
              :key="acc.handle"
              :href="acc.url"
              target="_blank"
              rel="noopener noreferrer"
              class="group inline-flex items-center gap-2.5 rounded-xl border border-border bg-surface-1/60 px-4 py-3 transition-colors hover:border-primary/45"
            >
              <Icon name="github" :size="18" class="text-text-muted transition-colors group-hover:text-primary" />
              <span class="text-left">
                <span class="block font-mono text-sm text-text">{{ acc.handle }}</span>
                <span class="block font-mono text-[10px] tracking-wider text-text-dim uppercase">
                  {{ t(acc.note) }}
                </span>
              </span>
            </a>
          </div>
        </RevealBlock>
      </div>

      <!-- Portrait rises slightly against the copy beside it. -->
      <Parallax :speed="-0.1" class="order-1 lg:order-2">
        <RevealBlock direction="scale">
          <div class="relative mx-auto w-56 sm:w-64 lg:w-full">
            <span
              class="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-primary/50"
              aria-hidden="true"
            />
            <img
              :src="avatar"
              :alt="personal.name"
              width="320"
              height="320"
              loading="lazy"
              decoding="async"
              class="relative w-full rounded-2xl border border-border object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
            />
          </div>
        </RevealBlock>
      </Parallax>
    </div>
  </section>
</template>
