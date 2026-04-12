/* ─── Aether OS Canvas Theme ─────────────────────────────────────────────── */
/* Canonical palette for TS/JS (inline styles, SVG, Recharts). Keep in sync with
 * src/styles/theme.css :root — same names map to --w-* variables there. */

/**
 * Contrast policy (WCAG 2.1 AA):
 * - text1: primary body text, ≥7:1 on bg — AAA
 * - text2: secondary labels, ≥5:1 on bg — AA
 * - text3: muted captions, ≥4.5:1 on bg — AA (lightened in v10)
 * - text4: decorative/meta only, ~4.8:1 — borderline AA; never for essential info
 */
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
  text3:        '#8888B8',
  text4:        '#7878B0',
  violet:       '#7C5CFC',
  violetSoft:   '#9D80FF',
  violetGlow:   'rgba(124,92,252,0.25)',
  violetSubtle: 'rgba(124,92,252,0.13)',
  cyan:         '#00D4C8',
  cyanGlow:     'rgba(0,212,200,0.22)',
  cyanSubtle:   'rgba(0,212,200,0.10)',
  blue:         '#3B82F6',
  blueGlow:     'rgba(59,130,246,0.22)',
  blueSubtle:   'rgba(59,130,246,0.10)',
  blueMuted:    '#60A5FA',
  blueDark:     '#1E40AF',
  teal:         '#00D4C8',
  tealMuted:    '#009E95',
  tealDark:     '#006B66',
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
  glass02:      'rgba(255,255,255,0.02)',
  glass04:      'rgba(255,255,255,0.04)',
  glass07:      'rgba(255,255,255,0.07)',
  glass12:      'rgba(255,255,255,0.12)',
  glassHover:   'rgba(255,255,255,0.06)',
  overlay88:    'rgba(6,6,16,0.88)',

  /** App shell background grid (1px lines) */
  appShellGridLine: 'rgba(255,255,255,0.012)',
  /** Map HUD floating panels (springs counter, weather strip) */
  mapHudPanelBg:    'rgba(5,5,16,0.82)',
  mapHudPanelBgWQ:  'rgba(0,212,200,0.08)',
  mapHudPanelBgWQWarn: 'rgba(245,166,35,0.12)',
  mapHudBorderCyan: '1px solid rgba(0,212,200,0.18)',
  mapHudBorderCyanStrong: '1px solid rgba(0,212,200,0.20)',
  mapHudBorderAmber: '1px solid rgba(245,166,35,0.28)',
  mapHudBorderRed: '1px solid rgba(255,77,77,0.25)',
  mapControlBg:     'rgba(13, 13, 28, 0.95)',
  mapControlBorder: '1px solid rgba(255, 255, 255, 0.08)',

  /** App shell: top header bar (blur + tint) */
  chromeHeaderBg: 'rgba(13,13,28,0.95)',
  /** Full modal overlay */
  scrim:          'rgba(0,0,0,0.5)',
  /** Marketing page nav bar (blurred fixed header) */
  navScrim:       'rgba(7,7,14,0.88)',
  /** Panel seams, tab bars */
  hairlineBorder: '1px solid rgba(255,255,255,0.06)',
  /** Glass cards, icon buttons, inputs */
  chromeBorder:   '1px solid rgba(255,255,255,0.08)',
  /** Data honesty strip (getDataContext) */
  bannerBgMock:   'rgba(0,212,200,0.06)',
  bannerBgLive:   'rgba(245,166,35,0.08)',
  bannerEdgeMock: 'rgba(0,212,200,0.12)',
  bannerEdgeLive: 'rgba(245,166,35,0.2)',
  /** Map: water feature fill (dark blue tint) */
  mapWaterFill:   '#0A1A28',
  /** Map: text halo / label knockout (matches canvas) */
  mapHalo:        '#060610',
  /** Map: commercial plant marker */
  mapCommercial:  '#8B1538',
  /** Map: secondary / muted geometry */
  mapSecondary:   '#B8B8D8',
  /** High-contrast on accent fills */
  textInverse:    '#ffffff',
  /** Alert / destructive ring (e.g. bell when alerts active) */
  redBorderSoft:  'rgba(255,77,77,0.3)',
  /** Small alert count badges */
  redBadgeBg:     'rgba(255,77,77,0.15)',
  /** Neutral/muted gray for waste, inactive, disabled states */
  gray:           '#6B7280',
  graySubtle:     'rgba(107,114,128,0.06)',

  glass03:      'rgba(255,255,255,0.03)',
  glass05:      'rgba(255,255,255,0.05)',
  glass06:      'rgba(255,255,255,0.06)',
  glass08:      'rgba(255,255,255,0.08)',

  radius:       { xs: 4, sm: 7, md: 10, lg: 14 },
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
