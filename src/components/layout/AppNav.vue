<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { t } from "@/i18n";
import LanguageToggle from "@/components/layout/LanguageToggle.vue";

const links = [
  { key: "nav.about", href: "#sobre" },
  { key: "nav.projects", href: "#projetos" },
  { key: "nav.skills", href: "#skills" },
  { key: "nav.experience", href: "#experiencia" },
  { key: "nav.contact", href: "#contato" },
] as const;

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
    <nav class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
      <a
        href="#"
        class="font-mono text-sm text-[#a855f7] tracking-widest uppercase hover:text-[#c084fc] transition-colors"
      >
        MV
      </a>
      <div class="flex items-center gap-6">
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
              {{ t(link.key) }}
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
        <LanguageToggle />
      </div>
    </nav>
  </header>
</template>
