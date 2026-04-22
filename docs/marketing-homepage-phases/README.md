# Marketing homepage — one phase per chat

Parent plan: [`../marketing-homepage-action-plan.md`](../marketing-homepage-action-plan.md)

## Rules

1. **Default workflow:** one Cursor chat per letter phase (A → F) for easier review. **Phases A–F are already implemented** in one agent pass (2026-04-22); keep these files as the spec for follow-ups or reruns.
2. **Start each chat** (when splitting work) by pasting the **“Chat starter”** block from the phase file (or `@` that file).
3. **End each chat** by copying the **“Handoff”** block, filled in, into the **next** chat (plus `@` the next phase file).
4. Do not mix phases in one chat unless you are only adding **Phase G** smoke. After any change, run **Phase G** from [`phase-g.md`](./phase-g.md) before merging.

## Order

| Chat # | Phase file | Goal IDs |
|--------|------------|----------|
| 1 | [phase-a.md](./phase-a.md) | G6 |
| 2 | [phase-b.md](./phase-b.md) | G4, G5 (partial) |
| 3 | [phase-c.md](./phase-c.md) | G3 |
| 4 | [phase-d.md](./phase-d.md) | G2 |
| 5 | [phase-e.md](./phase-e.md) | G1 |
| 6 | [phase-f.md](./phase-f.md) | G5 |
| — | [phase-g.md](./phase-g.md) | Regression (every PR) |

Skip letters only if you explicitly descope (document why in your PR).

## Branching

Use your experiment branch (e.g. `bayatto`) or short-lived `feat/marketing-home-<phase>` branches; merge in plan order to avoid conflicts (C and E both touch `ScrollyExperience` / layout — sequence matters).
