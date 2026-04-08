/**
 * Validated Vite env for live backend wiring.
 * Add parsers here as real services land; avoid scattering import.meta.env reads.
 */

export type DataMode = 'mock' | 'live'

export function getDataMode(): DataMode {
  const m = (import.meta.env.VITE_DATA_MODE as string | undefined)?.toLowerCase()
  return m === 'live' ? 'live' : 'mock'
}

export function getApiBaseUrl(): string | undefined {
  const u = import.meta.env.VITE_API_BASE_URL as string | undefined
  return u && u.trim() !== '' ? u.trim() : undefined
}

export function getWsUrl(): string | undefined {
  const u = import.meta.env.VITE_WS_URL as string | undefined
  return u && u.trim() !== '' ? u.trim() : undefined
}

/** Stakeholder demo: tighter banner copy + emphasis on provenance footers */
export function getPresentationMode(): boolean {
  const v = import.meta.env.VITE_PRESENTATION_MODE as string | undefined
  return v === '1' || v === 'true'
}

/** IR disclosure mode: hides simulated telemetry, shows board-approved facts only */
export function getDisclosureMode(): boolean {
  const v = import.meta.env.VITE_DISCLOSURE_MODE as string | undefined
  return v === '1' || v === 'true'
}

/** Startup checks for required Vite env. Warns in development when values are missing. */
export function validateEnv(): { warnings: string[] } {
  const warnings: string[] = []
  const maptiler = (import.meta.env.VITE_MAPTILER_KEY as string | undefined)?.trim()
  if (!maptiler) {
    const msg = 'VITE_MAPTILER_KEY is not set; MapTiler map tiles may not load.'
    warnings.push(msg)
    if (import.meta.env.DEV) {
      console.warn(`[env] ${msg}`)
    }
  }
  return { warnings }
}
