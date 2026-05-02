<script setup lang="ts">
defineProps<{ label: string; title: string }>()
</script>

<template>
  <div class="mb-12">
    <p class="font-mono text-xs text-[#a855f7] tracking-widest uppercase mb-2">{{ label }}</p>
    <h2 class="text-3xl font-semibold tracking-tight">{{ title }}</h2>
    <div class="mt-4 h-px w-12 bg-[#a855f7] rounded-full" />
  </div>
</template>
