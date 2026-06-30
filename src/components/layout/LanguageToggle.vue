<script setup lang="ts">
import { locale, setLocale } from '@/i18n'

const options = [
  { code: 'pt' as const, flag: '🇧🇷', label: 'Português' },
  { code: 'en' as const, flag: '🇺🇸', label: 'English' },
]
</script>

<template>
  <div class="flex items-center gap-1 rounded-lg border border-[#27272a] bg-[#18181c]/60 p-0.5">
    <button
      v-for="opt in options"
      :key="opt.code"
      type="button"
      :aria-label="opt.label"
      :aria-pressed="locale === opt.code"
      class="px-2 py-1 rounded-md text-base leading-none transition-all duration-200"
      :class="
        locale === opt.code
          ? 'bg-[#a855f7]/20 ring-1 ring-[#a855f7]/50 opacity-100'
          : 'opacity-50 grayscale hover:opacity-90 hover:grayscale-0'
      "
      @click="setLocale(opt.code)"
    >
      {{ opt.flag }}
    </button>
  </div>
</template>
