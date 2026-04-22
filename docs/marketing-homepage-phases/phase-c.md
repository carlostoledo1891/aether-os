# Phase C — Contrast & hero legibility (G3)

**Prerequisite:** Phase B complete recommended (B4 focus ring complements C3 header; order can swap B/C only if you resolve merge conflicts carefully).

---

## Chat starter (paste into a new chat)

```
Implement Phase C of the marketing homepage plan only.

Paste handoff from Phase B below (if any):
<paste handoff block here>

Context:
@docs/marketing-homepage-action-plan.md
@docs/marketing-homepage-phases/phase-c.md

Scope:
- ScrollyExperience: eyebrow color ≥4.5:1 on intended surface (text3 or marketing-specific token on marketing only).
- Thesis hero: gradient and/or frosted column behind copy; map visible at edges.
- AuditTicker header row: align meta text with C1 treatment.
- Optional C4: MarketingGlobe scrim bump only during thesis window — only if C2 insufficient.

Do not implement Phase D–F in this chat.

When done: fill Handoff for Phase D.
```

---

## Tasks

| ID | Primary files | Deliverable |
|----|----------------|-------------|
| C1 | `ScrollyExperience.tsx` | Eyebrow AA on dark / glass |
| C2 | `ScrollyExperience.tsx` | Thesis readability treatment |
| C3 | `AuditTicker.tsx` | Header label contrast aligned with C1 |
| C4 | `MarketingGlobe.tsx` + scroll hook if needed | Optional dynamic scrim |

**Contrast baseline:** see parent plan “Contrast baseline” table.

---

## Definition of done

- [ ] Screenshots: thesis readable with/without MapTiler key (worst frames attached to PR).
- [ ] Document eyebrow token choice + ratio target in PR description.
- [ ] Phase G: lint, test:run, build.

---

## Handoff → Phase D

```markdown
## Handoff from Phase C (Contrast + hero)

- Branch: `<branch-name>`
- PR / commit: `<link or sha>`
- Screenshots: `<link or folder>`
- C4 used?: `yes | no`
- Notes: `<e.g. new CSS var name>`

Next: implement **Phase D** only (nav + skip link).
@docs/marketing-homepage-phases/phase-d.md
```
