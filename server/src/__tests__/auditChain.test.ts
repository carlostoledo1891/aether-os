import { describe, it, expect, afterAll } from 'vitest'
import { createHash } from 'node:crypto'

/**
 * These tests exercise the audit chain functions directly against an in-memory
 * SQLite database. We dynamically set DB_PATH to ':memory:' before importing
 * the modules so the real aether.db is never touched.
 */

// Point DB to in-memory before any module import that calls getDb()
process.env.DB_PATH = ':memory:'

const { sha256, computePayloadHash, appendAuditEvent, getAuditTrail, getAuditEvent, verifyChain } =
  await import('../store/auditChain.js')
const { getDb } = await import('../store/db.js')

afterAll(() => {
  try { getDb().close() } catch { /* already closed */ }
})

/* ─── sha256 ──────────────────────────────────────────────────────────────── */

describe('sha256', () => {
  it('produces correct hex for known input', () => {
    const expected = createHash('sha256').update('hello').digest('hex')
    expect(sha256('hello')).toBe(expected)
  })

  it('produces 64-character hex string', () => {
    expect(sha256('test')).toHaveLength(64)
    expect(sha256('test')).toMatch(/^[0-9a-f]{64}$/)
  })
})

/* ─── computePayloadHash ──────────────────────────────────────────────────── */

describe('computePayloadHash', () => {
  const event = {
    event_id: 'TEST-001',
    timestamp: '2026-01-01T00:00:00Z',
    type: 'system_event' as const,
    actor: 'System',
    action: 'Test',
    detail: 'Test event',
  }

  it('is deterministic', () => {
    expect(computePayloadHash(event)).toBe(computePayloadHash(event))
  })

  it('produces different hashes for different events', () => {
    const other = { ...event, event_id: 'TEST-002' }
    expect(computePayloadHash(event)).not.toBe(computePayloadHash(other))
  })

  it('handles optional relatedEntityId', () => {
    const withRef = { ...event, relatedEntityId: 'REF-1' }
    expect(computePayloadHash(event)).not.toBe(computePayloadHash(withRef))
  })
})

/* ─── appendAuditEvent ────────────────────────────────────────────────────── */

describe('appendAuditEvent', () => {
  it('creates genesis event with prev_hash = 0x64', () => {
    const row = appendAuditEvent({
      event_id: 'GEN-001',
      timestamp: '2026-01-01T00:00:00Z',
      type: 'system_event',
      actor: 'System',
      action: 'Genesis',
      detail: 'First event',
    })
    expect(row.sequence).toBe(1)
    expect(row.prev_hash).toBe('0'.repeat(64))
    expect(row.chain_hash).toHaveLength(64)
    expect(row.payload_hash).toHaveLength(64)
  })

  it('chains correctly — event N references event N-1', () => {
    const row2 = appendAuditEvent({
      event_id: 'GEN-002',
      timestamp: '2026-01-02T00:00:00Z',
      type: 'batch_created',
      actor: 'Test',
      action: 'Second',
      detail: 'Second event',
    })
    expect(row2.sequence).toBe(2)
    const row1 = getAuditEvent('GEN-001')!
    expect(row2.prev_hash).toBe(row1.chain_hash)
  })

  it('increments sequence monotonically', () => {
    const row3 = appendAuditEvent({
      event_id: 'GEN-003',
      timestamp: '2026-01-03T00:00:00Z',
      type: 'user_action',
      actor: 'Test',
      action: 'Third',
      detail: 'Third event',
    })
    expect(row3.sequence).toBe(3)
  })

  it('rejects duplicate event_id', () => {
    expect(() => appendAuditEvent({
      event_id: 'GEN-001',
      timestamp: '2026-01-04T00:00:00Z',
      type: 'system_event',
      actor: 'Test',
      action: 'Duplicate',
      detail: 'Should fail',
    })).toThrow()
  })
})

/* ─── getAuditTrail ───────────────────────────────────────────────────────── */

