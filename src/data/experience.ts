export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  stack: string[];
}

export const experience: Experience[] = [
  {
    id: 2,
    role: "Engenheiro de Software Full Stack",
    company: "Samplemed",
    period: "2023 — Atualmente",
    description:
      "Desenvolvimento e manutenção da plataforma Sample360, sistema multi-tenant de saúde corporativa. Atuação em módulos de subscrição, questionários dinâmicos, análise preditiva e frontend Vue 3.",
    stack: ["Django", "DRF", "Vue 3", "PostgreSQL", "Redis", "Docker"],
  },
  {
    id: 1,
    role: "Engenheiro de Software",
    company: "SOLVUM",
    period: "2022 — 2023",
    description:
      "Desenvolvimento de soluções backend robustas e escaláveis, com foco em qualidade de código, testes e entrega contínua.",
    stack: ["Python", "Django", "FastAPI", "PostgreSQL", "Redis", "Docker"],
  },
  {
    id: 3,
    role: "Desenvolvedor Backend",
    company: "Freelance",
    period: "2020 — 2022",
    description:
      "Desenvolvimento de APIs REST e automações com Python para clientes de diferentes segmentos. Projetos incluindo crawlers, integrações com terceiros e scripts de automação.",
    stack: ["Python", "Flask", "PostgreSQL", "Docker"],
  },
];
