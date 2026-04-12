import { useState, useCallback } from 'react'
import type { MapLayerMouseEvent } from '../../components/map/MapBase'
import type { MapPopupData } from '../../components/map/MapFeaturePopup'
import { DRILL_LAYER_ID } from '../../components/map/DrillHoleOverlay'
import { LICENSE_LAYER_ID } from '../../components/map/LicenseOverlay'
import { W } from '../../app/canvas/canvasTheme'

export function useBuyerMapInteraction() {
  const [hoveredHoleId, setHoveredHoleId] = useState<string | null>(null)
  const [popupData, setPopupData] = useState<{ data: MapPopupData; x: number; y: number } | null>(null)

  const handleBuyerMouseEnter = useCallback((e: MapLayerMouseEvent) => {
    const feat = e.features?.[0]
    const layerId = feat?.layer?.id
    const props = feat?.properties as Record<string, unknown> | undefined
    const px = e.point

    if (layerId === DRILL_LAYER_ID && props) {
      setHoveredHoleId(String(props.id))
      setPopupData({
        x: px.x, y: px.y,
        data: {
          title: String(props.id),
          subtitle: `${props.hole_type ?? 'DD'} · ${props.treo_ppm ?? 0} ppm TREO · ${props.depth_m ?? 0} m`,
          accentColor: W.cyan,
          rows: [
            { label: 'Deposit', value: String(props.deposit ?? '—') },
          ],
          footer: props.source_ref ? `${props.source_ref}${props.as_of ? ` · ${props.as_of}` : ''}` : undefined,
        }
      })
      return
    }

    if (layerId === LICENSE_LAYER_ID && props) {
      setPopupData({
        x: px.x, y: px.y,
        data: {
          title: String(props.name ?? props.id ?? ''),
          accentColor: W.violet,
          rows: [
            { label: 'Status', value: String(props.status ?? '—') },
            { label: 'Area', value: `${Number(props.area_km2 ?? 0)} km²` },
          ],
        },
      })
      return
    }
    setPopupData(null)
    setHoveredHoleId(null)
  }, [])

  const handleBuyerMouseLeave = useCallback(() => {
    setPopupData(null)
    setHoveredHoleId(null)
  }, [])

  return {
    hoveredHoleId,
    popupData,
    setPopupData,
    handleBuyerMouseEnter,
    handleBuyerMouseLeave,
  }
}