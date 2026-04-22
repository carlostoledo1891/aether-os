# Vero Wave 1 — Public Verifier launch post

**Owner:** CTO
**Status:** draft (revised by CTO before publication)
**Reference bundle:** `c1a32f57bf64b88c845166007e16f12a3522589dcc4f90cad572f14ba8512d1a`
**Live URL:** <https://verochain.co/verify/c1a32f57bf64b88c845166007e16f12a3522589dcc4f90cad572f14ba8512d1a>

This file is the canonical source of the launch copy. Cross-published copies
(LinkedIn long-form, Hacker News submission, X/Twitter thread, partner
emails) MUST link back here so corrections propagate. Do not edit the
references at the bottom without bumping the date in the changelog.

---

## TL;DR (the 30-second pitch)

Today we're shipping the first piece of Vero you can prove without
trusting us: a **public, single-URL evidence bundle that your browser
verifies on its own**. Open the link, watch your tab recompute every
SHA-256 in the audit chain, and decide whether the chain is intact. We
never get to be the one who says "valid". The wire format and
verification algorithm are MIT-licensed in
[`docs/spec/`](https://github.com/carlostoledo1891/aether-os/tree/main/docs/spec).

> <https://verochain.co/verify/c1a32f57bf64b88c845166007e16f12a3522589dcc4f90cad572f14ba8512d1a>

---

## Why this URL exists

Vero is the operating system for critical-mineral supply chains: live
plant telemetry, environmental monitoring, drill assays, evidence
bundles, regulator-facing reports. Every state change is appended to a
SQLite-backed Git-style hash chain inside the workspace, so every claim
the platform makes is traceable to a specific row that nobody — not even
us — can edit without breaking the chain after it.

That property is only valuable if **outsiders can prove it**.

So we built the smallest thing that proves it: a content-addressed
evidence bundle, fetched anonymously, then re-walked by your browser
using `crypto.subtle`. No login, no account, no analytics nag. Either
the chain reproduces or it doesn't, and the verdict is rendered by your
machine, not ours.

If you've ever read a sustainability report from a mining major, this is
the structural complaint we are fixing. Reports today are PDFs whose
provenance is "trust the auditor who trusted the consultant who trusted
the data export." Vero replaces that chain of vouches with a hash chain
you can re-walk in your tab in 5 seconds.

---

## What you can do with the URL

1. **Click the link.** The page fetches the bundle, then walks the chain
   with a progress counter. Most sessions finish in under a second.
2. **Look at the verdict.** Green = every payload hash and chain link
   reproduced. Red = a specific sequence number is broken; the page
   tells you which one.
3. **Press "Re-verify in your tab"** to repeat the computation without
   re-fetching. Useful when you want to demonstrate that no network
   call is needed for the verdict itself.
4. **Press "Download bundle JSON"** to grab the raw bytes and run
   [`src/verify/clientVerifier.ts`](https://github.com/carlostoledo1891/aether-os/blob/main/src/verify/clientVerifier.ts)
   yourself in Node, in Deno, in a sandboxed worker, anywhere with
   `crypto.subtle`.
5. **Read the spec.** [`docs/spec/audit-event-v1.md`](https://github.com/carlostoledo1891/aether-os/blob/main/docs/spec/audit-event-v1.md)
   and [`docs/spec/bundle-v1.md`](https://github.com/carlostoledo1891/aether-os/blob/main/docs/spec/bundle-v1.md)
   define the canonical-JSON encoding and the chain construction. The
   reference verifier is ~120 lines of TypeScript with no Vero-specific
   imports; you can fork it.

---

## How the proof works (the 90-second technical version)

Every audit event in Vero carries:

- a deterministic `payload_hash` over the canonical JSON of its content
  fields, and
- a `chain_hash` over `prev_chain_hash || payload_hash`.

A bundle is a content-addressed package of:

- a snapshot of the unit subgraph the bundle vouches for,
- the audit-events slice covering that snapshot, and
- a `chainProof` that names the start/end sequence numbers and the
  `endHash` (the bundle's identity).

The verifier in your browser:

1. Validates the JSON shape against `bundle-v1.md`.
2. Re-canonicalises every event's payload, hashes it with SHA-256, and
   compares the result to the embedded `payload_hash`.
3. Walks the chain, recomputing each `chain_hash` from
   `prev_chain_hash || payload_hash`, and asserts the final value
   matches the `chainProof.endHash` from the URL.

If any byte in the snapshot or chain disagrees with the embedded
hashes, the page renders red and tells you which sequence number broke.

The server's only job is to serve bytes. It is never trusted to render
the verdict, and the public route refuses to serve mock-mode bundles
(403 `mock_mode_bundle_not_publishable`) so the verifier promise —
"this came from live operational data" — is a hard rule.

---

## What this is **not**

- **Not a one-off demo.** This is the same audit chain that backs every
  in-app evidence bundle, every regulator-facing report, and every
  state transition in the workspace. The public verifier is just the
  un-gated read of it.
- **Not a marketing surface.** There is no chrome layer, no CTA flood,
  no email capture. The page is one verdict card, one bundle metadata
  card, and one explainer card. If those three things don't earn the
  visitor's trust, more pixels won't.
- **Not a replacement for our SOC2-equivalent control mapping.** We
  still publish [SECURITY.md](https://github.com/carlostoledo1891/aether-os/blob/main/SECURITY.md)
  and the NIST 800-53 / CMMC mapping in [`/trust`](https://verochain.co/trust).
  The verifier is the cryptographic floor under those controls.
- **Not a proof of correctness of the underlying data.** Hash chains
  prove that a row hasn't been edited since publication. They do not
  prove the row was correct when written. That's what calibration,
  cross-checks, and field audits are for. We don't conflate the two.

---

## What we shipped to make it real

This is the punch-list the engineering team can point at:

- **Open spec.** `audit-event-v1.md`, `bundle-v1.md`, JSON Schemas, and
  a CHANGELOG, MIT-licensed.
- **Reference verifier.** `src/verify/clientVerifier.ts` — pure
  TypeScript, no Vero imports, runs in any `crypto.subtle` host.
- **Public route.** `/api/public/bundles/by-hash/:hash` and a
  redirecting `/api/public/bundles/:id` alias. No auth.
- **Live-mode-only guard.** Mock bundles return 403 with a named
  error code; live bundles wear a "Live data" badge in the verifier UI.
- **`crypto.subtle` fallback.** Browsers that lack the API get a
  dedicated card with the chain hash and a `curl` snippet, never a
  silent "trust the server" downgrade.
- **Drift gate.** `docs/REFERENCE_BUNDLE_HASH.txt` is the canonical
  reference hash; `server/src/__tests__/referenceBundle.test.ts` fails
  CI if the seeded bundle ever changes shape without a deliberate
  update to the README, this post, and the changelog.
- **Anonymous timing telemetry.** `POST /api/public/verifier-telemetry`
  records (chain hash, duration, outcome, browser bucket); `/admin/verifier-stats`
  surfaces p50/p95 and a per-outcome histogram. No IPs or fingerprints
  stored — `bundle_published` already handles unique-session counting
  on the audit chain.
- **Mobile Safari runbook.** A real iPhone procedure
  ([`docs/launch/mobile-safari-smoke.md`](./mobile-safari-smoke.md))
  is in the deployment checklist; we run it before every public link
  goes out.

---

## What we measure

The Wave-1 north-star is **"external verifications per published
bundle"**. Every public fetch appends a `bundle_published` audit row
(deduped per (bundle, source-IP) within a 1h window so refresh storms
don't inflate the metric). The /admin widget reads it directly off the
audit chain — the conversion metric is itself provable.

We will publish a brief monthly summary of:

- bundles published,
- distinct external verifications,
- p50/p95 of the in-tab verify duration, and
- the share of sessions on each browser bucket.

If verifications-per-published-bundle stays under 2x for the first 90
days, we re-open the question of whether the URL needs more affordances
on the page (one CTA back to the workspace, a side-by-side "what
changed" view of the snapshot, etc.). That decision is in the next
roundtable, not in this post.

---

## How to push back on this

We're shipping this so people can attack it. The honest list of
attacks we know about:

- **The reference bundle is seeded by us.** True. The drift gate forces
  any change to its shape into a deliberate, reviewed PR; the seed
  events are deterministic; the hash is reproducible from a fresh
  clone. If you don't trust seed data, generate your own bundle in the
  workspace and verify that one — every bundle uses the same chain.
- **The public route is rate-limited only by Cloudflare defaults.**
  True; we'll dial that down if the metric shows abuse. The route is
  read-only and content-addressed, so cache pressure is mostly a
  bandwidth question, not a correctness one.
- **`crypto.subtle` is not equally fast on all browsers.** True; the
  p50/p95 split exists exactly so we notice when one bucket regresses.
  iOS Safari is on the deployment-parity checklist for this reason.
- **A green verdict does not mean the data is correct, only that it
  hasn't been edited since publication.** True; this is the explicit
  scope of a hash chain and is called out on the page itself.
- **Forking the spec is the point, but you still control the
  implementation.** Also true. If a partner ships their own verifier
  in Rust, Go, or in-database (e.g. a Snowflake UDF), we link to it
  from the spec README and treat it as a first-class implementation.

---

## Cross-publish targets (CTO checklist)

- [ ] Update <https://verochain.co/trust> to point its primary "Verify
      a bundle" link at the reference URL. (Day-5 task in the sprint
      plan.)
- [ ] LinkedIn long-form post: this file, lightly edited for tone,
      with the verifier URL as the only external CTA.
- [ ] Hacker News "Show HN" with the verifier URL in the title and a
      one-paragraph context lifted from the TL;DR.
- [ ] X/Twitter thread (≤ 6 tweets) — first tweet is the verifier URL
      and a single screenshot of the verdict card.
- [ ] Direct emails to the three named pilot prospects (Meteoric,
      LaPOC, regulator contact) with the verifier URL and the spec
      URLs. No deck attachment in this batch — the URL is the deck.
- [ ] Drop the URL into the partner-update Slack channel after the
      LinkedIn post is live (so partners see the announcement in the
      channel they already watch).

---

## Internal acceptance for the launch post

The post is publishable when **all** of these are true:

- `docs/REFERENCE_BUNDLE_HASH.txt` matches the URL above.
- `npm run verify:release` is green on the SHA we're pointing at.
- The mobile-Safari smoke ([`mobile-safari-smoke.md`](./mobile-safari-smoke.md))
  has a fresh **Pass** row in the AGENT.md checklist.
- The 90-second screen recording (Day 4 second deliverable) has been
  captured per [`screen-recording-runbook.md`](./screen-recording-runbook.md)
  and either committed as `docs/launch/wave-1-verifier.mp4` or its
  hosted-mirror URL is recorded in the runbook's "Hosted mirror" table
  AND in the "Cross-publish targets" block above.
- A second engineer or the CTO has clicked the URL on a phone they
  did not build the platform on.

If any of those are red, the post stays in draft.
