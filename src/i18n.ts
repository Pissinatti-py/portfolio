import { ref, watchEffect } from 'vue'

export type Locale = 'pt' | 'en'

export interface I18nString {
  pt: string
  en: string
}

const STORAGE_KEY = 'portfolio.locale'

/** English is the default for everyone; a saved choice is the only thing that
 *  overrides it. (Deliberately not browser-language driven — most visitors
 *  worth reaching read English even when their browser says otherwise.) */
function initialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'pt' ? 'pt' : 'en'
}

export const locale = ref<Locale>(initialLocale())

// Keep the document language and the saved preference in sync with the ref,
// so a reload lands in the same language and screen readers pick the right voice.
if (typeof window !== 'undefined') {
  watchEffect(() => {
    document.documentElement.lang = locale.value === 'pt' ? 'pt-BR' : 'en'
    localStorage.setItem(STORAGE_KEY, locale.value)
  })
}

export function setLocale(l: Locale) {
  locale.value = l
}

export function toggleLocale() {
  locale.value = locale.value === 'pt' ? 'en' : 'pt'
}

/** Resolve a bilingual data string to the current locale. */
export function tr(s: I18nString): string {
  return s[locale.value]
}

const dict = {
  // Navigation
  'nav.build': { pt: 'O que faço', en: 'What I build' },
  'nav.work': { pt: 'Trabalhos', en: 'Work' },
  'nav.experience': { pt: 'Experiência', en: 'Experience' },
  'nav.skills': { pt: 'Stack', en: 'Stack' },
  'nav.about': { pt: 'Sobre', en: 'About' },
  'nav.contact': { pt: 'Contato', en: 'Contact' },
  'nav.menu': { pt: 'Abrir menu', en: 'Open menu' },
  'nav.close': { pt: 'Fechar menu', en: 'Close menu' },

  // Hero
  'hero.greeting': { pt: 'Olá, eu sou', en: "Hi, I'm" },
  'hero.available': {
    pt: 'Aberto a vagas de backend e plataforma — remoto ou Brasil',
    en: 'Open to backend & platform roles — remote or Brazil',
  },
  'hero.pitch': {
    pt: 'Eu construo a parte sem glamour que decide se um produto sobrevive ao contato com tráfego real: as APIs, as filas, a autenticação, as métricas. Seis anos fazendo isso em produção — e ainda gosto.',
    en: 'I build the unglamorous half that decides whether a product survives contact with real traffic: the APIs, the queues, the auth, the metrics. Six years doing it in production — and I still enjoy it.',
  },
  'hero.cta': { pt: 'Ver o trabalho', en: 'See the work' },
  'hero.ctaAlt': { pt: 'Falar comigo', en: 'Get in touch' },
  'hero.scroll': { pt: 'role', en: 'scroll' },

  // 01 — What I build
  'section.build.label': { pt: '01 — O que faço', en: '01 — What I build' },
  'section.build.title': {
    pt: 'O que você estaria me contratando para fazer',
    en: "What you'd be hiring me to do",
  },
  'section.build.intro': {
    pt: 'Três frentes, todas com código público que você pode abrir e ler agora.',
    en: 'Three fronts, each with public code you can open and read right now.',
  },
  'build.1.title': { pt: 'Serviços de backend e APIs', en: 'Backend services & APIs' },
  'build.1.body': {
    pt: 'Serviços em Python que aguentam carga: FastAPI e Django/DRF, SQLAlchemy assíncrono, workers Celery, Postgres multi-tenant. Escritos para a próxima pessoa conseguir ler.',
    en: 'Python services that hold up under load: FastAPI and Django/DRF, async SQLAlchemy, Celery workers, multi-tenant Postgres. Written so the next person can actually read them.',
  },
  'build.2.title': { pt: 'Funcionalidades com IA que vão pro ar', en: 'AI features that ship' },
  'build.2.body': {
    pt: 'Agentes LangGraph com ferramentas de verdade, RAG sobre os seus dados, pgvector, cache semântico. A parte interessante não é o modelo — é deixar tudo rápido, barato e previsível.',
    en: "LangGraph agents with real tools, RAG over your own data, pgvector, semantic caching. The interesting part isn't the model — it's making it fast, cheap and predictable.",
  },
  'build.3.title': { pt: 'Observabilidade e entrega', en: 'Observability & delivery' },
  'build.3.body': {
    pt: 'Métricas Prometheus, streams SSE e WebSocket, autenticação HMAC e JWT/JWKS, Docker, GitHub Actions. Para você descobrir por um dashboard, não por um cliente.',
    en: 'Prometheus metrics, SSE and WebSocket streams, HMAC and JWT/JWKS auth, Docker, GitHub Actions. So you find out from a dashboard, not from a customer.',
  },

  // 02 — Selected work
  'section.work.label': { pt: '02 — Trabalhos', en: '02 — Selected work' },
  'section.work.title': { pt: 'Coisas que construí e coloquei no ar', en: "Things I've built and shipped" },
  'section.work.intro': {
    pt: 'Cada card leva ao código. Duas contas: @Pissinatti-py é onde trabalho hoje, @Chuckpy é onde comecei.',
    en: 'Every card links to the source. Two accounts: @Pissinatti-py is where I work now, @Chuckpy is where I started.',
  },

  // 03 — Experience
  'section.experience.label': { pt: '03 — Experiência', en: '03 — Experience' },
  'section.experience.title': { pt: 'Por onde passei', en: "Where I've worked" },

  // 04 — Stack
  'section.skills.label': { pt: '04 — Stack', en: '04 — Stack' },
  'section.skills.title': { pt: 'O que uso no dia a dia', en: 'What I reach for' },

  // 05 — About
  'section.about.label': { pt: '05 — Sobre', en: '05 — About' },
  'section.about.title': { pt: 'Prazer, Marcus', en: "Nice to meet you" },

  // 06 — Contact
  'section.contact.label': { pt: '06 — Contato', en: '06 — Contact' },
  'section.contact.title': { pt: 'Vamos conversar', en: "Let's talk" },
  'contact.intro': {
    pt: 'Se você tem um backend que precisa aguentar mais, uma feature de IA parada no protótipo, ou uma vaga que combina com o que está aí em cima — me manda uma mensagem. Respondo todas.',
    en: "If you have a backend that needs to hold more, an AI feature stuck at the prototype stage, or a role that matches what's above — send me a message. I answer all of them.",
  },
  'contact.email': { pt: 'Enviar e-mail', en: 'Send an email' },
  'contact.responds': { pt: 'Normalmente respondo em 24h', en: 'Usually replies within 24h' },

  // Projects
  'projects.private': { pt: 'Privado', en: 'Private' },
  'projects.privateTitle': {
    pt: 'Repositório privado — código fechado',
    en: 'Private repository — source not public',
  },
  'projects.showLess': { pt: 'Ver menos', en: 'Show less' },
  'projects.filterAll': { pt: 'Tudo', en: 'All' },
  'projects.source': { pt: 'Ver código', en: 'View source' },
  'projects.empty': { pt: 'Nada com esse filtro.', en: 'Nothing matches that filter.' },

  // Links / footer
  'links.currentWork': { pt: 'trabalho atual', en: 'current work' },
  'links.earlyWork': { pt: 'trabalhos antigos', en: 'early work' },
  'footer.built': {
    pt: 'Vue 3, TypeScript e Tailwind. Sem bibliotecas de animação — o parallax é feito à mão.',
    en: 'Vue 3, TypeScript and Tailwind. No animation libraries — the parallax is hand-rolled.',
  },
  'footer.source': { pt: 'Código deste site', en: 'Source of this site' },

  // Command palette
  'palette.placeholder': { pt: 'Digite um comando…', en: 'Type a command…' },
  'palette.group.goto': { pt: 'Ir para', en: 'Go to' },
  'palette.group.actions': { pt: 'Ações', en: 'Actions' },
  'palette.empty': { pt: 'Nenhum resultado', en: 'No results' },
  'palette.social.github': { pt: 'Abrir GitHub (@Pissinatti-py)', en: 'Open GitHub (@Pissinatti-py)' },
  'palette.social.github2': { pt: 'Abrir GitHub (@Chuckpy)', en: 'Open GitHub (@Chuckpy)' },
  'palette.social.linkedin': { pt: 'Abrir LinkedIn', en: 'Open LinkedIn' },
  'palette.social.email': { pt: 'Enviar e-mail', en: 'Send email' },
  'palette.hint': { pt: 'para comandos', en: 'for commands' },
} as const

export type I18nKey = keyof typeof dict

/** Resolve a UI string key to the current locale. */
export function t(key: I18nKey): string {
  return dict[key][locale.value]
}

/** Parameterized "view all N projects" label. */
export function tProjectsShowAll(n: number): string {
  return locale.value === 'pt' ? `Ver todos os ${n} projetos` : `View all ${n} projects`
}

/** Label for the action that switches to the *other* language. */
export function tSwitchLanguage(): string {
  return locale.value === 'pt' ? 'Switch to English' : 'Mudar para Português'
}
