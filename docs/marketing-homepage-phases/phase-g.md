# Phase G — Regression gates (run every PR)

Not a separate “feature” chat by default — run **at the end of each phase chat** (minimum: lint + test + build) and **once fully** before merging the combined marketing work.

---

## Commands (repo root)

```bash
npm run lint
npm run test:run
npm run build
```

If you touched server/engine (not expected for A–F): also `cd server && npm test` and `cd engine && npm test` per CI.

---

## Manual smoke (`/`)

- [ ] Load `/` — globe + scroll story runs.
- [ ] Request demo opens/closes.
- [ ] Ticker rows clickable (if Phase B+).
- [ ] Nav links (if Phase D+).
- [ ] Reduced motion on/off (if Phase B+).

**Mobile:** one pass on narrow viewport after Phase D/E.

---

## Playwright (`e2e/marketingHome.spec.ts`)

Run locally (starts `dev:all` via `playwright.config` when `PLAYWRIGHT_BASE_URL` is unset). One-time browser install if needed: `npx playwright install chromium`.

```bash
npx playwright test e2e/marketingHome.spec.ts
```

Covers: meta / OG tags, skip link + scroll target, chapter rail count, reduced-motion provenance dot.

Record in PR when extending.
