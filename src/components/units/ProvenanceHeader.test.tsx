import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProvenanceHeader } from './ProvenanceHeader'
import { getUnitProvenance } from './provenance'
import type { UnitDetail } from 'shared/units/types'

function makeUnit(data: Record<string, unknown>): UnitDetail {
  return {
    id: 'DEP-capao-do-mel',
    typeId: 'deposit',
    label: 'Capão do Mel',
    currentState: 'measured',
    severity: 'nominal',
    updatedAt: '2026-04-16T00:00:00Z',
    data,
    edgeCount: 0,
    evidenceCount: 0,
    typeDef: {
      id: 'deposit', label: 'Deposit', color: '#f59e0b', icon: 'layers',
      states: [], transitions: [], schema: [], metrics: [], inspectorSections: [],
    },
  }
}

describe('ProvenanceHeader', () => {
  it('renders nothing when no provenance data is present', () => {
    const { container } = render(<ProvenanceHeader unit={makeUnit({ treo_ppm: 3034 })} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when provenance is an empty object', () => {
    const { container } = render(<ProvenanceHeader unit={makeUnit({ provenance: {} })} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all three chips when source, classification, and verifier are present', () => {
    const unit = makeUnit({
      provenance: {
        source: 'ASX 2024-11-08',
        classification: 'JORC Measured',
        verifier: 'Dr. Caponi, LAPOC',
      },
    })
    render(<ProvenanceHeader unit={unit} />)
    expect(screen.getByText('ASX 2024-11-08')).toBeDefined()
    expect(screen.getByText('JORC Measured')).toBeDefined()
    expect(screen.getByText('Dr. Caponi, LAPOC')).toBeDefined()
  })

  it('renders partial provenance (classification only)', () => {
    const unit = makeUnit({
      provenance: { classification: 'JORC Inferred' },
    })
    render(<ProvenanceHeader unit={unit} />)
    expect(screen.getByText('JORC Inferred')).toBeDefined()
    expect(screen.queryByText(/ASX/)).toBeNull()
  })

  it('makes the source chip clickable when a url is provided', () => {
    const unit = makeUnit({
      provenance: {
        source: 'ASX 2024-11-08',
        classification: 'JORC Measured',
        url: 'https://example.com/release.pdf',
      },
    })
    render(<ProvenanceHeader unit={unit} />)
    const link = screen.getByText('ASX 2024-11-08').closest('a')
    expect(link).toBeDefined()
    expect(link?.getAttribute('href')).toBe('https://example.com/release.pdf')
    expect(link?.getAttribute('target')).toBe('_blank')
    expect(link?.getAttribute('rel')).toContain('noreferrer')
  })

  it('getUnitProvenance ignores non-string field values', () => {
    const unit = makeUnit({
      provenance: { source: 'ASX 2024', classification: 42, verifier: null },
    })
    const p = getUnitProvenance(unit)
    expect(p).toEqual({ source: 'ASX 2024' })
  })
})
