import { createContext } from 'react'
import { getThemeTokens, type ThemeId, type ThemeTokens } from './themeTokens'

export interface ThemeContextValue {
  theme: ThemeId
  tokens: ThemeTokens
}

const DEFAULT_THEME: ThemeId = 'dark'

export const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  tokens: getThemeTokens(DEFAULT_THEME),
})

export function createThemeValue(theme: ThemeId): ThemeContextValue {
  return {
    theme,
    tokens: getThemeTokens(theme),
  }
}
