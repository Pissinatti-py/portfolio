# Marcus Vinicius — Portfolio

Personal portfolio: a single-page scroll narrative with hand-rolled parallax, a
⌘K command palette, and generated SVG cover art for every project. Dark-only,
bilingual (English by default, Portuguese one click away).

🔗 **[pissinatti-py.github.io/portfolio](https://pissinatti-py.github.io/portfolio/)**

## Stack

- **Vue 3** + TypeScript, `<script setup>`, no router and no store
- **Vite** + **Tailwind CSS v4** (CSS-first config, tokens live in `src/style.css`)
- **Three runtime dependencies.** No animation library — parallax, scroll reveals,
  the typewriter, tilt and magnetic hovers are all a few lines each in
  `src/composables/`

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # vue-tsc type-check + production build
npm run preview  # serve the built output
```

## Deploy

Push to `main` triggers `.github/workflows/deploy.yml`, which builds with
`VITE_BASE_URL=/portfolio/` and publishes to GitHub Pages.

## Editing the content

Everything the page says lives in two places:

| File | What it holds |
|---|---|
| `src/i18n.ts` | Every UI string, both languages, in one flat `dict` |
| `src/data/personal.ts` | Name, hero role lines, bio, stats, links |
| `src/data/projects.ts` | The project list — description, stack, filter tags, cover-art motif |
| `src/data/experience.ts` | Job history |
| `src/data/skills.ts` | Stack groups |

Data files carry `I18nString` (`{ pt, en }`) values resolved by `tr()`; UI chrome
uses `t('some.key')`. Adding a language means widening `Locale` and filling in
the third value — nothing else knows about locales.

### Adding a project

Append to `src/data/projects.ts`. `motif` picks one of eight generated SVG covers
(`queue`, `graph`, `stream`, `layers`, `neural`, `wave`, `grid`, `lock`) and `id`
seeds a per-project variation, so reusing a motif still looks different. `tags`
must come from the `TAGS` shortlist — that's what the filter row renders.
Omit `github` and the card renders a "private" badge instead of a link.

## Notes

- `color-scheme: dark` and `<meta name="darkreader-lock">` are deliberate: the
  site is dark-only, and without them Chrome's auto-dark-mode and Dark Reader
  re-tint every surface.
- Motion respects `prefers-reduced-motion` everywhere — parallax, reveals, the
  typewriter and the cover-art animations all go static.
- All parallax layers share a single scroll listener and one `requestAnimationFrame`
  (`src/composables/useParallax.ts`), and only ever write `transform`.
