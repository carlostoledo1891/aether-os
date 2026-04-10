import type { ViewManifest } from '../types'

export const PREFEITURA_MANIFEST: ViewManifest = {
  id: 'prefeitura-pocos',
  title: 'Meteoric Resources × Prefeitura de Poços de Caldas',
  subtitle: 'Painel Público de Impacto Social e Ambiental',
  theme: 'dark',
  sections: [
    {
      id: 'impacto-economico',
      kind: 'metric-grid',
      title: 'Impacto Econômico',
      columns: 4,
      gap: 8,
      widgets: [
        { type: 'metric-card', props: { label: 'Empregos Diretos', value: '340', unit: 'postos', color: '#22D68A' } },
        { type: 'metric-card', props: { label: 'ISS Estimado', value: 'R$ 2.1M', unit: '/ano', color: '#00D4C8' } },
        { type: 'metric-card', props: { label: 'Investimento Local', value: 'R$ 45M', color: '#7C5CFC' } },
        { type: 'metric-card', props: { label: 'Ações Sociais', value: '12', unit: 'programas', color: '#F5A623' } },
      ],
    },
    {
      id: 'operacao',
      kind: 'metric-grid',
      title: 'Operação Minerária',
      columns: 3,
      gap: 8,
      widgets: [
        { type: 'metric-card', props: { label: 'Produção NdPr', value: '3,250', unit: 't/ano', color: '#7C5CFC' } },
        { type: 'metric-card', props: { label: 'Terras Raras (TREO)', value: '18,000', unit: 'tpa', color: '#00D4C8' } },
        { type: 'metric-card', props: { label: 'Vida Útil (LOM)', value: '25', unit: 'anos', color: '#22D68A' } },
      ],
    },
    {
      id: 'ambiental',
      kind: 'metric-grid',
      title: 'Compromisso Ambiental',
      columns: 4,
      gap: 8,
      widgets: [
        { type: 'metric-card', props: { label: 'Nascentes Preservadas', value: '1,092', unit: 'de 1,092', color: '#00D4C8' } },
        { type: 'metric-card', props: { label: 'Recirculação Hídrica', value: '95', unit: '%', color: '#22D68A' } },
        { type: 'metric-card', props: { label: 'Disposição Sólida', value: 'Dry-stack', sublabel: 'Zero barragens', color: '#7C5CFC' } },
        { type: 'metric-card', props: { label: 'CO₂ por Tonelada', value: '3.2', unit: 't CO₂e/t', sublabel: '70% abaixo da média', color: '#22D68A' } },
      ],
    },
    {
      id: 'social',
      kind: 'card-stack',
      title: 'Programas Sociais',
      gap: 8,
      widgets: [
        { type: 'metric-card', props: { label: 'Programa Jovem Aprendiz', value: '48 vagas/ano', sublabel: 'Parceria SENAI + ETEC', color: '#F5A623' } },
        { type: 'metric-card', props: { label: 'Fundo Comunitário', value: 'R$ 500K/ano', sublabel: 'Educação, saúde e cultura', color: '#22D68A' } },
        { type: 'metric-card', props: { label: 'Monitoramento Participativo', value: 'Tempo real', sublabel: 'Dados abertos para a comunidade', color: '#00D4C8' } },
      ],
    },
    {
      id: 'mapa',
      kind: 'hero-map',
      title: 'Área do Projeto',
      widgets: [
        {
          type: 'map-placeholder',
          geo: {
            layers: ['boundary', 'licenses', 'plantSites'],
            center: [-46.56, -21.87],
            zoom: 12,
          },
        },
      ],
    },
  ],
}
