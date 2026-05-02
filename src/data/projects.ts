export interface Project {
  id: number;
  name: string;
  description: string;
  stack: string[];
  github?: string;
  demo?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    name: "Sample360 Core",
    description:
      "Backend multi-tenant para plataforma de seguros. Arquitetura Django + DRF com roteamento dinâmico por tenant, Celery para tarefas assíncronas e suporte a múltiplos bancos de dados.",
    stack: [
      "Python",
      "Django",
      "DRF",
      "PostgreSQL",
      "Redis",
      "Celery",
      "Docker",
    ],
    featured: true,
  },
  {
    id: 2,
    name: "FastAPI Boilerplate",
    description:
      "Template de produção para APIs com FastAPI, incluindo autenticação JWT, rate limiting com Redis, paginação, Celery, storage S3 e agentes de IA com pydantic-ai.",
    stack: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "Alembic",
      "Celery",
      "Redis",
      "Docker",
    ],
    featured: true,
  },
  {
    id: 3,
    name: "Sample360 Front",
    description:
      "SPA para plataforma de saúde corporativa com módulos de questionários dinâmicos, subscrição, análise preditiva e gestão de apólices.",
    stack: ["Vue 3", "Pinia", "Vue Router", "Vite", "JavaScript"],
    featured: true,
  },
  {
    id: 4,
    name: "Django E-commerce",
    description:
      "Plataforma de e-commerce com blog integrado voltado para divulgação de conteúdo sobre ciência, filosofia e tecnologia.",
    stack: ["Python", "Django", "HTML", "CSS", "JavaScript", "Bootstrap"],
    github: "https://github.com/Chuckpy/Django-ecommerce",
    featured: false,
  },
  {
    id: 5,
    name: "SOM — Detecção de Fraude em Crédito",
    description:
      "Modelo de aprendizado não supervisionado com Self-Organizing Maps (SOM) para identificar transações financeiras suspeitas em dataset anônimo do Kaggle.",
    stack: ["Python", "TensorFlow", "Keras", "NumPy", "MiniSOM", "Matplotlib"],
    github: "https://github.com/Chuckpy/SOM_suspicious-credit-activity",
    featured: false,
  },
  {
    id: 6,
    name: "RNN — Previsão de Ações de Petróleo",
    description:
      "Rede Neural Recorrente (RNN) para previsão de valores de ações do setor de petróleo. O projeto que iniciou minha jornada em Machine Learning.",
    stack: ["Python", "TensorFlow", "Keras", "NumPy", "Matplotlib"],
    github: "https://github.com/Chuckpy/RNN.petroilaction",
    featured: false,
  },
];
