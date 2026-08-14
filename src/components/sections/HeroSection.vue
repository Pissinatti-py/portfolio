<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { personal, stats } from '@/data/personal'
import { locale, t, tr } from '@/i18n'
import { useTypewriter } from '@/composables/useTypewriter'
import { prefersReducedMotion } from '@/composables/useParallax'
import Icon from '@/components/ui/Icon.vue'
import { vMagnetic } from '@/composables/useMagnetic'

const variants = computed(() => personal.roleVariants[locale.value])

// Cycle the role line. useTypewriter restarts whenever its source ref changes,
// so advancing the index is the whole animation.
const index = ref(0)
const current = computed(() => variants.value[index.value % variants.value.length])
const { displayed, done } = useTypewriter(current, 45, 600)

let timer: ReturnType<typeof setInterval> | undefined
if (!prefersReducedMotion()) timer = setInterval(() => index.value++, 5200)
onUnmounted(() => clearInterval(timer))

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <!-- Backdrop comes from SiteBackground.vue, which runs behind the whole page. -->
  <section
    id="top"
    class="relative flex min-h-[100svh] items-center px-5 pt-24 pb-16 sm:px-8"
  >
    <div class="relative mx-auto w-full max-w-6xl">
      <!-- Availability: stated plainly, once, and never mentioned again. -->
      <p
        class="fade-up inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.07] py-1.5 pr-4 pl-3 font-mono text-[11px] tracking-wide text-primary-light"
        style="animation-delay: 0.05s"
      >
        <span class="relative flex h-2 w-2">
          <span class="ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        {{ t('hero.available') }}
      </p>

      <p
        class="fade-up mt-8 font-mono text-sm text-text-muted"
        style="animation-delay: 0.15s"
      >
        {{ t('hero.greeting') }}
      </p>

      <h1
        class="fade-up mt-2 text-5xl font-bold tracking-tighter text-text sm:text-7xl lg:text-8xl"
        style="animation-delay: 0.25s"
      >
        {{ personal.name }}<span class="text-primary">.</span>
      </h1>

      <!-- Reserved height so the cycling line never reflows the page. -->
      <p
        class="fade-up mt-5 flex min-h-[5rem] items-start font-mono text-base text-primary-light sm:min-h-[2.5rem] sm:text-lg"
        style="animation-delay: 0.35s"
        aria-live="off"
      >
        <span class="text-text-dim">&gt;&nbsp;</span>
        <span>{{ displayed }}<span class="caret" :class="done && 'blink'">▍</span></span>
      </p>
      <span class="sr-only">{{ tr(personal.role) }}</span>

      <p
        class="fade-up mt-8 max-w-2xl text-lg leading-relaxed text-text-body"
        style="animation-delay: 0.45s"
      >
        {{ t('hero.pitch') }}
      </p>

      <div class="fade-up mt-10 flex flex-wrap items-center gap-3" style="animation-delay: 0.55s">
        <button
          v-magnetic
          type="button"
          class="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
          @click="go('work')"
        >
          {{ t('hero.cta') }}
          <Icon name="arrowRight" :size="15" class="transition-transform group-hover:translate-x-1" />
        </button>
        <button
          v-magnetic
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-text-body transition-colors hover:border-primary/50 hover:text-text"
          @click="go('contact')"
        >
          {{ t('hero.ctaAlt') }}
        </button>
        <span class="ml-1 inline-flex items-center gap-1.5 font-mono text-xs text-text-dim">
          <Icon name="pin" :size="13" />
          {{ tr(personal.location) }}
        </span>
      </div>

      <dl
        class="fade-up mt-16 flex flex-wrap gap-x-12 gap-y-6 border-t border-border pt-8"
        style="animation-delay: 0.7s"
      >
        <div v-for="stat in stats" :key="stat.value">
          <dt class="font-mono text-3xl font-bold text-text">{{ stat.value }}</dt>
          <dd class="mt-1 font-mono text-[11px] tracking-wider text-text-dim uppercase">
            {{ tr(stat.label) }}
          </dd>
        </div>
      </dl>
    </div>

    <button
      type="button"
      class="absolute inset-x-0 bottom-6 mx-auto hidden w-fit flex-col items-center gap-1 font-mono text-[10px] tracking-[0.25em] text-text-subtle uppercase transition-colors hover:text-text-muted lg:flex"
      @click="go('build')"
    >
      {{ t('hero.scroll') }}
      <Icon name="arrowDown" :size="14" class="bob" />
    </button>
  </section>
</template>

<style scoped>
.fade-up {
  animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}
.caret {
  opacity: 1;
}
.blink {
  animation: blink 1.1s step-end infinite;
}
.ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
.bob {
  animation: bob 2.4s ease-in-out infinite;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
@keyframes ping {
  75%,
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
@keyframes bob {
  50% {
    transform: translateY(5px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-up,
  .blink,
  .ping,
  .bob {
    animation: none;
  }
}
</style>
