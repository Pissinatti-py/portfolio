<script setup lang="ts">
import { ref, computed } from 'vue'
import { projects } from '@/data/projects'
import RevealBlock from '@/components/ui/RevealBlock.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const showAll = ref(false)
const featured = computed(() => projects.filter((p) => p.featured))
const listed = computed(() => (showAll.value ? projects : featured.value))
</script>

<template>
  <section id="projetos" class="py-28 max-w-5xl mx-auto px-6">
    <RevealBlock>
      <SectionHeading label="02. projetos" title="Projetos" />
    </RevealBlock>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      <RevealBlock
        v-for="(project, i) in listed"
        :key="project.id"
        :delay="i * 80"
      >
        <article
          class="group h-full bg-[#18181c] border border-[#27272a] rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 hover:border-[#a855f7]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
        >
          <div class="flex items-start justify-between gap-2">
            <svg class="w-8 h-8 text-[#a855f7] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <div class="flex items-center gap-3">
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                rel="noopener"
                class="text-[#3f3f46] hover:text-[#e4e4e7] transition-colors"
                aria-label="GitHub"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                v-if="project.demo"
                :href="project.demo"
                target="_blank"
                rel="noopener"
                class="text-[#3f3f46] hover:text-[#e4e4e7] transition-colors"
                aria-label="Demo"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <div class="flex-1">
            <h3 class="text-base font-semibold mb-2 group-hover:text-[#c084fc] transition-colors duration-200">
              {{ project.name }}
            </h3>
            <p class="text-[#71717a] text-sm leading-relaxed">{{ project.description }}</p>
          </div>

          <ul class="flex flex-wrap gap-1.5 mt-auto pt-2">
            <li
              v-for="tech in project.stack"
              :key="tech"
              class="font-mono text-[10px] px-2 py-0.5 rounded bg-[#222228] text-[#71717a] border border-[#2c2c34]"
            >
              {{ tech }}
            </li>
          </ul>
        </article>
      </RevealBlock>
    </div>

    <RevealBlock :delay="200">
      <div class="mt-10 text-center">
        <button
          class="font-mono text-sm text-[#a855f7] hover:text-[#c084fc] transition-colors border border-[#27272a] hover:border-[#a855f7]/50 px-6 py-2.5 rounded-lg"
          @click="showAll = !showAll"
        >
          {{ showAll ? 'Mostrar menos' : `Ver todos os projetos (${projects.length})` }}
        </button>
      </div>
    </RevealBlock>
  </section>
</template>
