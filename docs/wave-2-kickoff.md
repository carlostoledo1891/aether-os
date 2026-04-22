# Wave 2 — Kickoff Brief (Vero edition)

**Owner:** CTO
**Audience:** next roundtable (Geologist, AI developer, Business
strategist, Scientist, Field-ops manager, Tech advisor)
**Status:** draft for discussion. Replaces no prior commitment until
the roundtable accepts it.
**Companion plans:** [`wave_1_final_sprint_c23e42d0.plan.md`](../.cursor/plans/wave_1_final_sprint_c23e42d0.plan.md),
[`wave_1_public_verifier_3da0c0e1.plan.md`](../.cursor/plans/wave_1_public_verifier_3da0c0e1.plan.md),
[`docs/launch/wave-1-public-verifier.md`](./launch/wave-1-public-verifier.md).

---

## 1. Where Wave 1 left us (the substrate-claim, restated)

Wave 1 shipped a single URL — the public verifier at
`/verify/<reference-hash>` — that lets a stranger recompute every hash
in a Vero evidence bundle inside their own tab. The bundle is
content-addressed, the spec is MIT-licensed, the algorithm is ~120
lines of TypeScript, and the conversion metric (verifications per
published bundle) is itself appended to the audit chain. The mobile
Safari smoke runbook, the `crypto.subtle` fallback, the live-mode-only
guard, and the reference-hash drift gate are all in place.

That URL is the floor of every claim Vero makes from now on. Every
later wave has to *raise the ceiling* without lowering the floor.

## 2. Wave 2 thesis (one sentence to test against)

> *Forking a Vero evidence bundle into your own analysis is one click
> away from verifying it.*

Wave 1 made tampering visible. Wave 2 makes **counter-claims**
visible. The visceral demo is: open the verifier URL, click "Fork
this bundle", land in a sandboxed Vero workspace where the same
audit chain is yours to extend — same units, same snapshot, your
new transitions. When you publish the fork, you get a new hash that
references the parent. A buyer, a regulator, or a journalist can now
prove not just "this came from Vero" but "this is what *I* did with
it on top of what Vero published."

If Wave 1 was the Git-style hash chain, Wave 2 is the Git-style
**branch**.

## 3. What we ship (one URL again)

A new public route: **`/fork/<chain-hash>`**.

1. Resolves the parent bundle exactly the way `/verify/<hash>` does
   (canonical hash → bundle JSON → in-tab verify), then promotes the
   parent into a per-session sandbox workspace pinned to the parent's
   snapshot.
2. The sandbox workspace renders a stripped-down Vero canvas: the
   same `UnitInspector`, `TransitionDialog`, and `BundleExporter`
   primitives from the main app, but with three forced policies:
   - **Append-only** — no edits to the parent's audit segment.
   - **Anonymous** — no account required; the session is keyed on a
     URL-bearer token kept in `sessionStorage`.
   - **Provenance-clamped** — every new audit row carries
     `forked_from = <parent chain_hash>` and `fork_session_id` so
     the fork's own bundle is content-addressed by the *delta*, not
     the whole world.
