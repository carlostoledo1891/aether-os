# Marketing homepage — action plan (updated)

Scope: `/` landing (`LandingPage` → `MarketingShell` → `ScrollyExperience` + globe HUD).  
Audience: implementers + QA. **No camera/story copy changes** unless explicitly added later.

## One phase per chat (handoff workflow)

Work is split so **each letter phase (A–F) runs in its own Cursor chat**, with a **copy-paste handoff** into the next chat.

| Resource | Purpose |
|----------|---------|
| [`marketing-homepage-phases/README.md`](./marketing-homepage-phases/README.md) | Order, rules, branching note |
| [`marketing-homepage-phases/phase-a.md`](./marketing-homepage-phases/phase-a.md) … **phase-f.md** | **Chat starter** block + **tasks** + **Handoff template** for the next phase |
| [`marketing-homepage-phases/phase-g.md`](./marketing-homepage-phases/phase-g.md) | Lint / test / build + manual smoke (run after **every** phase and before merge) |

**How to run it:** open a **new chat** → `@docs/marketing-homepage-phases/phase-<letter>.md` → paste that file’s **Chat starter** block → implement only that phase → copy the **Handoff** block (filled) into the **next** chat with `@phase-<next>.md`.

---

## Goals

| # | Goal | Success signal |
|---|------|----------------|
| G1 | **Orientation** | Users can tell story position and rough “how much left” without guessing. |
| G2 | **Wayfinding** | Trust / product reachable in **one click** from `/` without finishing scroll. |
| G3 | **Contrast & legibility** | Hero + HUD readable on worst-case basemap frames; **AA** for normal text where background is stable; dynamic map documented + spot-checked. |
| G4 | **Motion prefs** | Decorative motion respects `prefers-reduced-motion` (parity with `useScrollDriver`). |
| G5 | **A11y** | Ticker rows have accessible names; demo dialog is keyboard-safe (focus trap + restore). |
| G6 | **Distribution** | `meta description` + Open Graph + Twitter card tags present for share previews. |

---

## Contrast baseline (do this before / while building)

Reference: `src/styles/theme.css` (`--w-text1` … `--w-text4`), `MarketingGlobe.tsx` (scrim + vignette), `ScrollyExperience.tsx` (hero vs glass beats).

