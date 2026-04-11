/**
 * Lightweight feature flags resolved from VITE_FEATURE_* env vars.
 *
 * Each flag defaults to `true` (enabled) unless explicitly set to '0' or 'false'.
 * This allows progressive feature gating per deployment without a feature flag service.
 */

function flag(name: string, defaultValue = true): boolean {
  const raw = (import.meta.env[`VITE_FEATURE_${name}`] as string | undefined)?.trim()
  if (raw === undefined || raw === '') return defaultValue
  return raw !== '0' && raw !== 'false'
}

export const features = {
  chat: flag('CHAT'),
  reports: flag('REPORTS'),
  controlRoom: flag('CONTROL_ROOM'),
  aiAgent: flag('AI_AGENT'),
  alerts: flag('ALERTS'),
  mapSatellite: flag('MAP_SATELLITE'),
} as const

export type FeatureKey = keyof typeof features
