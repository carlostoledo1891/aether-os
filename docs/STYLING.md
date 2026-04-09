# Vero Dashboard — styling contract

This document defines how UI styling is organized so the codebase stays consistent, documented, and ready for future **theme switching** (light/dark or alternate palettes) without a full rewrite.

## Source of truth

| Layer | Role |
|-------|------|
| **`W` in [`src/app/canvas/canvasTheme.ts`](../src/app/canvas/canvasTheme.ts)** | Canonical colors, glass stops, chrome borders, radii, and layout tints for **TypeScript** (inline `style`, Recharts, SVG props, MapLibre paint where dynamic). |
| **`:root` in [`src/styles/theme.css`](../src/styles/theme.css)** | Same semantic values as CSS variables (`--w-*`) for **global CSS**, scrollbars, keyframes, and **future** `[data-theme="…"]` overrides. |
| **`index.css`** | Reset, body, scrollbar — uses `var(--w-*)` only. |

**Rule:** When adding a token, add it to **`W` first**, then mirror it in **`theme.css`** with a `--w-*` name. Keep string values identical.

## When to use what

- **`W.*` in components** — Default for React inline styles. Import `W` from `canvasTheme.ts`.
- **`var(--w-*)` in `.css` files** — Use for static global rules and animations that do not need JS.
- **Raw `rgba` / `#hex` in TSX** — Only when:
  - MapLibre / third-party APIs require a literal, or
  - You are composing a one-off with a comment pointing to the nearest `W` equivalent, or
  - Two tokens are blended (prefer extracting a named token if reused).

## Canonical radii

Use **`W.radius.sm` (7)**, **`W.radius.md` (10)**, **`W.radius.lg` (14)** — mirrored as `--w-radius-sm|md|lg` in CSS.

## Borders and glass

- **Hairline seams** (header/footer/tab bars): `W.hairlineBorder` — `1px solid rgba(255,255,255,0.06)`.
- **Chrome** (cards, icon buttons, drawer edges): `W.chromeBorder` — `1px solid rgba(255,255,255,0.08)`.
- **Surfaces:** `W.glass`, `W.glass02`, `W.glass04`, `W.glass07`, `W.glass12`, `W.overlay88` — use the smallest opacity that reads correctly.

[`GlassCard`](../src/components/ui/GlassCard.tsx) uses **`W.glass`**, **`W.chromeBorder`**, **`W.radius.lg`**, and accent glows derived from `W.*Glow` tokens.

## Layout chrome

- **App header:** `W.chromeHeaderBg`
- **Modal scrim:** `W.scrim`
- **Data honesty banner:** `W.bannerBgMock` / `W.bannerBgLive` and edge colors `W.bannerEdgeMock` / `W.bannerEdgeLive`

## Shared UI primitives

Reusable building blocks live under [`src/components/ui/`](../src/components/ui/):

- **`SectionLabel`** — Uppercase micro-heading (`text4`, wide tracking) for panel sections.
- **`MutedCaption`** — Secondary explanatory line (`text4`, small).
- **`HairlineDivider`** — Horizontal or vertical 1px separator using `W.border2`.

Prefer these over copying the same `fontSize` / `color` blocks into new panels.

## Tailwind

Tailwind 4 is loaded from `theme.css` (`@theme inline` maps core `--w-*` colors). Use utilities for **layout** (`flex`, `gap`, `grid`) when it reduces noise; keep **semantic colors** on `W` or CSS variables so themes can swap later.

## Performance notes

- Inline style objects are recreated each render; at current scale this is acceptable. If a list becomes hot, hoist static styles or wrap rows in `React.memo` after profiling.
- Map overlays (`HydroOverlay`, `PlantOverlay`) are the heaviest surfaces — avoid unnecessary state churn on pan/zoom.

## Future: light/dark and alternate palettes (not implemented)

**Recommended approach when you prioritize it:**

1. Add **`data-theme="dark" | "light"`** on `<html>` (default `dark` to match today).
2. Define a second block in `theme.css`, e.g. `[data-theme="light"] { --w-bg: …; --w-text1: …; }`, duplicating or deriving semantic tokens.
3. Persist the user choice in **`localStorage`** (e.g. `aether-theme`) and read it in **`main.tsx`** before paint to avoid flash.
4. Optional: small **`ThemeContext`** in React for components that must branch in JS (charts, MapLibre).
5. **Maps:** Decide whether the basemap stays dark for contrast or follows UI theme (product decision).

Do **not** sprinkle `prefers-color-scheme` until semantic tokens and `data-theme` are in place.

See also: [`HANDOFF.md`](../HANDOFF.md) (narrative and architecture context).
