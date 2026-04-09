import { describe, it, expect, afterEach, vi } from 'vitest'
import { getDataMode, getWsUrl, getPresentationMode, validateEnv } from './env'

describe('env', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('getDataMode defaults to mock', () => {
    vi.stubEnv('VITE_DATA_MODE', '')
    expect(getDataMode()).toBe('mock')
  })

  it('getDataMode accepts live (case-insensitive)', () => {
    vi.stubEnv('VITE_DATA_MODE', 'LIVE')
    expect(getDataMode()).toBe('live')
  })

  it('getWsUrl trims and drops empty', () => {
    vi.stubEnv('VITE_WS_URL', '')
    expect(getWsUrl()).toBeUndefined()
    vi.stubEnv('VITE_WS_URL', 'wss://h.test')
    expect(getWsUrl()).toBe('wss://h.test')
  })

  it('getPresentationMode reads VITE_PRESENTATION_MODE', () => {
    vi.stubEnv('VITE_PRESENTATION_MODE', '')
    expect(getPresentationMode()).toBe(false)
    vi.stubEnv('VITE_PRESENTATION_MODE', '1')
    expect(getPresentationMode()).toBe(true)
  })

  it("getPresentationMode is true when VITE_PRESENTATION_MODE is 'true'", () => {
    vi.stubEnv('VITE_PRESENTATION_MODE', 'true')
    expect(getPresentationMode()).toBe(true)
  })

  it('validateEnv returns a warning when VITE_MAPTILER_KEY is missing', () => {
    vi.stubEnv('VITE_MAPTILER_KEY', '')
    const { warnings } = validateEnv()
    expect(warnings.length).toBe(1)
    expect(warnings[0]).toMatch(/VITE_MAPTILER_KEY/)
  })

  it('validateEnv returns no warnings when VITE_MAPTILER_KEY is set', () => {
    vi.stubEnv('VITE_MAPTILER_KEY', 'pk.test')
    const { warnings } = validateEnv()
    expect(warnings).toEqual([])
  })
})
