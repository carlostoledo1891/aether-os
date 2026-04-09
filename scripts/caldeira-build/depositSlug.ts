/** Map ASX appendix target names to `caldeira-drillholes` deposit slugs. */
const TARGET_TO_DEPOSIT: Record<string, string> = {
  Agostinho: 'agostinho',
  'Barra do Pacú': 'barra-do-pacu',
  'Capão do Mel': 'capao-do-mel',
  Cercado: 'cercado',
  'Cipó': 'cipo',
  'Cipo 3': 'cipo-3',
  Coqueirinho: 'coqueirinho',
  'Cupim Vermelho Norte': 'cupim-vermelho-norte',
  'Cupim Vermelho Sul': 'cupim-vermelho-sul',
  Donana: 'donana',
  'Dona Maria 1': 'dona-maria-1',
  'Dona Maria 2': 'dona-maria-2',
  'Fazenda Limoeiro': 'fazenda-limoeiro',
  Figueira: 'figueira',
  Pião: 'piao',
  Pinheiro: 'pinheiro',
  Pitangueira: 'pitangueira',
  Soberbo: 'soberbo',
  Tamandua: 'tamandua',
  Tatu: 'tatu',
}

export function targetToDeposit(target: string): string {
  const d = TARGET_TO_DEPOSIT[target]
  if (d) return d
  return target
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, '-')
}
