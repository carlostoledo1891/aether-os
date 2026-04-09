import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, render, screen, fireEvent } from '@testing-library/react'
import { DataServiceProvider } from '../services/DataServiceProvider'
import { createMockDataService } from '../services/mockDataService'
import { useServiceQuery, useServiceQueryWithArg } from './useServiceQuery'
import { ErrorFallback } from '../components/ui/ErrorFallback'
import type { AetherDataService, MaybeAsync, RiskItem } from '../services/dataService'
import type { ReactNode } from 'react'

let mockService: AetherDataService

function wrapper({ children }: { children: ReactNode }) {
  return <DataServiceProvider service={mockService}>{children}</DataServiceProvider>
}

beforeEach(() => {
  vi.useFakeTimers()
  mockService = createMockDataService()
})
afterEach(() => {
  vi.useRealTimers()
})

describe('useServiceQuery — sync branch (mock mode)', () => {
  it('returns data synchronously without loading state', () => {
    const { result } = renderHook(
      () => useServiceQuery('risks', s => s.getRiskRegister()),
      { wrapper },
    )
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(Array.isArray(result.current.data)).toBe(true)
    expect(result.current.data!.length).toBeGreaterThan(0)
  })

  it('returns data for batches', () => {
    const { result } = renderHook(
      () => useServiceQuery('batches', s => s.getBatches()),
      { wrapper },
    )
    expect(result.current.isLoading).toBe(false)
    expect(Array.isArray(result.current.data)).toBe(true)
  })
})

describe('useServiceQuery — async branch (live mode)', () => {
  it('shows loading then resolves data from an async service method', async () => {
    const asyncService: AetherDataService = {
      ...mockService,
      getRiskRegister: () => new Promise<RiskItem[]>(resolve => {
        setTimeout(() => resolve([{ id: 'R01', title: 'Test', category: 'market', likelihood: 2, impact: 3, score: 6, mitigation: 'none', status: 'open', owner: 'test' }]), 100)
      }) as MaybeAsync<RiskItem[]>,
    }
    const asyncWrapper = ({ children }: { children: ReactNode }) => (
      <DataServiceProvider service={asyncService}>{children}</DataServiceProvider>
    )

    const { result } = renderHook(
      () => useServiceQuery('async-risks', s => s.getRiskRegister()),
      { wrapper: asyncWrapper },
    )
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()

    await act(async () => { vi.advanceTimersByTime(150) })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeDefined()
    expect(result.current.data![0].id).toBe('R01')
  })

  it('propagates errors from rejected promises', async () => {
    const failingService: AetherDataService = {
      ...mockService,
      getRiskRegister: () => Promise.reject(new Error('Network failure')) as MaybeAsync<RiskItem[]>,
    }
    const failWrapper = ({ children }: { children: ReactNode }) => (
      <DataServiceProvider service={failingService}>{children}</DataServiceProvider>
    )

    const { result } = renderHook(
      () => useServiceQuery('fail-risks', s => s.getRiskRegister()),
      { wrapper: failWrapper },
    )

    await act(async () => { vi.advanceTimersByTime(10) })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error!.message).toBe('Network failure')
    expect(result.current.data).toBeUndefined()
  })

  it('propagates errors from thrown sync exceptions', () => {
    const throwService: AetherDataService = {
      ...mockService,
      getRiskRegister: () => { throw new Error('Sync failure') },
    }
    const throwWrapper = ({ children }: { children: ReactNode }) => (
      <DataServiceProvider service={throwService}>{children}</DataServiceProvider>
    )

    const { result } = renderHook(
      () => useServiceQuery('throw-risks', s => s.getRiskRegister()),
      { wrapper: throwWrapper },
    )
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error!.message).toBe('Sync failure')
  })
})

