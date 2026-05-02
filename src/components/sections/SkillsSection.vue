<script setup lang="ts">
import { skills } from '@/data/skills'
import RevealBlock from '@/components/ui/RevealBlock.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
</script>

<template>
  <section id="skills" class="py-28 bg-[#18181c]/50">
    <div class="max-w-5xl mx-auto px-6">
      <RevealBlock>
        <SectionHeading label="03. habilidades" title="Skills" />
      </RevealBlock>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RevealBlock
          v-for="(group, i) in skills"
          :key="group.category"
          :delay="i * 80"
        >
          <div class="bg-[#18181c] border border-[#27272a] rounded-xl p-6 hover:border-[#a855f7]/30 transition-colors duration-300">
            <h3 class="font-mono text-xs text-[#a855f7] tracking-widest uppercase mb-4">
              {{ group.category }}
            </h3>
            <ul class="flex flex-wrap gap-2">
              <li
                v-for="item in group.items"
                :key="item"
                class="text-sm px-3 py-1 rounded-md bg-[#222228] border border-[#2c2c34] text-[#a1a1aa] hover:text-white hover:border-[#a855f7]/40 transition-all duration-200 cursor-default"
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
