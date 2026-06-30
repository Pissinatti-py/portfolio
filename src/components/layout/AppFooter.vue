<script setup lang="ts">
import { personal } from '@/data/personal'
import { t } from '@/i18n'
</script>

<template>
  <footer class="border-t border-[#27272a] py-8 mt-32">
    <div class="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="text-[#3f3f46] text-sm font-mono">
        &copy; {{ new Date().getFullYear() }} {{ personal.name }}
      </p>
      <p class="text-[#3f3f46] text-sm">
        {{ t('footer.madeWith') }}
      </p>
    </div>
  </footer>
</template>
