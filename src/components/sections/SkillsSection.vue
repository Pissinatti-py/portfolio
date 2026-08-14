<script setup lang="ts">
/**
 * Stack, as one dense matrix.
 *
 * Two earlier shapes failed in opposite directions. Eight opaque cells of plain
 * <ul> put ~2000px of list on a phone; a category rail with one panel fixed that
 * but showed five to eight items out of forty-nine, so the block read empty.
 *
 * This shows everything at once and prints the total, which is the point — the
 * section is meant to read as breadth at a glance. The filter narrows to a
 * single band for anyone who wants to look at one area, but nothing is hidden
 * by default.
 */
import { computed, ref } from 'vue'
import { skills } from '@/data/skills'
import { t, tr, tStackCount } from '@/i18n'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import RevealBlock from '@/components/ui/RevealBlock.vue'

/** Index of the single band being shown, or null for all of them. */
const activeBand = ref<number | null>(null)

/** Counted from the data rather than written down, so they cannot drift. */
const total = computed(() => skills.reduce((n, g) => n + g.items.length, 0))

const visible = computed(() =>
  activeBand.value === null ? skills : [skills[activeBand.value]],
)

function toggleBand(i: number | null) {
  activeBand.value = activeBand.value === i ? null : i
}

const nn = (i: number) => String(i + 1).padStart(2, '0')

/** Shared by the All chip and the eleven band chips. */
const CHIP = 'shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-xs whitespace-nowrap transition-colors'
const CHIP_ON = 'border-primary/50 bg-primary/10 text-primary-light'
const CHIP_OFF = 'border-border text-text-dim hover:border-text-subtle hover:text-text-body'
</script>

<template>
  <section id="skills" class="relative py-28 sm:py-36">
    <div class="relative mx-auto max-w-page px-5 sm:px-8">
      <SectionHeading
        :label="t('section.skills.label')"
        :title="t('section.skills.title')"
      />

      <!-- The count is the density signal, so it sits right under the heading
           rather than being buried at the end. -->
      <p class="-mt-8 mb-10 font-mono text-xs tracking-wider text-text-dim">
        {{ tStackCount(total, skills.length) }}
      </p>

      <!-- Filter row. Same chip shape as the Work filter so the two rhyme; below
           lg it scrolls sideways, with the clipped last chip and the edge fade
           as the affordance instead of a scrollbar. -->
      <div
        class="rail -mx-1 mb-12 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible"
      >
        <button
          type="button"
          :class="[CHIP, activeBand === null ? CHIP_ON : CHIP_OFF]"
          @click="toggleBand(null)"
        >
          {{ t('projects.filterAll') }}
        </button>
        <button
          v-for="(group, i) in skills"
          :key="group.category.en"
          type="button"
          :class="[CHIP, activeBand === i ? CHIP_ON : CHIP_OFF]"
          @click="toggleBand(i)"
        >
          {{ tr(group.category) }}
        </button>
      </div>

      <!-- Bands. One RevealBlock each, staggered like the Build cards. Filtering
           is instant on purpose: RevealBlock owns opacity through its own
           classes, and a TransitionGroup over the same elements would fight it
           for control. -->
      <div class="space-y-8">
        <RevealBlock
          v-for="(group, i) in visible"
          :key="group.category.en"
          :delay="i * 60"
        >
          <div class="mb-3 flex items-center gap-4">
            <p class="font-mono text-[11px] tracking-widest text-primary-light uppercase">
              <span class="mr-1.5 text-text-dim">{{ nn(skills.indexOf(group)) }}</span>
              {{ tr(group.category) }}
            </p>
            <!-- Rule fills whatever width the label leaves. -->
            <span class="h-px flex-1 bg-border" aria-hidden="true" />
            <span class="font-mono text-[11px] text-text-dim">{{ group.items.length }}</span>
          </div>

          <ul class="flex flex-wrap gap-2">
            <li
              v-for="item in group.items"
              :key="item"
              class="rounded-md border border-border bg-surface-1/70 px-2.5 py-1 font-mono text-[11px] text-text-body transition-colors hover:border-primary/40 hover:text-text"
            >
              {{ item }}
            </li>
          </ul>
        </RevealBlock>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Below lg the filter row scrolls sideways. The page's 6px custom scrollbar is
   fine on the document but reads as an unfinished edge under a row of chips, so
   the affordance is the clipped last chip and the fade instead. Both revert at
   lg, where the row wraps and does not scroll at all. */
.rail {
  scrollbar-width: none;
  mask-image: linear-gradient(to right, #000 0, #000 88%, transparent 100%);
}

.rail::-webkit-scrollbar {
  display: none;
}

@media (width >= 64rem) {
  .rail {
    mask-image: none;
  }
}
</style>
