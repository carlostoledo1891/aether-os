import { useState, useCallback } from 'react'
import type { MapLayerMouseEvent } from '../../components/map/MapBase'
import type { MapPopupData } from '../../components/map/MapFeaturePopup'
import { DRILL_LAYER_ID } from '../../components/map/DrillHoleOverlay'
import { LICENSE_LAYER_ID } from '../../components/map/LicenseOverlay'
import { SPRING_PIN_LAYER_ID } from '../../components/map/SpringPinsOverlay'
import { W } from '../../app/canvas/canvasTheme'
import type { LayerId } from '../../components/map/layerRegistry'
import {
  buildExternalPresentationFromRenderedFeature,
  requestExternalIdentify,
} from '../../components/map/externalLayerIdentify'

export function useBuyerMapInteraction(visibleLayerIds: LayerId[]) {
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

    if (layerId === SPRING_PIN_LAYER_ID && props) {
      setHoveredHoleId(null)
      setPopupData({
        x: px.x,
        y: px.y,
        data: {
          title: String(props.name ?? props.id ?? 'Spring'),
          rows: [
            { label: 'Spring ID', value: String(props.id ?? '—') },
            ...(props.source_label ? [{ label: 'Source', value: String(props.source_label) }] : []),
            ...(props.municipality ? [{ label: 'Municipality', value: String(props.municipality) }] : []),
          ],
          footer: 'SISEMA / MG spring reference geometry',
        },
      })
      return
    }

    if (layerId && props) {
      const externalPresentation = buildExternalPresentationFromRenderedFeature(layerId, props)
      if (externalPresentation) {
        setHoveredHoleId(null)
        setPopupData({
          x: px.x,
          y: px.y,
          data: externalPresentation,
        })
        return
      }
    }
    setPopupData(null)
    setHoveredHoleId(null)
  }, [])

  const handleBuyerMapClick = useCallback(async (e: MapLayerMouseEvent) => {
    const feat = e.features?.find(feature =>
      typeof feature.layer?.id === 'string'
      && !!feature.properties
      && !!buildExternalPresentationFromRenderedFeature(feature.layer.id, feature.properties as Record<string, unknown>),
    )
    if (!feat?.properties || typeof feat.layer?.id !== 'string') return

    const snapshotPresentation = buildExternalPresentationFromRenderedFeature(
      feat.layer.id,
      feat.properties as Record<string, unknown>,
    )
    if (!snapshotPresentation) return

    try {
      const livePresentation = visibleLayerIds.includes(snapshotPresentation.layerId as LayerId)
        ? await requestExternalIdentify(
            snapshotPresentation.layerId,
            e.lngLat.lng,
            e.lngLat.lat,
          )
        : null
      setPopupData({
        x: e.point.x,
        y: e.point.y,
        data: livePresentation ?? snapshotPresentation,
      })
    } catch {
      setPopupData({
        x: e.point.x,
        y: e.point.y,
        data: snapshotPresentation,
      })
    }
  }, [visibleLayerIds])

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
    handleBuyerMapClick,
  }
}