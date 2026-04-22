# Phase A — Meta & distribution (G6)

**Prerequisite:** None (first chat).

---

## Chat starter (paste into a new chat)

```
Implement Phase A of the marketing homepage plan only.

Context:
@docs/marketing-homepage-action-plan.md
@docs/marketing-homepage-phases/phase-a.md

Scope: index.html — meta description, Open Graph, Twitter card tags.
Do not implement Phase B–F in this chat.

When done: fill the Handoff block in phase-a.md and give me the filled copy for the next chat.
```

---

## Tasks

| ID | Deliverable |
|----|-------------|
| A1 | `meta name="description"` |
| A1 | `og:title`, `og:description`, `og:url`, `og:type` |
| A1 | `twitter:card`, `twitter:title`, `twitter:description` |
| A2 | **`VITE_PUBLIC_SITE_URL`** — `vite.config.ts` replaces `__VITE_PUBLIC_SITE_URL__` in `index.html` at dev + build. Unset → `https://verochain.co/`. Set in Vercel / `.env.production` for preview canonicals (e.g. `https://my-app.vercel.app`). See `.env.example`. |

**Primary file:** `index.html`

---

## Definition of done

- [ ] View page source locally: all tags present with sensible copy.
- [ ] Staging/production URL: share preview shows title + description (OpenGraph debugger).
- [ ] `npm run lint && npm run test:run && npm run build` (Phase G subset).

---

## Handoff → Phase B (copy and fill for next chat)

```markdown
## Handoff from Phase A (Meta)

- Branch: `<branch-name>`
- PR / commit: `<link or sha>`
- `og:url` strategy: `<static | env | TBD>`
- Notes: `<anything the Phase B agent should know>`

Next: implement **Phase B** only.
@docs/marketing-homepage-phases/phase-b.md
```
