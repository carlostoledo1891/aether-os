# Phase D — Navigation & skip link (G2)

**Prerequisite:** Phase C complete recommended (nav layout may interact with hero padding — coordinate if parallelizing).

---

## Chat starter (paste into a new chat)

```
Implement Phase D of the marketing homepage plan only.

Paste handoff from Phase C below (if any):
<paste handoff block here>

Context:
@docs/marketing-homepage-action-plan.md
@docs/marketing-homepage-phases/phase-d.md

Scope:
- MarketingNav: Trust → /trust, Product or App → /app (confirm path with codebase); W tokens; ≥44px tap targets on mobile.
- MarketingShell (or small component): skip link to main scroll content, visible on focus.

Do not implement Phase E–F in this chat.

When done: fill Handoff for Phase E.
```

---

## Tasks

| ID | Files | Deliverable |
|----|-------|-------------|
| D1 | `MarketingNav.tsx` | Links + mobile hit areas + no overlap with ProvenanceChip / AuditTicker |
| D2 | `MarketingShell.tsx` (+ `id` on scroll container if needed) | Skip to content |

---

## Definition of done

- [ ] All links work on dark theme routes.
- [ ] First Tab shows skip link; Enter moves focus into story region.
- [ ] iPhone width: no overlap with fixed HUDs.
- [ ] Phase G: lint, test:run, build.

---

## Handoff → Phase E

```markdown
## Handoff from Phase D (Nav + skip)

- Branch: `<branch-name>`
- PR / commit: `<link or sha>`
- Link labels shipped: `<Trust | Product | …>`
- Notes: `<layout tweaks>`

Next: implement **Phase E** only (story orientation / chapter UI).
@docs/marketing-homepage-phases/phase-e.md
```
