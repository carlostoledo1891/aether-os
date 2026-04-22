# Vero Open Specs

This directory contains the **open, MIT-licensed** wire formats that Vero
exposes for independent verification. The rest of the Vero codebase is
proprietary; these specs are open so anyone can write a third-party verifier
that does not need to trust Vero.

## Specs

- [`audit-event-v1.md`](./audit-event-v1.md) — canonical-JSON encoding,
  payload-hash derivation, chain-hash construction, and the verification
  algorithm.
- [`bundle-v1.md`](./bundle-v1.md) — evidence bundle envelope, canonical
  addressing by `chain_hash`, and the segment-verification rules.

## JSON Schemas

- [`schemas/audit-event.json`](./schemas/audit-event.json)
- [`schemas/bundle.json`](./schemas/bundle.json)

Both schemas target JSON Schema 2020-12 and are usable with Ajv, Cerberus,
and other compliant validators.

## Reference implementations

| Surface | File | License |
|---------|------|---------|
| Server canonical-JSON encoder | [`shared/audit/canonicalJson.ts`](../../shared/audit/canonicalJson.ts) | MIT |
| Shared types | [`shared/audit/types.ts`](../../shared/audit/types.ts) | MIT |
| Server append/verify | [`server/src/store/auditChain.ts`](../../server/src/store/auditChain.ts) | Proprietary (binds to Vero's SQLite store) |
| Browser verifier | [`src/verify/clientVerifier.ts`](../../src/verify/clientVerifier.ts) | MIT |

The MIT-licensed files above are explicitly carved out of the proprietary
license that covers the rest of `aether-os`. You may copy them into a third
party project, including a fork that competes with Vero, with attribution.

## Live verifier

`https://verochain.co/verify/<chain_hash>` is the public verifier. It uses
`crypto.subtle` in your browser to recompute every hash. The server is never
the one that says "valid" — the entire point of the design.

A reference bundle is generated on every fresh boot; its hash is logged at
startup so you can share a working URL for your own deployment. The same
hash is also committed to [`docs/REFERENCE_BUNDLE_HASH.txt`](../REFERENCE_BUNDLE_HASH.txt)
and gated by `server/src/__tests__/referenceBundle.test.ts` so silent drift
between the seeded bundle and the published anchor breaks CI.

## Maintainers

- `audit-event-v1`, `bundle-v1`, JSON Schemas: **CTO** (single owner). Domain
  pack schemas (chemistry, astrophysics, mining) get sub-owners when those
  waves start. See `.cursor/plans/wave_1_final_sprint_c23e42d0.plan.md` § 2.1
  for the governance decision.
- Backwards-incompatible changes require a major version bump and a new spec
  file (`audit-event-v2.md`), never an in-place edit. The `v1` documents are
  immutable once tagged.

## Versioning

We follow semantic versioning at the spec level:

- **Major** (`v2`, `v3`, …): wire-format breaking changes. New file, new
  schema, deployed alongside `v1` until consumers migrate.
- **Minor** (`v1.1`, `v1.2`, …): backwards-compatible additions to the spec
  prose or schemas (new optional fields, clarifications). Tracked in
  [`CHANGELOG.md`](./CHANGELOG.md).
- **Patch** (`v1.0.1`, …): editorial fixes only. Same in `CHANGELOG.md`.
