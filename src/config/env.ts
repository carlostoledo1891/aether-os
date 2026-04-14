/**
 * Validated Vite env for live backend wiring.
 * Add parsers here as real services land; avoid scattering import.meta.env reads.
 */

export type DataMode = 'mock' | 'live'

export interface RuntimeConfig {
  dataMode: DataMode
  apiBaseUrl?: string
  wsBaseUrl?: string
  presentationMode: boolean
  disclosureMode: boolean
}

function readOptionalEnv(name: string): string | undefined {
  const value = import.meta.env[name] as string | undefined
  if (!value) return undefined
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

function isHostedRuntime(): boolean {
  if (typeof location === 'undefined') return false
  return !['localhost', '127.0.0.1'].includes(location.hostname)
}

function isValidHttpUrl(value: string): boolean {
  return /^https?:\/\/\S+$/i.test(value)
}

function isValidWsUrl(value: string): boolean {
  return /^wss?:\/\/\S+$/i.test(value)
}

export function getDataMode(): DataMode {
  const m = readOptionalEnv('VITE_DATA_MODE')?.toLowerCase()
  return m === 'live' ? 'live' : 'mock'
}

export function getApiBaseUrl(): string | undefined {
  const apiBase = readOptionalEnv('VITE_API_BASE_URL')
  return apiBase ? trimTrailingSlash(apiBase) : undefined
}

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const apiBase = getApiBaseUrl()
  return apiBase ? `${apiBase}${normalizedPath}` : normalizedPath
}

export function getWsUrl(): string | undefined {
  const explicitWs = readOptionalEnv('VITE_WS_URL')
  if (explicitWs) return trimTrailingSlash(explicitWs)

  const apiBase = getApiBaseUrl()
  if (!apiBase) return undefined
  if (apiBase.startsWith('https://')) return `wss://${apiBase.slice('https://'.length)}`
  if (apiBase.startsWith('http://')) return `ws://${apiBase.slice('http://'.length)}`
  return undefined
}

export function buildWsTelemetryUrl(): string {
  const wsBase = getWsUrl()
  if (wsBase) {
    return wsBase.endsWith('/ws') ? `${wsBase}/telemetry` : `${wsBase}/ws/telemetry`
  }
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${location.host}/ws/telemetry`
}

/** Stakeholder demo: tighter banner copy + emphasis on provenance footers */
export function getPresentationMode(): boolean {
  const v = readOptionalEnv('VITE_PRESENTATION_MODE')
  return v === '1' || v === 'true'
}

/** IR disclosure mode: hides simulated telemetry, shows board-approved facts only */
export function getDisclosureMode(): boolean {
  const v = readOptionalEnv('VITE_DISCLOSURE_MODE')
  return v === '1' || v === 'true'
}

export function getRuntimeConfig(): RuntimeConfig {
  return {
    dataMode: getDataMode(),
    apiBaseUrl: getApiBaseUrl(),
    wsBaseUrl: getWsUrl(),
    presentationMode: getPresentationMode(),
    disclosureMode: getDisclosureMode(),
  }
}

/** Startup checks for required Vite env. Warns in development when values are missing. */
export function validateEnv(): { warnings: string[] } {
  const warnings: string[] = []
  const maptiler = readOptionalEnv('VITE_MAPTILER_KEY')
  const apiBaseUrl = getApiBaseUrl()
  const explicitWsUrl = readOptionalEnv('VITE_WS_URL')
  if (!maptiler) {
    const msg = 'VITE_MAPTILER_KEY is not set; MapTiler map tiles may not load.'
    warnings.push(msg)
    if (import.meta.env.DEV) {
      console.warn(`[env] ${msg}`)
    }
  }
  if (apiBaseUrl && !isValidHttpUrl(apiBaseUrl)) {
    warnings.push('VITE_API_BASE_URL must start with http:// or https://.')
  }
  if (explicitWsUrl && !isValidWsUrl(explicitWsUrl)) {
    warnings.push('VITE_WS_URL must start with ws:// or wss://.')
  }
  if (getDataMode() === 'live' && isHostedRuntime() && !apiBaseUrl) {
    warnings.push(
      'VITE_API_BASE_URL is not set; hosted live deployments fall back to same-origin /api and /ws. Only leave this empty when the host reverse-proxies those paths to the backend.',
    )
  }
  return { warnings }
}
