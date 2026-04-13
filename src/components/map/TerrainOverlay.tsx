/**
 * TerrainOverlay — free 3D terrain + optional hillshade layer.
 *
 * Uses AWS Terrarium DEM tiles (no API key required) as a fallback
 * when MapTiler is unavailable.  When MapTiler IS available it defers
 * to the StyleController DEM source already wired in MapBase.
 *
 * The hillshade layer is a separate toggle so it can be turned on/off
 * independently from 3D terrain exaggeration.
 */

import { useEffect, memo } from 'react'
import { useMap, Source, Layer } from 'react-map-gl/maplibre'

const TERRARIUM_SOURCE_ID = 'terrain-dem-free'
const HILLSHADE_LAYER_ID = 'hillshade-free'

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string | undefined
const HAS_TILER = !!(MAPTILER_KEY && MAPTILER_KEY !== 'your_maptiler_key_here')

interface TerrainOverlayProps {
  mapId?: string
  terrain?: boolean
  hillshade?: boolean
  exaggeration?: number
}

export const TerrainOverlay = memo(function TerrainOverlay({
  mapId,
  terrain = false,
  hillshade = false,
  exaggeration = 1.4,
}: TerrainOverlayProps) {
  const maps = useMap()

  useEffect(() => {
    const mapRef = mapId
      ? (maps[mapId as keyof typeof maps] ?? maps.current)
      : maps.current
    if (!mapRef) return
    const map = (mapRef as { getMap(): maplibregl.Map }).getMap()

    const apply = () => {
      if (terrain) {
        const sourceId = HAS_TILER ? 'terrain-dem' : TERRARIUM_SOURCE_ID
        if (map.getSource(sourceId)) {
          map.setTerrain({ source: sourceId, exaggeration } as never)
        }
      } else {
        try { map.setTerrain(null as never) } catch { /* no terrain to clear */ }
      }
    }

    if (map.isStyleLoaded()) apply()
    else { map.once('load', apply) }
  }, [maps, mapId, terrain, exaggeration])

  if (HAS_TILER) {
    return hillshade ? (
      <Layer
        id={HILLSHADE_LAYER_ID}
        type="hillshade"
        source="terrain-dem"
        paint={{
          'hillshade-exaggeration': 0.35,
          'hillshade-shadow-color': 'rgba(0,0,0,0.5)',
          'hillshade-highlight-color': 'rgba(255,255,255,0.15)',
        }}
        beforeId="waterway"
      />
    ) : null
  }

  const needSource = terrain || hillshade
  if (!needSource) return null

  return (
    <Source
      id={TERRARIUM_SOURCE_ID}
      type="raster-dem"
      tiles={['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png']}
      tileSize={256}
      encoding="terrarium"
      maxzoom={15}
      attribution="© Mapzen, AWS"
    >
      {hillshade && (
        <Layer
          id={HILLSHADE_LAYER_ID}
          type="hillshade"
          paint={{
            'hillshade-exaggeration': 0.35,
            'hillshade-shadow-color': 'rgba(0,0,0,0.5)',
            'hillshade-highlight-color': 'rgba(255,255,255,0.15)',
          }}
        />
      )}
    </Source>
  )
})
