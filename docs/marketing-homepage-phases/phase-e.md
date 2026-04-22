# Phase E — Story orientation (G1)

**Prerequisite:** Phase D complete recommended (nav height / z-index affects where progress UI lives).

---

## Chat starter (paste into a new chat)

```
Implement Phase E of the marketing homepage plan only.

Paste handoff from Phase D below (if any):
<paste handoff block here>

Context:
@docs/marketing-homepage-action-plan.md
@docs/marketing-homepage-phases/phase-e.md

Scope:
- Chapter dots or strip driven by existing scroll progress (globeBus / subscribeToProgress). Do NOT add a second scroll listener that fights useScrollDriver.
- Optional E2: click dot → scrollTo beat; respect prefers-reduced-motion for smooth behavior.

Do not implement Phase F in this chat.

When done: fill Handoff for Phase F.
```

---

## Tasks

| ID | Deliverable |
|----|-------------|
| E1 | Progress UI reflects `t` 0..1; matches beat chapters |
| E2 | Optional: click navigates scroll; reduced-motion uses `auto` |

**Primary integration:** `globeBus.ts`, `ScrollyExperience.tsx` or sibling component mounted in `MarketingShell` / `LandingPage` chain.

---

## Definition of done

- [ ] Slow scroll: indicator never fights camera (single progress source).
- [ ] If E2: each dot lands near intended beat (document tolerance).
- [ ] Phase G: lint, test:run, build; manual scroll once on mobile.

---

## Handoff → Phase F

```markdown
## Handoff from Phase E (Story orientation)

- Branch: `<branch-name>`
- PR / commit: `<link or sha>`
- E2 shipped?: `yes | no`
- Component name / path: `<path>`
- Notes: `<e.g. beat ranges duplicated — consider centralizing>`

Next: implement **Phase F** only (demo modal focus trap).
@docs/marketing-homepage-phases/phase-f.md
```
