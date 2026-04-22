import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import type { UnitTypeDef, EvidenceRef } from '../types/unitTypes.js'

process.env.DB_PATH = ':memory:'

const {
  validateTransition,
  seedUnitType,
  createUnit,
  getUnit,
  listUnits,
  getUnitByPlace,
  getUnitStats,
  createEdge,
  getEdges,
  transitionUnit,
  getTransitions,
  attachEvidence,
  getEvidence,
  getConsequences,
  createBundle,
  getBundle,
  verifyBundle,
  getUnitCount,
  getEdgeCount,
} = await import('../store/unitStore.js')
const { getDb } = await import('../store/db.js')
const { getAuditTrail } = await import('../store/auditChain.js')

afterAll(() => {
  try { getDb().close() } catch { /* already closed */ }
})

/* ─── Test type definition ────────────────────────────────────────────────── */

const TEST_TYPE: UnitTypeDef = {
  id: 'test_type',
  label: 'Test Unit',
  color: '#FF0000',
  icon: 'test',
  states: [
    { id: 'draft', label: 'Draft', severity: 'nominal' },
    { id: 'active', label: 'Active', severity: 'nominal' },
    { id: 'review', label: 'Under Review', severity: 'attention' },
    { id: 'blocked', label: 'Blocked', severity: 'blocked' },
    { id: 'closed', label: 'Closed', severity: 'nominal' },
  ],
  transitions: [
    { from: 'draft', to: 'active', label: 'Activate' },
    { from: 'active', to: 'review', label: 'Send for Review' },
    { from: 'review', to: 'active', label: 'Approve', requiredEvidence: ['approval_doc'] },
    { from: 'review', to: 'blocked', label: 'Block' },
    { from: 'blocked', to: 'active', label: 'Unblock' },
    { from: 'active', to: 'closed', label: 'Close' },
  ],
  schema: [
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'value', label: 'Value', type: 'number', unit: 'kg' },
  ],
  metrics: [{ key: 'value', label: 'Value', unit: 'kg' }],
  inspectorSections: [
    { type: 'fields', label: 'Details' },
    { type: 'timeline', label: 'History' },
  ],
}

beforeAll(() => {
  getDb()
  seedUnitType(TEST_TYPE)
})

/* ─── validateTransition (pure) ───────────────────────────────────────────── */

describe('validateTransition', () => {
  it('accepts a legal transition', () => {
    const result = validateTransition(TEST_TYPE, 'draft', 'active', [])
    expect(result).toEqual({ valid: true })
  })

  it('rejects an illegal transition', () => {
    const result = validateTransition(TEST_TYPE, 'draft', 'closed', [])
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.reason).toContain('No transition')
    }
  })

  it('rejects when required evidence is missing', () => {
    const result = validateTransition(TEST_TYPE, 'review', 'active', [])
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.reason).toContain('approval_doc')
    }
  })

  it('accepts when required evidence is present', () => {
    const evidence: EvidenceRef[] = [{
      id: 1, unitId: 'x', docType: 'approval_doc',
      docId: 'DOC-1', label: 'Approval', attachedAt: '2026-01-01T00:00:00Z',
    }]
    const result = validateTransition(TEST_TYPE, 'review', 'active', evidence)
    expect(result).toEqual({ valid: true })
  })
})

/* ─── createUnit + getUnit roundtrip ──────────────────────────────────────── */

describe('createUnit + getUnit', () => {
  it('creates and retrieves a unit', () => {
    const summary = createUnit({
      id: 'TEST-001',
      typeId: 'test_type',
      label: 'Test Unit One',
      initialState: 'draft',
      placeId: 'place-001',
      owner: 'Alice',
      data: { name: 'Widget', value: 42 },
    })

    expect(summary.id).toBe('TEST-001')
    expect(summary.currentState).toBe('draft')
    expect(summary.severity).toBe('nominal')

    const detail = getUnit('TEST-001')
    expect(detail).not.toBeNull()
    expect(detail!.data).toEqual({ name: 'Widget', value: 42 })
    expect(detail!.typeDef.id).toBe('test_type')
    expect(detail!.edgeCount).toBe(0)
    expect(detail!.evidenceCount).toBe(0)
  })

  it('returns null for unknown unit', () => {
    expect(getUnit('NONEXISTENT')).toBeNull()
  })
})

