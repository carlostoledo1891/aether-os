/**
 * Project-level tenant configuration.
 *
 * Resolved from VITE_PROJECT_ID env var (default: 'caldeira').
 * When a second project is onboarded, add a new config block here
 * and set VITE_PROJECT_ID in the deployment environment.
 */

import type { ViewMode } from '../types/telemetry'

export interface TenantConfig {
  projectId: string
  projectName: string
  companyName: string
  mapCenter: [lng: number, lat: number]
  mapZoom: number
  mapPitch: number
  accentColor: string
  availableViews: ViewMode[]
  defaultView: ViewMode
}

const CALDEIRA: TenantConfig = {
  projectId: 'caldeira',
  projectName: 'Caldeira Project',
  companyName: 'Meteoric Resources',
  mapCenter: [-46.56, -21.88],
  mapZoom: 11.5,
  mapPitch: 35,
  accentColor: '#7C5CFC',
  availableViews: ['operator', 'buyer', 'executive'],
  defaultView: 'operator',
}

const TENANTS: Record<string, TenantConfig> = {
  caldeira: CALDEIRA,
}

function getProjectId(): string {
  return (import.meta.env.VITE_PROJECT_ID as string | undefined)?.trim() || 'caldeira'
}

export function getTenantConfig(): TenantConfig {
  const id = getProjectId()
  const config = TENANTS[id]
  if (!config) {
    console.warn(`[tenant] Unknown project "${id}", falling back to caldeira`)
    return CALDEIRA
  }
  return config
}

export const tenant = getTenantConfig()
