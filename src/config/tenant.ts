/**
 * Project-level tenant configuration.
 *
 * Resolved from VITE_PROJECT_ID env var (default: 'caldeira').
 * When a second project is onboarded, add a new site config under
 * shared/sites/ and register it in the TENANTS map below.
 */

import type { ViewMode } from '../types/telemetry'
import { CALDEIRA_IDENTITY, CALDEIRA_GEO } from 'shared/sites/caldeira'

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

const CALDEIRA_TENANT: TenantConfig = {
  projectId: CALDEIRA_IDENTITY.siteId,
  projectName: CALDEIRA_IDENTITY.projectName,
  companyName: CALDEIRA_IDENTITY.companyName,
  mapCenter: CALDEIRA_GEO.center,
  mapZoom: CALDEIRA_GEO.defaultZoom,
  mapPitch: CALDEIRA_GEO.defaultPitch,
  accentColor: CALDEIRA_IDENTITY.accentColor,
  availableViews: ['operator'],
  defaultView: 'operator',
}

const TENANTS: Record<string, TenantConfig> = {
  caldeira: CALDEIRA_TENANT,
}

function getProjectId(): string {
  return (import.meta.env.VITE_PROJECT_ID as string | undefined)?.trim() || 'caldeira'
}

export function getTenantConfig(): TenantConfig {
  const id = getProjectId()
  const config = TENANTS[id]
  if (!config) {
    console.warn(`[tenant] Unknown project "${id}", falling back to caldeira`)
    return CALDEIRA_TENANT
  }
  return config
}

export const tenant = getTenantConfig()
