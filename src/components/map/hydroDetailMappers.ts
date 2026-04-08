import type { SpringTelemetry } from '../../types/telemetry'

export type HydroNodeType = 'piezometer' | 'udc' | 'mine' | 'plant' | 'spring'

export interface HydroOverlayNodeDetail {
  id: string
  label: string
  sublabel: string
  nodeType: HydroNodeType
  metric: string
  statusLabel: string
  coordinates: [number, number]
  monitoringTier?: SpringTelemetry['monitoring_tier']
  method?: string
  lastFieldVisit?: string
  linkedSensorId?: string
  dataSources?: string[]
}

type SpringStatus = 'Active' | 'Reduced' | 'Suppressed'

/** @internal — exported for unit tests */
export function tierShort(t: SpringTelemetry['monitoring_tier']): string {
  if (t === 'direct') return 'Direct'
  if (t === 'sentinel_proxy') return 'Sentinel'
  return 'Inferred'
}

export function toSpringDetail(
  properties: Record<string, unknown>,
  coordinates: [number, number] | undefined,
  telem: SpringTelemetry | undefined,
): HydroOverlayNodeDetail | null {
  const id = properties.id
  if (typeof id !== 'string') return null
  const name = String(properties.name ?? id)
  const municipio = properties.municipio ? String(properties.municipio) : ''
  const car = properties.car_registered ? 'CAR registered' : 'CAR pending'
  const sublabel = municipio ? `${municipio} · ${car}` : car
  const status = telem?.status ?? (properties.status as SpringStatus | undefined) ?? 'Active'
  const tier = telem?.monitoring_tier ?? 'modeled_inferred'
  return {
    id,
    label: name,
    sublabel,
    nodeType: 'spring',
    metric: `${tierShort(tier)} · ${telem?.method ?? 'hydro_model_v1'}`,
    statusLabel: String(status),
    coordinates: coordinates ?? [0, 0],
    monitoringTier: tier,
    method: telem?.method,
    lastFieldVisit: telem?.last_field_visit,
    linkedSensorId: telem?.linked_sensor_id,
    dataSources: telem?.data_sources,
  }
}

export function toHydroNodeDetail(
  properties: Record<string, unknown>,
  coordinates?: [number, number],
): HydroOverlayNodeDetail | null {
  const id = properties.id
  if (typeof id !== 'string') return null
  return {
    id,
    label: String(properties.label ?? ''),
    sublabel: String(properties.sublabel ?? ''),
    nodeType: (properties.nodeType ?? 'piezometer') as HydroNodeType,
    metric: String(properties.metric ?? ''),
    statusLabel: String(properties.statusLabel ?? ''),
    coordinates: coordinates ?? [0, 0],
  }
}

export type HydroWeatherStripModel = {
  loading: boolean
  error: string | null
  windowPrecipMm: number
  anomalyMm: number
  source: 'openmeteo' | 'mock'
  scenarioDroughtIndex: number
  scenarioHorizon: string
}
