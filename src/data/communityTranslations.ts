/**
 * Bilingual community card translations (EN / PT-BR).
 * Scoped to the EnvironmentPanel community notice — not a full i18n system.
 */

export type CommunityLang = 'en' | 'pt'

export interface CommunityStrings {
  title: string
  disclaimer: string
  disclaimer_bold: string
  disclaimer_rest: string
  grievance_title: string
  grievance_intro: string
  grievance_steps: string[]
  contacts_title: string
  contacts: { label: string; value: string; note?: string }[]
  toggle_label: string
  forecast_title: string
  forecast_safe: string
  forecast_disclaimer: string
}

export const COMMUNITY_STRINGS: Record<CommunityLang, CommunityStrings> = {
  en: {
    title: 'Community & Stakeholder Notice',
    disclaimer: 'Spring status colors are',
    disclaimer_bold: 'modeled for monitoring plan rehearsal',
    disclaimer_rest:
      '— not field-verified findings. Locations use public FBDS/CAR reference geometry. ' +
      'For actual water quality data, contact the relevant monitoring authority. ' +
      'This view demonstrates how VeroChain would support transparent environmental reporting, not substitute for it.',
    grievance_title: 'How to Report a Concern',
    grievance_intro: 'If you have a concern about water quality, environmental impact, or community impact:',
    grievance_steps: [
      'Contact FEAM (State Environmental Foundation) or IGAM (Water Management Institute) using the numbers below.',
      'You may also reach Meteoric Resources\' community liaison office for project-specific questions.',
      'All concerns are logged and tracked. You have the right to a response within 30 business days.',
    ],
    contacts_title: 'Key Contacts',
    contacts: [
      { label: 'FEAM — Fundação Estadual do Meio Ambiente', value: '(31) 3915-1200', note: 'Environmental licensing and monitoring' },
      { label: 'IGAM — Instituto de Gestão das Águas', value: '(31) 3915-1400', note: 'Water resources management' },
      { label: 'MPF — Ministério Público Federal', value: '(35) 3697-9700', note: 'Federal prosecution (environmental enforcement)' },
      { label: 'Meteoric Community Office', value: 'community@meteoric.com.au', note: 'Project-specific community inquiries' },
    ],
    toggle_label: 'Português',
    forecast_title: '7-Day Water Outlook',
    forecast_safe: 'Predicted rainfall will not affect water quality thresholds in the next 7 days.',
    forecast_disclaimer: 'Predictive model — does not replace official monitoring.',
  },
  pt: {
    title: 'Aviso à Comunidade e Partes Interessadas',
    disclaimer: 'As cores de status das nascentes são',
    disclaimer_bold: 'modeladas para ensaio do plano de monitoramento',
    disclaimer_rest:
      '— não são resultados verificados em campo. As localizações utilizam geometria de referência pública FBDS/CAR. ' +
      'Para dados reais de qualidade da água, entre em contato com a autoridade de monitoramento competente. ' +
      'Esta visualização demonstra como o VeroChain apoiaria relatórios ambientais transparentes, não substitui os órgãos competentes.',
    grievance_title: 'Como Relatar uma Preocupação',
    grievance_intro: 'Se você tem uma preocupação sobre qualidade da água, impacto ambiental ou impacto na comunidade:',
    grievance_steps: [
      'Entre em contato com a FEAM (Fundação Estadual do Meio Ambiente) ou IGAM (Instituto de Gestão das Águas) pelos números abaixo.',
      'Você também pode procurar o escritório de relacionamento comunitário da Meteoric Resources para questões específicas do projeto.',
      'Todas as reclamações são registradas e acompanhadas. Você tem direito a uma resposta em até 30 dias úteis.',
    ],
    contacts_title: 'Contatos Importantes',
    contacts: [
      { label: 'FEAM — Fundação Estadual do Meio Ambiente', value: '(31) 3915-1200', note: 'Licenciamento e monitoramento ambiental' },
      { label: 'IGAM — Instituto de Gestão das Águas', value: '(31) 3915-1400', note: 'Gestão de recursos hídricos' },
      { label: 'MPF — Ministério Público Federal', value: '(35) 3697-9700', note: 'Fiscalização ambiental federal' },
      { label: 'Escritório Comunitário Meteoric', value: 'community@meteoric.com.au', note: 'Consultas comunitárias sobre o projeto' },
    ],
    toggle_label: 'English',
    forecast_title: 'Previsão Hídrica — 7 Dias',
    forecast_safe: 'A chuva prevista não afetará os limites de qualidade da água nos próximos 7 dias.',
    forecast_disclaimer: 'Modelo preditivo — não substitui monitoramento oficial.',
  },
}
