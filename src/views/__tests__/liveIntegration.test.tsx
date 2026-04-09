/**
 * THE test — CTO persona: "What is the test that would have caught the
 * infinite re-render before it shipped? Write it."
 *
 * Renders a real component (RiskTab) with a mock async service that returns
 * Promise<T> — the same contract as liveDataService. Verifies:
 *   (a) no infinite re-render (render count stays bounded)
 *   (b) loading skeleton appears while promise is pending
 *   (c) data renders after promise resolves
 *   (d) error fallback renders on rejection
 *   (e) no console errors during the lifecycle
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import { DataServiceProvider } from '../../services/DataServiceProvider'
import { createMockDataService } from '../../services/mockDataService'
import { __clearCacheForTesting } from '../../hooks/useServiceQuery'
import { RiskTab } from '../executive/RiskTab'
import type { AetherDataService, MaybeAsync, RiskItem } from '../../services/dataService'
import type { ReactNode } from 'react'

const RISK_FIXTURES: RiskItem[] = [
  {
    id: 'R01', title: 'Water licence delay', category: 'permitting',
    likelihood: 4, impact: 4, score: 16, mitigation: 'Engage IGAM early',
    status: 'open', owner: 'env-lead',
  },
  {
    id: 'R02', title: 'REE price drop', category: 'market',
    likelihood: 3, impact: 3, score: 9, mitigation: 'Offtake hedging',
    status: 'mitigating', owner: 'cfo',
  },
]

let resolveRisks!: (v: RiskItem[]) => void
let rejectRisks!: (e: Error) => void
let callCount: number

function createAsyncService(): AetherDataService {
  const base = createMockDataService()
  callCount = 0
  return {
    ...base,
    getRiskRegister() {
      callCount++
      return new Promise<RiskItem[]>((res, rej) => {
        resolveRisks = res
        rejectRisks = rej
      }) as MaybeAsync<RiskItem[]>
    },
  }
}

function Wrapper({ service, children }: { service: AetherDataService; children: ReactNode }) {
  return <DataServiceProvider service={service}>{children}</DataServiceProvider>
}

beforeEach(() => {
  __clearCacheForTesting()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('RiskTab — live-mode integration (THE test)', () => {
  it('shows loading skeleton while async data is pending', () => {
    const service = createAsyncService()
    render(
      <Wrapper service={service}>
        <RiskTab />
      </Wrapper>,
    )

    expect(screen.getByText('Loading risks...')).toBeDefined()
  })

  it('renders resolved data after promise settles', async () => {
    const service = createAsyncService()
    render(
      <Wrapper service={service}>
        <RiskTab />
      </Wrapper>,
    )

    expect(screen.getByText('Loading risks...')).toBeDefined()

    await act(async () => {
      resolveRisks(RISK_FIXTURES)
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(screen.getByText('Water licence delay')).toBeDefined()
    })
    expect(screen.getByText('REE price drop')).toBeDefined()
    expect(screen.queryByText('Loading risks...')).toBeNull()
  })

  it('shows error fallback when async service rejects', async () => {
    const service = createAsyncService()
    render(
      <Wrapper service={service}>
        <RiskTab />
      </Wrapper>,
    )

    await act(async () => {
      rejectRisks(new Error('API 502: Bad Gateway'))
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined()
    })
    expect(screen.getByText('API 502: Bad Gateway')).toBeDefined()
    expect(screen.queryByText('Loading risks...')).toBeNull()
  })

  it('does NOT infinite re-render with async service (bounded render count)', async () => {
    let renderCount = 0
    function CountedRiskTab() {
      renderCount++
      return <RiskTab />
    }

    const service = createAsyncService()
    render(
      <Wrapper service={service}>
        <CountedRiskTab />
      </Wrapper>,
    )

    const preResolveCount = renderCount
    await act(async () => {
      resolveRisks(RISK_FIXTURES)
      await Promise.resolve()
    })

    // A healthy component: initial render + state update after resolve = ~2-5 renders.
    // The infinite re-render bug caused 100+ renders per second.
    expect(renderCount).toBeLessThan(10)
    expect(preResolveCount).toBeLessThan(5)
  })

  it('service method is called exactly once (no re-fetch storm)', async () => {
    const service = createAsyncService()
    render(
      <Wrapper service={service}>
        <RiskTab />
      </Wrapper>,
    )

    await act(async () => {
      resolveRisks(RISK_FIXTURES)
      await Promise.resolve()
    })

    expect(callCount).toBe(1)
  })

  it('produces no console errors during the full lifecycle', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const service = createAsyncService()

    render(
      <Wrapper service={service}>
        <RiskTab />
      </Wrapper>,
    )

    await act(async () => {
      resolveRisks(RISK_FIXTURES)
      await Promise.resolve()
    })

    expect(consoleError).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
