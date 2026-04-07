import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSimulatedTelemetry } from './useSimulatedTelemetry'

describe('useSimulatedTelemetry', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial telemetry state', () => {
    const { result } = renderHook(() => useSimulatedTelemetry())
    expect(result.current.plant).toBeTruthy()
    expect(result.current.env).toBeTruthy()
    expect(result.current.esg.overall).toBe(94)
    expect(result.current.alerts).toEqual([])
    expect(result.current.simMode.type).toBe('live')
  })

  it('provides plant and env history arrays', () => {
    const { result } = renderHook(() => useSimulatedTelemetry())
    expect(result.current.plantHistory).toHaveLength(1)
    expect(result.current.envHistory).toHaveLength(1)
  })

  it('updates telemetry on interval', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useSimulatedTelemetry())

    const initialTimestamp = result.current.plant.timestamp

    act(() => {
      vi.advanceTimersByTime(2100)
    })

    expect(result.current.plant.timestamp).not.toBe(initialTimestamp)
    expect(result.current.plantHistory.length).toBeGreaterThan(1)
  })

  it('dismissAlert marks a specific alert as dismissed', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useSimulatedTelemetry())

    // Force a pH-high alert scenario
    act(() => {
      vi.advanceTimersByTime(2100)
    })

    if (result.current.alerts.length > 0) {
      const alertId = result.current.alerts[0].id
      act(() => {
        result.current.dismissAlert(alertId)
      })
      const dismissed = result.current.alerts.find(a => a.id === alertId)
      expect(dismissed?.dismissed).toBe(true)
    }
  })

  it('dismissAllAlerts dismisses every alert', () => {
    const { result } = renderHook(() => useSimulatedTelemetry())

    act(() => {
      result.current.dismissAllAlerts()
    })

    expect(result.current.activeAlerts).toHaveLength(0)
  })

  it('setSimMode updates simulation mode', () => {
    const { result } = renderHook(() => useSimulatedTelemetry())

    act(() => {
      result.current.setSimMode({ type: 'paused' })
    })

    expect(result.current.simMode.type).toBe('paused')
  })
})
