# Vero Open Specs — Changelog

All notable changes to the open, MIT-licensed Vero wire formats are recorded
here. Entries follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and [Semantic Versioning](https://semver.org/).

Spec governance lives in [`README.md`](./README.md) under "Maintainers".

## v1.0.0 — 2026-04-18

Initial public release. MIT-licensed under the carve-out documented in
[`README.md`](./README.md).

### Added

- [`audit-event-v1.md`](./audit-event-v1.md) — canonical-JSON encoding,
  `payload_hash` derivation, `chain_hash` construction, GENESIS_HASH
  (`'0'.repeat(64)`), and the verification algorithm.
- [`bundle-v1.md`](./bundle-v1.md) — evidence bundle envelope, canonical
  addressing by `chain_hash`, and the segment-verification rules.
- [`schemas/audit-event.json`](./schemas/audit-event.json) — JSON Schema
  2020-12 for the audit event row.
- [`schemas/bundle.json`](./schemas/bundle.json) — JSON Schema 2020-12 for
  the evidence bundle envelope.

### Reference implementations

- Server canonical-JSON encoder — `shared/audit/canonicalJson.ts` (MIT).
- Shared types — `shared/audit/types.ts` (MIT).
- Browser verifier — `src/verify/clientVerifier.ts` (MIT).

### Notes

- The reference bundle hash committed at this version is recorded in
  `docs/REFERENCE_BUNDLE_HASH.txt`; the value is regenerated on first boot
  of a fresh DB and gated against drift by
  `server/src/__tests__/referenceBundle.test.ts`.
- This release ships alongside the Wave 1 public verifier launch
  (`docs/launch/wave-1-public-verifier.md`).
