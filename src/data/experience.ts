import type { I18nString } from '@/i18n'

export interface Experience {
  id: number;
  role: I18nString;
  company: string;
  period: I18nString;
  description: I18nString;
  stack: string[];
}

export const experience: Experience[] = [
  {
    id: 2,
    role: {
      pt: "Engenheiro de Software Full Stack",
      en: "Full Stack Software Engineer",
    },
    company: "Samplemed",
    period: { pt: "2023 — Atualmente", en: "2023 — Present" },
    description: {
      pt: "Desenvolvimento e manutenção da plataforma Sample360, sistema multi-tenant de saúde corporativa. Atuação em módulos de subscrição, questionários dinâmicos, análise preditiva e frontend Vue 3.",
      en: "Development and maintenance of the Sample360 platform, a multi-tenant corporate health system. Work on underwriting modules, dynamic questionnaires, predictive analysis and the Vue 3 frontend.",
    },
    stack: ["Django", "DRF", "Vue 3", "PostgreSQL", "Redis", "Docker"],
  },
  {
    id: 1,
    role: { pt: "Engenheiro de Software", en: "Software Engineer" },
    company: "SOLVUM",
    period: { pt: "2022 — 2023", en: "2022 — 2023" },
    description: {
      pt: "Desenvolvimento de soluções backend robustas e escaláveis, com foco em qualidade de código, testes e entrega contínua.",
      en: "Development of robust and scalable backend solutions, focused on code quality, testing and continuous delivery.",
    },
    stack: ["Python", "Django", "FastAPI", "PostgreSQL", "Redis", "Docker"],
  },
  {
    id: 3,
    role: { pt: "Desenvolvedor Backend", en: "Backend Developer" },
    company: "Freelance",
    period: { pt: "2020 — 2022", en: "2020 — 2022" },
    description: {
      pt: "Desenvolvimento de APIs REST e automações com Python para clientes de diferentes segmentos. Projetos incluindo crawlers, integrações com terceiros e scripts de automação.",
      en: "Development of REST APIs and automations with Python for clients across different segments. Projects including crawlers, third-party integrations and automation scripts.",
    },
    stack: ["Python", "Flask", "PostgreSQL", "Docker"],
  },
];
