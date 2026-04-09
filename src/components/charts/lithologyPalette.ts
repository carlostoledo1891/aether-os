export const LITH_COLORS: Record<string, string> = {
  laterite:            '#E9D5FF',
  saprolite:           '#C4B5FD',
  weathered_phonolite: '#A78BFA',
  fresh_phonolite:     '#7C5CFC',
  tinguaite:           '#6D28D9',
  nepheline_syenite:   '#4C1D95',
  alluvium:            '#F5F3FF',
}

export const LITH_LABELS: Record<string, string> = {
  laterite:            'Laterite',
  saprolite:           'Saprolite',
  weathered_phonolite: 'Weathered phonolite',
  fresh_phonolite:     'Fresh phonolite',
  tinguaite:           'Tinguaite',
  nepheline_syenite:   'Nepheline syenite',
  alluvium:            'Alluvium',
}

export const LITH_ORDER = [
  'alluvium', 'laterite', 'saprolite',
  'weathered_phonolite', 'fresh_phonolite',
  'tinguaite', 'nepheline_syenite',
] as const
