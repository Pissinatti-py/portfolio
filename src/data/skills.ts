export interface SkillGroup {
  category: string
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: 'Backend',
    items: ['Python', 'Django', 'FastAPI', 'DRF', 'Celery', 'SQLAlchemy', 'Alembic'],
  },
  {
    category: 'Frontend',
    items: ['Vue 3', 'TypeScript', 'JavaScript', 'Vite', 'Pinia', 'Vue Router', 'Tailwind CSS'],
  },
  {
    category: 'Banco de Dados',
    items: ['PostgreSQL', 'Redis', 'MySQL', 'SQLite'],
  },
  {
    category: 'DevOps & Cloud',
    items: ['Docker', 'Docker Compose', 'AWS', 'Serverless', 'CI/CD', 'Nginx'],
  },
  {
    category: 'IA & Machine Learning',
    items: ['pydantic-ai', 'LangChain', 'Keras', 'NumPy', 'Pandas', 'Ollama'],
  },
  {
    category: 'Ferramentas',
    items: ['Git', 'pytest', 'Vitest', 'Cypress', 'Linux', 'REST APIs', 'WebSockets'],
  },
]
