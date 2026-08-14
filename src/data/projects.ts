import type { I18nString } from '@/i18n'

/** Abstract cover-art motifs. Fewer motifs than projects on purpose — the
 *  `id` seeds a variation so two projects sharing a motif still differ. */
export type Motif = 'queue' | 'graph' | 'stream' | 'layers' | 'neural' | 'wave' | 'grid' | 'lock'

export type Account = 'Pissinatti-py' | 'Chuckpy'

/** Curated filter buckets. Deliberately short — the full stack list lives on
 *  the card, this is just the coarse cut a visitor actually wants. */
export const TAGS = ['Python', 'Rust', 'FastAPI', 'Django', 'Vue', 'AI/LLM', 'Infra'] as const
export type Tag = (typeof TAGS)[number]

export interface Project {
  id: string
  name: string
  description: I18nString
  stack: string[]
  tags: Tag[]
  motif: Motif
  account?: Account
  github?: string
  featured: boolean
}

export const projects: Project[] = [
  {
    id: 'webhook-ingester',
    name: 'webhook-ingester',
    description: {
      pt: 'Uma porta de entrada em Rust para webhooks. Verifica a assinatura HMAC, descarta duplicatas e empurra o payload cru pro Redis num único script Lua atômico — a tempestade de retries do provedor bate aqui, não no seu servidor de aplicação.',
      en: "A Rust front door for webhooks. It verifies the HMAC signature, drops duplicates and pushes the raw payload onto Redis in one atomic Lua script — so a provider's retry storm hits this instead of your app server.",
    },
    stack: ['Rust', 'axum', 'Redis', 'HMAC-SHA256', 'Docker'],
    tags: ['Rust', 'Infra'],
    motif: 'queue',
    account: 'Pissinatti-py',
    github: 'https://github.com/Pissinatti-py/webhook-ingester',
    featured: true,
  },
  {
    id: 'finance-ai-assistant',
    name: 'finance-ai-assistant',
    description: {
      pt: 'Um assistente de finanças pessoais self-hosted: agente LangGraph com ferramentas de verdade, RAG sobre uma base de conhecimento e um cache semântico que responde perguntas repetidas sem pagar chamada de modelo. Postgres + pgvector, embeddings rodando na CPU.',
      en: 'A personal-finance assistant you can self-host: a LangGraph agent with real tools, RAG over a knowledge base, and a semantic cache that answers repeat questions without paying for a model call. Postgres + pgvector, embeddings on CPU.',
    },
    stack: ['Python', 'FastAPI', 'LangGraph', 'Anthropic', 'PostgreSQL', 'pgvector', 'WebSockets'],
    tags: ['Python', 'FastAPI', 'AI/LLM'],
    motif: 'graph',
    account: 'Pissinatti-py',
    github: 'https://github.com/Pissinatti-py/finance-ai-assistant',
    featured: true,
  },
  {
    id: 'auth-boilerplate',
    name: 'auth-boilerplate',
    description: {
      pt: 'Um emissor, muitos verificadores. Serviço de autenticação isolado que emite JWTs e publica um JWKS, para todo o resto da frota validar usuários offline — zero chamadas de volta. Com MFA, sessões e controle de acesso por papéis.',
      en: 'One issuer, many verifiers. A standalone auth service that mints JWTs and publishes a JWKS, so every other service in the fleet validates users offline — zero calls back. MFA, sessions and role-based access included.',
    },
    stack: ['Python', 'FastAPI', 'JWT', 'JWKS', 'PostgreSQL', 'Redis', 'Docker'],
    tags: ['Python', 'FastAPI', 'Infra'],
    motif: 'lock',
    account: 'Pissinatti-py',
    github: 'https://github.com/Pissinatti-py/auth-boilerplate',
    featured: true,
  },
  {
    id: 'fastapi-observability-demo',
    name: 'fastapi-observability-demo',
    description: {
      pt: 'Dispare um job e acompanhe até o fim. Eventos de progresso passam por um hub pub/sub e chegam ao browser via SSE, enquanto cada request e cada job é instrumentado com Prometheus e desenhado num dashboard Grafana. Sem banco de dados, de propósito.',
      en: 'Start a job, watch it finish. Progress events fan out through a pub/sub hub to browsers over SSE, while every request and job is instrumented with Prometheus and drawn on a Grafana dashboard. No database, on purpose.',
    },
    stack: ['Python', 'FastAPI', 'SSE', 'Prometheus', 'Grafana', 'Redis', 'Docker'],
    tags: ['Python', 'FastAPI', 'Infra'],
    motif: 'stream',
    account: 'Pissinatti-py',
    github: 'https://github.com/Pissinatti-py/fastapi-observability-demo',
    featured: true,
  },
  {
    id: 'market-insights-service',
    name: 'market-insights-service',
    description: {
      pt: 'Coletores Celery varrem o GitHub trending, releases do PyPI e do npm, Dev.to e Hacker News, deduplicam tudo por chave idempotente — e então um LLM local pontua cada item contra um perfil técnico. Sinal de mercado sem assinatura.',
      en: 'Celery collectors sweep GitHub trending, PyPI and npm releases, Dev.to and Hacker News, dedupe everything on an idempotent key, then a local LLM scores each item against a technical profile. Market signal without a subscription.',
    },
    stack: ['Python', 'FastAPI', 'Celery', 'RedBeat', 'PostgreSQL', 'Ollama', 'uv'],
    tags: ['Python', 'FastAPI', 'AI/LLM'],
    motif: 'wave',
    account: 'Pissinatti-py',
    github: 'https://github.com/Pissinatti-py/market-insights-service',
    featured: true,
  },
  {
    id: 'fastapi-boilerplate',
    name: 'fastapi-boilerplate',
    description: {
      pt: 'O ponto de partida que eu realmente uso: SQLAlchemy assíncrono, Alembic, Celery, Docker e uma arquitetura limpa que sobrevive além da primeira sprint. Com cara de produção, não de tutorial.',
      en: 'The starting point I actually use: async SQLAlchemy, Alembic, Celery, Docker and a clean-architecture layout that survives past the first sprint. Production-shaped rather than tutorial-shaped.',
    },
    stack: ['Python', 'FastAPI', 'SQLAlchemy', 'Alembic', 'Celery', 'Redis', 'Docker'],
    tags: ['Python', 'FastAPI', 'Infra'],
    motif: 'layers',
    account: 'Pissinatti-py',
    github: 'https://github.com/Pissinatti-py/fastapi-boilerplate',
    featured: true,
  },
  {
    id: 'sample360',
    name: 'Sample360',
    description: {
      pt: 'A plataforma em que trabalho todo dia na Samplemed: saúde corporativa multi-tenant, um banco Postgres por cliente roteado por estado thread-local. Motores de subscrição, questionários dinâmicos, análise preditiva e o front em Vue 3.',
      en: 'The platform I work on daily at Samplemed: multi-tenant corporate health, one Postgres database per client routed by thread-local state. Underwriting engines, dynamic questionnaires, predictive analysis and the Vue 3 front end.',
    },
    stack: ['Python', 'Django', 'DRF', 'Vue 3', 'PostgreSQL', 'Celery', 'Channels'],
    tags: ['Python', 'Django', 'Vue'],
    motif: 'grid',
    featured: false,
  },
  {
    id: 'challenge',
    name: 'challenge',
    description: {
      pt: 'Quatro jogadores, quatro estratégias, milhares de partidas simuladas para descobrir qual comportamento realmente ganha. Um desafio técnico que virou um serviço FastAPI com suíte de testes completa.',
      en: 'Four players, four strategies, thousands of simulated matches to find out which behaviour actually wins. A take-home that turned into a small FastAPI service with a full test suite.',
    },
    stack: ['Python', 'FastAPI', 'pytest'],
    tags: ['Python', 'FastAPI'],
    motif: 'grid',
    account: 'Pissinatti-py',
    github: 'https://github.com/Pissinatti-py/challenge',
    featured: false,
  },
  {
    id: 'som-credit',
    name: 'SOM_suspicious-credit-activity',
    description: {
      pt: 'Um mapa auto-organizável não supervisionado sobre um dataset de crédito do Kaggle, usado para destacar os IDs mais distantes de qualquer cluster normal. Meu primeiro contato com "o modelo é a parte fácil".',
      en: 'An unsupervised self-organising map over a Kaggle credit dataset, used to surface the applicant IDs that sit furthest from every normal cluster. My first taste of "the model is the easy part".',
    },
    stack: ['Python', 'MiniSom', 'NumPy', 'Pandas'],
    tags: ['Python', 'AI/LLM'],
    motif: 'neural',
    account: 'Chuckpy',
    github: 'https://github.com/Chuckpy/SOM_suspicious-credit-activity',
    featured: false,
  },
  {
    id: 'rnn-petroil',
    name: 'RNN.petroilaction',
    description: {
      pt: 'Uma rede recorrente treinada em séries de preço de ações de petróleo para prever o próximo fechamento. Keras, muita normalização e uma lição saudável sobre o quanto uma previsão ruim consegue parecer confiante.',
      en: 'A recurrent network trained on oil-stock price series to forecast the next close. Keras, a lot of normalisation, and a healthy lesson in how confident a bad forecast can look.',
    },
    stack: ['Python', 'Keras', 'NumPy', 'Pandas'],
    tags: ['Python', 'AI/LLM'],
    motif: 'wave',
    account: 'Chuckpy',
    github: 'https://github.com/Chuckpy/RNN.petroilaction',
    featured: false,
  },
  {
    id: 'fastapi-celery',
    name: 'FastAPI-Celery',
    description: {
      pt: 'A ligação de referência para trabalho assíncrono em FastAPI: workers Celery atrás do RabbitMQ, tudo em Docker Compose. Escrito como resposta a uma pergunta que eu vivia resolvendo de novo.',
      en: 'The reference wiring for async work in FastAPI: Celery workers behind RabbitMQ, all of it in Docker Compose. Written as the answer to a question I kept re-solving.',
    },
    stack: ['Python', 'FastAPI', 'Celery', 'RabbitMQ', 'Docker'],
    tags: ['Python', 'FastAPI', 'Infra'],
    motif: 'queue',
    account: 'Chuckpy',
    github: 'https://github.com/Chuckpy/FastAPI-Celery',
    featured: false,
  },
  {
    id: 'django-ecommerce',
    name: 'Django-ecommerce',
    description: {
      pt: 'Uma loja completa em Django — catálogo, carrinho, checkout — feita enquanto eu aprendia o framework de verdade, em vez de copiar views de um lado pro outro.',
      en: 'A full Django storefront — catalogue, cart, checkout — built while learning the framework properly instead of copying views around.',
    },
    stack: ['Python', 'Django', 'PostgreSQL', 'Bootstrap'],
    tags: ['Python', 'Django'],
    motif: 'layers',
    account: 'Chuckpy',
    github: 'https://github.com/Chuckpy/Django-ecommerce',
    featured: false,
  },
  {
    id: 'weather-api',
    name: 'weather-api',
    description: {
      pt: 'Um serviço FastAPI pequeno que conversa com APIs de clima de terceiros e guarda as respostas no Postgres. Pequeno de propósito: existe para mostrar o formato da integração.',
      en: 'A small FastAPI service that talks to third-party weather APIs and caches the answers in Postgres. Small on purpose: it exists to show the shape of the integration.',
    },
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    tags: ['Python', 'FastAPI'],
    motif: 'stream',
    account: 'Chuckpy',
    github: 'https://github.com/Chuckpy/weather-api',
    featured: false,
  },
  {
    id: 'portfolio',
    name: 'portfolio',
    description: {
      pt: 'Esta página. Vue 3, TypeScript e Tailwind v4, com o parallax, os reveals e a paleta ⌘K escritos à mão — três dependências em runtime, nenhuma biblioteca de animação.',
      en: 'This page. Vue 3, TypeScript and Tailwind v4, with the parallax, the reveals and the ⌘K palette written by hand — three runtime dependencies, no animation library.',
    },
    stack: ['Vue 3', 'TypeScript', 'Vite', 'Tailwind CSS'],
    tags: ['Vue'],
    motif: 'grid',
    account: 'Pissinatti-py',
    github: 'https://github.com/Pissinatti-py/portfolio',
    featured: false,
  },
]
