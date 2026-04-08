import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { DataServiceProvider, useTelemetry, useDataService, useAetherService } from './DataServiceProvider'
import { createMockDataService } from './mockDataService'
import type { AetherDataService } from './dataService'
import type { ReactNode } from 'react'

describe('DataServiceProvider', () => {
  let service: AetherDataService

  beforeEach(() => {
    vi.useFakeTimers()
    service = createMockDataService()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function wrapper({ children }: { children: ReactNode }) {
    return <DataServiceProvider service={service}>{children}</DataServiceProvider>
  }

  it('useTelemetry returns initial telemetry state', () => {
    const { result } = renderHook(() => useTelemetry(), { wrapper })
    expect(result.current.plant).toBeDefined()
    expect(result.current.env).toBeDefined()
    expect(result.current.esg.overall).toBeGreaterThan(0)
    expect(Array.isArray(result.current.activeAlerts)).toBe(true)
    expect(typeof result.current.lastUpdated).toBe('number')
  })

  it('useTelemetry updates on tick', () => {
    const { result } = renderHook(() => useTelemetry(), { wrapper })
    const initialTimestamp = result.current.plant.timestamp
    act(() => { vi.advanceTimersByTime(2100) })
    expect(result.current.plant.timestamp).not.toBe(initialTimestamp)
  })

  it('useAetherService returns the service instance', () => {
    const { result } = renderHook(() => useAetherService(), { wrapper })
    expect(typeof result.current.getBatches).toBe('function')
    const batches = result.current.getBatches()
    expect(!(batches instanceof Promise)).toBe(true)
    if (!(batches instanceof Promise)) expect(batches.length).toBeGreaterThan(0)
  })

  it('useDataService throws outside provider', () => {
    expect(() => {
      renderHook(() => useDataService())
    }).toThrow('useDataService must be used within DataServiceProvider')
  })

  it('dismissAlert updates the alert list', () => {
    const { result } = renderHook(() => useDataService(), { wrapper })
    act(() => { vi.advanceTimersByTime(60000) })
    const alerts = result.current.telemetry.activeAlerts
    if (alerts.length > 0) {
      const id = alerts[0].id
      act(() => { result.current.dismissAlert(id) })
      expect(result.current.telemetry.activeAlerts.find(a => a.id === id)).toBeUndefined()
    }
  })

  it('dismissAllAlerts clears all alerts', () => {
    const { result } = renderHook(() => useDataService(), { wrapper })
    act(() => { vi.advanceTimersByTime(60000) })
    act(() => { result.current.dismissAllAlerts() })
    expect(result.current.telemetry.activeAlerts.length).toBe(0)
  })
})
