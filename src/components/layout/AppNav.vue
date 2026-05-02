<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const links = [
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Skills", href: "#skills" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Contato", href: "#contato" },
];

const scrolled = ref(false);
const activeSection = ref("");

function onScroll() {
  scrolled.value = window.scrollY > 40;

  const sections = ["sobre", "projetos", "skills", "experiencia", "contato"];
  for (const id of [...sections].reverse()) {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) {
      activeSection.value = id;
      break;
    }
  }
}

onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
    :class="
      scrolled ? 'bg-[#0f0f11]/90 backdrop-blur border-b border-[#27272a]' : ''
    "
  >
    <nav class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <a
        href="#"
        class="font-mono text-sm text-[#a855f7] tracking-widest uppercase hover:text-[#c084fc] transition-colors"
      >
        MV
      </a>
      <ul class="hidden md:flex items-center gap-8">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            class="text-sm transition-colors duration-200 relative group"
            :class="
              activeSection === link.href.slice(1)
                ? 'text-white'
                : 'text-[#71717a] hover:text-[#e4e4e7]'
            "
          >
            {{ link.label }}
            <span
              class="absolute -bottom-0.5 left-0 h-px bg-[#a855f7] transition-all duration-300"
              :class="
                activeSection === link.href.slice(1)
                  ? 'w-full'
                  : 'w-0 group-hover:w-full'
              "
            />
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>
