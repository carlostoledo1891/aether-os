# Vero Audit Event — v1

**Status:** Stable, Wave 1.
**License:** MIT (this spec, plus `shared/audit/canonicalJson.ts` and
`src/verify/clientVerifier.ts`). The rest of the Vero codebase is proprietary;
this format is open so anyone can write a third-party verifier.

---

## What this is

Vero appends every state change in the workspace (unit transitions, evidence
attachments, bundle generations, regulatory submissions, public-verifier
fetches…) to a tamper-evident, hash-chained log. This document is the wire
contract for that log.

If you implement this spec faithfully, you can:

- Verify any Vero-issued evidence bundle independently of Vero.
- Detect any tampering with audit events at the byte level.
- Build a third-party verifier (e.g. for a regulator's intranet) that
  Vero cannot lie to.

The reference implementations are:

- Server: [`server/src/store/auditChain.ts`](../../server/src/store/auditChain.ts)
- Browser: [`src/verify/clientVerifier.ts`](../../src/verify/clientVerifier.ts)
- Shared canonical-JSON encoder: [`shared/audit/canonicalJson.ts`](../../shared/audit/canonicalJson.ts)

---

## Event payload

An audit event has the following fields. Keys marked **required** must be
present; `relatedEntityId` is the only optional field.

| Field             | Type   | Required | Notes |
|-------------------|--------|----------|-------|
| `event_id`        | string | yes      | Globally unique within a Vero deployment. |
| `timestamp`       | string | yes      | ISO 8601, UTC. |
| `type`            | string | yes      | Event-type enum (see [`shared/audit/types.ts`](../../shared/audit/types.ts)). |
| `actor`           | string | yes      | Human or system identifier. |
| `action`          | string | yes      | Short human-readable summary. |
| `detail`          | string | yes      | Long-form context. |
| `relatedEntityId` | string | no       | Entity (unit/bundle/batch) the event refers to. |

---

## Canonical JSON

The `payload_hash` is `sha256(canonical_json(event))`, where the canonical
JSON has these invariants:

1. **Fixed alphabetical key order**, regardless of input order:
   `action`, `actor`, `detail`, `event_id`, `timestamp`, `type`,
   then `relatedEntityId` if present.
2. **No whitespace.** `JSON.stringify(obj)` with no `space` argument.
3. **Optional `relatedEntityId`** is included only when defined. Its
   alphabetical position is preserved when included.
4. **String values are emitted exactly as JSON.stringify would** (UTF-16,
   minimal escaping). No additional normalization.

### Pseudocode

```pseudo
function canonical_event_json(event):
    out = ordered_map()
    out["action"]    = event.action
    out["actor"]     = event.actor
    out["detail"]    = event.detail
    out["event_id"]  = event.event_id
    out["timestamp"] = event.timestamp
    out["type"]      = event.type
    if event.relatedEntityId is defined:
        out["relatedEntityId"] = event.relatedEntityId
    return json_stringify(out, no_whitespace=true)
```

### Example

Input:

```json
{
  "event_id": "GEN-001",
  "timestamp": "2026-01-01T00:00:00Z",
  "type": "system_event",
  "actor": "System",
  "action": "Genesis",
  "detail": "First event"
}
```

Canonical JSON:

```text
{"action":"Genesis","actor":"System","detail":"First event","event_id":"GEN-001","timestamp":"2026-01-01T00:00:00Z","type":"system_event"}
```

`payload_hash` = `sha256(canonical_json)` = 64-char lowercase hex.

---

## Chain hash

Each event has a `sequence` (1-indexed monotonic integer assigned by the
authoritative writer) and a `chain_hash` linking it to the previous event:

```pseudo
chain_hash = sha256(sequence + "|" + payload_hash + "|" + prev_hash)
```

Where:

- `sequence` is rendered with `Number.toString()` semantics (no padding,
  base 10).
- `prev_hash` is the previous row's `chain_hash`, or `GENESIS_HASH` for the
  first event.
- `GENESIS_HASH` is the 64-character ASCII string `"0000000000000000…"`
  (sixty-four `0` characters).

Note that `chain_hash` is sha256 of the **string** `"<seq>|<payload>|<prev>"`,
not of any structured object. This keeps the construction language-neutral.

---

## Verification algorithm

Given an array of audit-event rows in ascending `sequence` order:

```pseudo
function verify_chain(events, expected_first_prev = GENESIS_HASH):
    if events.length == 0:
        return { valid: true, length: 0 }

    prev = expected_first_prev
    for row in events:
        if row.prev_hash != prev:
            return { valid: false, brokenAt: row.sequence, detail: "prev_hash mismatch" }

        if row.payload_hash != sha256(canonical_event_json(row)):
            return { valid: false, brokenAt: row.sequence, detail: "payload_hash mismatch" }

        if row.chain_hash != sha256(row.sequence + "|" + row.payload_hash + "|" + row.prev_hash):
            return { valid: false, brokenAt: row.sequence, detail: "chain_hash mismatch" }

        prev = row.chain_hash

    return { valid: true, length: events.length }
```

For verifying a **segment** (not starting at sequence 1), pass the previous
chain segment's end hash as `expected_first_prev`. The Vero public verifier
fetches a bundle that already includes the full continuous segment between
the bundle's `chainProof.startSequence` and `endSequence`, so the verifier
just needs to confirm the segment is internally consistent.

---

## JSON Schema

A formal JSON Schema for the event row shape lives at
[`schemas/audit-event.json`](./schemas/audit-event.json). It is suitable for
use with Ajv, Cerberus, or any other JSON Schema 2020-12 validator.

---

## Stability promise

This is **v1**. Any breaking change to the canonical-JSON encoding or the
chain-hash construction will ship as `v2` at a new spec URL with a deprecation
notice on this one. Vero will continue to verify v1 bundles indefinitely.

Backwards-compatible additions (new event types, new optional fields whose
absence does not affect the canonical JSON) do not require a version bump.
