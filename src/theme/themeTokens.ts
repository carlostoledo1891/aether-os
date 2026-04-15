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
  teal: WL.cyan,
  tealMuted: '#007C75',
  tealDark: '#005E59',
  blueMuted: '#4F83F1',
  blueDark: '#1D4ED8',
  glassHover: 'rgba(0,0,0,0.06)',
  overlay88: 'rgba(250,250,253,0.88)',
  appShellGridLine: 'rgba(26,26,46,0.05)',
  mapHudPanelBg: 'rgba(255,255,255,0.92)',
  mapHudPanelBgWQ: 'rgba(0,168,158,0.08)',
  mapHudPanelBgWQWarn: 'rgba(212,137,10,0.12)',
  mapHudBorderCyan: '1px solid rgba(0,168,158,0.18)',
  mapHudBorderCyanStrong: '1px solid rgba(0,168,158,0.26)',
  mapHudBorderAmber: '1px solid rgba(212,137,10,0.22)',
  mapHudBorderRed: '1px solid rgba(220,53,69,0.2)',
  mapControlBg: 'rgba(255,255,255,0.94)',
  mapControlBorder: '1px solid rgba(26,26,46,0.12)',
  chromeHeaderBg: 'rgba(255,255,255,0.92)',
  scrim: 'rgba(15,23,42,0.18)',
  navScrim: 'rgba(255,255,255,0.9)',
  hairlineBorder: '1px solid rgba(26,26,46,0.08)',
  chromeBorder: '1px solid rgba(26,26,46,0.12)',
  bannerBgMock: 'rgba(0,168,158,0.06)',
  bannerBgLive: 'rgba(212,137,10,0.08)',
  bannerEdgeMock: 'rgba(0,168,158,0.12)',
  bannerEdgeLive: 'rgba(212,137,10,0.18)',
  mapWaterFill: '#D8ECF8',
  mapHalo: '#FFFFFF',
  mapCommercial: '#A8325A',
  mapSecondary: '#6A6A8A',
  redBorderSoft: 'rgba(220,53,69,0.22)',
  redBadgeBg: 'rgba(220,53,69,0.12)',
  graySubtle: 'rgba(107,114,128,0.08)',
  glass03: 'rgba(0,0,0,0.03)',
  glass05: 'rgba(0,0,0,0.05)',
  glass06: 'rgba(0,0,0,0.06)',
  glass08: 'rgba(0,0,0,0.08)',
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
