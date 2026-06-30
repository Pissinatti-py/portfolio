import { ref } from 'vue'

export type Locale = 'pt' | 'en'

export interface I18nString {
  pt: string
  en: string
}

export const locale = ref<Locale>('pt')

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
  'nav.about': { pt: 'Sobre', en: 'About' },
  'nav.projects': { pt: 'Projetos', en: 'Projects' },
  'nav.skills': { pt: 'Habilidades', en: 'Skills' },
  'nav.experience': { pt: 'Experiência', en: 'Experience' },
  'nav.contact': { pt: 'Contato', en: 'Contact' },

  // Hero
  'hero.greeting': { pt: 'Olá, eu sou', en: "Hi, I'm" },
  'hero.cta': { pt: 'Ver projetos', en: 'View projects' },

  // Section eyebrows + titles
  'section.about.label': { pt: '01 — Sobre', en: '01 — About' },
  'section.about.title': { pt: 'Um pouco sobre mim', en: 'A bit about me' },
  'section.projects.label': { pt: '02 — Projetos', en: '02 — Projects' },
  'section.projects.title': { pt: 'Coisas que construí', en: 'Things I have built' },
  'section.skills.label': { pt: '03 — Habilidades', en: '03 — Skills' },
  'section.skills.title': { pt: 'Ferramentas do dia a dia', en: 'Tools of the trade' },
  'section.experience.label': { pt: '04 — Experiência', en: '04 — Experience' },
  'section.experience.title': { pt: 'Por onde passei', en: 'Where I have worked' },
  'section.contact.label': { pt: '05 — Contato', en: '05 — Contact' },
  'section.contact.title': { pt: 'Vamos conversar', en: "Let's talk" },

  // Projects
  'projects.private': { pt: 'Privado', en: 'Private' },
  'projects.privateTitle': {
    pt: 'Repositório privado — código fechado',
    en: 'Private repository — source not public',
  },
  'projects.showLess': { pt: 'Ver menos', en: 'Show less' },
  'projects.filterAll': { pt: 'Todas', en: 'All' },

  // Contact
  'contact.intro': {
    pt: 'Aberto a novas oportunidades e bons papos sobre backend, IA e produtos. Se quiser trocar uma ideia ou construir algo juntos, é só chamar.',
    en: "Open to new opportunities and good conversations about backend, AI and products. If you want to chat or build something together, just reach out.",
  },

  // Footer
  'footer.madeWith': {
    pt: 'Feito com Vue + Tailwind',
    en: 'Made with Vue + Tailwind',
  },

  // Command palette
  'palette.placeholder': {
    pt: 'Digite um comando…',
    en: 'Type a command…',
  },
  'palette.group.goto': { pt: 'Ir para', en: 'Go to' },
  'palette.group.actions': { pt: 'Ações', en: 'Actions' },
  'palette.empty': { pt: 'Nenhum resultado', en: 'No results' },
  'palette.social.github': { pt: 'Abrir GitHub', en: 'Open GitHub' },
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
