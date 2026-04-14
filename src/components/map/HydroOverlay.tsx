// GeoJSON `data` props use `as never` to bridge FeatureCollection/GeoJSON.GeoJSON
// type mismatch between our typed GeoJSON and react-map-gl's maplibre binding.
import { memo, useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Layer, Marker, Source, useMap } from 'react-map-gl/maplibre'
import type { EnvTelemetry, SpringTelemetry } from '../../types/telemetry'
import { W } from '../../app/canvas/canvasTheme'
import {
  emptyFeatureCollection,
  useGeoJsonFeatureCollection,
  type Feature,
  type FeatureCollection,
  type FeatureProperties,
  type PointGeometry,
} from './geojson'
import { GEO } from '../../data/geo/registry'
import { MAP_STACKING } from './mapStacking'
import { tierShort, type HydroNodeType } from './hydroDetailMappers'
import { HYDRO_NODE_LAYER_ID, HYDRO_SPRING_LAYER_ID } from './hydroLayerIds'
import { springPinRadiusPx, tierCircleOpacity } from './springPinStyle'

const HYDRO_SPRINGS_CIRCLE_PAINT = {
  'circle-radius': ['get', 'radius'],
  'circle-color': ['get', 'color'],
  'circle-stroke-color': W.overlay88,
  'circle-stroke-width': 0.8,
  'circle-opacity': ['get', 'circleOpacity'],
}

const HYDRO_UDC_ZONE_PAINT = {
  'circle-radius': ['get', 'zoneRadius'],
  'circle-color': W.red,
  'circle-opacity': ['get', 'zoneOpacity'],
  'circle-blur': 0.9,
}

const HYDRO_NODE_GLOW_PAINT = {
  'circle-radius': ['get', 'glowRadius'],
  'circle-color': ['get', 'strokeColor'],
  'circle-opacity': ['case', ['==', ['get', 'nodeType'], 'udc'], 0.18, 0.12],
  'circle-blur': 0.85,
}

const HYDRO_NODE_CORE_PAINT = {
  'circle-radius': ['get', 'radius'],
  'circle-color': ['get', 'fillColor'],
  'circle-stroke-color': ['get', 'strokeColor'],
  'circle-stroke-width': 1.5,
  'circle-stroke-opacity': 0.95,
}

const HYDRO_NODE_CENTER_PAINT = {
  'circle-radius': ['*', ['get', 'radius'], 0.33],
  'circle-color': ['get', 'strokeColor'],
  'circle-opacity': 0.95,
}

const HYDRO_NODE_LABELS_LAYOUT = {
  'text-field': ['get', 'label'],
  'text-font': ['Open Sans Semibold'],
  'text-size': 9,
  'text-offset': [0, 1.8] as [number, number],
  'text-anchor': 'top' as const,
  'text-allow-overlap': true,
}

const HYDRO_NODE_LABELS_PAINT = {
  'text-color': ['get', 'labelColor'],
  'text-halo-color': W.mapHalo,
  'text-halo-width': 1.2,
}

const HYDRO_NODE_METRICS_LAYOUT = {
  'text-field': ['get', 'metric'],
  'text-font': ['Open Sans Regular'],
  'text-size': 9,
  'text-offset': [0, -2.2] as [number, number],
  'text-anchor': 'bottom' as const,
  'text-allow-overlap': true,
}

const HYDRO_NODE_METRICS_PAINT = {
  'text-color': ['get', 'labelColor'],
  'text-halo-color': W.mapHalo,
  'text-halo-width': 1.3,
}

const HYDRO_NODE_HOVER_PAINT = {
  'circle-radius': ['+', ['get', 'radius'], 10],
  'circle-color': 'rgba(0,0,0,0)',
  'circle-stroke-color': ['get', 'strokeColor'],
  'circle-stroke-width': 1.7,
  'circle-stroke-opacity': 0.82,
}

const HYDRO_NODE_SELECTED_PAINT = {
  'circle-radius': ['+', ['get', 'radius'], 12],
  'circle-color': 'rgba(0,0,0,0)',
  'circle-stroke-color': ['get', 'strokeColor'],
  'circle-stroke-width': 1.5,
  'circle-stroke-opacity': 0.72,
}

