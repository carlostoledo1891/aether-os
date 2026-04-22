# Phase F — Demo modal a11y (G5)

**Prerequisite:** Phase E complete or not required for your release; modal work is independent but should be last to avoid churn in `RequestDemo.tsx` while earlier phases merge.

---

## Chat starter (paste into a new chat)

```
Implement Phase F of the marketing homepage plan only.

Paste handoff from Phase E below (if any):
<paste handoff block here>

Context:
@docs/marketing-homepage-action-plan.md
@docs/marketing-homepage-phases/phase-f.md

Scope:
- RequestDemo overlay: focus trap when open; restore focus to invoking control on close.
- Optional F3: aria-describedby if helper copy added.

Do not start new feature phases; this closes the marketing homepage a11y track.

When done: fill Handoff below and run full Phase G before merge.
```

---

## Tasks

| ID | File | Deliverable |
|----|------|-------------|
| F1 | `RequestDemo.tsx` | Focus trap while `isOpen` |
| F2 | Same | `returnFocus` to opener on close |
| F3 | Optional | `aria-describedby` |

---

## Definition of done

- [ ] Keyboard-only: open → tab through all fields → submit or cancel → focus returns.
- [ ] Esc still closes; no focus escape to globe/map behind.
- [ ] Phase G full: lint, test:run, build; optional axe on `/`.

---

## Handoff → merge / release

```markdown
## Handoff from Phase F (Demo modal)

- Branch: `<branch-name>`
- PR / commit: `<link or sha>`
- Focus library used?: `none | focus-trap-react | custom`
- Notes: `<edge cases>`

Marketing homepage phases A–F complete. Run Phase G checklist before merge.
@docs/marketing-homepage-phases/phase-g.md
```
