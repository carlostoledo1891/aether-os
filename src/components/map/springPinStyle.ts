import type { SpringTelemetry } from '../../types/telemetry'

/** Circle opacity by monitoring tier — keep in sync with former HydroOverlay.tierVisual. */
export function tierCircleOpacity(tier: SpringTelemetry['monitoring_tier']): number {
  if (tier === 'direct') return 0.94
  if (tier === 'sentinel_proxy') return 0.82
  return 0.62
}

/** Radius multiplier by tier — keep in sync with former HydroOverlay.tierVisual. */
export function tierRadiusMul(tier: SpringTelemetry['monitoring_tier']): number {
  if (tier === 'direct') return 1.14
  if (tier === 'sentinel_proxy') return 1.02
  return 0.9
}

export function springStatusBaseRadius(status: SpringTelemetry['status']): number {
  if (status === 'Suppressed') return 4.3
  if (status === 'Reduced') return 3.9
  return 3.5
}

export function springPinRadiusPx(
  status: SpringTelemetry['status'],
  tier: SpringTelemetry['monitoring_tier'],
): number {
  return springStatusBaseRadius(status) * tierRadiusMul(tier)
}

/**
 * Default spring dot radius (px) — Active + `modeled_inferred`, same fallback as HydroOverlay
 * when telemetry uses `?? 'modeled_inferred'` / `?? 'Active'`.
 */
export const HYDRO_SPRING_PIN_RADIUS_DEFAULT_PX = springPinRadiusPx('Active', 'modeled_inferred')