/* ─── listUnits + filters ─────────────────────────────────────────────────── */

describe('listUnits', () => {
  beforeAll(() => {
    createUnit({ id: 'TEST-002', typeId: 'test_type', label: 'Unit Two', initialState: 'active', severity: 'attention', owner: 'Bob' })
    createUnit({ id: 'TEST-003', typeId: 'test_type', label: 'Unit Three', initialState: 'draft', owner: 'Alice' })
  })

  it('returns all units without filters', () => {
    const all = listUnits()
    expect(all.length).toBeGreaterThanOrEqual(3)
  })

  it('filters by state', () => {
    const drafts = listUnits({ state: 'draft' })
    for (const u of drafts) expect(u.currentState).toBe('draft')
  })

  it('filters by severity', () => {
    const attention = listUnits({ severity: 'attention' })
    expect(attention.length).toBeGreaterThanOrEqual(1)
    for (const u of attention) expect(u.severity).toBe('attention')
  })
})

/* ─── getUnitByPlace ──────────────────────────────────────────────────────── */

describe('getUnitByPlace', () => {
  it('finds unit by place_id', () => {
    const unit = getUnitByPlace('place-001')
    expect(unit).not.toBeNull()
    expect(unit!.id).toBe('TEST-001')
  })

  it('returns null for unknown place', () => {
    expect(getUnitByPlace('nonexistent-place')).toBeNull()
  })
})

/* ─── getUnitStats ────────────────────────────────────────────────────────── */

describe('getUnitStats', () => {
  it('returns grouped counts', () => {
    const stats = getUnitStats()
    expect(stats['test_type']).toBeDefined()
    expect(stats['test_type']['nominal']).toBeGreaterThanOrEqual(1)
  })
})

/* ─── Edges ───────────────────────────────────────────────────────────────── */

describe('edges', () => {
  it('creates and retrieves edges', () => {
    createEdge('TEST-001', 'TEST-002', 'depends_on')
    createEdge('TEST-002', 'TEST-003', 'contains')

    const edges = getEdges('TEST-002')
    expect(edges.incoming.length).toBe(1)
    expect(edges.incoming[0].fromId).toBe('TEST-001')
    expect(edges.outgoing.length).toBe(1)
    expect(edges.outgoing[0].toId).toBe('TEST-003')
  })

  it('deduplicates edges (same edge twice does not throw)', () => {
    expect(() => createEdge('TEST-001', 'TEST-002', 'depends_on')).not.toThrow()
    const edges = getEdges('TEST-001')
    const matchingOutgoing = edges.outgoing.filter(
      e => e.toId === 'TEST-002' && e.rel === 'depends_on',
    )
    expect(matchingOutgoing.length).toBe(1)
  })
})

/* ─── transitionUnit ──────────────────────────────────────────────────────── */

describe('transitionUnit', () => {
  it('transitions a unit and writes audit event', () => {
    const record = transitionUnit('TEST-001', 'active', 'Alice', 'Ready to go')

    expect(record.fromState).toBe('draft')
    expect(record.toState).toBe('active')
    expect(record.actor).toBe('Alice')
    expect(record.auditEventId).toBeTruthy()

    const unit = getUnit('TEST-001')
    expect(unit!.currentState).toBe('active')

    const trail = getAuditTrail({ type: 'unit_transition' })
    expect(trail.length).toBeGreaterThanOrEqual(1)
    expect(trail[0].related_entity_id ?? trail[0].relatedEntityId).toBe('TEST-001')
  })

  it('updates severity based on target state', () => {
    transitionUnit('TEST-001', 'review', 'Alice')
    const unit = getUnit('TEST-001')
    expect(unit!.severity).toBe('attention')
  })

  it('rejects illegal transition', () => {
    expect(() => transitionUnit('TEST-001', 'closed', 'Alice'))
      .toThrow(/No transition/)
  })

  it('rejects transition with missing required evidence', () => {
    expect(() => transitionUnit('TEST-001', 'active', 'Alice'))
      .toThrow(/approval_doc/)
  })

  it('allows transition when evidence is attached', () => {
    attachEvidence('TEST-001', {
      docType: 'approval_doc',
      docId: 'DOC-APPROVE-1',
      label: 'Review approval document',
    })
    const record = transitionUnit('TEST-001', 'active', 'Alice', 'Approved')
    expect(record.toState).toBe('active')
    expect(getUnit('TEST-001')!.severity).toBe('nominal')
  })
})

