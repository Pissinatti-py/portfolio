<script setup lang="ts">
import { personal } from '@/data/personal'
import { t, tr } from '@/i18n'
import { vMagnetic } from '@/composables/useMagnetic'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import RevealBlock from '@/components/ui/RevealBlock.vue'
import Icon from '@/components/ui/Icon.vue'
import type { IconName } from '@/components/ui/Icon.vue'

const links: { icon: IconName; label: string; url: string }[] = [
  { icon: 'github', label: '@Pissinatti-py', url: personal.github },
  { icon: 'github', label: '@Chuckpy', url: personal.githubEarly },
  { icon: 'linkedin', label: 'LinkedIn', url: personal.linkedin },
]
</script>

<template>
  <section id="contact" class="relative overflow-hidden px-5 py-28 sm:px-8 sm:py-36">
    <div class="relative mx-auto max-w-6xl">
      <SectionHeading :label="t('section.contact.label')" :title="t('section.contact.title')" />

      <RevealBlock>
        <p class="max-w-2xl text-lg leading-relaxed text-text-body">{{ t('contact.intro') }}</p>
      </RevealBlock>

      <RevealBlock :delay="120">
        <div class="mt-10 flex flex-wrap items-center gap-4">
          <a
            v-magnetic
            :href="personal.emailUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-medium text-white transition-colors hover:bg-primary-light"
          >
            <Icon name="mail" :size="18" />
            {{ t('contact.email') }}
            <Icon name="arrowRight" :size="15" class="transition-transform group-hover:translate-x-1" />
          </a>
          <span class="font-mono text-xs text-text-dim">{{ t('contact.responds') }}</span>
        </div>
      </RevealBlock>

      <RevealBlock :delay="220">
        <div class="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-8">
          <a
            :href="personal.emailUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono text-sm text-text-muted transition-colors hover:text-primary"
          >
            {{ personal.email }}
          </a>
          <a
            v-for="link in links"
            :key="link.label"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 font-mono text-sm text-text-muted transition-colors hover:text-primary"
          >
            <Icon :name="link.icon" :size="15" />
            {{ link.label }}
          </a>
          <span class="ml-auto font-mono text-xs text-text-dim">{{ tr(personal.location) }}</span>
        </div>
      </RevealBlock>
    </div>
  </section>
</template>
