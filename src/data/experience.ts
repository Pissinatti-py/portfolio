import type { I18nString } from '@/i18n'

export interface Experience {
  id: number
  role: I18nString
  company: string
  period: I18nString
  year: string
  description: I18nString
  stack: string[]
}

/** Most recent first — the array order is the render order. */
export const experience: Experience[] = [
  {
    id: 3,
    role: { pt: 'Engenheiro de Software Full Stack', en: 'Full Stack Software Engineer' },
    company: 'Samplemed',
    period: { pt: '2023 — Atualmente', en: '2023 — Present' },
    year: '2023',
    description: {
      pt: 'Sample360, plataforma de saúde corporativa multi-tenant com um banco Postgres por cliente. Trabalho de ponta a ponta: motores de subscrição, um engine de questionários dinâmicos, análise preditiva e o front em Vue 3 — mantendo o isolamento entre tenants intacto enquanto a base cresce.',
      en: 'Sample360, a multi-tenant corporate health platform with one Postgres database per client. End-to-end work: underwriting engines, a dynamic questionnaire engine, predictive analysis and the Vue 3 front end — keeping tenant isolation intact while the codebase grows.',
    },
    stack: ['Django', 'DRF', 'Vue 3', 'PostgreSQL', 'Celery', 'Redis', 'Docker'],
  },
  {
    id: 2,
    role: { pt: 'Engenheiro de Software', en: 'Software Engineer' },
    company: 'SOLVUM',
    period: { pt: '2022 — 2023', en: '2022 — 2023' },
    year: '2022',
    description: {
      pt: 'Backends para clientes que não podiam cair. Foi onde testes deixaram de ser opcionais pra mim: cobertura antes de merge, deploy previsível, e revisões que pegavam problema antes do cliente pegar.',
      en: "Backends for clients that could not go down. This is where tests stopped being optional for me: coverage before merge, predictable deploys, and reviews that caught problems before the customer did.",
    },
    stack: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    id: 1,
    role: { pt: 'Desenvolvedor Backend — Freelance', en: 'Backend Developer — Freelance' },
    period: { pt: '2020 — 2022', en: '2020 — 2022' },
    company: 'Freelance',
    year: '2020',
    description: {
      pt: 'APIs REST, crawlers, integrações com terceiros e automações em Python para clientes de segmentos bem diferentes. Aprendi a fazer as perguntas certas antes de escrever a primeira linha.',
      en: 'REST APIs, crawlers, third-party integrations and Python automation for clients across very different segments. Where I learned to ask the right questions before writing the first line.',
    },
    stack: ['Python', 'Flask', 'PostgreSQL', 'Docker'],
  },
]
