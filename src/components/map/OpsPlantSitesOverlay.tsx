import { memo, useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { W } from '../../app/canvas/canvasTheme'
import {
  useGeoJsonFeatureCollection,
  type Feature,
  type FeatureCollection,
  type FeatureProperties,
  type PointGeometry,
} from './geojson'
import { GEO } from '../../data/geo/registry'

interface OpsPlantProperties extends FeatureProperties {
  id: string
  label: string
  sublabel: string
  kind: string
  status: string
  details?: string
  source_ref?: string
  as_of?: string
  confidence?: string
}

type OpsPlantFeature = Feature<OpsPlantProperties, PointGeometry>

/** Interactive hit target for pilot + commercial plant collars (terrain-accurate ops layer). */
export const OPS_PLANT_SITE_CORE_LAYER_ID = 'ops-plant-site-core'

interface OpsPlantSitesOverlayProps {
  hoveredId?: string | null
  selectedId?: string | null
}

export const OpsPlantSitesOverlay = memo(function OpsPlantSitesOverlay({
  hoveredId = null,
  selectedId = null,
}: OpsPlantSitesOverlayProps) {
  const { data: raw } = useGeoJsonFeatureCollection<OpsPlantFeature>(GEO.plantSites.url)

  const data = useMemo<FeatureCollection<OpsPlantFeature> | null>(() => {
    if (!raw) return null
    return {
      type: 'FeatureCollection',
      features: raw.features.map((f) => {
        const h = f.properties.id === hoveredId
        const s = f.properties.id === selectedId
        return {
          ...f,
          properties: {
            ...f.properties,
            dotColor: W.green,
            dotRadius: 10,
            dotOpacity: s ? 1 : h ? 0.95 : 0.88,
          },
        }
      }),
    }
  }, [raw, hoveredId, selectedId])

  if (!data) return null

  return (
    <Source id="ops-plant-sites-source" type="geojson" data={data}>
      <Layer
        id="ops-plant-site-glow"
        type="circle"
        paint={{
          'circle-color': ['get', 'dotColor'],
          'circle-radius': ['*', ['get', 'dotRadius'], 2.1],
          'circle-opacity': 0.14,
          'circle-blur': 1,
        }}
      />
      <Layer
        id={OPS_PLANT_SITE_CORE_LAYER_ID}
        type="circle"
        paint={{
          'circle-color': ['get', 'dotColor'],
          'circle-radius': ['get', 'dotRadius'],
          'circle-opacity': ['get', 'dotOpacity'],
          'circle-stroke-color': W.mapHalo,
          'circle-stroke-width': 2,
        }}
      />
      <Layer
        id="ops-plant-site-label"
        type="symbol"
        layout={{
          'text-field': ['get', 'label'],
          'text-size': 10,
          'text-font': ['Open Sans Semibold'],
          'text-anchor': 'top',
          'text-offset': [0, 1],
          'text-allow-overlap': false,
        }}
        paint={{
          'text-color': ['get', 'dotColor'],
          'text-halo-color': W.mapHalo,
          'text-halo-width': 1.5,
          'text-opacity': 0.92,
        }}
      />
    </Source>
  )
})
