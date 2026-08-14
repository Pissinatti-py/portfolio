<script setup lang="ts">
import { t, type I18nKey } from "@/i18n";
import SectionHeading from "@/components/ui/SectionHeading.vue";
import RevealBlock from "@/components/ui/RevealBlock.vue";
import ProjectArt from "@/components/ui/ProjectArt.vue";
import type { Motif } from "@/data/projects";

/** Copy lives in the dict; only the stack chips and the motif are presentational. */
const cards: {
  n: string;
  title: I18nKey;
  body: I18nKey;
  motif: Motif;
  stack: string[];
}[] = [
  {
    n: "01",
    title: "build.1.title",
    body: "build.1.body",
    motif: "layers",
    stack: ["FastAPI", "Django / DRF", "SQLAlchemy", "Celery", "PostgreSQL"],
  },
  {
    n: "02",
    title: "build.2.title",
    body: "build.2.body",
    motif: "graph",
    stack: ["LangGraph", "RAG", "pgvector", "Anthropic", "Ollama"],
  },
  {
    n: "03",
    title: "build.3.title",
    body: "build.3.body",
    motif: "stream",
    stack: ["Prometheus", "Grafana", "SSE", "JWT / JWKS", "GitHub Actions"],
  },
];
</script>

<template>
  <section
    id="build"
    class="relative mx-auto max-w-page px-5 py-28 sm:px-8 sm:py-36"
  >
    <SectionHeading
      :label="t('section.build.label')"
      :title="t('section.build.title')"
      :intro="t('section.build.intro')"
    />

    <div class="grid gap-5 md:grid-cols-3">
      <RevealBlock v-for="(card, i) in cards" :key="card.n" :delay="i * 120">
        <article
          class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-1/80 transition-colors duration-300 hover:border-primary/40"
        >
          <div
            class="h-28 overflow-hidden opacity-50 transition-opacity duration-500 group-hover:opacity-100"
          >
            <ProjectArt :motif="card.motif" :seed="card.n" />
          </div>
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-transparent to-surface-1"
          />

          <div class="relative flex flex-1 flex-col p-6">
            <span class="font-mono text-xs text-primary-light/70">{{
              card.n
            }}</span>
            <h3 class="mt-2 text-lg font-semibold text-text">
              {{ t(card.title) }}
            </h3>
            <p class="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
              {{ t(card.body) }}
            </p>

            <ul class="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-4">
              <li
                v-for="tech in card.stack"
                :key="tech"
                class="rounded-md bg-surface-2 px-2 py-1 font-mono text-[10px] text-text-dim"
              >
                {{ tech }}
              </li>
            </ul>
          </div>
        </article>
      </RevealBlock>
    </div>
  </section>
</template>
