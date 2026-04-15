import { useContext } from 'react'
import { ThemeContext } from './themeContext'

export function useTheme() {
  return useContext(ThemeContext)
}

export function useThemeTokens() {
  return useTheme().tokens
}
