<script setup lang="ts">
import { personal } from '@/data/personal'
import RevealBlock from '@/components/ui/RevealBlock.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import avatar from '@/assets/avatar.webp'
</script>

<template>
  <section id="sobre" class="py-28 max-w-5xl mx-auto px-6">
    <RevealBlock>
      <SectionHeading label="01. sobre" title="Sobre mim" />
    </RevealBlock>

    <div class="grid md:grid-cols-5 gap-12 items-start">
      <RevealBlock :delay="100" class="md:col-span-3 space-y-4">
        <p
          v-for="(paragraph, i) in personal.about.split('\n')"
          :key="i"
          class="text-[#a1a1aa] leading-relaxed text-base"
        >
          {{ paragraph.trim() }}
        </p>
        <div class="pt-2">
          <a
            :href="`mailto:${personal.email}`"
            class="inline-flex items-center gap-2 font-mono text-sm text-[#a855f7] hover:text-[#c084fc] transition-colors group"
          >
            {{ personal.email }}
            <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </RevealBlock>

      <RevealBlock :delay="200" direction="right" class="md:col-span-2">
        <div class="relative group w-48 md:w-full max-w-xs mx-auto md:mx-0">
          <div class="aspect-square rounded-2xl overflow-hidden border border-[#27272a]">
            <img
              :src="avatar"
              :alt="personal.name"
              class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <!-- Borda decorativa -->
          <div
            class="absolute inset-0 rounded-2xl border border-[#a855f7]/30 translate-x-3 translate-y-3 -z-10 transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4"
          />
        </div>
      </RevealBlock>
    </div>
  </section>
</template>
