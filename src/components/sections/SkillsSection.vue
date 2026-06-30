<script setup lang="ts">
import { skills } from '@/data/skills'
import { t, tr } from '@/i18n'
import RevealBlock from '@/components/ui/RevealBlock.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
</script>

<template>
  <section id="skills" class="bg-[#18181c]/50 py-28">
    <div class="mx-auto max-w-5xl px-6 lg:px-10">
      <RevealBlock>
        <SectionHeading :label="t('section.skills.label')" :title="t('section.skills.title')" />
      </RevealBlock>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:[grid-auto-flow:dense]">
        <RevealBlock
          v-for="(group, i) in skills"
          :key="group.category.en"
          :delay="i * 80"
          :class="group.items.length >= 8 ? 'sm:col-span-2' : ''"
        >
          <div class="h-full rounded-xl border border-[#27272a] bg-[#18181c] p-6 transition-colors duration-300 hover:border-[#a855f7]/30">
            <h3 class="mb-4 font-mono text-xs uppercase tracking-widest text-[#a855f7]">
              {{ tr(group.category) }}
            </h3>
            <ul class="flex flex-wrap gap-2">
              <li
                v-for="item in group.items"
                :key="item"
                class="cursor-default rounded-md border border-[#2c2c34] bg-[#222228] px-3 py-1 text-sm text-[#a1a1aa] transition-all duration-200 hover:border-[#a855f7]/40 hover:text-white"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </RevealBlock>
      </div>
    </div>
  </section>
</template>
