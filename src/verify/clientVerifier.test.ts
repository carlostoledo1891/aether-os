/**
 * Math-correctness gate for the Wave 1 public verifier (see
 * `.cursor/plans/wave_1_public_verifier_3da0c0e1.plan.md`, week-2 gate).
 *
 * Builds a synthetic chain segment using the same canonical-JSON spec the
 * server uses, then exercises every failure mode the verifier must catch.
 */

import { describe, it, expect } from 'vitest'
import {
  canonicalEventJson,
  chainHashInput,
} from 'shared/audit/canonicalJson'
import {
  GENESIS_HASH,
  type AuditEventInput,
  type AuditEventRow,
} from 'shared/audit/types'
import {
  sha256Hex,
  computePayloadHashClient,
  computeChainHashClient,
  verifyChainClient,
} from './clientVerifier'

async function buildRow(
  input: AuditEventInput,
  sequence: number,
  prevHash: string,
): Promise<AuditEventRow> {
  const payload_hash = await sha256Hex(canonicalEventJson(input))
  const chain_hash = await sha256Hex(chainHashInput(sequence, payload_hash, prevHash))
  return {
    ...input,
    sequence,
    payload_hash,
    prev_hash: prevHash,
    chain_hash,
    anchor_batch_id: null,
  }
}

async function buildChain(inputs: AuditEventInput[]): Promise<AuditEventRow[]> {
  const rows: AuditEventRow[] = []
  let prev = GENESIS_HASH
  let seq = 1
  for (const input of inputs) {
    const row = await buildRow(input, seq, prev)
    rows.push(row)
    prev = row.chain_hash
    seq += 1
  }
  return rows
}

const SAMPLE_INPUTS: AuditEventInput[] = [
  {
    event_id: 'GEN-001',
    timestamp: '2026-01-01T00:00:00Z',
    type: 'system_event',
    actor: 'System',
    action: 'Genesis',
    detail: 'First event',
  },
  {
    event_id: 'GEN-002',
    timestamp: '2026-01-02T00:00:00Z',
    type: 'batch_created',
    actor: 'Test',
    action: 'Second',
    detail: 'Second event',
    relatedEntityId: 'BATCH-1',
  },
  {
    event_id: 'GEN-003',
    timestamp: '2026-01-03T00:00:00Z',
    type: 'unit_transition',
    actor: 'Operator',
    action: 'Third',
    detail: 'Third event',
    relatedEntityId: 'UNIT-1',
  },
]

describe('sha256Hex', () => {
  it('produces 64-character lowercase hex', async () => {
    const out = await sha256Hex('hello')
    expect(out).toHaveLength(64)
    expect(out).toMatch(/^[0-9a-f]{64}$/)
  })

  it('matches the published sha256 of "hello"', async () => {
    expect(await sha256Hex('hello')).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    )
  })

  it('is deterministic', async () => {
    const a = await sha256Hex('payload')
    const b = await sha256Hex('payload')
    expect(a).toBe(b)
  })
})

describe('computePayloadHashClient', () => {
  it('matches a hand-derived hash of the canonical JSON', async () => {
    const ev = SAMPLE_INPUTS[0]
    const expected = await sha256Hex(canonicalEventJson(ev))
    expect(await computePayloadHashClient(ev)).toBe(expected)
  })

  it('treats relatedEntityId as a meaningful field', async () => {
    const a = await computePayloadHashClient(SAMPLE_INPUTS[0])
    const b = await computePayloadHashClient({ ...SAMPLE_INPUTS[0], relatedEntityId: 'X' })
    expect(a).not.toBe(b)
  })
})

describe('computeChainHashClient', () => {
  it('matches sha256 of "<seq>|<payload>|<prev>"', async () => {
    const expected = await sha256Hex('5|aa|bb')
    expect(await computeChainHashClient(5, 'aa', 'bb')).toBe(expected)
  })
})

describe('verifyChainClient — happy path', () => {
  it('returns valid + length for an empty chain', async () => {
    const out = await verifyChainClient([])
    expect(out).toEqual({ valid: true, length: 0 })
  })

  it('returns valid for an untampered 3-event chain', async () => {
    const rows = await buildChain(SAMPLE_INPUTS)
    const out = await verifyChainClient(rows)
    expect(out.valid).toBe(true)
    expect(out.length).toBe(3)
    expect(out.brokenAt).toBeUndefined()
  })

  it('returns valid even when input is shuffled (verifier sorts by sequence)', async () => {
    const rows = await buildChain(SAMPLE_INPUTS)
    const shuffled = [rows[2], rows[0], rows[1]]
    const out = await verifyChainClient(shuffled)
    expect(out.valid).toBe(true)
    expect(out.length).toBe(3)
  })

  it('invokes onProgress for every event', async () => {
    const rows = await buildChain(SAMPLE_INPUTS)
    const calls: Array<[number, number]> = []
    await verifyChainClient(rows, { onProgress: (cur, total) => calls.push([cur, total]) })
    expect(calls).toEqual([[1, 3], [2, 3], [3, 3]])
  })
})

describe('verifyChainClient — tamper detection', () => {
  it('reports brokenAt the right sequence when payload_hash is wrong', async () => {
    const rows = await buildChain(SAMPLE_INPUTS)
    rows[1] = { ...rows[1], payload_hash: 'b'.repeat(64) }
    const out = await verifyChainClient(rows)
    expect(out.valid).toBe(false)
    expect(out.brokenAt).toBe(2)
    expect(out.detail).toContain('payload_hash')
  })

  it('reports brokenAt when chain_hash is wrong', async () => {
    const rows = await buildChain(SAMPLE_INPUTS)
    rows[1] = { ...rows[1], chain_hash: 'c'.repeat(64) }
    const out = await verifyChainClient(rows)
    expect(out.valid).toBe(false)
    expect(out.brokenAt).toBe(2)
    expect(out.detail).toContain('chain_hash')
  })

  it('reports brokenAt when prev_hash linkage is broken', async () => {
    const rows = await buildChain(SAMPLE_INPUTS)
    rows[2] = { ...rows[2], prev_hash: 'd'.repeat(64) }
    const out = await verifyChainClient(rows)
    expect(out.valid).toBe(false)
    expect(out.brokenAt).toBe(3)
    expect(out.detail).toContain('prev_hash')
  })

  it('detects a quietly-edited canonical field even when hashes look plausible', async () => {
    const rows = await buildChain(SAMPLE_INPUTS)
    rows[1] = { ...rows[1], detail: 'tampered detail without rehash' }
    const out = await verifyChainClient(rows)
    expect(out.valid).toBe(false)
    expect(out.brokenAt).toBe(2)
    expect(out.detail).toContain('payload_hash')
  })
})

describe('verifyChainClient — segment semantics', () => {
  it('honors expectedFirstPrevHash override when verifying a non-genesis segment', async () => {
    const fullChain = await buildChain([
      ...SAMPLE_INPUTS,
      { ...SAMPLE_INPUTS[0], event_id: 'GEN-004', timestamp: '2026-01-04T00:00:00Z' },
    ])
    const segment = fullChain.slice(2)
    const segmentValid = await verifyChainClient(segment, {
      expectedFirstPrevHash: fullChain[1].chain_hash,
    })
    expect(segmentValid.valid).toBe(true)
    expect(segmentValid.length).toBe(2)

    const segmentInvalid = await verifyChainClient(segment, {
      expectedFirstPrevHash: 'e'.repeat(64),
    })
    expect(segmentInvalid.valid).toBe(false)
    expect(segmentInvalid.brokenAt).toBe(segment[0].sequence)
  })
})
