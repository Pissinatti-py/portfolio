import type { I18nString } from '@/i18n'

export interface SkillGroup {
  category: I18nString
  items: string[]
}

/**
 * The Stack section renders every one of these at once and prints the total, so
 * two rules matter here:
 *
 *  1. **No duplicates across bands.** The headline count is derived from these
 *     arrays, so an entry listed twice inflates it. `pgvector` belongs to Data
 *     only, even though AI & LLM would also be a fair home.
 *
 *  2. **Same-slot only.** The chips are presented flat, with no visual
 *     distinction between what has shipped and what is a near-equivalent. That
 *     is only honest while every entry either appears in one of the repos or
 *     sits in a slot already filled by something adjacent — Starlette beside
 *     FastAPI, Qdrant beside pgvector, Playwright beside Cypress. Kubernetes,
 *     Kafka, React and Terraform are deliberately absent: they are genuine
 *     leaps, not swaps. Keep new entries to the same standard.
 */
export const skills: SkillGroup[] = [
  {
    category: { pt: 'Linguagens', en: 'Languages' },
    items: ['Python', 'TypeScript', 'JavaScript', 'Rust', 'Go', 'SQL', 'Bash', 'Lua'],
  },
  {
    category: { pt: 'Backend', en: 'Backend' },
    items: [
      'FastAPI',
      'Django',
      'DRF',
      'Flask',
      'axum',
      'Starlette',
      'Litestar',
      'Pydantic',
      'Uvicorn',
      'Gunicorn',
    ],
  },
  {
    category: { pt: 'Dados & Persistência', en: 'Data & persistence' },
    items: [
      'PostgreSQL',
      'MySQL',
      'SQLite',
      'SQLAlchemy',
      'Django ORM',
      'Alembic',
      'Redis',
      'pgvector',
      'Qdrant',
      'Chroma',
    ],
  },
  {
    category: { pt: 'Filas & Tempo Real', en: 'Queues & realtime' },
    items: [
      'Celery',
      'RabbitMQ',
      'RedBeat',
      'Redis Streams',
      'Django Channels',
      'WebSockets',
      'SSE',
      'AMQP',
    ],
  },
  {
    category: { pt: 'IA & LLM', en: 'AI & LLM' },
    items: [
      'LangGraph',
      'LangChain',
      'LiteLLM',
      'RAG',
      'Anthropic Claude',
      'OpenAI API',
      'Ollama',
      'pydantic-ai',
      'fastembed',
      'sentence-transformers',
      'Hugging Face',
    ],
  },
  {
    category: { pt: 'ML & Dados', en: 'ML & data' },
    items: ['Keras', 'TensorFlow', 'PyTorch', 'NumPy', 'Pandas', 'MiniSom'],
  },
  {
    category: { pt: 'Infra & Entrega', en: 'Infra & delivery' },
    items: [
      'Docker',
      'Docker Compose',
      'GitHub Actions',
      'GitLab CI',
      'Nginx',
      'Traefik',
      'AWS',
      'AWS Lambda',
      'Amazon S3',
      'Serverless Framework',
      'GitHub Pages',
    ],
  },
  {
    category: { pt: 'Observabilidade', en: 'Observability' },
    items: ['Prometheus', 'Grafana', 'Grafana Loki', 'OpenTelemetry', 'Sentry'],
  },
  {
    category: { pt: 'API & Autenticação', en: 'API & auth' },
    items: [
      'REST',
      'OpenAPI / Swagger',
      'GraphQL',
      'gRPC',
      'JWT / JWKS',
      'OAuth2',
      'OIDC',
      'HMAC',
      'MFA',
      'Webhooks',
    ],
  },
  {
    category: { pt: 'Frontend', en: 'Frontend' },
    items: [
      'Vue 3',
      'Nuxt',
      'Vue Router',
      'Pinia',
      'Vite',
      'Tailwind CSS',
      'SCSS',
      'Axios',
      'vue-i18n',
      'Bootstrap',
      'TanStack Query',
    ],
  },
  {
    category: { pt: 'Qualidade & Ferramentas', en: 'Quality & tooling' },
    items: [
      'pytest',
      'Vitest',
      'Cypress',
      'Playwright',
      'coverage.py',
      'mypy',
      'ruff',
      'black',
      'isort',
      'flake8',
      'pre-commit',
      'Commitizen',
      'Git',
    ],
  },
]