| Finding | Action in this plan |
|---------|---------------------|
| **`text4` (#676372) at 10px eyebrows** — ~**3:1** on solid dark, **below AA** for normal text | **Phase C** — marketing eyebrows / tiny HUD caps use **`text3`** or a dedicated **`--w-text4-marketing`** slightly lighter; avoid redefining global “disabled” semantics without audit. |
| **Hero beat** — transparent panel on **map + scrim** (variable) | **Phase C** — targeted **left-weighted gradient or frosted text column** on thesis (optional: tie scrim bump to scroll only for thesis window). |
| **Ticker header `text4` on glass over map** | Same as eyebrows + **focus ring** for perceived clarity. |
| **CTA `#5A2EE6` / white** | **No change required** (~7:1). |
| **Accent `#7C5CFC` in large headline** | OK as **large text**; do not use at **body** size on `#181724` without check. |

**Verification:** (1) Token pairs via `npx @google/design.md lint` once a `DESIGN.md` exists, or manual spreadsheet. (2) **Screenshots** at multiple scroll positions × with/without MapTiler key × 200% zoom. (3) Optional: `prefers-reduced-transparency` if you add heavy blur.

---

## Phase A — Meta & distribution (G6)

| Task | Files | Acceptance | Test |
|------|-------|------------|------|
| A1 | `index.html` | `meta name="description"`; `og:title`, `og:description`, `og:url`, `og:type`; `twitter:card`, `twitter:title`, `twitter:description` | View source; opengraph preview on staging URL |
| A2 | Same | **`VITE_PUBLIC_SITE_URL`** in Vite (`phase-a.md`) — optional override for preview/staging `og:url`; default production URL unchanged. | Same |

---

## Phase B — Motion & micro-a11y (G4 + partial G5)

| Task | Files | Acceptance | Test |
|------|-------|------------|------|
| B1 | `ProvenanceChip.tsx` | No infinite pulse when `prefers-reduced-motion: reduce` | macOS Reduce Motion on/off |
| B2 | `AuditTicker.tsx` | No `rowIn` translate animation when reduced motion | Same |
| B3 | `AuditTicker.tsx` | Each row `<button>` has **`aria-label`** describing action + kind + block | VoiceOver / NVDA; axe |
| B4 | `AuditTicker.tsx` | **`focus-visible`** outline (token-based, e.g. violet/cyan ring) | Tab through ticker |

---

## Phase C — Contrast & hero legibility (G3)

| Task | Files | Acceptance | Test |
|------|-------|------------|------|
| C1 | `ScrollyExperience.tsx` (eyebrow) | Eyebrow color passes **≥4.5:1** on intended surface (solid or glass), or documented as large if ever bumped | Contrast check vs `#181724` and vs `rgba(8,11,22,0.55)` composite |
| C2 | `ScrollyExperience.tsx` (hero `panelStyle`) | **Thesis** text block has **gradient scrim and/or frosted column** behind copy only; map remains visible at edges | Screenshots worst-case basemap; 200% zoom |
| C3 | `AuditTicker.tsx` (header row) | Header uses same upgraded meta color as C1 | Visual + ratio |
| C4 | Optional | `MarketingGlobe` `scrim` prop bump **only** when thesis beat fully active — **if** C2 insufficient; avoid flattening whole story | Compare scroll positions side-by-side |

---

## Phase D — Navigation & skip (G2)

| Task | Files | Acceptance | Test |
|------|-------|------------|------|
| D1 | `MarketingNav.tsx` | Links: **Trust** → `/trust`, **Product** (or **App**) → `/app` (or agreed path); tokens `W`; tap targets **≥44px** mobile | Click routes; no overlap with `ProvenanceChip` / ticker |
| D2 | `MarketingShell.tsx` (or small component) | **Skip to main content** link, visible on focus, targets scroll container / `#main` | First Tab from load; Enter |

---

## Phase E — Story orientation (G1)

| Task | Files | Acceptance | Test |
|------|-------|------------|------|
| E1 | New component + `globeBus` / `subscribeToProgress` | **Chapter dots or strip** reflects progress `t`; no second scroll listener fighting `useScrollDriver` | Slow scroll: indicator tracks |
| E2 | Optional | Click dot → `scrollTo` approximate beat; `behavior` respects reduced motion | Click each chapter; map + copy roughly aligned |

---

## Phase F — Demo modal a11y (G5)

| Task | Files | Acceptance | Test |
|------|-------|------------|------|
| F1 | `RequestDemo.tsx` | **Focus trap** when open; Tab cycles inside | Keyboard only |
| F2 | Same | **Restore focus** to invoking control on close | Tab after close |
| F3 | Optional | `aria-describedby` if helper copy added | axe / Lighthouse |

---

## Phase G — Regression gates (always)

| Step | Command / action |
|------|------------------|
| G.1 | `npm run lint` |
| G.2 | `npm run test:run` |
| G.3 | `npm run build` |
| G.4 | Manual: iPhone Safari + Android Chrome — nav, dots (if shipped), ticker, demo, full scroll once |
| G.5 | Optional Playwright: meta tags on `/`; `emulateMedia({ reducedMotion: 'reduce' })` assert pulse/animation class behavior |

Align with `.github/workflows/ci.yml` before merge.

---

## Recommended order

1. **A** (meta) — isolated, no UX risk.  
2. **B** (motion + aria + focus ring) — quick, high a11y value.  
3. **C** (contrast / hero / HUD meta) — highest visual + compliance impact.  
4. **D** (nav + skip) — product discovery.  
5. **E** (progress) — more moving parts; validate scroll math.  
6. **F** (focus trap) — modal polish.

**Parallel:** A + B can ship in one PR; C often deserves its own PR for visual review.

---

## Out of scope (unless added later)

- Rewriting marketing beats or `TRACK_VH` / `cameraPath.ts` keyframes.  
- Analytics instrumentation.  
- New dependencies for head-only meta (prefer static `index.html` unless multi-route meta is required).

---

## Revision history

| Date | Change |
|------|--------|
| 2026-04-22 | Initial plan: phases A–F + gates. |
| 2026-04-22 | **Updated:** merged **contrast review** (`text4`/eyebrows, hero variance, ticker HUD, CTA/violet notes); added **Phase C** and baseline table; reordered execution; expanded tests. |
| 2026-04-22 | **Per-chat handoff:** added [`marketing-homepage-phases/`](./marketing-homepage-phases/) (`README` + `phase-a` … `phase-g`) with chat starters and handoff templates. |
| 2026-04-22 | **Implemented A–F in-repo:** meta/OG tags, reduced-motion + ticker a11y, contrast/hero scrim + eyebrow `text3`, nav + skip + chapter rail, demo focus trap + `openRequestDemo(el)` return-focus. See `marketingScrollChapterModel.ts`, `StoryChapterRail.tsx`, `usePrefersReducedMotion.ts`. |
| 2026-04-22 | **Phase G follow-up:** `marketingScrollChapterModel.test.ts` (Vitest), `e2e/marketingHome.spec.ts` (Playwright), demo `aria-describedby`, `data-testid` on provenance dot, A2 canonical URL note in `phase-a.md`. |
| 2026-04-22 | **`VITE_PUBLIC_SITE_URL`:** Vite `transformIndexHtml` injects `og:url`; README + `.env.example`. Playwright `chromium` installed; `marketingHome.spec.ts` passes. |
