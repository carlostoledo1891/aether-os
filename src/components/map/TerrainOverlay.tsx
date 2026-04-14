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

import { useEffect, memo, useState } from 'react'
import { useMap, Source, Layer } from 'react-map-gl/maplibre'

const TERRARIUM_SOURCE_ID = 'terrain-dem-free'
const HILLSHADE_LAYER_ID = 'hillshade-free'

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string | undefined
const HAS_TILER = !!(MAPTILER_KEY && MAPTILER_KEY !== 'your_maptiler_key_here')
const HILLSHADE_ANCHOR_CANDIDATES = [
  'waterway',
  'water',
  'water_shadow',
  'road-label',
  'place-label',
] as const

interface TerrainOverlayProps {
  mapId?: string
  terrain?: boolean
  hillshade?: boolean
  exaggeration?: number
}

export function resolveHillshadeBeforeId(
  layerIds: readonly string[],
): string | undefined {
  const layerSet = new Set(layerIds)
  return HILLSHADE_ANCHOR_CANDIDATES.find(id => layerSet.has(id))
}

export const TerrainOverlay = memo(function TerrainOverlay({
  mapId,
  terrain = false,
  hillshade = false,
  exaggeration = 1.4,
}: TerrainOverlayProps) {
  const maps = useMap()
  const [hillshadeBeforeId, setHillshadeBeforeId] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!HAS_TILER) return
    const mapRef = mapId
      ? (maps[mapId as keyof typeof maps] ?? maps.current)
      : maps.current
    if (!mapRef) return
    const map = (mapRef as { getMap(): maplibregl.Map }).getMap()

    const updateAnchor = () => {
      const layerIds = (map.getStyle().layers ?? []).map(layer => layer.id)
      setHillshadeBeforeId(resolveHillshadeBeforeId(layerIds))
    }

    if (map.isStyleLoaded()) updateAnchor()
    else map.once('load', updateAnchor)

    map.on('styledata', updateAnchor)
    return () => {
      map.off('styledata', updateAnchor)
    }
  }, [maps, mapId])

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
        beforeId={hillshadeBeforeId}
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