describe('useServiceQuery — dedup cache (DEDUP_WINDOW_MS)', () => {
  it('returns cached data for same key within dedup window', () => {
    const spy = vi.fn(() => mockService.getRiskRegister())
    const spyService: AetherDataService = { ...mockService, getRiskRegister: spy }
    const spyWrapper = ({ children }: { children: ReactNode }) => (
      <DataServiceProvider service={spyService}>{children}</DataServiceProvider>
    )

    const { result: r1 } = renderHook(
      () => useServiceQuery('dedup-risks', s => s.getRiskRegister()),
      { wrapper: spyWrapper },
    )
    expect(r1.current.data).toBeDefined()

    const { result: r2 } = renderHook(
      () => useServiceQuery('dedup-risks', s => s.getRiskRegister()),
      { wrapper: spyWrapper },
    )
    expect(r2.current.data).toBeDefined()
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('useServiceQuery — render stability', () => {
  it('does NOT infinite re-render with async service (THE test)', async () => {
    let renderCount = 0
    const asyncService: AetherDataService = {
      ...mockService,
      getRiskRegister: () => Promise.resolve([{
        id: 'R01', title: 'Test', category: 'market' as const,
        likelihood: 2 as const, impact: 3 as const, score: 6,
        mitigation: 'none', status: 'open' as const, owner: 'test',
      }]) as MaybeAsync<RiskItem[]>,
    }
    const asyncWrapper = ({ children }: { children: ReactNode }) => (
      <DataServiceProvider service={asyncService}>{children}</DataServiceProvider>
    )

    renderHook(
      () => {
        renderCount++
        return useServiceQuery('stable-risks', s => s.getRiskRegister())
      },
      { wrapper: asyncWrapper },
    )

    await act(async () => { vi.advanceTimersByTime(500) })

    expect(renderCount).toBeLessThan(10)
  })
})

describe('useServiceQueryWithArg', () => {
  it('fetches data based on a dynamic argument', () => {
    const { result } = renderHook(
      () => useServiceQueryWithArg('history', '24h' as const, (s, r) => s.getHistory(r)),
      { wrapper },
    )
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeDefined()
    expect(result.current.data!.plantHistory).toBeDefined()
  })

  it('re-fetches when arg changes', () => {
    type Range = '24h' | '7d'
    const { result, rerender } = renderHook(
      ({ range }: { range: Range }) => useServiceQueryWithArg('history', range, (s, r) => s.getHistory(r)),
      { wrapper, initialProps: { range: '24h' as Range } },
    )

    expect(result.current.data).toBeDefined()
    const firstData = result.current.data

    rerender({ range: '7d' as Range })
    expect(result.current.data).toBeDefined()
    expect(result.current.data).not.toBe(firstData)
  })

  it('handles async arg-based queries', async () => {
    const asyncService: AetherDataService = {
      ...mockService,
      getFinancialScenario: (key) => new Promise(resolve => {
        setTimeout(() => resolve({
          key, label: key, ndpr_price_kg: 100, dytb_price_kg: 50,
          npv_pretax_m: 200, npv_posttax_m: 150, irr_pretax_pct: 25,
          irr_posttax_pct: 20, payback_yrs: 4, annual_revenue_m: 100,
          opex_per_kg: 10, breakeven_ndpr_kg: 50,
        }), 50)
      }),
    }
    const asyncWrapper = ({ children }: { children: ReactNode }) => (
      <DataServiceProvider service={asyncService}>{children}</DataServiceProvider>
    )

    const { result } = renderHook(
      () => useServiceQueryWithArg('fin', 'consensus' as const, (s, k) => s.getFinancialScenario(k)),
      { wrapper: asyncWrapper },
    )

    expect(result.current.isLoading).toBe(true)
    await act(async () => { vi.advanceTimersByTime(100) })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data?.key).toBe('consensus')
  })
})

describe('useServiceQuery — cleanup', () => {
  it('does not update state after unmount', async () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const asyncService: AetherDataService = {
      ...mockService,
      getRiskRegister: () => new Promise<RiskItem[]>(resolve => {
        setTimeout(() => resolve([]), 200)
      }) as MaybeAsync<RiskItem[]>,
    }
    const asyncWrapper = ({ children }: { children: ReactNode }) => (
      <DataServiceProvider service={asyncService}>{children}</DataServiceProvider>
    )

    const { unmount } = renderHook(
      () => useServiceQuery('cleanup-risks', s => s.getRiskRegister()),
      { wrapper: asyncWrapper },
    )

    unmount()
    await act(async () => { vi.advanceTimersByTime(300) })

    expect(consoleWarn).not.toHaveBeenCalled()
    consoleWarn.mockRestore()
  })
})

describe('ErrorFallback component', () => {
  it('renders error message', () => {
    render(<ErrorFallback error={new Error('Test error')} label="Test label" />)
    expect(screen.getByRole('alert')).toBeDefined()
    expect(screen.getByText('Test error')).toBeDefined()
    expect(screen.getByText('Test label')).toBeDefined()
  })

  it('renders retry button when onRetry is provided', () => {
    const onRetry = vi.fn()
    render(<ErrorFallback error={new Error('Fail')} onRetry={onRetry} />)
    const btn = screen.getByText('Retry')
    fireEvent.click(btn)
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