describe('getAuditTrail', () => {
  it('returns events in descending sequence order', () => {
    const trail = getAuditTrail()
    expect(trail.length).toBe(3)
    expect(trail[0].sequence).toBeGreaterThan(trail[1].sequence)
  })

  it('filters by type', () => {
    const filtered = getAuditTrail({ type: 'system_event' })
    expect(filtered.length).toBe(1)
    expect(filtered[0].event_id).toBe('GEN-001')
  })

  it('returns empty array for non-existent type', () => {
    expect(getAuditTrail({ type: 'nonexistent' })).toHaveLength(0)
  })
})

/* ─── getAuditEvent ───────────────────────────────────────────────────────── */

describe('getAuditEvent', () => {
  it('finds event by ID', () => {
    const event = getAuditEvent('GEN-002')
    expect(event).not.toBeNull()
    expect(event!.action).toBe('Second')
  })

  it('returns null for unknown ID', () => {
    expect(getAuditEvent('NOPE')).toBeNull()
  })
})

/* ─── verifyChain ─────────────────────────────────────────────────────────── */

describe('verifyChain', () => {
  it('returns valid on untampered chain', () => {
    const result = verifyChain()
    expect(result.valid).toBe(true)
    expect(result.length).toBe(3)
  })

  it('detects tampered payload_hash', () => {
    const db = getDb()
    const original = db.prepare('SELECT payload_hash FROM audit_events WHERE sequence = 2').get() as { payload_hash: string }
    db.prepare('UPDATE audit_events SET payload_hash = ? WHERE sequence = 2').run('bad'.repeat(16) + 'badbad0000000000')

    const result = verifyChain()
    expect(result.valid).toBe(false)
    expect(result.brokenAt).toBe(2)
    expect(result.detail).toContain('payload_hash')

    db.prepare('UPDATE audit_events SET payload_hash = ? WHERE sequence = 2').run(original.payload_hash)
  })

  it('detects tampered chain_hash', () => {
    const db = getDb()
    const original = db.prepare('SELECT chain_hash FROM audit_events WHERE sequence = 2').get() as { chain_hash: string }
    db.prepare('UPDATE audit_events SET chain_hash = ? WHERE sequence = 2').run('c'.repeat(64))

    const result = verifyChain()
    expect(result.valid).toBe(false)
    expect(result.brokenAt).toBe(2)

    db.prepare('UPDATE audit_events SET chain_hash = ? WHERE sequence = 2').run(original.chain_hash)
  })

  it('detects broken prev_hash link', () => {
    const db = getDb()
    const original = db.prepare('SELECT prev_hash FROM audit_events WHERE sequence = 3').get() as { prev_hash: string }
    db.prepare('UPDATE audit_events SET prev_hash = ? WHERE sequence = 3').run('d'.repeat(64))

    const result = verifyChain()
    expect(result.valid).toBe(false)
    expect(result.brokenAt).toBe(3)
    expect(result.detail).toContain('prev_hash')

    db.prepare('UPDATE audit_events SET prev_hash = ? WHERE sequence = 3').run(original.prev_hash)
  })
})

/* ─── Empty chain ─────────────────────────────────────────────────────────── */

describe('verifyChain on empty table', () => {
  it('returns valid with length 0', () => {
    const db = getDb()
    const backup = db.prepare('SELECT * FROM audit_events ORDER BY sequence ASC').all()
    db.prepare('DELETE FROM audit_events').run()

    const result = verifyChain()
    expect(result.valid).toBe(true)
    expect(result.length).toBe(0)

    const insertStmt = db.prepare(`
      INSERT INTO audit_events (sequence, event_id, timestamp, type, actor, action, detail, payload_hash, prev_hash, chain_hash, related_entity_id, anchor_batch_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    for (const row of backup as Array<Record<string, unknown>>) {
      insertStmt.run(
        row.sequence, row.event_id, row.timestamp, row.type,
        row.actor, row.action, row.detail, row.payload_hash,
        row.prev_hash, row.chain_hash, row.related_entity_id, row.anchor_batch_id,
      )
    }
  })
})
