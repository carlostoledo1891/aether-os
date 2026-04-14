import { describe, it, expect, afterEach, vi } from 'vitest'
import { buildApiUrl, buildWsTelemetryUrl, getApiBaseUrl, getDataMode, getPresentationMode, getRuntimeConfig, getWsUrl, validateEnv } from './env'

const originalLocation = globalThis.location

function setLocation(url: string) {
  Object.defineProperty(globalThis, 'location', {
    value: new URL(url),
    configurable: true,
  })
}

describe('env', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    Object.defineProperty(globalThis, 'location', {
      value: originalLocation,
      configurable: true,
    })
  })

  it('getDataMode defaults to mock', () => {
    vi.stubEnv('VITE_DATA_MODE', '')
    expect(getDataMode()).toBe('mock')
  })

  it('getDataMode accepts live (case-insensitive)', () => {
    vi.stubEnv('VITE_DATA_MODE', 'LIVE')
    expect(getDataMode()).toBe('live')
  })

  it('getApiBaseUrl trims trailing slash and buildApiUrl prefixes requests', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://staging-api.example.com/')
    expect(getApiBaseUrl()).toBe('https://staging-api.example.com')
    expect(buildApiUrl('/api/health')).toBe('https://staging-api.example.com/api/health')
  })

  it('getWsUrl trims and drops empty', () => {
    vi.stubEnv('VITE_WS_URL', '')
    expect(getWsUrl()).toBeUndefined()
    vi.stubEnv('VITE_WS_URL', 'wss://h.test')
    expect(getWsUrl()).toBe('wss://h.test')
  })

  it('derives websocket base and telemetry path from api base url', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://staging-api.example.com')
    vi.stubEnv('VITE_WS_URL', '')
    expect(getWsUrl()).toBe('wss://staging-api.example.com')
    expect(buildWsTelemetryUrl()).toBe('wss://staging-api.example.com/ws/telemetry')
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

  it('validateEnv warns when hosted live mode has no explicit api base url', () => {
    setLocation('https://staging.example.com/')
    vi.stubEnv('VITE_DATA_MODE', 'live')
    vi.stubEnv('VITE_MAPTILER_KEY', 'pk.test')
    vi.stubEnv('VITE_API_BASE_URL', '')
    const { warnings } = validateEnv()
    expect(warnings.some(w => w.includes('VITE_API_BASE_URL'))).toBe(true)
  })

  it('getRuntimeConfig exposes resolved api and websocket targets', () => {
    vi.stubEnv('VITE_DATA_MODE', 'live')
    vi.stubEnv('VITE_API_BASE_URL', 'https://staging-api.example.com')
    vi.stubEnv('VITE_WS_URL', '')
    expect(getRuntimeConfig()).toEqual({
      dataMode: 'live',
      apiBaseUrl: 'https://staging-api.example.com',
      wsBaseUrl: 'wss://staging-api.example.com',
      presentationMode: false,
      disclosureMode: false,
    })
  })
})
