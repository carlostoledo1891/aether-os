/* ─── Aether OS Canvas Theme ─────────────────────────────────────────────── */
/* JS mirror of theme.css tokens for programmatic use in SVG, canvas, recharts */

export const W = {
  bg:           '#07070E',
  canvas:       '#060610',
  panel:        '#0D0D1C',
  surface:      '#121228',
  surfaceHigh:  '#181834',
  border:       '#20203A',
  border2:      '#2E2E52',
  border3:      '#424270',
  text1:        '#ECECF8',
  text2:        '#A0A0C8',
  text3:        '#6B6B98',
  text4:        '#5A5A88',
  violet:       '#7C5CFC',
  violetSoft:   '#9D80FF',
  violetGlow:   'rgba(124,92,252,0.25)',
  violetSubtle: 'rgba(124,92,252,0.13)',
  cyan:         '#00D4C8',
  cyanGlow:     'rgba(0,212,200,0.22)',
  cyanSubtle:   'rgba(0,212,200,0.10)',
  green:        '#22D68A',
  greenGlow:    'rgba(34,214,138,0.22)',
  greenSubtle:  'rgba(34,214,138,0.10)',
  amber:        '#F5A623',
  amberGlow:    'rgba(245,166,35,0.22)',
  amberSubtle:  'rgba(245,166,35,0.10)',
  red:          '#FF4D4D',
  redGlow:      'rgba(255,77,77,0.22)',
  redSubtle:    'rgba(255,77,77,0.10)',
  glass:        'rgba(255,255,255,0.035)',
  glassHover:   'rgba(255,255,255,0.06)',
} as const

/* Domain lanes for REE vertical */
export const DOMAIN_COLORS: Record<string, {
  border: string; bg: string; label: string; text: string;
}> = {
  Extraction:  { border: W.cyan,   bg: W.cyanSubtle,   label: W.cyan,      text: W.text2 },
  Processing:  { border: W.violet, bg: W.violetSubtle,  label: W.violetSoft, text: W.text2 },
  Compliance:  { border: W.green,  bg: W.greenSubtle,  label: W.green,     text: W.text2 },
  Environment: { border: W.amber,  bg: W.amberSubtle,  label: W.amber,     text: W.text2 },
  Critical:    { border: W.red,    bg: W.redSubtle,    label: W.red,       text: W.text2 },
}

export type StatusType = 'running' | 'success' | 'failed' | 'warning' | 'idle' | 'offline'

export const STATUS_PRIORITY: Record<StatusType, number> = {
  failed:  5,
  warning: 4,
  running: 3,
  success: 2,
  idle:    1,
  offline: 0,
}
