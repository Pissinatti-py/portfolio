<script setup lang="ts">
import { experience } from '@/data/experience'
import RevealBlock from '@/components/ui/RevealBlock.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
</script>

<template>
  <section id="experiencia" class="py-28 max-w-5xl mx-auto px-6">
    <RevealBlock>
      <SectionHeading label="04. trajetória" title="Experiência" />
    </RevealBlock>

    <div class="relative">
      <!-- Linha vertical -->
      <div class="absolute left-0 top-2 bottom-2 w-px bg-[#27272a] hidden md:block" />

      <div class="space-y-10">
        <RevealBlock
          v-for="(job, i) in experience"
          :key="job.id"
          :delay="i * 100"
        >
          <div class="md:pl-10 relative">
            <!-- Dot na linha -->
            <div class="absolute -left-1.5 top-2 w-3 h-3 rounded-full border-2 border-[#a855f7] bg-[#0f0f11] hidden md:block" />

            <div class="bg-[#18181c] border border-[#27272a] rounded-xl p-6 hover:border-[#a855f7]/30 transition-colors duration-300">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                <div>
                  <h3 class="font-semibold text-base">{{ job.role }}</h3>
                  <p class="text-[#a855f7] text-sm font-medium">{{ job.company }}</p>
                </div>
                <span class="font-mono text-xs text-[#52525b] bg-[#222228] px-3 py-1 rounded-full whitespace-nowrap self-start">
                  {{ job.period }}
                </span>
              </div>

              <p class="text-[#71717a] text-sm leading-relaxed mb-4">{{ job.description }}</p>

              <ul class="flex flex-wrap gap-1.5">
                <li
                  v-for="tech in job.stack"
                  :key="tech"
                  class="font-mono text-[10px] px-2 py-0.5 rounded bg-[#222228] text-[#71717a] border border-[#2c2c34]"
                >
                  {{ tech }}
                </li>
              </ul>
            </div>
          </div>
        </RevealBlock>
      </div>
    </div>
  </section>
</template>
