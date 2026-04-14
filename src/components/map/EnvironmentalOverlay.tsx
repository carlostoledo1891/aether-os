import { memo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { W } from '../../app/canvas/canvasTheme'
import { useGeoJsonFeatureCollection } from './geojson'
import { GEO } from '../../data/geo/registry'

export const ENV_APA_FILL_LAYER_ID = 'env-apa-fill'
export const ENV_BUFFER_FILL_LAYER_ID = 'env-buffer-fill'
export const ENV_MONITORING_FILL_LAYER_ID = 'env-monitoring-fill'
export const ENV_URBAN_FILL_LAYER_ID = 'env-urban-fill'
/** City centroid (Point) — interactive on Hydro tab when urban layer on */
export const ENV_URBAN_CENTROID_CORE_LAYER_ID = 'env-urban-centroid-core'

export interface EnvironmentalOverlayProps {
  showApa?: boolean
  showBuffer?: boolean
  showMonitoring?: boolean
  showUrban?: boolean
}

export const ApaOverlay = memo(function ApaOverlay() {
  const { data: apa } = useGeoJsonFeatureCollection(GEO.apa.url)
  if (!apa) return null

  return (
    <Source id="caldeira-env-apa" type="geojson" data={apa}>
      <Layer
        id={ENV_APA_FILL_LAYER_ID}
        type="fill"
        filter={['==', ['get', 'kind'], 'protected-area']}
        paint={{ 'fill-color': W.cyan, 'fill-opacity': 0.06 }}
      />
      <Layer
        id="env-apa-line"
        type="line"
        filter={['==', ['get', 'kind'], 'protected-area']}
        paint={{
          'line-color': W.cyan,
          'line-width': 1,
          'line-opacity': 0.55,
        }}
      />
      <Layer
        id="env-apa-label"
        type="symbol"
        filter={['==', ['get', 'kind'], 'protected-area']}
        layout={{
          'text-field': ['get', 'label'],
          'text-font': ['Open Sans Semibold'],
          'text-size': 10,
          'text-allow-overlap': true,
        }}
        paint={{
          'text-color': 'rgba(0,212,200,0.75)',
          'text-halo-color': 'rgba(6,6,16,0.95)',
          'text-halo-width': 1.2,
        }}
      />
    </Source>
  )
})

export const BufferOverlay = memo(function BufferOverlay() {
  const { data: buffer } = useGeoJsonFeatureCollection(GEO.buffer.url)
  if (!buffer) return null

  return (
    <Source id="caldeira-env-buffer" type="geojson" data={buffer}>
      <Layer
        id={ENV_BUFFER_FILL_LAYER_ID}
        type="fill"
        filter={['==', ['get', 'kind'], 'buffer-zone']}
        paint={{ 'fill-color': W.cyan, 'fill-opacity': 0.03 }}
      />
      <Layer
        id="env-buffer-line"
        type="line"
        filter={['==', ['get', 'kind'], 'buffer-zone']}
        paint={{
          'line-color': W.cyan,
          'line-width': 1,
          'line-opacity': 0.35,
          'line-dasharray': [4, 4],
        }}
      />
    </Source>
  )
})

export const MonitoringOverlay = memo(function MonitoringOverlay() {
  const { data: monitoring } = useGeoJsonFeatureCollection(GEO.monitoring.url)
  if (!monitoring) return null

  return (
    <Source id="caldeira-env-monitoring" type="geojson" data={monitoring}>
      <Layer
        id={ENV_MONITORING_FILL_LAYER_ID}
        type="fill"
        filter={['==', ['get', 'kind'], 'monitoring-zone']}
        paint={{ 'fill-color': W.cyan, 'fill-opacity': 0.06 }}
      />
      <Layer
        id="env-monitoring-line"
        type="line"
        filter={['==', ['get', 'kind'], 'monitoring-zone']}
        paint={{
          'line-color': W.cyan,
          'line-width': 1.2,
          'line-opacity': 0.5,
          'line-dasharray': [3, 2.5],
        }}
      />
    </Source>
  )
})

export const UrbanOverlay = memo(function UrbanOverlay() {
  const { data: urban } = useGeoJsonFeatureCollection(GEO.urban.url)
  if (!urban) return null

  return (
    <Source id="caldeira-env-urban" type="geojson" data={urban}>
      <Layer
        id={ENV_URBAN_FILL_LAYER_ID}
        type="fill"
        filter={['==', ['get', 'kind'], 'urban-context']}
        paint={{ 'fill-color': W.text1, 'fill-opacity': 0.04 }}
      />
      <Layer
        id="env-urban-line"
        type="line"
        filter={['==', ['get', 'kind'], 'urban-context']}
        paint={{
          'line-color': 'rgba(236,236,248,0.35)',
          'line-width': 1,
          'line-opacity': 0.5,
          'line-dasharray': [2, 2],
        }}
      />
      <Layer
        id="env-urban-label"
        type="symbol"
        filter={['==', ['get', 'kind'], 'urban-context']}
        layout={{
          'text-field': ['get', 'label'],
          'text-size': 9,
          'text-font': ['Open Sans Regular'],
        }}
        paint={{
          'text-color': 'rgba(236,236,248,0.5)',
          'text-halo-color': W.mapHalo,
          'text-halo-width': 1,
        }}
      />
      <Layer
        id="env-urban-centroid-glow"
        type="circle"
        filter={['==', ['get', 'kind'], 'urban-centroid']}
        paint={{
          'circle-radius': 14,
          'circle-color': W.text1,
          'circle-opacity': 0.08,
        }}
      />
      <Layer
        id={ENV_URBAN_CENTROID_CORE_LAYER_ID}
        type="circle"
        filter={['==', ['get', 'kind'], 'urban-centroid']}
        paint={{
          'circle-radius': 6,
          'circle-color': W.mapSecondary,
          'circle-opacity': 0.55,
          'circle-stroke-color': W.mapHalo,
          'circle-stroke-width': 1.5,
        }}
      />
      <Layer
        id="env-urban-centroid-label"
        type="symbol"
        filter={['==', ['get', 'kind'], 'urban-centroid']}
        layout={{
          'text-field': ['get', 'label'],
          'text-size': 9,
          'text-offset': [0, 1.15],
          'text-font': ['Open Sans Regular'],
        }}
        paint={{
          'text-color': 'rgba(236,236,248,0.55)',
          'text-halo-color': W.mapHalo,
          'text-halo-width': 1.2,
        }}
      />
    </Source>
  )
})

export const EnvironmentalOverlay = memo(function EnvironmentalOverlay({
  showApa = true,
  showBuffer = true,
  showMonitoring = true,
  showUrban = false,
}: EnvironmentalOverlayProps) {
  return (
    <>
      {showApa && <ApaOverlay />}
      {showBuffer && <BufferOverlay />}
      {showMonitoring && <MonitoringOverlay />}
      {showUrban && <UrbanOverlay />}
    </>
  )
})

/** Parse GeoJSON feature props for map inspector (APA, buffer, monitoring, urban). */
export function parseEnvMapFeature(properties: Record<string, unknown>): {
  id: string
  label: string
  kind: string
  note: string
  source_ref: string
  as_of: string
  confidence?: string
  sublabel?: string
  authority?: string
  municipality?: string
  state?: string
  area_ha?: number
  perimeter_km?: number
  description?: string
} | null {
  const id = properties.id
  if (typeof id !== 'string') return null
  const pop = properties.population_approx
  const popNote = typeof pop === 'number' ? `~${pop.toLocaleString()} population (approx.)` : ''
  const baseNote = String(properties.note ?? '')
  const note = [baseNote, popNote].filter(Boolean).join(' · ')

  return {
    id,
    label: String(properties.label ?? ''),
    kind: String(properties.kind ?? ''),
    note,
    source_ref: String(properties.source_ref ?? ''),
    as_of: String(properties.as_of ?? ''),
    confidence: properties.confidence ? String(properties.confidence) : undefined,
    sublabel: properties.sublabel ? String(properties.sublabel) : undefined,
    authority: properties.authority ? String(properties.authority) : undefined,
    municipality: properties.municipality ? String(properties.municipality) : undefined,
    state: properties.state ? String(properties.state) : undefined,
    area_ha: typeof properties.area_ha === 'number' ? properties.area_ha : undefined,
    perimeter_km: typeof properties.perimeter_km === 'number' ? properties.perimeter_km : undefined,
    description: properties.description ? String(properties.description) : undefined,
  }
}
