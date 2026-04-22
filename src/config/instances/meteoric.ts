/**
 * Meteoric / Caldeira instance — the existing Vero workspace, now one of
 * many Vero use cases. The chrome the user sees inside /app/meteoric is
 * still rendered by the historical UnitPage (no behaviour change); this
 * config drives the EmptyShell picker card, the optional KPI strip, and
 * any cross-instance copy that needs to stay consistent.
 */

import { CALDEIRA_GEO } from 'shared/sites/caldeira'
import type { InstanceConfig } from './types'

export const METEORIC_INSTANCE: InstanceConfig = {
  slug: 'meteoric',
  label: 'Caldeira',
  brand: {
    brandLine: 'Meteoric Resources',
    productLine: 'Caldeira Project — Poços de Caldas, Brazil',
    contextLine: 'Critical-mineral operations',
  },
  cameraPreset: {
    longitude: CALDEIRA_GEO.center[0],
    latitude: CALDEIRA_GEO.center[1],
    zoom: CALDEIRA_GEO.defaultZoom,
    pitch: CALDEIRA_GEO.defaultPitch,
    bearing: CALDEIRA_GEO.defaultBearing,
  },
  kpis: [
    { id: 'deposits', label: 'Deposits', value: '7' },
    { id: 'drillholes', label: 'Drill holes', value: '186' },
    { id: 'springs', label: 'Springs monitored', value: '1,092' },
    { id: 'permits', label: 'Permit conditions', value: '5' },
  ],
  pickerCard: {
    eyebrow: 'Mining · Critical minerals',
    title: 'Caldeira',
    description:
      'Drill collars, license polygons, hydrology twins, and a board-pack evidence bundle. The reference deployment for Meteoric Resources.',
    tenant: 'Meteoric Resources Ltd (ASX: MEI)',
    ctaLabel: 'Open Caldeira workspace',
  },
  selectable: true,
  glyph: '⛏',
}
