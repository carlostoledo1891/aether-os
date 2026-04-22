# Vero Evidence Bundle — v1

**Status:** Stable, Wave 1.
**License:** MIT (this spec, plus `shared/audit/canonicalJson.ts` and
`src/verify/clientVerifier.ts`).

A bundle is a self-contained, content-addressed evidence package that anyone
can verify offline using the [audit event v1 spec](./audit-event-v1.md).

---

## Bundle envelope

```jsonc
{
  "id": "BDL-1734720000-3a7c1f88",
  "rootUnitId": "SITE-CALDEIRA",
  "claim": "Caldeira Project board pack: …",
  "createdAt": "2026-04-18T14:32:11.000Z",
  "verificationStatus": "pending",       // server's last verdict; do not trust
  "verifiedAt": null,
  "narrative": "Plain-text human summary…",
  "snapshot": { /* opaque domain snapshot */ },
  "chainProof": {
    "startSequence": 100,
    "endSequence":   142,
    "eventCount":    7,                    // events tied to the bundle's units
    "startHash":     "<sha256 hex>",
    "endHash":       "<sha256 hex>",       // ← canonical address
    "valid":         true
  },
  "events": [ /* full audit_events rows, sequence 100..142 inclusive */ ]
}
```

---

## Canonical address

A bundle's **canonical address** is its `chainProof.endHash` — the
`chain_hash` of the most recent audit event the bundle vouches for. That is
the URL Vero exposes:

```
verochain.co/verify/<chain_hash>
```

The bundle's UUID `id` is also accepted as a transparent alias and 302-redirects
to the canonical hash URL. UUIDs may collide across deployments; the chain
hash is content-addressed and globally unique.

---

## Visibility

All bundles are publicly readable by their canonical address. Wave 1
explicitly chose this model — see the alignment doc and
[`.cursor/plans/wave_1_public_verifier_3da0c0e1.plan.md`](../../.cursor/plans/wave_1_public_verifier_3da0c0e1.plan.md).

If a future deployment needs private bundles, it must add an explicit
`visibility` field to the envelope (forward-compatible: missing means
public).

---

## Embedded events

`events` is a **continuous segment** of the audit chain spanning
`chainProof.startSequence` through `chainProof.endSequence` inclusive — not
just the events tied to the bundle's units. The continuous segment is what
the verifier needs to reproduce every chain link end-to-end.

Therefore: `events.length === endSequence - startSequence + 1` and
`events.length >= chainProof.eventCount`.

---

## Verification algorithm

```pseudo
function verify_bundle(bundle, expected_first_prev_hash):
    return verify_chain(bundle.events, expected_first_prev_hash)
```

Where `verify_chain` is from [`audit-event-v1.md`](./audit-event-v1.md).

For a bundle whose first embedded event has `sequence == 1`, pass
`GENESIS_HASH`. Otherwise, pass `bundle.events[0].prev_hash` — which the
verifier can validate independently if it has access to a prior bundle that
contains the previous segment.

The bundle is **valid** iff:

1. `verify_chain(bundle.events)` returns `{ valid: true }`.
2. `bundle.events[0].chain_hash === bundle.chainProof.startHash`.
3. `bundle.events[bundle.events.length - 1].chain_hash === bundle.chainProof.endHash`.
4. `bundle.events.length === bundle.chainProof.endSequence - bundle.chainProof.startSequence + 1`.

The reference Vero verifier checks all four. The `verificationStatus` field
in the envelope is the server's prior verdict; **never** treat it as proof.

---

## Snapshot

`snapshot` is opaque. Vero's current snapshot includes:

```jsonc
{
  "units":     { "<unitId>": { /* unit fields */ }, … },
  "edges":     [ { /* graph edges */ } ],
  "evidence":  [ { /* attached evidence refs */ } ],
  "generatedAt": "<ISO-8601 UTC>"
}
```

The snapshot is **not** part of the chain proof. It documents the state the
bundle vouches for, but the cryptographic guarantee is over the audit
events. A future spec version will optionally hash-bind the snapshot.

---

## JSON Schema

A formal JSON Schema for the envelope lives at
[`schemas/bundle.json`](./schemas/bundle.json).

---

## Stability promise

Same as the audit-event spec — additive changes are safe; breaking changes
ship as `bundle-v2.md` with a deprecation banner here.
