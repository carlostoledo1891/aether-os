/**
 * Light-mode palette for report templates.
 * Mirrors the W (dark) token shape so components can swap WL for W inside reports.
 */
export const WL = {
  bg:           '#FFFFFF',
  canvas:       '#FAFAFD',
  panel:        '#F5F5FA',
  surface:      '#EDEDF5',
  surfaceHigh:  '#E4E4F0',
  border:       '#D8D8E8',
  border2:      '#C8C8DC',
  border3:      '#B0B0CC',
  text1:        '#1A1A2E',
  text2:        '#4A4A6A',
  text3:        '#6A6A8A',
  text4:        '#9A9AB0',

  violet:       '#7C5CFC',
  violetSoft:   '#9D80FF',
  violetGlow:   'rgba(124,92,252,0.15)',
  violetSubtle: 'rgba(124,92,252,0.08)',

  cyan:         '#00A89E',
  cyanGlow:     'rgba(0,168,158,0.12)',
  cyanSubtle:   'rgba(0,168,158,0.06)',

  blue:         '#3B82F6',
  blueGlow:     'rgba(59,130,246,0.12)',
  blueSubtle:   'rgba(59,130,246,0.06)',

  green:        '#16A366',
  greenGlow:    'rgba(22,163,102,0.12)',
  greenSubtle:  'rgba(22,163,102,0.06)',

  amber:        '#D4890A',
  amberGlow:    'rgba(212,137,10,0.12)',
  amberSubtle:  'rgba(212,137,10,0.06)',

  red:          '#DC3545',
  redGlow:      'rgba(220,53,69,0.12)',
  redSubtle:    'rgba(220,53,69,0.06)',

  glass:        'rgba(0,0,0,0.025)',
  glass02:      'rgba(0,0,0,0.02)',
  glass04:      'rgba(0,0,0,0.04)',
  glass07:      'rgba(0,0,0,0.07)',
  glass12:      'rgba(0,0,0,0.12)',

  textInverse:  '#ffffff',
  gray:         '#6B7280',

  radius:       { xs: 4, sm: 7, md: 10, lg: 14 },
} as const

export type TimeRange = '7d' | '30d' | '90d' | '1yr' | 'all'
