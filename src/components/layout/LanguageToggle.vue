<script setup lang="ts">
import { locale, setLocale } from '@/i18n'

const options = [
  { value: 'pt' as const, label: 'PT', flag: '🇧🇷' },
  { value: 'en' as const, label: 'EN', flag: '🇺🇸' },
]
</script>

<template>
  <div
    class="inline-flex items-center gap-0.5 p-0.5 rounded-lg border border-[#27272a] bg-[#18181c]"
  >
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="flex items-center gap-1.5 px-2 py-1 rounded-md font-mono text-xs transition-colors duration-200"
      :class="
        locale === opt.value
          ? 'bg-[#222228] text-white'
          : 'text-[#52525b] hover:text-[#a1a1aa]'
      "
      :aria-pressed="locale === opt.value"
      @click="setLocale(opt.value)"
    >
      <span aria-hidden="true">{{ opt.flag }}</span>
      {{ opt.label }}
    </button>
  </div>
</template>
