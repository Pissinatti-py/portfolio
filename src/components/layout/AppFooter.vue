<script setup lang="ts">
import { personal } from '@/data/personal'
import { t } from '@/i18n'
import Parallax from '@/components/ui/Parallax.vue'
import Icon from '@/components/ui/Icon.vue'

/** Decorative dither band — a nod to the terminal, generated rather than drawn. */
const CHARS = '░▒▓█'
// Wide enough to run past the widest viewport; the footer clips the overflow.
const band = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 260 }, (_, col) =>
    CHARS[Math.max(0, Math.min(3, Math.round(3 - row * 0.9 + Math.sin(col * 0.11) * 1.4 - 0.6)))],
  ).join(''),
)

const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative overflow-hidden border-t border-border">
    <Parallax :speed="0.3" class="pointer-events-none absolute inset-x-0 -bottom-6 select-none">
      <pre
        class="overflow-hidden font-mono text-[10px] leading-[0.9] whitespace-pre text-primary/[0.08] sm:text-sm"
        aria-hidden="true"
      >{{ band.join('\n') }}</pre>
    </Parallax>

    <div
      class="relative mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:px-8"
    >
      <p class="font-mono text-xs text-text-dim">© {{ year }} {{ personal.name }}</p>

      <a
        :href="personal.repo"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 font-mono text-xs text-text-dim transition-colors hover:text-primary sm:ml-auto"
      >
        <Icon name="github" :size="13" />
        {{ t('footer.source') }}
      </a>

      <p class="max-w-md font-mono text-xs text-text-subtle sm:text-right">
        {{ t('footer.built') }}
      </p>
    </div>
  </footer>
</template>
