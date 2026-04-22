import { useEffect, useRef } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import type maplibregl from 'maplibre-gl'
import { useUnits } from '../../hooks/useUnits'
import type { Severity, UnitSummary } from 'shared/units/types'
import type { MapPopupData } from './MapFeaturePopup'

const UNIT_MARKERS_SOURCE_ID = 'unit-markers'
const UNIT_MARKERS_LAYER_ID = 'unit-markers-layer'

const SEVERITY_SHAPES: Record<Severity, string> = {
  nominal: 'circle',
  attention: 'diamond',
  action_required: 'triangle',
  blocked: 'square',
}

interface UnitMarkersProps {
  activeTypeIds: string[]
  severityFilter: Severity[]
  typeColors: Record<string, string>
  typeLabels?: Record<string, string>
  onUnitClick?: (unitId: string) => void
  onUnitHover?: (popup: { data: MapPopupData; x: number; y: number } | null) => void
}

/**
 * Renders unit markers on the map via a GeoJSON source + circle layer.
 * Uses MapLibre's native source/layer API rather than DOM markers
 * for performance with thousands of springs.
 */
export function UnitMarkers({
  activeTypeIds,
  severityFilter,
  typeColors,
  typeLabels,
  onUnitClick,
  onUnitHover,
}: UnitMarkersProps) {
  const { current: mapRef } = useMap()
  const { data: units } = useUnits()
  const handlersRef = useRef<{
    click?: (e: maplibregl.MapMouseEvent) => void
    mouseenter?: (e: maplibregl.MapMouseEvent) => void
    mousemove?: (e: maplibregl.MapMouseEvent) => void
    mouseleave?: () => void
  }>({})
  const map = mapRef?.getMap()

  useEffect(() => {
    if (!map || !units) return

    const filtered = units.filter(u => {
      if (!activeTypeIds.includes(u.typeId)) return false
      if (severityFilter.length > 0 && !severityFilter.includes(u.severity)) return false
      return true
    })

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: filtered
        .filter(u => u.placeId)
        .map(u => {
          const coords = getUnitCoords(u)
          if (!coords) return null
          return {
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: coords },
            properties: {
              id: u.id,
              typeId: u.typeId,
              typeLabel: typeLabels?.[u.typeId] ?? u.typeId.replace(/_/g, ' '),
              severity: u.severity,
              label: u.label,
              currentState: u.currentState,
              owner: u.owner ?? '',
              updatedAt: u.updatedAt,
              color: typeColors[u.typeId] ?? '#888',
            },
          }
        })
        .filter(Boolean) as GeoJSON.Feature[],
    }

    const clickHandler = (e: maplibregl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [UNIT_MARKERS_LAYER_ID] })
      if (features.length > 0 && onUnitClick) {
        onUnitClick(features[0].properties?.id as string)
      }
    }

    const emitHoverPopup = (e: maplibregl.MapMouseEvent) => {
      if (!onUnitHover) return
      const features = map.queryRenderedFeatures(e.point, { layers: [UNIT_MARKERS_LAYER_ID] })
      const props = features[0]?.properties as Record<string, unknown> | undefined
      if (!props) {
        onUnitHover(null)
        return
      }
      const severity = String(props.severity ?? 'nominal').replace(/_/g, ' ')
      const currentState = String(props.currentState ?? 'unknown').replace(/_/g, ' ')
      const owner = typeof props.owner === 'string' && props.owner.trim().length > 0 ? props.owner : 'Unassigned'
      const updatedAt = typeof props.updatedAt === 'string' && props.updatedAt
        ? new Date(props.updatedAt).toLocaleDateString()
        : 'Unknown'
      onUnitHover({
        x: e.point.x,
        y: e.point.y,
        data: {
          title: String(props.label ?? props.id ?? 'Unit'),
          subtitle: String(props.typeLabel ?? props.typeId ?? 'unit'),
          accentColor: String(props.color ?? '#888'),
          rows: [
            { label: 'State', value: currentState },
            { label: 'Severity', value: severity },
            { label: 'Owner', value: owner },
          ],
          footer: `Updated ${updatedAt}`,
        },
      })
    }

    const mouseEnterHandler = (e: maplibregl.MapMouseEvent) => {
      map.getCanvas().style.cursor = 'pointer'
      emitHoverPopup(e)
    }

    const mouseMoveHandler = (e: maplibregl.MapMouseEvent) => {
      emitHoverPopup(e)
    }

    const mouseLeaveHandler = () => {
      map.getCanvas().style.cursor = ''
      onUnitHover?.(null)
    }

    const detachLayerHandlers = () => {
      if (handlersRef.current.click) {
        map.off('click', UNIT_MARKERS_LAYER_ID, handlersRef.current.click)
      }
      if (handlersRef.current.mouseenter) {
        map.off('mouseenter', UNIT_MARKERS_LAYER_ID, handlersRef.current.mouseenter)
      }
      if (handlersRef.current.mousemove) {
        map.off('mousemove', UNIT_MARKERS_LAYER_ID, handlersRef.current.mousemove)
      }
      if (handlersRef.current.mouseleave) {
        map.off('mouseleave', UNIT_MARKERS_LAYER_ID, handlersRef.current.mouseleave)
      }
    }

    const attachLayerHandlers = () => {
      if (!map.getLayer(UNIT_MARKERS_LAYER_ID)) return
      detachLayerHandlers()
      handlersRef.current.click = clickHandler
      handlersRef.current.mouseenter = mouseEnterHandler
      handlersRef.current.mousemove = mouseMoveHandler
      handlersRef.current.mouseleave = mouseLeaveHandler
      map.on('click', UNIT_MARKERS_LAYER_ID, clickHandler)
      map.on('mouseenter', UNIT_MARKERS_LAYER_ID, mouseEnterHandler)
      map.on('mousemove', UNIT_MARKERS_LAYER_ID, mouseMoveHandler)
      map.on('mouseleave', UNIT_MARKERS_LAYER_ID, mouseLeaveHandler)
    }

    const applyUnitMarkers = () => {
      if (!map.isStyleLoaded()) return

      const source = map.getSource(UNIT_MARKERS_SOURCE_ID) as maplibregl.GeoJSONSource | undefined
      if (source) {
        source.setData(geojson)
      } else {
        map.addSource(UNIT_MARKERS_SOURCE_ID, { type: 'geojson', data: geojson })
      }

      if (!map.getLayer(UNIT_MARKERS_LAYER_ID)) {
        map.addLayer({
          id: UNIT_MARKERS_LAYER_ID,
          type: 'circle',
          source: UNIT_MARKERS_SOURCE_ID,
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              6, 2.5,
              12, 5,
              16, 8,
            ],
            'circle-color': ['get', 'color'],
            'circle-opacity': 0.85,
            'circle-stroke-width': 1,
            'circle-stroke-color': 'rgba(0,0,0,0.3)',
          },
        })
      }

      attachLayerHandlers()
    }

    const handleStyleData = () => {
      if (!map.isStyleLoaded()) return
      applyUnitMarkers()
    }

    if (map.isStyleLoaded()) {
      applyUnitMarkers()
    } else {
      map.once('load', applyUnitMarkers)
    }
    map.on('styledata', handleStyleData)

    return () => {
      map.off('load', applyUnitMarkers)
      map.off('styledata', handleStyleData)
      detachLayerHandlers()
      map.getCanvas().style.cursor = ''
      onUnitHover?.(null)
    }
  }, [map, units, activeTypeIds, severityFilter, typeColors, typeLabels, onUnitClick, onUnitHover])

  return null
}

function getUnitCoords(u: UnitSummary): [number, number] | null {
  if (u.coordinates && u.coordinates.length >= 2) return u.coordinates
  return null
}

export { SEVERITY_SHAPES }
