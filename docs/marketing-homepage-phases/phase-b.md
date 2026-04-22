# Phase B — Motion & micro-a11y (G4 + partial G5)

**Prerequisite:** Phase A complete (or explicitly skipped — note in handoff).

---

## Chat starter (paste into a new chat)

```
Implement Phase B of the marketing homepage plan only.

Paste handoff from Phase A below (if any):
<paste handoff block here>

Context:
@docs/marketing-homepage-action-plan.md
@docs/marketing-homepage-phases/phase-b.md

Scope:
- ProvenanceChip: respect prefers-reduced-motion (no pulse / static dot).
- AuditTicker: rowIn animation off when reduced motion; aria-label on each chain row button; focus-visible ring using theme tokens.

Do not implement Phase C–F in this chat.

When done: fill the Handoff block in phase-b.md for Phase C.
```

---

## Tasks

| ID | File | Deliverable |
|----|------|-------------|
| B1 | `src/components/marketing/globe/ProvenanceChip.tsx` | Reduced motion: no infinite pulse |
| B2 | `src/components/marketing/globe/AuditTicker.tsx` | Reduced motion: no rowIn translate |
| B3 | `AuditTicker.tsx` | `aria-label` per row (action + kind + block) |
| B4 | `AuditTicker.tsx` | `:focus-visible` outline (W violet/cyan) |

---

## Definition of done

- [ ] macOS “Reduce motion” ON: chip static; new rows appear without slide-in.
- [ ] Tab: ticker rows show visible focus ring; SR announces row purpose.
- [ ] Phase G subset: lint, test:run, build.

---

## Handoff → Phase C

```markdown
## Handoff from Phase B (Motion + ticker a11y)

- Branch: `<branch-name>`
- PR / commit: `<link or sha>`
- Notes: `<e.g. new token helper for prefers-reduced-motion>`

Next: implement **Phase C** only (contrast + hero).
@docs/marketing-homepage-phases/phase-c.md
```
