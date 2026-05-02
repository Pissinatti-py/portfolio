# Marcus Vinicius — Portfolio

Portfólio pessoal desenvolvido como SPA minimalista com animações de entrada por scroll, efeito typewriter no hero e tema escuro.

🔗 **[marcusvp-portfolio.netlify.app](https://pissinatti-py.github.io/portfolio/)**

## Stack

- **Vue 3** + TypeScript + `<script setup>`
- **Vite** + Tailwind CSS v4
- **Animações** via Intersection Observer (sem dependências externas)

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Deploy

Push para `main` dispara o workflow `.github/workflows/deploy.yml` que faz build e publica automaticamente no GitHub Pages.

## Atualizando o conteúdo

Todo o conteúdo está em `src/data/`:

| Arquivo | O que edita |
|---|---|
| `personal.ts` | Nome, cargo, bio, links |
| `projects.ts` | Lista de projetos |
| `skills.ts` | Grupos de habilidades |
| `experience.ts` | Histórico profissional |
