import type { I18nString } from '@/i18n'

export interface SkillGroup {
  category: I18nString
  /** Two-digit index rendered as a mono eyebrow on the card. */
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: { pt: 'Linguagens', en: 'Languages' },
    items: ['Python', 'TypeScript', 'Rust', 'JavaScript', 'SQL'],
  },
  {
    category: { pt: 'Backend', en: 'Backend' },
    items: ['FastAPI', 'Django', 'DRF', 'SQLAlchemy', 'Alembic', 'Celery', 'axum', 'Flask'],
  },
  {
    category: { pt: 'Dados', en: 'Data' },
    items: ['PostgreSQL', 'pgvector', 'Redis', 'MySQL', 'SQLite'],
  },
  {
    category: { pt: 'IA & LLM', en: 'AI & LLM' },
    items: ['LangGraph', 'RAG', 'Anthropic Claude', 'Ollama', 'pydantic-ai', 'fastembed', 'Keras'],
  },
  {
    category: { pt: 'Infra & Entrega', en: 'Infra & Delivery' },
    items: ['Docker', 'GitHub Actions', 'Prometheus', 'Grafana', 'Nginx', 'AWS', 'Serverless'],
  },
  {
    category: { pt: 'Frontend', en: 'Frontend' },
    items: ['Vue 3', 'Vite', 'Pinia', 'Tailwind CSS', 'Vue Router'],
  },
  {
    category: { pt: 'Protocolos', en: 'Protocols' },
    items: ['REST', 'WebSockets', 'SSE', 'JWT / JWKS', 'HMAC', 'OAuth2'],
  },
  {
    category: { pt: 'Qualidade', en: 'Quality' },
    items: ['pytest', 'Vitest', 'Cypress', 'ruff', 'black', 'Git'],
  },
]
