/**
 * MacrostratOverlay — color-coded geological unit tiles from Macrostrat.
 *
 * Free, no API key required.  Instantly contextualizes the caldera with
 * lithology and age-coded polygons that geologists will recognise.
 *
 * Source: https://macrostrat.org/map
 */

import { memo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'

export const MACROSTRAT_LAYER_ID = 'macrostrat-carto'

interface MacrostratOverlayProps {
  opacity?: number
}

export const MacrostratOverlay = memo(function MacrostratOverlay({
  opacity = 0.55,
}: MacrostratOverlayProps) {
  return (
    <Source
      id="macrostrat-carto"
      type="raster"
      tiles={['https://tiles.macrostrat.org/carto/{z}/{x}/{y}.png']}
      tileSize={256}
      attribution="© Macrostrat"
      maxzoom={13}
    >
      <Layer
        id={MACROSTRAT_LAYER_ID}
        type="raster"
        paint={{ 'raster-opacity': opacity }}
      />
    </Source>
  )
})
