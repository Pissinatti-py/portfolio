import type { I18nString } from '@/i18n'

export interface Project {
  id: number;
  name: I18nString;
  description: I18nString;
  stack: string[];
  github?: string;
  demo?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 8,
    name: { pt: "Portfólio", en: "Portfolio" },
    description: {
      pt: "Este portfólio: SPA em Vue 3 + TypeScript com Vite e Tailwind CSS v4. Navegação por sidebar, command palette (⌘K), i18n bilíngue (pt/en) e micro-interações próprias — efeitos magnético, tilt 3D, typewriter e reveal ao rolar.",
      en: "This portfolio: a Vue 3 + TypeScript SPA built with Vite and Tailwind CSS v4. Sidebar navigation, a command palette (⌘K), bilingual i18n (pt/en) and custom micro-interactions — magnetic, 3D tilt, typewriter and scroll-reveal effects.",
    },
    stack: ["Vue 3", "TypeScript", "Vite", "Tailwind CSS"],
    github: "https://github.com/Pissinatti-py/portfolio",
    featured: true,
  },
  {
    id: 2,
    name: { pt: "FastAPI Boilerplate", en: "FastAPI Boilerplate" },
    description: {
      pt: "Template de produção para APIs com FastAPI, incluindo autenticação JWT, rate limiting com Redis, paginação, Celery, storage S3 e agentes de IA com pydantic-ai.",
      en: "Production-ready template for APIs with FastAPI, including JWT auth, Redis rate limiting, pagination, Celery, S3 storage and AI agents with pydantic-ai.",
    },
    stack: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "Alembic",
      "Celery",
      "Redis",
      "Docker",
    ],
    github: "https://github.com/Pissinatti-py/fastapi-boilerplate",
    featured: true,
  },
  {
    id: 7,
    name: { pt: "Auth Boilerplate", en: "Auth Boilerplate" },
    description: {
      pt: "Serviço de autenticação central para arquitetura de microsserviços: emite, rotaciona e revoga tokens JWT (RS256) que cada serviço verifica offline com a chave pública. Inclui MFA, sessões, senhas com Argon2id, proteção contra força bruta e controle de acesso por papéis, com Postgres e Redis próprios.",
      en: "Central authentication service for a microservices architecture: issues, rotates and revokes RS256 JWTs that every service verifies offline with the public key. Includes MFA, sessions, Argon2id passwords, brute-force protection and role-based access, with its own Postgres and Redis.",
    },
    stack: [
      "Python",
      "FastAPI",
      "JWT",
      "JWKS",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
    github: "https://github.com/Pissinatti-py/auth-boilerplate",
    featured: true,
  },
  {
    id: 3,
    name: { pt: "Finance AI Assistant", en: "Finance AI Assistant" },
    description: {
      pt: "Assistente de finanças pessoais com IA: agente LangGraph com ferramentas, RAG sobre base de conhecimento e cache semântico. FastAPI + Postgres/pgvector + Anthropic, com embeddings locais em CPU e chat por WebSocket.",
      en: "Standalone AI personal-finance assistant: a LangGraph agent with tools, RAG over a knowledge base and a semantic cache. FastAPI + Postgres/pgvector + Anthropic, with local CPU embeddings and WebSocket streaming chat.",
    },
    stack: [
      "Python",
      "FastAPI",
      "LangGraph",
      "Anthropic",
      "PostgreSQL",
      "pgvector",
      "Docker",
    ],
    github: "https://github.com/Pissinatti-py/finance-ai-assistant",
    featured: true,
  },
  {
    id: 9,
    name: {
      pt: "FastAPI Observability & SSE",
      en: "FastAPI Observability & SSE",
    },
    description: {
      pt: "Serviço FastAPI que demonstra Server-Sent Events e observabilidade com Prometheus: jobs rodam de forma assíncrona e publicam progresso por um hub pub/sub (Redis ou memória), o navegador acompanha ao vivo via SSE e cada requisição é instrumentada e renderizada num dashboard Grafana.",
      en: "FastAPI service showcasing Server-Sent Events and Prometheus observability: jobs run asynchronously and publish progress through a pub/sub hub (Redis or in-memory), the browser watches live over SSE, and every request is instrumented and rendered on a Grafana dashboard.",
    },
    stack: [
      "Python",
      "FastAPI",
      "SSE",
      "Prometheus",
      "Grafana",
      "Redis",
      "Docker",
    ],
    github: "https://github.com/Pissinatti-py/fastapi-observability-demo",
    featured: true,
  },
  {
    id: 10,
    name: { pt: "Webhook Ingester", en: "Webhook Ingester" },
    description: {
      pt: "Front-end de webhooks de alta vazão em Rust (axum + Redis) que protege uma aplicação mais lenta: verifica a assinatura HMAC-SHA256, descarta duplicatas e enfileira o payload no Redis em operações O(1), absorvendo picos e retries dos provedores antes que cheguem ao servidor de aplicação.",
      en: "High-throughput webhook front-end in Rust (axum + Redis) that shields a slower app: it verifies the HMAC-SHA256 signature, drops duplicates and queues the payload onto Redis in O(1) operations, absorbing provider bursts and retry storms before they reach the application server.",
    },
    stack: ["Rust", "axum", "Redis", "HMAC", "Docker"],
    github: "https://github.com/Pissinatti-py/webhook-ingester",
    featured: true,
  },
  {
    id: 1,
    name: { pt: "Sample360 Core", en: "Sample360 Core" },
    description: {
      pt: "Backend multi-tenant para plataforma de seguros. Arquitetura Django + DRF com roteamento dinâmico por tenant, Celery para tarefas assíncronas e suporte a múltiplos bancos de dados.",
      en: "Multi-tenant backend for an insurance platform. Django + DRF architecture with dynamic per-tenant routing, Celery for async tasks and multi-database support.",
    },
    stack: [
      "Python",
      "Django",
      "DRF",
      "PostgreSQL",
      "Redis",
      "Celery",
      "Docker",
    ],
    featured: false,
  },
  {
    id: 4,
    name: { pt: "Django E-commerce", en: "Django E-commerce" },
    description: {
      pt: "Plataforma de e-commerce com blog integrado voltado para divulgação de conteúdo sobre ciência, filosofia e tecnologia.",
      en: "E-commerce platform with an integrated blog for sharing content about science, philosophy and technology.",
    },
    stack: ["Python", "Django", "HTML", "CSS", "JavaScript", "Bootstrap"],
    github: "https://github.com/Chuckpy/Django-ecommerce",
    featured: false,
  },
  {
    id: 5,
    name: {
      pt: "SOM — Detecção de Fraude em Crédito",
      en: "SOM — Credit Fraud Detection",
    },
    description: {
      pt: "Modelo de aprendizado não supervisionado com Self-Organizing Maps (SOM) para identificar transações financeiras suspeitas em dataset anônimo do Kaggle.",
      en: "Unsupervised learning model with Self-Organizing Maps (SOM) to identify suspicious financial transactions in an anonymized Kaggle dataset.",
    },
    stack: ["Python", "TensorFlow", "Keras", "NumPy", "MiniSOM", "Matplotlib"],
    github: "https://github.com/Chuckpy/SOM_suspicious-credit-activity",
    featured: false,
  },
  {
    id: 6,
    name: {
      pt: "RNN — Previsão de Ações de Petróleo",
      en: "RNN — Oil Stock Forecasting",
    },
    description: {
      pt: "Rede Neural Recorrente (RNN) para previsão de valores de ações do setor de petróleo. O projeto que iniciou minha jornada em Machine Learning.",
      en: "Recurrent Neural Network (RNN) for forecasting oil sector stock prices. The project that started my Machine Learning journey.",
    },
    stack: ["Python", "TensorFlow", "Keras", "NumPy", "Matplotlib"],
    github: "https://github.com/Chuckpy/RNN.petroilaction",
    featured: false,
  },
];
