import { W } from '../app/canvas/canvasTheme'
import { WL } from '../components/reports/reportTheme'

export type ThemeId = 'dark' | 'light'

type Widen<T> =
  T extends string ? string
    : T extends number ? number
      : T extends boolean ? boolean
        : T extends ReadonlyArray<infer U> ? Widen<U>[]
          : T extends object ? { [K in keyof T]: Widen<T[K]> }
            : T

export type ThemeTokens = Widen<typeof W>

const LIGHT_THEME: ThemeTokens = {
  ...W,
  ...WL,
  card: '#FFFFFF',
  cardHover: '#F6F3F8',
  inset: '#EFEDF3',
  icon: '#797387',
  iconMuted: '#A39CAB',
  teal: WL.cyan,
  tealMuted: '#007C75',
  tealDark: '#005E59',
  blueMuted: '#4F83F1',
  blueDark: '#1D4ED8',
  glass: 'rgba(0,0,0,0.022)',
  glassHover: 'rgba(0,0,0,0.06)',
  overlay88: 'rgba(244,242,247,0.9)',
  appShellGridLine: 'rgba(43,39,50,0.05)',
  mapHudPanelBg: 'rgba(255,255,255,0.92)',
  mapHudPanelBgWQ: 'rgba(0,168,158,0.08)',
  mapHudPanelBgWQWarn: 'rgba(212,137,10,0.12)',
  mapHudBorderCyan: '1px solid rgba(0,168,158,0.18)',
  mapHudBorderCyanStrong: '1px solid rgba(0,168,158,0.26)',
  mapHudBorderAmber: '1px solid rgba(212,137,10,0.22)',
  mapHudBorderRed: '1px solid rgba(220,53,69,0.2)',
  mapControlBg: 'rgba(255,255,255,0.94)',
  mapControlBorder: '1px solid rgba(26,26,46,0.12)',
  chromeHeaderBg: 'rgba(244,242,247,0.92)',
  scrim: 'rgba(27,26,39,0.18)',
  navScrim: 'rgba(244,242,247,0.92)',
  hairlineBorder: '1px solid rgba(43,39,50,0.08)',
  chromeBorder: '1px solid rgba(43,39,50,0.12)',
  bannerBgMock: 'rgba(43,39,50,0.03)',
  bannerBgLive: 'rgba(43,39,50,0.045)',
  bannerEdgeMock: 'rgba(43,39,50,0.10)',
  bannerEdgeLive: 'rgba(43,39,50,0.12)',
  mapWaterFill: '#D8ECF8',
  mapHalo: '#FFFFFF',
  mapCommercial: '#A8325A',
  mapSecondary: '#6A6A8A',
  redBorderSoft: 'rgba(220,53,69,0.22)',
  redBadgeBg: 'rgba(220,53,69,0.12)',
  graySubtle: 'rgba(107,114,128,0.08)',
  glass03: 'rgba(0,0,0,0.02)',
  glass05: 'rgba(0,0,0,0.05)',
  glass06: 'rgba(0,0,0,0.06)',
  glass08: 'rgba(0,0,0,0.08)',
  shadowSm: '0 2px 8px rgba(0,0,0,0.08)',
  shadowMd: '0 6px 18px rgba(0,0,0,0.12)',
  shadowLg: '0 10px 28px rgba(0,0,0,0.16)',
}

export const THEME_TOKENS: Record<ThemeId, ThemeTokens> = {
  dark: W,
  light: LIGHT_THEME,
}

export function getThemeTokens(theme: ThemeId): ThemeTokens {
  return THEME_TOKENS[theme]
}

export function setDocumentTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}
