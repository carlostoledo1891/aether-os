/**
 * Maritime ISR instance — the second live Vero use case, demonstrating
 * the substrate works outside mining. Demo persona is the fictional
 * "Atlantic Coast Maritime Authority". Camera preset opens over the
 * mid-Atlantic coast (Hampton Roads / Chesapeake area) where the AOI
 * polygons cluster.
 */

import type { Lens } from 'shared/units/types'
import type { InstanceConfig } from './types'

const MARITIME_LENS_PATROL: Lens = {
  id: 'patrol',
  label: 'Patrol',
  unitTypes: ['vessel', 'maritime_aoi', 'sensor_station'],
  kpiMetrics: ['vessel.count', 'maritime_aoi.count', 'sensor_station.nominal'],
}

const MARITIME_LENS_VESSELS: Lens = {
  id: 'vessels',
  label: 'Vessels',
  unitTypes: ['vessel'],
  kpiMetrics: ['vessel.tracked', 'vessel.dark', 'vessel.cleared'],
}

const MARITIME_LENS_SENSORS: Lens = {
  id: 'sensors',
  label: 'Sensors',
  unitTypes: ['sensor_station', 'maritime_aoi'],
  kpiMetrics: ['sensor_station.nominal', 'sensor_station.degraded'],
}

const MARITIME_LENS_ALERTS: Lens = {
  id: 'alerts',
  label: 'Alerts',
  unitTypes: ['incident_alert', 'vessel'],
  severityFilter: ['attention', 'action_required', 'blocked'],
  kpiMetrics: ['incident_alert.action_required', 'incident_alert.attention'],
}

const MARITIME_LENS_EVERYTHING: Lens = {
  id: 'everything-maritime',
  label: 'Everything',
  unitTypes: ['site', 'maritime_aoi', 'vessel', 'sensor_station', 'incident_alert', 'isr_product'],
  kpiMetrics: ['total.count', 'incident_alert.action_required'],
}

export const MARITIME_LENSES: Lens[] = [
  MARITIME_LENS_PATROL,
  MARITIME_LENS_VESSELS,
  MARITIME_LENS_SENSORS,
  MARITIME_LENS_ALERTS,
  MARITIME_LENS_EVERYTHING,
]

export const MARITIME_INSTANCE: InstanceConfig = {
  slug: 'maritime',
  label: 'Atlantic Maritime',
  brand: {
    brandLine: 'Atlantic Coast Maritime Authority',
    productLine: 'AOI patrol · ISR product handoff · Audit-chain reporting',
    contextLine: 'Defense / Public Sector demo instance',
  },
  cameraPreset: {
    // Mid-Atlantic coast — Hampton Roads / Chesapeake Bay mouth.
    // Wide enough to show the AOI grid + offshore vessel traffic.
    longitude: -75.7,
    latitude: 36.85,
    zoom: 7.5,
    pitch: 20,
    bearing: 0,
  },
  kpis: [
    { id: 'aois', label: 'AOIs monitored', value: '11' },
    { id: 'vessels', label: 'Vessels tracked', value: '78' },
    { id: 'dark', label: 'Dark detections (7d)', value: '4' },
    { id: 'isr', label: 'ISR bundles published', value: '3' },
  ],
  pickerCard: {
    eyebrow: 'Defense · Maritime ISR',
    title: 'Atlantic Maritime',
    description:
      'Patrol AOIs along the eastern seaboard, AIS-tracked vessel traffic, dark-vessel detections, and an audit-chained ISR product handoff bundle.',
    tenant: 'Atlantic Coast Maritime Authority (demo persona)',
    ctaLabel: 'Open Atlantic workspace',
  },
  selectable: true,
  glyph: '⚓',
  lenses: MARITIME_LENSES,
  defaultLensId: 'patrol',
}
