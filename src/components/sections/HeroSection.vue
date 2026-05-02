<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { personal } from '@/data/personal'
import { useTypewriter } from '@/composables/useTypewriter'

const { displayed: typedName, done: nameDone } = useTypewriter(personal.name, 55, 300)

const showSubtitle = ref(false)
const showTagline = ref(false)
const showLinks = ref(false)

onMounted(() => {
  const nameLen = personal.name.length
  const nameDuration = 300 + nameLen * 55 + 200
  setTimeout(() => (showSubtitle.value = true), nameDuration)
  setTimeout(() => (showTagline.value = true), nameDuration + 300)
  setTimeout(() => (showLinks.value = true), nameDuration + 600)
})
</script>

<template>
  <section class="min-h-screen flex items-center relative overflow-hidden">
    <!-- Glow de fundo -->
    <div
      class="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
      style="background: radial-gradient(circle, #a855f7, transparent)"
    />
    <div
      class="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-5 blur-3xl pointer-events-none"
      style="background: radial-gradient(circle, #c084fc, transparent)"
    />

    <div class="max-w-5xl mx-auto px-6 pt-24 pb-16">
      <p class="font-mono text-sm text-[#a855f7] tracking-widest uppercase mb-6 animate-fade-in">
        Olá, meu nome é
      </p>

      <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-4 min-h-[1.2em]">
        {{ typedName }}<span
          class="inline-block w-0.5 h-[0.9em] align-middle ml-1 bg-[#a855f7]"
          :class="nameDone ? 'animate-blink' : ''"
        />
      </h1>

      <Transition name="fade-up">
        <h2
          v-if="showSubtitle"
          class="text-2xl md:text-3xl font-medium text-[#71717a] mb-6"
        >
          {{ personal.role }}
        </h2>
      </Transition>

      <Transition name="fade-up">
        <p
          v-if="showTagline"
          class="text-lg text-[#52525b] max-w-lg mb-10"
        >
          {{ personal.tagline }}
        </p>
      </Transition>

      <Transition name="fade-up">
        <div v-if="showLinks" class="flex items-center gap-4 flex-wrap">
          <a
            href="#projetos"
            class="px-5 py-2.5 bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/20"
          >
            Ver projetos
          </a>
          <a
            :href="personal.github"
            target="_blank"
            rel="noopener"
            class="px-5 py-2.5 border border-[#27272a] hover:border-[#a855f7] text-[#a1a1aa] hover:text-white text-sm font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            GitHub
          </a>
          <a
            :href="personal.linkedin"
            target="_blank"
            rel="noopener"
            class="px-5 py-2.5 border border-[#27272a] hover:border-[#a855f7] text-[#a1a1aa] hover:text-white text-sm font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            LinkedIn
          </a>
        </div>
      </Transition>

      <!-- Scroll indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30 animate-bounce-slow">
        <div class="w-px h-12 bg-gradient-to-b from-transparent to-[#a855f7]" />
        <svg class="w-4 h-4 text-[#a855f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes blink {
  0%, 100% { opacity: 1 }
  50% { opacity: 0 }
}
.animate-blink {
  animation: blink 1s step-end infinite;
}

@keyframes bounce-slow {
  0%, 100% { transform: translateX(-50%) translateY(0) }
  50% { transform: translateX(-50%) translateY(6px) }
}
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px) }
  to { opacity: 1; transform: translateY(0) }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out both;
}

.fade-up-enter-active {
  transition: all 0.5s ease-out;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
</style>
