# Theming Contract

This app now supports theme selection at the app, route, and section level without adding a user-facing theme switcher.

## Rules

- Use `dark` as the default document theme.
- Apply alternate themes intentionally in code with `ThemeScope` or `ThemeBoundary`.
- Prefer route-level or contained section-level overrides; do not let nested screens mutate the entire document theme.
- Do not add per-section token override maps yet. Stay with named theme presets only.

## Theme IDs

- `dark`: default product shell, maps, operations, marketing, decks.
- `light`: reports, printable surfaces, and any section that needs paper-like presentation.

## How To Use

- CSS-only surfaces: consume the existing `--w-*` variables from `src/styles/theme.css`.
- JS-driven surfaces: use `useThemeTokens()` for inline styles, SVG, and chart colors.
- Route or section overrides: wrap content in `ThemeScope theme="light"` or `ThemeScope theme="dark"`.
- Existing shells that need theme-aware tokens should use `getThemeTokens()` or `useThemeTokens()` instead of importing `W` directly.

## Current Foundation

- `src/theme/themeTokens.ts` defines the named presets.
- `src/theme/ThemeProvider.tsx` owns root theme context plus nested theme boundaries.
- `src/styles/theme.css` mirrors the presets into CSS custom properties.
- `src/main.tsx` bootstraps the default document theme early to avoid a flash of the wrong palette.

## Deferred

- No user switcher.
- No arbitrary per-section token overrides.
- No chart-specific or map-style adapters beyond the shared token bridge yet.
