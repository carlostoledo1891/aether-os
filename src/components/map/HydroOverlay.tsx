import { useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Layer, Source, useMap } from 'react-map-gl/maplibre'
import type { EnvTelemetry } from '../../types/telemetry'
import { W } from '../../app/canvas/canvasTheme'
import {
  emptyFeatureCollection,
  useGeoJsonFeatureCollection,
  type Feature,
  type FeatureCollection,
  type FeatureProperties,
  type LineStringGeometry,
  type PointGeometry,
} from './geojson'
import hydroNodesUrl from '../../data/geojson/hydro-nodes.geojson?url'
import hydroRiversUrl from '../../data/geojson/hydro-rivers.geojson?url'
import hydroSpringsUrl from '../../data/geojson/hydro-springs.geojson?url'

type HydroNodeType = 'piezometer' | 'udc' | 'mine' | 'plant'
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

export interface HydroOverlayNodeDetail {
  id: string
  label: string
  sublabel: string
  nodeType: HydroNodeType
  metric: string
  statusLabel: string
  coordinates: [number, number]
}

interface HydroRiverProperties extends FeatureProperties {
  id: string
  kind: 'river' | 'groundwater'
  label: string
  lineColor: string
  lineWidth: number
}

interface HydroSpringProperties extends FeatureProperties {
  id: string
}

interface HydroSpringRenderProperties extends HydroSpringProperties {
  status: SpringStatus
  color: string
  radius: number
}

type HydroNodeFeature = Feature<HydroNodeProperties, PointGeometry>
type HydroNodeRenderFeature = Feature<HydroNodeRenderProperties, PointGeometry>
type HydroRiverFeature = Feature<HydroRiverProperties, LineStringGeometry>
type HydroSpringFeature = Feature<HydroSpringProperties, PointGeometry>
type HydroSpringRenderFeature = Feature<HydroSpringRenderProperties, PointGeometry>

export const HYDRO_NODE_LAYER_ID = 'hydro-node-core'

export function toHydroNodeDetail(
  properties: Record<string, unknown>,
  coordinates?: [number, number],
): HydroOverlayNodeDetail | null {
  const id = properties.id
  if (typeof id !== 'string') return null
  return {
    id,
    label: String(properties.label ?? ''),
    sublabel: String(properties.sublabel ?? ''),
    nodeType: (properties.nodeType ?? 'piezometer') as HydroNodeType,
    metric: String(properties.metric ?? ''),
    statusLabel: String(properties.statusLabel ?? ''),
    coordinates: coordinates ?? [0, 0],
  }
}

interface HydroOverlayProps {
  env: EnvTelemetry
  hoveredNodeId: string | null
  selectedNodeId: string | null
}

