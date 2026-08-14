import type { I18nString } from '@/i18n'

export const personal = {
  name: 'Marcus Vinicius',
  initials: 'MV',
  role: {
    pt: 'Engenheiro de Software Backend',
    en: 'Backend Software Engineer',
  } as I18nString,
  /** Cycled through by the hero typewriter. The first is the job title; the
   *  rest are claims, not stack lists — a recruiter learns nothing from
   *  "Python, FastAPI, Django". */
  roleVariants: {
    pt: [
      'Engenheiro de Software Backend',
      'Deixo sistema lento rápido e sistema frágil entediante',
      'Entrego a parte que precisa ficar de pé às 3 da manhã',
      'Leio o plano da query antes de culpar o front',
    ],
    en: [
      'Backend Software Engineer',
      'I make slow systems fast and fragile ones boring',
      'I ship the part that has to stay up at 3am',
      'I read the query plan before blaming the frontend',
    ],
  },
  about: {
    pt: `Entrei nisso querendo entender redes neurais. Treinei algumas — um mapa auto-organizável para fraude de crédito, uma RNN para prever ações — e descobri que gostava mais do que ficava embaixo: o serviço que precisa responder em 40ms enquanto outros três sistemas estão pegando fogo.

Então fui pro backend. Seis anos depois estou na Samplemed, numa plataforma de saúde multi-tenant onde cada cliente tem o próprio banco e nenhum deles quer saber disso. A lição que ficou: experiência do usuário começa no backend. Uma tela é lenta porque uma query é lenta.

Prazer, Marcus. Os amigos antigos — e minha primeira conta no GitHub — me chamam de Chuck.`,
    en: `I got into this wanting to understand neural networks. I trained a few — a self-organising map for credit fraud, an RNN for stock forecasting — and found out I cared more about what sat underneath: the service that has to answer in 40ms while three other systems are on fire.

So I went backend. Six years later I'm at Samplemed on a multi-tenant health platform where every client gets their own database and none of them ever want to hear about it. The lesson that stuck: user experience starts at the backend. A screen is slow because a query is slow.

I'm Marcus. Old friends — and my first GitHub account — call me Chuck.`,
  } as I18nString,
  location: { pt: 'Brasil · Remoto', en: 'Brazil · Remote' } as I18nString,
  email: 'marcusandrade.37@gmail.com',
  emailUrl: 'https://mail.google.com/mail/?view=cm&fs=1&to=marcusandrade.37@gmail.com',
  github: 'https://github.com/Pissinatti-py',
  githubEarly: 'https://github.com/Chuckpy',
  linkedin: 'https://www.linkedin.com/in/marcusviniciusfonsecap',
  repo: 'https://github.com/Pissinatti-py/portfolio',
}

/** Short proof points shown under the hero. Every one has to be checkable from
 *  the page itself — the third points at finance-ai-assistant and
 *  market-insights-service, both linked in the work grid. */
export const stats: { id: string; value: I18nString; label: I18nString }[] = [
  {
    id: 'years',
    value: { pt: '6+', en: '6+' },
    label: { pt: 'anos em produção', en: 'years in production' },
  },
  {
    id: 'repos',
    value: { pt: '20+', en: '20+' },
    label: { pt: 'repositórios públicos', en: 'public repositories' },
  },
  {
    id: 'ai',
    value: { pt: 'Agentes + RAG', en: 'Agents + RAG' },
    label: { pt: 'entregue, não demo', en: 'shipped, not demoed' },
  },
]
