<script setup lang="ts">
import { locale, setLocale, type Locale } from '@/i18n'

const options: Locale[] = ['en', 'pt']
</script>

<template>
  <div
    class="flex items-center rounded-full border border-border bg-surface-1/80 p-0.5 font-mono text-[11px]"
    role="group"
    aria-label="Language"
  >
    <button
      v-for="l in options"
      :key="l"
      type="button"
      class="rounded-full px-2.5 py-1 uppercase transition-colors"
      :class="
        locale === l
          ? 'bg-primary/15 text-primary-light'
          : 'text-text-dim hover:text-text-body'
      "
      :aria-pressed="locale === l"
      @click="setLocale(l)"
    >
      {{ l }}
    </button>
  </div>
</template>
