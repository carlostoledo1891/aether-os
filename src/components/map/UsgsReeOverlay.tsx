/**
 * UsgsReeOverlay — USGS Rare Earth Element deposit locations via WMS.
 *
 * Free, no API key required.  Shows Caldeira in the global context of
 * known REE deposits — a powerful visual for geological stakeholders.
 *
 * Source: https://mrdata.usgs.gov/services/ree
 */

import { memo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'

export const USGS_REE_LAYER_ID = 'usgs-ree'

const TILE_TEMPLATE =
  'https://mrdata.usgs.gov/services/ree?' +
  'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap' +
  '&LAYERS=REE&SRS=EPSG:3857' +
  '&BBOX={bbox-epsg-3857}' +
  '&WIDTH=256&HEIGHT=256' +
  '&FORMAT=image/png&TRANSPARENT=TRUE'

interface UsgsReeOverlayProps {
  opacity?: number
}

export const UsgsReeOverlay = memo(function UsgsReeOverlay({
  opacity = 0.75,
}: UsgsReeOverlayProps) {
  return (
    <Source
      id="usgs-ree"
      type="raster"
      tiles={[TILE_TEMPLATE]}
      tileSize={256}
      attribution="© USGS MRData"
      maxzoom={10}
    >
      <Layer
        id={USGS_REE_LAYER_ID}
        type="raster"
        paint={{ 'raster-opacity': opacity }}
      />
    </Source>
  )
})