3. Publishing the fork mints a new bundle whose `chainProof.endHash`
   is shareable as `/verify/<new-hash>`. Verifying it shows the
   parent hash + the delta inline ("forked from … on … by anonymous
   session …").

The fork is the conversion event. Views are vanity; **forks per
verification** is the metric.

## 4. New primitives Wave 2 must author

Each one has to pay rent in at least two future demos. If it doesn't
generalise, we either redesign or we don't ship it.

| Primitive | Substrate role | Reused in |
|-----------|----------------|-----------|
| `forkSession` (server) | Session-scoped overlay over the unit graph; copy-on-write semantics on units, edges, audit chain. | Wave 2 sandbox; future "what-if" mode for buyers; future regulator review surface. |
| `BundlePromoteOverlay` (client) | "Open this bundle as a workspace" UX, fronted by the verifier card. | Wave 2 fork CTA; future "open this report" CTA inside the main app. |
| `provenanceClampedAudit` (server) | `appendAuditEvent` variant that stamps `forked_from` + session id and refuses cross-session writes. | Wave 2; future multi-tenant pilot work; future regulator scratchpad. |
| `bundleDelta` (shared) | Canonical-JSON encoding of "what this bundle adds on top of its parent". Hashed the same way as bundle root, so deltas are content-addressed. | Wave 2 publish; future diff view in the main app; future Wave 3 re-pull from a partner lab. |
| `ForkVerdictCard` (client) | Three-line summary card: parent hash, delta event count, fork-session id. Drops into the existing verifier page when `verify-page` resolves a forked bundle. | Wave 2 verifier; future "show me the chain of custody" widget on regulator-facing reports. |

That's five new primitives. The discipline rule still holds: anything
that wouldn't be reused twice gets cut.

## 5. Conversion metric and the dashboard widget

- **North star:** `forks per verification` over the last 30 days.
- **Numerator:** count of `bundle_published` rows where the parent
  bundle has `forked_from = NULL` (i.e., a fork was created from
  the verified bundle within the same session-bucket window).
- **Denominator:** count of `bundle_published` rows from the public
  verifier route (the same metric Wave 1 already records).
- **Surface:** add a `forksPerVerification` block to the existing
  `/admin/verifier-stats` page, alongside the p50/p95 timing
  histogram from Wave-1 sprint § 3.2. Not a new admin page.

We expect the metric to be tiny at launch (single digits per week);
the point of putting it on the dashboard is so any improvement is
visible the same week it happens.

## 6. Kill criterion (what would make us pivot)

Set in advance, not after the fact:

> If after **8 weeks** (i.e., 56 days from the day `/fork/` ships)
> we have fewer than **2 forks per 100 verifications**, we stop
> investing in the fork loop and re-open the question of whether
> Wave 2 should instead be the **Vero-edition skeleton mirror** —
> a webcam-driven full-body avatar wired into the main app's
> `Field Ops` lens for ergonomics + posture audit during plant
> walk-arounds. (Same five-primitive budget; same sandboxed URL
> semantics; different domain.)

The decision happens at the month-2 roundtable on schedule, with
data, not vibes.

## 7. The first 30 days (concrete punch-list)

| Week | Deliverable | Owner | Decision gate |
|------|-------------|-------|---------------|
| 1 | `forkSession` + `provenanceClampedAudit` server-side; in-memory only; round-trip test passes. | Engineer | Audit chain round-trips end-to-end after a fork session is opened, mutated, and published. |
| 2 | `/fork/:hash` route with `BundlePromoteOverlay` + sandboxed workspace shell. Anonymous bearer token. | Engineer | A test user can verify a Wave-1 bundle, click Fork, append one transition, and see the new state on screen. |
| 3 | `bundleDelta` + publish flow. New hash mints. New `/verify/<delta-hash>` URL works and shows `ForkVerdictCard`. | Engineer + CTO review | A second tab opening the new URL re-verifies the delta and shows the parent hash. End-to-end loop is alive. |
| 4 | Telemetry, drift gate for the *fork* reference bundle, launch post draft, mobile Safari runbook update for the fork flow. | Engineer + CTO + Samuel | Same release-readiness checklist as Wave 1 (reference hash committed, drift test passing, mobile Safari smoke recorded, `npm run verify:release` green). |

By day 30, `/fork/<hash>` is live behind a "preview" badge and the
month-2 roundtable has a real metric to point at.

## 8. Decisions the roundtable owes Wave 2

- **Sandbox lifetime.** Default 7 days; longer requires an account.
  Confirm we're comfortable with anonymous-only fork sessions for
  the first 8 weeks.
- **What's frozen vs. forkable.** Today the proposal freezes the
  parent's audit segment and lets the fork extend the chain *only*
  with new transitions. No edits to the parent. Confirm this is the
  right discipline (it matches the Wave-1 chain semantics).
- **Account boundary trigger.** Today: publish fork → still
  anonymous. Tomorrow: publish fork to *the parent organisation* →
  must be an account. Confirm the trigger is "cross-tenant publish",
  not "publish at all".
- **Wave-1 verifier UX impact.** The fork CTA needs space inside
  the existing `VerdictCard`. Confirm we are willing to add one
  primary button there, or whether the CTA lives only on the
  Wave-2 hero page.
- **Series A narrative position.** Where in the deck does the fork
  loop sit? Probably between the verifier (which proves we don't
  trust ourselves) and the AI co-pilot story (which proves the
  graph is a substrate, not a UI).

Anything not decided by the roundtable becomes the engineer's
decision per the existing decision-rights rule.

## 9. What this brief is *not*

- Not a new strategy. The substrate thesis from the alignment doc is
  unchanged: the goal is forking as the conversion event.
- Not a new framework. We are reusing the existing Vero stack
  (Fastify + SQLite + audit chain + canonical JSON + the same React
  app shell) end-to-end. No new render surface, no new theme, no
  new build pipeline.
- Not a license to start coding before the roundtable. Wave 1 is
  not yet at the kill-or-scale checkpoint; Wave 2 starts only when
  Wave 1's metric has at least four weekly data points.