export {
  toSpringDetail,
  toHydroNodeDetail,
  type HydroOverlayNodeDetail,
  type HydroWeatherStripModel,
} from './hydroDetailMappers'
export { HYDRO_NODE_LAYER_ID, HYDRO_SPRING_LAYER_ID }

type SpringStatus = 'Active' | 'Reduced' | 'Suppressed'

interface HydroNodeProperties extends FeatureProperties {
  id: string
  label: string
  sublabel: string
  nodeType: HydroNodeType
  radius: number
}

interface HydroNodeRenderProperties extends HydroNodeProperties {
  fillColor: string
  strokeColor: string
  labelColor: string
  metric: string
  glowRadius: number
  statusLabel: string
  zoneRadius: number
  zoneOpacity: number
}

/** Core spring props from GeoJSON; other keys allowed via FeatureProperties index signature */
interface HydroSpringProperties extends FeatureProperties {
  id: string
}

interface HydroSpringRenderProperties extends HydroSpringProperties {
  status: SpringStatus
  color: string
  radius: number
  circleOpacity: number
  monitoringTier: SpringTelemetry['monitoring_tier']
  monitoringLabel: string
  methodDisplay: string
  lastFieldVisitDisplay: string
  linkedSensorDisplay: string
}

type HydroNodeFeature = Feature<HydroNodeProperties, PointGeometry>
type HydroNodeRenderFeature = Feature<HydroNodeRenderProperties, PointGeometry>
type HydroSpringFeature = Feature<HydroSpringProperties, PointGeometry>
type HydroSpringRenderFeature = Feature<HydroSpringRenderProperties, PointGeometry>

interface HydroOverlayProps {
  env: EnvTelemetry
  hoveredNodeId: string | null
  selectedNodeId: string | null
}