/* ─── getTransitions ──────────────────────────────────────────────────────── */

describe('getTransitions', () => {
  it('returns transition history in desc order', () => {
    const transitions = getTransitions('TEST-001')
    expect(transitions.length).toBeGreaterThanOrEqual(3)
    expect(transitions[0].id).toBeGreaterThan(transitions[1].id)
  })
})

/* ─── Evidence ────────────────────────────────────────────────────────────── */

describe('evidence', () => {
  it('attaches and retrieves evidence', () => {
    attachEvidence('TEST-002', {
      docType: 'lab_result',
      docId: 'LAB-001',
      label: 'Assay report',
      hash: 'abc123',
    })
    const refs = getEvidence('TEST-002')
    expect(refs.length).toBeGreaterThanOrEqual(1)
    expect(refs[0].docType).toBe('lab_result')
  })
})

/* ─── Consequence graph ───────────────────────────────────────────────────── */

describe('getConsequences', () => {
  it('returns connected graph with depth limit', () => {
    const consequences = getConsequences('TEST-001', 5)
    expect(consequences.length).toBeGreaterThanOrEqual(1)
    const ids = consequences.map(c => c.unitId)
    expect(ids).toContain('TEST-002')
  })

  it('handles cycles without infinite loop', () => {
    createEdge('TEST-003', 'TEST-001', 'feeds_back')
    const consequences = getConsequences('TEST-001', 5)
    expect(consequences.length).toBeGreaterThanOrEqual(1)
    const uniqueIds = new Set(consequences.map(c => c.unitId))
    expect(uniqueIds.size).toBe(consequences.length)
  })

  it('respects maxDepth', () => {
    const shallow = getConsequences('TEST-001', 1)
    const deep = getConsequences('TEST-001', 5)
    expect(shallow.length).toBeLessThanOrEqual(deep.length)
    for (const node of shallow) {
      expect(node.depth).toBeLessThanOrEqual(1)
    }
  })
})

/* ─── Bundles ─────────────────────────────────────────────────────────────── */

describe('evidence bundles', () => {
  let bundleId: string

  it('creates a bundle', () => {
    const bundle = createBundle('TEST-001', 'Test claim for provenance')
    expect(bundle.id).toBeTruthy()
    expect(bundle.rootUnitId).toBe('TEST-001')
    expect(bundle.claim).toBe('Test claim for provenance')
    expect(bundle.narrative).toBeTruthy()
    expect(bundle.verificationStatus).toBe('pending')
    bundleId = bundle.id
  })

  it('retrieves a bundle', () => {
    const bundle = getBundle(bundleId)
    expect(bundle).not.toBeNull()
    expect(bundle!.rootUnitId).toBe('TEST-001')
    expect(bundle!.snapshot).toBeDefined()
    expect(bundle!.chainProof).toBeDefined()
  })

  it('verifies a bundle', () => {
    const result = verifyBundle(bundleId)
    expect(result).not.toBeNull()
    expect(result!.verificationStatus).toBe('valid')
    expect(result!.verifiedAt).toBeTruthy()
  })

  it('returns null for unknown bundle', () => {
    expect(getBundle('NONEXISTENT')).toBeNull()
    expect(verifyBundle('NONEXISTENT')).toBeNull()
  })
})

/* ─── Counts ──────────────────────────────────────────────────────────────── */

describe('count helpers', () => {
  it('getUnitCount returns correct count', () => {
    expect(getUnitCount()).toBeGreaterThanOrEqual(3)
  })

  it('getEdgeCount returns correct count', () => {
    expect(getEdgeCount()).toBeGreaterThanOrEqual(2)
  })
})
