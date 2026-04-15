import { useEffect, useMemo, type CSSProperties, type ReactNode } from 'react'
import { setDocumentTheme, type ThemeId } from './themeTokens'
import { ThemeContext, createThemeValue } from './themeContext'

const DEFAULT_THEME: ThemeId = 'dark'

export function ThemeProvider({
  theme = DEFAULT_THEME,
  children,
}: {
  theme?: ThemeId
  children: ReactNode
}) {
  useEffect(() => {
    setDocumentTheme(theme)
  }, [theme])

  const value = useMemo(() => createThemeValue(theme), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function ThemeBoundary({
  theme,
  children,
}: {
  theme: ThemeId
  children: ReactNode
}) {
  const value = useMemo(() => createThemeValue(theme), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function ThemeScope({
  theme,
  children,
  className,
  style,
}: {
  theme: ThemeId
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <ThemeBoundary theme={theme}>
      <div data-theme={theme} className={className} style={style}>
        {children}
      </div>
    </ThemeBoundary>
  )
}
