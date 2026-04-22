import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { DataServiceProvider } from '../../services/DataServiceProvider'
import { createMockDataService } from '../../services/mockDataService'
import { UnitChrome } from './UnitChrome'
import { LENS_EXECUTIVE, LENS_FIELD, LENS_EVERYTHING } from '../../units/lensRegistry'
import type { UseLensReturn } from '../../units/useLens'
import type { Lens } from 'shared/units/types'

function makeLensReturn(activeLens: Lens): UseLensReturn {
  return {
    activeLens,
    typeToggles: Object.fromEntries(activeLens.unitTypes.map(t => [t, true])),
    severityFilter: activeLens.severityFilter ?? [],
    setLens: vi.fn(),
    toggleType: vi.fn(),
    setSeverityFilter: vi.fn(),
    allLenses: [LENS_FIELD, LENS_EXECUTIVE, LENS_EVERYTHING],
    activeTypeIds: activeLens.unitTypes,
  }
}

function wrap(ui: ReactNode) {
  return (
    <DataServiceProvider service={createMockDataService()}>{ui}</DataServiceProvider>
  )
}

const BUNDLE_RESPONSE = {
  id: 'BDL-TEST',
  rootUnitId: 'SITE-CALDEIRA',
  claim: 'Board pack claim',
  createdAt: '2026-04-16T00:00:00Z',
  verificationStatus: 'pending',
  snapshot: { units: {}, edges: [], evidence: [], generatedAt: '2026-04-16T00:00:00Z' },
  chainProof: { startSequence: 1, endSequence: 2, eventCount: 2, startHash: 'a', endHash: 'b', valid: true },
  narrative: 'Narrative here',
  verifiedAt: null,
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    if (url.includes('/api/bundles/preset')) {
      return new Response(JSON.stringify(BUNDLE_RESPONSE), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({ type: 'FeatureCollection', features: [] }), { status: 200 })
  }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('UnitChrome — Board Pack button', () => {
  it('does NOT render Board Pack button on the field lens', () => {
    render(wrap(<UnitChrome lens={makeLensReturn(LENS_FIELD)} />))
    expect(screen.queryByRole('button', { name: /board pack/i })).toBeNull()
  })

  it('renders Board Pack button when lens=executive', () => {
    render(wrap(<UnitChrome lens={makeLensReturn(LENS_EXECUTIVE)} />))
    expect(screen.getByRole('button', { name: /board pack/i })).toBeDefined()
  })

  it('renders Board Pack button when lens=everything', () => {
    render(wrap(<UnitChrome lens={makeLensReturn(LENS_EVERYTHING)} />))
    expect(screen.getByRole('button', { name: /board pack/i })).toBeDefined()
  })

  it('clicking Board Pack posts preset=boardPack and renders the bundle dialog', async () => {
    render(wrap(<UnitChrome lens={makeLensReturn(LENS_EXECUTIVE)} />))
    const btn = screen.getByRole('button', { name: /board pack/i })

    await act(async () => { fireEvent.click(btn) })
    await act(async () => { await Promise.resolve() })

    expect(screen.getByText(/Board Pack — Caldeira Project/i)).toBeDefined()

    const generateBtn = screen.getByRole('button', { name: /generate bundle/i })
    await act(async () => { fireEvent.click(generateBtn) })
    await act(async () => { await Promise.resolve() })

    const fetchMock = global.fetch as unknown as ReturnType<typeof vi.fn>
    const presetCall = fetchMock.mock.calls.find(call => String(call[0]).includes('/api/bundles/preset'))
    expect(presetCall).toBeDefined()
    const body = JSON.parse((presetCall![1] as { body: string }).body)
    expect(body.preset).toBe('boardPack')
  })
})
