/**
 * CprmGeologyOverlay — CPRM/SGB (Serviço Geológico do Brasil) lithostratigraphic map.
 *
 * Uses ArcGIS REST export API (the WMS endpoint returns 500).
 * Full coverage of Minas Gerais. Free, no API key required.
 *
 * Source: https://geoportal.sgb.gov.br/server/rest/services/dados_plataforma/geologia/MapServer
 */

import { memo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'

export const CPRM_GEOLOGY_LAYER_ID = 'cprm-geology'

const TILE_TEMPLATE =
  'https://geoportal.sgb.gov.br/server/rest/services/dados_plataforma/geologia/MapServer/export' +
  '?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857' +
  '&size=256,256&format=png32&transparent=true&f=image'

interface CprmGeologyOverlayProps {
  opacity?: number
}

export const CprmGeologyOverlay = memo(function CprmGeologyOverlay({
  opacity = 0.7,
}: CprmGeologyOverlayProps) {
  return (
    <Source
      id="cprm-geology"
      type="raster"
      tiles={[TILE_TEMPLATE]}
      tileSize={256}
      attribution="Fonte: SGB/CPRM"
      maxzoom={14}
    >
      <Layer
        id={CPRM_GEOLOGY_LAYER_ID}
        type="raster"
        paint={{ 'raster-opacity': opacity }}
      />
    </Source>
  )
})
