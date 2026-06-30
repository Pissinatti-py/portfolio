import type { I18nString } from '@/i18n'

export interface SkillGroup {
  category: I18nString
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: { pt: 'Backend', en: 'Backend' },
    items: ['Python', 'Django', 'FastAPI', 'DRF', 'Celery', 'SQLAlchemy', 'Alembic'],
  },
  {
    category: { pt: 'Frontend', en: 'Frontend' },
    items: ['Vue 3', 'TypeScript', 'JavaScript', 'Vite', 'Pinia', 'Vue Router', 'Tailwind CSS'],
  },
  {
    category: { pt: 'Banco de Dados', en: 'Databases' },
    items: ['PostgreSQL', 'pgvector', 'Redis', 'MySQL', 'SQLite'],
  },
  {
    category: { pt: 'DevOps & Cloud', en: 'DevOps & Cloud' },
    items: ['Docker', 'Docker Compose', 'AWS', 'Serverless', 'CI/CD', 'Nginx'],
  },
  {
    category: { pt: 'IA & Machine Learning', en: 'AI & Machine Learning' },
    items: ['LangGraph', 'pydantic-ai', 'LangChain', 'RAG', 'Anthropic Claude', 'fastembed', 'Keras', 'NumPy', 'Pandas', 'Ollama'],
  },
  {
    category: { pt: 'Ferramentas', en: 'Tools' },
    items: ['Git', 'pytest', 'Vitest', 'Cypress', 'Linux', 'REST APIs', 'WebSockets'],
  },
]
