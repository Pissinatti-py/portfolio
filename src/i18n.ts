import { ref } from 'vue'

export type Locale = 'pt' | 'en'
export interface I18nString {
  pt: string
  en: string
}

const stored = localStorage.getItem('locale')
export const locale = ref<Locale>(stored === 'en' ? 'en' : 'pt')

export function setLocale(l: Locale) {
  locale.value = l
  localStorage.setItem('locale', l)
  document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en'
}
setLocale(locale.value)

/** Pick the active-locale string from a bilingual field. Reactive in templates. */
export function tr(v: I18nString): string {
  return v[locale.value]
}

// UI strings (everything not living in the data files)
const ui = {
  'nav.about': { pt: 'Sobre', en: 'About' },
  'nav.projects': { pt: 'Projetos', en: 'Projects' },
  'nav.skills': { pt: 'Skills', en: 'Skills' },
  'nav.experience': { pt: 'Experiência', en: 'Experience' },
  'nav.contact': { pt: 'Contato', en: 'Contact' },

  'hero.greeting': { pt: 'Olá, meu nome é', en: 'Hi, my name is' },
  'hero.cta': { pt: 'Ver projetos', en: 'View projects' },

  'section.about.label': { pt: '01. sobre', en: '01. about' },
  'section.about.title': { pt: 'Sobre mim', en: 'About me' },
  'section.projects.label': { pt: '02. projetos', en: '02. projects' },
  'section.projects.title': { pt: 'Projetos', en: 'Projects' },
  'section.skills.label': { pt: '03. habilidades', en: '03. skills' },
  'section.skills.title': { pt: 'Skills', en: 'Skills' },
  'section.experience.label': { pt: '04. trajetória', en: '04. journey' },
  'section.experience.title': { pt: 'Experiência', en: 'Experience' },
  'section.contact.label': { pt: '05. contato', en: '05. contact' },
  'section.contact.title': { pt: 'Vamos conversar', en: "Let's talk" },

  'projects.showLess': { pt: 'Mostrar menos', en: 'Show less' },
  'projects.private': { pt: 'privado', en: 'private' },
  'projects.privateTitle': { pt: 'Repositório privado', en: 'Private repository' },

  'contact.intro': {
    pt: 'Estou aberto a novas oportunidades, projetos freelance ou só uma boa conversa sobre tecnologia. Se quiser entrar em contato, é só me enviar um e-mail.',
    en: "I'm open to new opportunities, freelance projects or just a good chat about technology. If you'd like to get in touch, just send me an email.",
  },

  'footer.madeWith': { pt: 'Feito com Vue 3 + Tailwind CSS', en: 'Built with Vue 3 + Tailwind CSS' },
} satisfies Record<string, I18nString>

export type UiKey = keyof typeof ui

export function t(key: UiKey): string {
  return ui[key][locale.value]
}

/** "Ver todos os projetos (6)" / "View all projects (6)" */
export function tProjectsShowAll(count: number): string {
  return locale.value === 'pt'
    ? `Ver todos os projetos (${count})`
    : `View all projects (${count})`
}