export function HydroOverlay({ env, hoveredNodeId, selectedNodeId }: HydroOverlayProps) {
  const { current: mapRef } = useMap()
  const staticNodes = useGeoJsonFeatureCollection<HydroNodeFeature>(hydroNodesUrl)
  const staticRivers = useGeoJsonFeatureCollection<HydroRiverFeature>(hydroRiversUrl)
  const staticSprings = useGeoJsonFeatureCollection<HydroSpringFeature>(hydroSpringsUrl)

  const sensorMap = useMemo(() => {
    const byId: Record<string, EnvTelemetry['aquifer']['sensors'][number]> = {}
    env.aquifer.sensors.forEach((sensor) => { byId[sensor.sensor_id] = sensor })
    return byId
  }, [env.aquifer.sensors])

  const springCounts = useMemo(() => ({
    active: env.springs.filter((s) => s.status === 'Active').length,
    reduced: env.springs.filter((s) => s.status === 'Reduced').length,
    suppressed: env.springs.filter((s) => s.status === 'Suppressed').length,
  }), [env.springs])

  const nodesData = useMemo<FeatureCollection<HydroNodeRenderFeature> | null>(() => {
    if (!staticNodes) return null
    return {
      type: 'FeatureCollection',
      features: staticNodes.features.map((feature) => {
        const sensor = sensorMap[feature.properties.id]
        const nodeType = feature.properties.nodeType
        let strokeColor: string = W.cyan
        let fillColor: string = 'rgba(0,212,200,0.12)'
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
          fillColor = 'rgba(124,92,252,0.12)'
          labelColor = W.violetSoft
          statusLabel = 'Observed'
        } else {
          strokeColor = W.border2
          fillColor = 'rgba(46,46,82,0.12)'
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
      features: staticSprings.features.map((feature, index) => {
        const status = env.springs[index]?.status ?? env.springs[index % env.springs.length]?.status ?? 'Active'
        const color = status === 'Active' ? W.green : status === 'Reduced' ? W.amber : W.red
        const radius = status === 'Suppressed' ? 4.3 : status === 'Reduced' ? 3.9 : 3.5
        return { ...feature, properties: { ...feature.properties, status, color, radius } }
      }),
    }
  }, [env.springs, staticSprings])

  const hoveredNode = useMemo(
    () => nodesData?.features.find((f) => f.properties.id === hoveredNodeId) ?? null,
    [hoveredNodeId, nodesData],
  )
  const selectedNode = useMemo(
    () => nodesData?.features.find((f) => f.properties.id === selectedNodeId) ?? null,
    [nodesData, selectedNodeId],
  )

  const hoverData = useMemo<FeatureCollection<HydroNodeRenderFeature>>(
    () => hoveredNode ? { type: 'FeatureCollection', features: [hoveredNode] } : emptyFeatureCollection<HydroNodeRenderFeature>(),
    [hoveredNode],
  )
  const selectedData = useMemo<FeatureCollection<HydroNodeRenderFeature>>(
    () => selectedNode ? { type: 'FeatureCollection', features: [selectedNode] } : emptyFeatureCollection<HydroNodeRenderFeature>(),
    [selectedNode],
  )

  if (!staticRivers || !nodesData || !springsData) return null

  const hoveredSensor = hoveredNode ? sensorMap[hoveredNode.properties.id] : null
  const [hoverLng, hoverLat] = hoveredNode?.geometry.coordinates ?? [null, null]
  const waterQualityAlert = env.water_quality.sulfate_ppm >= 250 || env.water_quality.nitrate_ppm >= 50

  return (
    <>
      {/* ── Rivers & groundwater ───────────────────────────────────────────── */}
      <Source id="hydro-rivers-source" type="geojson" data={staticRivers as never}>
        <Layer id="hydro-river-lines" type="line" filter={['==', ['get', 'kind'], 'river']}
          paint={{ 'line-color': ['get', 'lineColor'], 'line-width': ['get', 'lineWidth'], 'line-opacity': 0.62 }} />
        <Layer id="hydro-groundwater-lines" type="line" filter={['==', ['get', 'kind'], 'groundwater']}
          paint={{ 'line-color': ['get', 'lineColor'], 'line-width': ['get', 'lineWidth'], 'line-opacity': 0.45, 'line-dasharray': [1.5, 2.5] }} />
        <Layer id="hydro-river-labels" type="symbol" filter={['==', ['get', 'kind'], 'river']}
          layout={{ 'symbol-placement': 'line', 'text-field': ['get', 'label'], 'text-font': ['Open Sans Italic'], 'text-size': 10, 'text-letter-spacing': 0.05, 'text-allow-overlap': true }}
          paint={{ 'text-color': 'rgba(0,212,200,0.75)', 'text-halo-color': 'rgba(6,6,16,0.95)', 'text-halo-width': 1.1 }} />
      </Source>

      {/* ── Springs ────────────────────────────────────────────────────────── */}
      <Source id="hydro-springs-source" type="geojson" data={springsData as never}>
        <Layer id="hydro-springs" type="circle" paint={{
          'circle-radius': ['get', 'radius'], 'circle-color': ['get', 'color'],
          'circle-stroke-color': 'rgba(6,6,16,0.9)', 'circle-stroke-width': 0.8, 'circle-opacity': 0.9,
        }} />
      </Source>

      {/* ── Hydro nodes ────────────────────────────────────────────────────── */}
      <Source id="hydro-nodes-source" type="geojson" data={nodesData as never}>
        <Layer id="hydro-udc-zone" type="circle" filter={['==', ['get', 'nodeType'], 'udc']}
          paint={{ 'circle-radius': ['get', 'zoneRadius'], 'circle-color': '#FF4D4D', 'circle-opacity': ['get', 'zoneOpacity'], 'circle-blur': 0.9 }} />
        <Layer id="hydro-node-glow" type="circle" paint={{
          'circle-radius': ['get', 'glowRadius'], 'circle-color': ['get', 'strokeColor'],
          'circle-opacity': ['case', ['==', ['get', 'nodeType'], 'udc'], 0.18, 0.12], 'circle-blur': 0.85,
        }} />
        <Layer id={HYDRO_NODE_LAYER_ID} type="circle" paint={{
          'circle-radius': ['get', 'radius'], 'circle-color': ['get', 'fillColor'],
          'circle-stroke-color': ['get', 'strokeColor'], 'circle-stroke-width': 1.5, 'circle-stroke-opacity': 0.95,
        }} />
        <Layer id="hydro-node-center" type="circle" paint={{
          'circle-radius': ['*', ['get', 'radius'], 0.33], 'circle-color': ['get', 'strokeColor'], 'circle-opacity': 0.95,
        }} />
        <Layer id="hydro-node-labels" type="symbol"
          layout={{ 'text-field': ['get', 'label'], 'text-font': ['Open Sans Semibold'], 'text-size': 9, 'text-offset': [0, 1.8], 'text-anchor': 'top', 'text-allow-overlap': true }}
          paint={{ 'text-color': ['get', 'labelColor'], 'text-halo-color': 'rgba(6,6,16,0.95)', 'text-halo-width': 1.2 }} />
        <Layer id="hydro-node-metrics" type="symbol" filter={['!=', ['get', 'metric'], '']}
          layout={{ 'text-field': ['get', 'metric'], 'text-font': ['Open Sans Regular'], 'text-size': 9, 'text-offset': [0, -2.2], 'text-anchor': 'bottom', 'text-allow-overlap': true }}
          paint={{ 'text-color': ['get', 'labelColor'], 'text-halo-color': 'rgba(6,6,16,0.95)', 'text-halo-width': 1.3 }} />
      </Source>

      {/* ── Hover / selection outlines ─────────────────────────────────────── */}
      <Source id="hydro-hover-source" type="geojson" data={hoverData as never}>
        <Layer id="hydro-node-hover" type="circle" paint={{
          'circle-radius': ['+', ['get', 'radius'], 10], 'circle-color': 'rgba(0,0,0,0)',
          'circle-stroke-color': ['get', 'strokeColor'], 'circle-stroke-width': 1.7, 'circle-stroke-opacity': 0.82,
        }} />
      </Source>
      <Source id="hydro-selected-source" type="geojson" data={selectedData as never}>
        <Layer id="hydro-node-selected" type="circle" paint={{
          'circle-radius': ['+', ['get', 'radius'], 12], 'circle-color': 'rgba(0,0,0,0)',
          'circle-stroke-color': ['get', 'strokeColor'], 'circle-stroke-width': 1.5, 'circle-stroke-opacity': 0.72,
        }} />
      </Source>

      {/* ── Water quality badge ────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 14, right: 14, padding: '6px 9px', borderRadius: 8,
        background: waterQualityAlert ? 'rgba(245,166,35,0.12)' : 'rgba(0,212,200,0.08)',
        border: waterQualityAlert ? '1px solid rgba(245,166,35,0.28)' : '1px solid rgba(0,212,200,0.18)',
        color: waterQualityAlert ? W.amber : W.cyan,
        fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', pointerEvents: 'none', zIndex: 16,
      }}>
        WQ · SO4 {env.water_quality.sulfate_ppm.toFixed(0)} ppm · NO3 {env.water_quality.nitrate_ppm.toFixed(0)} ppm
      </div>

      {/* ── Spring counter ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', left: 12, top: 12,
        fontSize: 8, color: 'rgba(0,212,200,0.55)', fontFamily: 'var(--font-mono)',
        letterSpacing: '0.04em', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 15,
      }}>
        Springs: {springCounts.active}A / {springCounts.reduced}R / {springCounts.suppressed}S
      </div>

      {/* ── Hover tooltip card ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {hoveredNode && hoverLng !== null && hoverLat !== null && mapRef && (() => {
          const screenPos = mapRef.project([hoverLng, hoverLat])
          const container = mapRef.getContainer()
          const cW = container?.clientWidth ?? 1000
          const TOOLTIP_W = 218
          const OFFSET = 18
          const flipLeft = screenPos.x + OFFSET + TOOLTIP_W > cW - 12
          const left = flipLeft ? screenPos.x - TOOLTIP_W - OFFSET : screenPos.x + OFFSET
          const top = Math.max(12, screenPos.y)

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
                background: 'rgba(5,5,16,0.94)', backdropFilter: 'blur(12px)',
                border: `1px solid ${hoveredNode.properties.strokeColor}35`, borderRadius: 10,
                padding: '10px 12px', zIndex: 20,
                boxShadow: `0 0 18px ${hoveredNode.properties.strokeColor}14`, pointerEvents: 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>{hoveredNode.properties.id}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: hoveredNode.properties.labelColor, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{hoveredNode.properties.nodeType}</span>
              </div>
              <p style={{ margin: '0 0 3px', fontSize: 11, fontWeight: 600, color: hoveredNode.properties.labelColor }}>{hoveredNode.properties.label}</p>
              <p style={{ margin: '0 0 7px', fontSize: 10, color: W.text4 }}>{hoveredNode.properties.sublabel}</p>
              {hoveredSensor && (
                <div style={{ padding: '4px 8px', background: `${hoveredNode.properties.strokeColor}10`, border: `1px solid ${hoveredNode.properties.strokeColor}28`, borderRadius: 5, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: hoveredNode.properties.labelColor, fontFamily: 'var(--font-mono)' }}>{hoveredSensor.depth_meters.toFixed(1)} m</span>
                  <span style={{ fontSize: 10, color: W.text4, marginLeft: 6 }}>
                    D{(hoveredSensor.depth_meters - hoveredSensor.baseline_meters) >= 0 ? '+' : ''}{(hoveredSensor.depth_meters - hoveredSensor.baseline_meters).toFixed(1)} m
                  </span>
                </div>
              )}
              {hoveredNode.properties.nodeType === 'udc' && (
                <div style={{ padding: '4px 8px', background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.25)', borderRadius: 5, marginBottom: 6 }}>
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

      {/* ── Legend ──────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12, zIndex: 15, display: 'flex', gap: 8, alignItems: 'center',
        background: 'rgba(5,5,16,0.78)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,212,200,0.10)', borderRadius: 8, padding: '5px 10px', pointerEvents: 'none',
      }}>
        {[
          { label: 'Piezometer', color: W.cyan },
          { label: 'UDC Site', color: W.red },
          { label: 'Spring', color: W.green },
          { label: 'River', color: 'rgba(0,212,200,0.55)' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 4px ${color}80`, display: 'inline-block' }} />
            <span style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>{label}</span>
          </div>
        ))}
      </div>
    </>
  )
}