export const HydroOverlay = memo(function HydroOverlay({ env, hoveredNodeId, selectedNodeId }: HydroOverlayProps) {
  const { current: mapRef } = useMap()
  const { data: staticNodes } = useGeoJsonFeatureCollection<HydroNodeFeature>(GEO.hydroNodes.url)
  const { data: staticSprings } = useGeoJsonFeatureCollection<HydroSpringFeature>(GEO.hydroSprings.url)

  const sensorMap = useMemo(() => {
    const byId: Record<string, EnvTelemetry['aquifer']['sensors'][number]> = {}
    env.aquifer.sensors.forEach((sensor) => { byId[sensor.sensor_id] = sensor })
    return byId
  }, [env.aquifer.sensors])

  const springById = useMemo(() => {
    const m = new Map<string, SpringTelemetry>()
    env.springs.forEach((s) => { m.set(s.id, s) })
    return m
  }, [env.springs])

  const nodesData = useMemo<FeatureCollection<HydroNodeRenderFeature> | null>(() => {
    if (!staticNodes) return null
    return {
      type: 'FeatureCollection',
      features: staticNodes.features.map((feature) => {
        const sensor = sensorMap[feature.properties.id]
        const nodeType = feature.properties.nodeType
        let strokeColor: string = W.cyan
        let fillColor: string = W.cyanSubtle
        let labelColor: string = W.cyan
        let metric: string = ''
        let statusLabel: string = 'Normal'
        let zoneRadius = 0
        let zoneOpacity = 0

        if (nodeType === 'udc') {
          strokeColor = env.legacy_infrastructure.udc_status === 'Normal' ? W.amber : W.red
          fillColor = `${strokeColor}18`
          labelColor = strokeColor
          metric = `${env.legacy_infrastructure.radiation_usv_h.toFixed(3)} uSv/h`
          statusLabel = env.legacy_infrastructure.udc_status
          zoneRadius = 48 + (env.legacy_infrastructure.radiation_usv_h / 0.25) * 26
          zoneOpacity = 0.10 + (env.legacy_infrastructure.radiation_usv_h / 0.25) * 0.10
        } else if (nodeType === 'piezometer' && sensor) {
          strokeColor = sensor.status === 'Normal' ? W.cyan : sensor.status === 'Warning' ? W.amber : W.red
          fillColor = `${strokeColor}16`
          labelColor = strokeColor
          metric = `${sensor.depth_meters.toFixed(1)} m`
          statusLabel = sensor.status
        } else if (nodeType === 'mine') {
          strokeColor = W.violet
          fillColor = W.violetSubtle
          labelColor = W.violetSoft
          statusLabel = 'Observed'
        } else {
          strokeColor = W.border2
          fillColor = W.glass12
          labelColor = W.text3
          statusLabel = 'Hub'
        }

        return {
          ...feature,
          properties: {
            ...feature.properties, fillColor, strokeColor, labelColor, metric,
            glowRadius: feature.properties.radius + (nodeType === 'udc' ? 10 : 7),
            statusLabel, zoneRadius, zoneOpacity,
          },
        }
      }),
    }
  }, [env.legacy_infrastructure, sensorMap, staticNodes])

  const springsData = useMemo<FeatureCollection<HydroSpringRenderFeature> | null>(() => {
    if (!staticSprings) return null
    return {
      type: 'FeatureCollection',
      features: staticSprings.features.map((feature) => {
        const sid = feature.properties.id
        const telem = springById.get(sid)
        const status = telem?.status ?? 'Active'
        const tier = telem?.monitoring_tier ?? 'modeled_inferred'
        const circleOpacity = tierCircleOpacity(tier)
        const color = W.cyan
        const radius = springPinRadiusPx(status, tier)
        const lastVisit = telem?.last_field_visit
        const lastFieldVisitDisplay = lastVisit
          ? new Date(lastVisit).toISOString().slice(0, 10)
          : '—'
        const linkedSensorDisplay = telem?.linked_sensor_id ?? '—'
        return {
          ...feature,
          properties: {
            ...feature.properties,
            status,
            color,
            radius,
            circleOpacity,
            monitoringTier: tier,
            monitoringLabel: tierShort(tier).toUpperCase(),
            methodDisplay: telem?.method ?? 'hydro_model_v1',
            lastFieldVisitDisplay,
            linkedSensorDisplay,
          },
        }
      }),
    }
  }, [springById, staticSprings])

  const hoveredNode = useMemo(
    () => nodesData?.features.find((f) => f.properties.id === hoveredNodeId) ?? null,
    [hoveredNodeId, nodesData],
  )
  const selectedNode = useMemo(
    () => nodesData?.features.find((f) => f.properties.id === selectedNodeId) ?? null,
    [nodesData, selectedNodeId],
  )

  const hoveredSpring = useMemo(
    () => springsData?.features.find((f) => f.properties.id === hoveredNodeId) ?? null,
    [springsData, hoveredNodeId],
  )

  const hoverData = useMemo<FeatureCollection<HydroNodeRenderFeature>>(
    () => hoveredNode ? { type: 'FeatureCollection', features: [hoveredNode] } : emptyFeatureCollection<HydroNodeRenderFeature>(),
    [hoveredNode],
  )
  const selectedData = useMemo<FeatureCollection<HydroNodeRenderFeature>>(
    () => selectedNode ? { type: 'FeatureCollection', features: [selectedNode] } : emptyFeatureCollection<HydroNodeRenderFeature>(),
    [selectedNode],
  )

  const pulseMarkers = useMemo(() => {
    if (!nodesData) return null
    return nodesData.features
      .filter(f => f.properties.statusLabel === 'Warning' || f.properties.statusLabel === 'Elevated' || f.properties.statusLabel === 'Critical')
      .map(f => {
        const [lng, lat] = f.geometry.coordinates
        const color = f.properties.strokeColor
        const size = (f.properties.radius + 14) * 2
        return (
          <Marker key={`pulse-${f.properties.id}`} longitude={lng} latitude={lat} anchor="center">
            <div style={{
              width: size, height: size, borderRadius: '50%',
              background: `radial-gradient(circle, ${color}30 0%, ${color}00 70%)`,
              border: `1.5px solid ${color}50`,
              animation: 'warn-pulse-glow 2s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
          </Marker>
        )
      })
  }, [nodesData])

  if (!nodesData || !springsData) return null

  const hoveredSensor = hoveredNode ? sensorMap[hoveredNode.properties.id] : null
  const [hoverLng, hoverLat] = hoveredNode?.geometry.coordinates
    ?? hoveredSpring?.geometry.coordinates
    ?? [null, null]
  return (
    <>
      {/* ── Springs ────────────────────────────────────────────────────────── */}
      <Source id="hydro-springs-source" type="geojson" data={springsData as never}>
        <Layer id="hydro-springs" type="circle" paint={HYDRO_SPRINGS_CIRCLE_PAINT as never} />
      </Source>

      {/* ── Hydro nodes ────────────────────────────────────────────────────── */}
      <Source id="hydro-nodes-source" type="geojson" data={nodesData as never}>
        <Layer id="hydro-udc-zone" type="circle" filter={['==', ['get', 'nodeType'], 'udc']}
          paint={HYDRO_UDC_ZONE_PAINT as never} />
        <Layer id="hydro-node-glow" type="circle" paint={HYDRO_NODE_GLOW_PAINT as never} />
        <Layer id={HYDRO_NODE_LAYER_ID} type="circle" paint={HYDRO_NODE_CORE_PAINT as never} />
        <Layer id="hydro-node-center" type="circle" paint={HYDRO_NODE_CENTER_PAINT as never} />
        <Layer id="hydro-node-labels" type="symbol"
          layout={HYDRO_NODE_LABELS_LAYOUT as never}
          paint={HYDRO_NODE_LABELS_PAINT as never} />
        <Layer id="hydro-node-metrics" type="symbol" filter={['!=', ['get', 'metric'], '']}
          layout={HYDRO_NODE_METRICS_LAYOUT as never}
          paint={HYDRO_NODE_METRICS_PAINT as never} />
      </Source>

      {/* ── Hover / selection outlines ─────────────────────────────────────── */}
      <Source id="hydro-hover-source" type="geojson" data={hoverData as never}>
        <Layer id="hydro-node-hover" type="circle" paint={HYDRO_NODE_HOVER_PAINT as never} />
      </Source>
      <Source id="hydro-selected-source" type="geojson" data={selectedData as never}>
        <Layer id="hydro-node-selected" type="circle" paint={HYDRO_NODE_SELECTED_PAINT as never} />
      </Source>

      {/* ── Warning/critical pulse rings ─────────────────────────────────── */}
      {pulseMarkers}

      {/* ── Hover tooltip card ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {(hoveredNode || hoveredSpring) && hoverLng !== null && hoverLat !== null && mapRef && (() => {
          const screenPos = mapRef.project([hoverLng, hoverLat])
          const container = mapRef.getContainer()
          const cW = container?.clientWidth ?? 1000
          const TOOLTIP_W = 228
          const OFFSET = 18
          const flipLeft = screenPos.x + OFFSET + TOOLTIP_W > cW - 12
          const left = flipLeft ? screenPos.x - TOOLTIP_W - OFFSET : screenPos.x + OFFSET
          const top = Math.max(12, screenPos.y)

          if (hoveredSpring) {
            const p = hoveredSpring.properties
            const strokeColor = p.color
            const recent = env.springEvents?.filter(e => e.springId === p.id)?.slice(-1)[0]
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: flipLeft ? -6 : 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: flipLeft ? -6 : 6 }}
                transition={{ duration: 0.13 }}
                style={{
                  position: 'absolute', top, left, minWidth: 170, maxWidth: TOOLTIP_W,
                  transform: 'translateY(-50%)',
                  background: W.mapControlBg, backdropFilter: 'blur(12px)',
                  border: `1px solid ${strokeColor}40`, borderRadius: W.radius.md,
                  padding: '10px 12px', zIndex: MAP_STACKING.tooltip,
                  boxShadow: `0 0 18px ${strokeColor}18`, pointerEvents: 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>{p.id}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: W.text3, letterSpacing: '0.07em', textTransform: 'uppercase' }}>spring</span>
                </div>
                <p style={{ margin: '0 0 3px', fontSize: 11, fontWeight: 600, color: W.text1 }}>{p.name ?? p.id}</p>
                <p style={{ margin: '0 0 6px', fontSize: 9, color: W.text4, lineHeight: 1.35 }}>
                  {p.monitoringLabel} · {p.methodDisplay}
                </p>
                <div style={{ fontSize: 9, color: W.text4, marginBottom: 4, fontFamily: 'var(--font-mono)' }}>
                  Last field: {p.lastFieldVisitDisplay} · Linked: {p.linkedSensorDisplay}
                </div>
                {recent && (
                  <div style={{ fontSize: 9, color: W.text3, marginBottom: 6, padding: '4px 6px', background: W.glass04, borderRadius: W.radius.sm }}>
                    <span style={{ color: W.text2 }}>{recent.type}</span>
                    {' · '}{recent.note}
                  </div>
                )}
                <div style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)' }}>
                  {p.status} · {Math.abs(hoverLat).toFixed(3)}°S · {Math.abs(hoverLng).toFixed(3)}°W
                </div>
              </motion.div>
            )
          }

          if (!hoveredNode) return null

          return (
            <motion.div
              key={hoveredNode.properties.id}
              initial={{ opacity: 0, x: flipLeft ? -6 : 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: flipLeft ? -6 : 6 }}
              transition={{ duration: 0.13 }}
              style={{
                position: 'absolute', top, left, minWidth: 170, maxWidth: TOOLTIP_W,
                transform: 'translateY(-50%)',
                background: W.mapControlBg, backdropFilter: 'blur(12px)',
                border: `1px solid ${hoveredNode.properties.strokeColor}35`, borderRadius: W.radius.md,
                padding: '10px 12px', zIndex: MAP_STACKING.tooltip,
                boxShadow: `0 0 18px ${hoveredNode.properties.strokeColor}14`, pointerEvents: 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>{hoveredNode.properties.id}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: W.text3, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{hoveredNode.properties.nodeType}</span>
              </div>
              <p style={{ margin: '0 0 3px', fontSize: 11, fontWeight: 600, color: W.text1 }}>{hoveredNode.properties.label}</p>
              <p style={{ margin: '0 0 7px', fontSize: 10, color: W.text4 }}>{hoveredNode.properties.sublabel}</p>
              {hoveredSensor && (
                <div style={{ padding: '4px 8px', background: `${hoveredNode.properties.strokeColor}10`, border: `1px solid ${hoveredNode.properties.strokeColor}28`, borderRadius: W.radius.sm, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>{hoveredSensor.depth_meters.toFixed(1)} m</span>
                  <span style={{ fontSize: 10, color: W.text4, marginLeft: 6 }}>
                    D{(hoveredSensor.depth_meters - hoveredSensor.baseline_meters) >= 0 ? '+' : ''}{(hoveredSensor.depth_meters - hoveredSensor.baseline_meters).toFixed(1)} m
                  </span>
                </div>
              )}
              {hoveredNode.properties.nodeType === 'udc' && (
                <div style={{ padding: '4px 8px', background: W.redSubtle, border: W.mapHudBorderRed, borderRadius: W.radius.sm, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: W.red, fontFamily: 'var(--font-mono)' }}>{env.legacy_infrastructure.radiation_usv_h.toFixed(3)} uSv/h</span>
                </div>
              )}
              <div style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)' }}>
                {hoveredNode.properties.statusLabel} · {Math.abs(hoverLat).toFixed(3)}°S · {Math.abs(hoverLng).toFixed(3)}°W
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* ── Legend (rendered via bottomRight slot, see HydroLegend export) ── */}
    </>
  )
})

/* ── Standalone legend for the MapControlStack.bottomRight slot ───────── */

export function HydroLegend() {
  return (
    <div style={{
      background: W.mapControlBg,
      border: W.mapControlBorder,
      borderRadius: 8,
      padding: '8px 10px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      fontSize: 10,
      color: W.text3,
    }}>
      <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 9 }}>Legend</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: W.cyan, flexShrink: 0 }} />
        <span>Piezometer</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg width="8" height="8" viewBox="0 0 10 10" style={{ flexShrink: 0 }}>
          <polygon points="5,1 9,9 1,9" fill={W.amber} />
        </svg>
        <span>UDC Site</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: W.cyan, flexShrink: 0, opacity: 0.7 }} />
        <span>Spring</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: W.cyan, flexShrink: 0, opacity: 0.4 }} />
        <span>Water Feature</span>
      </div>
    </div>
  )
}
