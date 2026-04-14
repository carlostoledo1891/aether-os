import { memo, useEffect } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import type { SiteExternalLayer } from 'shared/sites/types'
import { getExternalSnapshotInteractiveLayerIds, getExternalSnapshotLayer } from '../../data/geo/externalRegistry'
import { useGeoJsonFeatureCollection } from './geojson'
import { publishLayerHealth } from './layerHealth'
import type { LayerId } from './layerRegistry'

interface ExternalSnapshotOverlayProps {
  config: SiteExternalLayer
}

export const ExternalSnapshotOverlay = memo(function ExternalSnapshotOverlay({
  config,
}: ExternalSnapshotOverlayProps) {
  const snapshot = getExternalSnapshotLayer(config.id)
  const { data, state } = useGeoJsonFeatureCollection(snapshot?.url ?? '')

  useEffect(() => {
    publishLayerHealth(config.id as LayerId, {
      state: state.status === 'idle' ? 'idle' : state.status === 'ready' ? 'ready' : state.status === 'loading' ? 'loading' : 'error',
      featureCount: state.featureCount,
      loadedAt: state.loadedAt,
      error: state.error,
    })
  }, [config.id, state.error, state.featureCount, state.loadedAt, state.status])

  if (!snapshot || !data) return null

  if (snapshot.kind === 'point') {
    const [circleLayerId] = getExternalSnapshotInteractiveLayerIds(config.id)
    return (
      <Source
        id={snapshot.sourceId}
        type="geojson"
        data={data}
        attribution={config.attribution || snapshot.attribution}
      >
        <Layer
          id={circleLayerId}
          type="circle"
          paint={{
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              8, 3,
              11, 4.5,
              14, 6.5,
            ],
            'circle-color': snapshot.circleColor ?? '#22d3ee',
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.9,
          }}
        />
      </Source>
    )
  }

  const [fillLayerId, lineLayerId] = getExternalSnapshotInteractiveLayerIds(config.id)
  return (
    <Source
      id={snapshot.sourceId}
      type="geojson"
      data={data}
      attribution={config.attribution || snapshot.attribution}
    >
      <Layer
        id={fillLayerId}
        type="fill"
        paint={{
          'fill-color': snapshot.fillColor ?? 'rgba(124,92,252,0.08)',
          'fill-opacity': 1,
        }}
      />
      <Layer
        id={lineLayerId}
        type="line"
        paint={{
          'line-color': snapshot.lineColor ?? 'rgba(124,92,252,0.92)',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, 0.6,
            12, 1,
            15, 1.4,
          ],
          'line-opacity': 0.82,
        }}
      />
    </Source>
  )
})
