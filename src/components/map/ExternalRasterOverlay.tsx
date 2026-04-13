/**
 * ExternalRasterOverlay — renders any external raster source from SiteExternalLayer config.
 *
 * Supports arcgis-rest, wms, and xyz-raster source types. The URL template
 * must use {bbox-epsg-3857} for WMS/ArcGIS or {z}/{x}/{y} for XYZ tiles.
 */

import { memo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'
import type { SiteExternalLayer } from 'shared/sites/types'

interface ExternalRasterOverlayProps {
  config: SiteExternalLayer
  opacity?: number
}

export const ExternalRasterOverlay = memo(function ExternalRasterOverlay({
  config,
  opacity = 0.7,
}: ExternalRasterOverlayProps) {
  if (!config.url) return null

  return (
    <Source
      id={`ext-${config.id}`}
      type="raster"
      tiles={[config.url]}
      tileSize={256}
      attribution={config.attribution}
      maxzoom={14}
    >
      <Layer
        id={`ext-layer-${config.id}`}
        type="raster"
        paint={{ 'raster-opacity': opacity }}
      />
    </Source>
  )
})
