import { useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Layer, Source, useMap } from 'react-map-gl/maplibre'
import type { EnvTelemetry, PlantTelemetry } from '../../types/telemetry'
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
import plantEdgesUrl from '../../data/geojson/plant-edges.geojson?url'
import plantNodesUrl from '../../data/geojson/plant-nodes.geojson?url'

type Domain = 'extraction' | 'processing' | 'compliance' | 'monitor' | 'transport' | 'external'
type NodeStatus = 'running' | 'success' | 'warning' | 'critical' | 'idle'

interface PlantNodeProperties extends FeatureProperties {
  id: string
  label: string
  sublabel: string
  domain: Domain
  radius: number
  labelMode: 'main' | 'sensor'
}

interface PlantNodeRenderProperties extends PlantNodeProperties {
  fillColor: string
  strokeColor: string
  labelColor: string
  status: NodeStatus
  statusColor: string
  metric: string
  isSensor: boolean
  isExternal: boolean
  isHub: boolean
  glowRadius: number
}

export interface PlantOverlayNodeDetail {
  id: string
  label: string
  sublabel: string
  domain: Domain
  status: NodeStatus
  metric: string
  coordinates: [number, number]
}

interface PlantEdgeProperties extends FeatureProperties {
  id: string
  from: string
  to: string
  variant: 'process' | 'monitor' | 'risk'
  lineColor: string
  lineWidth: number
}

type PlantNodeFeature = Feature<PlantNodeProperties, PointGeometry>
type PlantNodeRenderFeature = Feature<PlantNodeRenderProperties, PointGeometry>
type PlantEdgeFeature = Feature<PlantEdgeProperties, LineStringGeometry>

const DC: Record<Domain, { stroke: string; fill: string; text: string }> = {
  extraction: { stroke: W.cyan, fill: 'rgba(0,212,200,0.12)', text: W.cyan },
  processing: { stroke: W.violet, fill: 'rgba(124,92,252,0.12)', text: W.violetSoft },
  compliance: { stroke: W.green, fill: 'rgba(34,214,138,0.12)', text: W.green },
  monitor: { stroke: W.amber, fill: 'rgba(245,166,35,0.12)', text: W.amber },
  transport: { stroke: W.violetSoft, fill: 'rgba(157,128,255,0.12)', text: W.violetSoft },
  external: { stroke: W.border3, fill: 'rgba(66,66,112,0.08)', text: W.text4 },
}

const SR: Record<NodeStatus, string> = {
  running: W.violet,
  success: W.green,
  warning: W.amber,
  critical: W.red,
  idle: W.border3,
}

export const PLANT_NODE_LAYER_ID = 'plant-node-core'

export function toPlantNodeDetail(
  properties: Record<string, unknown>,
  coordinates?: [number, number],
): PlantOverlayNodeDetail | null {
  const id = properties.id
  if (typeof id !== 'string') return null
  return {
    id,
    label: String(properties.label ?? ''),
    sublabel: String(properties.sublabel ?? ''),
    domain: (properties.domain ?? 'processing') as Domain,
    status: (properties.status ?? 'idle') as NodeStatus,
    metric: String(properties.metric ?? ''),
    coordinates: coordinates ?? [0, 0],
  }
}

interface PlantOverlayProps {
  plant: PlantTelemetry
  env: EnvTelemetry
  hoveredNodeId: string | null
  selectedNodeId: string | null
}

export function PlantOverlay({ plant, env, hoveredNodeId, selectedNodeId }: PlantOverlayProps) {
  const { current: mapRef } = useMap()
  const staticNodes = useGeoJsonFeatureCollection<PlantNodeFeature>(plantNodesUrl)
  const staticEdges = useGeoJsonFeatureCollection<PlantEdgeFeature>(plantEdgesUrl)

  const nodeStatus = useMemo((): Record<string, NodeStatus> => {
    const ph = plant.leaching_circuit.ph_level
    const recirculation = plant.flow_metrics.recirculation_pct
    const piezometers = env.aquifer.sensors.reduce<Record<string, NodeStatus>>((acc, sensor) => {
      const nodeId = {
        'PIZ-N01': 'PIZN',
        'PIZ-C02': 'PIZC',
        'PIZ-S03': 'PIZS',
        'PIZ-E04': 'PIZE',
      }[sensor.sensor_id]
      if (nodeId) {
        acc[nodeId] = sensor.status === 'Normal' ? 'idle' : sensor.status === 'Warning' ? 'warning' : 'critical'
      }
      return acc
    }, {})

    return {
      'MINE-A': 'running',
      'MINE-B': 'running',
      'LEACH': (ph < 3.9 || ph > 5.1) ? 'warning' : 'running',
      'PREC': 'running',
      'CIP': recirculation < 94 ? 'warning' : 'running',
      'FJH': 'running',
      'QA': plant.output.treo_grade_pct > 90 ? 'success' : 'running',
      'EXPORT': 'running',
      'UDC': env.legacy_infrastructure.udc_status === 'Normal'
        ? 'idle'
        : env.legacy_infrastructure.udc_status === 'Elevated' ? 'warning' : 'critical',
      'RAPTOR': 'idle',
      'VIRIDIS': 'idle',
      ...piezometers,
    }
  }, [env, plant])

  const nodeMetric = useMemo<Record<string, string>>(
    () => ({
      'MINE-A': `${plant.output.mrec_kg_hr.toFixed(0)} kg/h`,
      'LEACH': `pH ${plant.leaching_circuit.ph_level.toFixed(2)}`,
      'CIP': `${plant.output.treo_grade_pct.toFixed(1)}% TREO`,
      'FJH': `-${plant.fjh_separation.energy_savings_pct.toFixed(0)}% E`,
      'UDC': `${env.legacy_infrastructure.radiation_usv_h.toFixed(3)} uSv`,
      'QA': `${plant.output.ndpr_ratio_pct.toFixed(1)}% NdPr`,
    }),
    [env, plant],
  )

  const nodesData = useMemo<FeatureCollection<PlantNodeRenderFeature> | null>(() => {
    if (!staticNodes) return null
    return {
      type: 'FeatureCollection',
      features: staticNodes.features.map((feature) => {
        const palette = DC[feature.properties.domain]
        const status = nodeStatus[feature.properties.id] ?? 'idle'
        const isSensor = feature.properties.labelMode === 'sensor'
        const isExternal = feature.properties.domain === 'external'
        const isHub = feature.properties.id === 'CIP'
        return {
          ...feature,
          properties: {
            ...feature.properties,
            fillColor: palette.fill,
            strokeColor: palette.stroke,
            labelColor: palette.text,
            status,
            statusColor: SR[status],
            metric: nodeMetric[feature.properties.id] ?? '',
            isSensor,
            isExternal,
            isHub,
            glowRadius: feature.properties.radius + (isSensor ? 5 : 10),
          },
        }
      }),
    }
  }, [nodeMetric, nodeStatus, staticNodes])

  const hoveredNode = useMemo(
    () => nodesData?.features.find((f) => f.properties.id === hoveredNodeId) ?? null,
    [hoveredNodeId, nodesData],
  )
  const selectedNode = useMemo(
    () => nodesData?.features.find((f) => f.properties.id === selectedNodeId) ?? null,
    [nodesData, selectedNodeId],
  )

  const hoverData = useMemo<FeatureCollection<PlantNodeRenderFeature>>(
    () => hoveredNode ? { type: 'FeatureCollection', features: [hoveredNode] } : emptyFeatureCollection<PlantNodeRenderFeature>(),
    [hoveredNode],
  )
  const selectedData = useMemo<FeatureCollection<PlantNodeRenderFeature>>(
    () => selectedNode ? { type: 'FeatureCollection', features: [selectedNode] } : emptyFeatureCollection<PlantNodeRenderFeature>(),
    [selectedNode],
  )

  if (!staticEdges || !nodesData) return null

  const hoveredPalette = hoveredNode ? DC[hoveredNode.properties.domain] : null
  const hoveredMetric = hoveredNode ? nodeMetric[hoveredNode.properties.id] : null
  const [hoverLng, hoverLat] = hoveredNode?.geometry.coordinates ?? [null, null]

  return (
    <>
      {/* ── Edge linework ──────────────────────────────────────────────────── */}
      <Source id="plant-edges-source" type="geojson" data={staticEdges as never}>
        <Layer id="plant-edge-casing" type="line" paint={{
          'line-color': 'rgba(255,255,255,0.08)',
          'line-width': ['+', ['get', 'lineWidth'], 2.2],
          'line-opacity': 0.35,
        }} />
        <Layer id="plant-edge-process" type="line"
          filter={['==', ['get', 'variant'], 'process']}
          paint={{ 'line-color': ['get', 'lineColor'], 'line-width': ['get', 'lineWidth'], 'line-opacity': 0.72 }}
        />
        <Layer id="plant-edge-monitor" type="line"
          filter={['==', ['get', 'variant'], 'monitor']}
          paint={{ 'line-color': ['get', 'lineColor'], 'line-width': ['get', 'lineWidth'], 'line-opacity': 0.55, 'line-dasharray': [2, 2.8] }}
        />
        <Layer id="plant-edge-risk" type="line"
          filter={['==', ['get', 'variant'], 'risk']}
          paint={{ 'line-color': ['get', 'lineColor'], 'line-width': ['get', 'lineWidth'], 'line-opacity': 0.62, 'line-dasharray': [1.5, 3.5] }}
        />
      </Source>

      {/* ── Node circles + labels ──────────────────────────────────────────── */}
      <Source id="plant-nodes-source" type="geojson" data={nodesData as never}>
        <Layer id="plant-node-glow" type="circle" paint={{
          'circle-radius': ['get', 'glowRadius'],
          'circle-color': ['get', 'statusColor'],
          'circle-opacity': ['match', ['get', 'status'], 'critical', 0.22, 'warning', 0.18, 'success', 0.14, 'running', 0.12, 0.08],
          'circle-blur': 0.9,
        }} />
        <Layer id={PLANT_NODE_LAYER_ID} type="circle" paint={{
          'circle-radius': ['get', 'radius'],
          'circle-color': ['get', 'fillColor'],
          'circle-stroke-color': ['get', 'strokeColor'],
          'circle-stroke-width': ['case', ['boolean', ['get', 'isHub'], false], 2, ['boolean', ['get', 'isExternal'], false], 1, 1.5],
          'circle-stroke-opacity': 0.95,
        }} />
        <Layer id="plant-node-status" type="circle" paint={{
          'circle-radius': ['case', ['boolean', ['get', 'isSensor'], false], 2.1, ['*', ['get', 'radius'], 0.34]],
          'circle-color': ['get', 'statusColor'],
          'circle-opacity': 0.98,
        }} />
        <Layer id="plant-node-label-main" type="symbol"
          filter={['==', ['get', 'labelMode'], 'main']}
          layout={{
            'text-field': ['get', 'label'], 'text-font': ['Open Sans Semibold'],
            'text-size': ['case', ['boolean', ['get', 'isHub'], false], 11, 9],
            'text-offset': [0, 1.8], 'text-anchor': 'top', 'text-allow-overlap': true,
          }}
          paint={{ 'text-color': ['get', 'labelColor'], 'text-halo-color': 'rgba(6,6,16,0.95)', 'text-halo-width': 1.2 }}
        />
        <Layer id="plant-node-label-sensor" type="symbol"
          filter={['==', ['get', 'labelMode'], 'sensor']}
          layout={{
            'text-field': ['get', 'label'], 'text-font': ['Open Sans Semibold'], 'text-size': 9,
            'text-offset': [1.15, 0], 'text-anchor': 'left', 'text-allow-overlap': true,
          }}
          paint={{ 'text-color': ['get', 'labelColor'], 'text-halo-color': 'rgba(6,6,16,0.95)', 'text-halo-width': 1.2 }}
        />
        <Layer id="plant-node-metric" type="symbol"
          filter={['all', ['!=', ['get', 'metric'], ''], ['==', ['get', 'labelMode'], 'main']]}
          layout={{
            'text-field': ['get', 'metric'], 'text-font': ['Open Sans Regular'], 'text-size': 9,
            'text-offset': [0, -2.25], 'text-anchor': 'bottom', 'text-allow-overlap': true,
          }}
          paint={{ 'text-color': ['get', 'labelColor'], 'text-halo-color': 'rgba(6,6,16,0.95)', 'text-halo-width': 1.4 }}
        />
      </Source>

      {/* ── Hover / selection outlines (driven by parent state) ────────────── */}
      <Source id="plant-hover-source" type="geojson" data={hoverData as never}>
        <Layer id="plant-node-hover" type="circle" paint={{
          'circle-radius': ['+', ['get', 'radius'], 10],
          'circle-color': 'rgba(0,0,0,0)',
          'circle-stroke-color': ['get', 'strokeColor'],
          'circle-stroke-width': 1.8,
          'circle-stroke-opacity': 0.82,
        }} />
      </Source>
      <Source id="plant-selected-source" type="geojson" data={selectedData as never}>
        <Layer id="plant-node-selected" type="circle" paint={{
          'circle-radius': ['+', ['get', 'radius'], 12],
          'circle-color': 'rgba(0,0,0,0)',
          'circle-stroke-color': ['get', 'strokeColor'],
          'circle-stroke-width': 1.6,
          'circle-stroke-opacity': 0.75,
        }} />
      </Source>

      {/* ── Bottom badge ───────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 16, transform: 'translateX(-50%)',
        fontSize: 8, color: 'rgba(124,92,252,0.60)', fontFamily: 'var(--font-mono)',
        letterSpacing: '0.08em', pointerEvents: 'none',
        textShadow: '0 0 8px rgba(124,92,252,0.28)', zIndex: 12, whiteSpace: 'nowrap',
      }}>
        CALDEIRA PROJECT · 193 km² · 77 licenses
      </div>

      {/* ── Hover tooltip card ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {hoveredNode && hoveredPalette && hoverLng !== null && hoverLat !== null && mapRef && (() => {
          const screenPos = mapRef.project([hoverLng, hoverLat])
          const container = mapRef.getContainer()
          const cW = container?.clientWidth ?? 1000
          const TOOLTIP_W = 220
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
                position: 'absolute', top, left, minWidth: 176, maxWidth: TOOLTIP_W,
                transform: 'translateY(-50%)',
                background: 'rgba(13,13,28,0.94)', backdropFilter: 'blur(12px)',
                border: `1px solid ${hoveredPalette.stroke}35`, borderRadius: 10,
                padding: '10px 12px', zIndex: 20,
                boxShadow: `0 0 18px ${hoveredPalette.stroke}14`, pointerEvents: 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>
                  {hoveredNode.properties.id}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: SR[hoveredNode.properties.status], letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  {hoveredNode.properties.status}
                </span>
              </div>
              <p style={{ margin: '0 0 3px', fontSize: 11, fontWeight: 600, color: hoveredNode.properties.labelColor }}>{hoveredNode.properties.label}</p>
              <p style={{ margin: '0 0 7px', fontSize: 10, color: W.text4 }}>{hoveredNode.properties.sublabel}</p>
              {hoveredMetric && (
                <div style={{ padding: '4px 8px', background: hoveredNode.properties.fillColor, border: `1px solid ${hoveredPalette.stroke}28`, borderRadius: 5, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: hoveredNode.properties.labelColor, fontFamily: 'var(--font-mono)' }}>{hoveredMetric}</span>
                </div>
              )}
              <div style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)' }}>
                {Math.abs(hoverLat).toFixed(3)}°S · {Math.abs(hoverLng).toFixed(3)}°W
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* ── Legend ──────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 10, alignItems: 'center',
        background: 'rgba(6,6,16,0.78)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '5px 10px',
        zIndex: 15, pointerEvents: 'none',
      }}>
        {(Object.entries(DC) as [Domain, typeof DC[Domain]][])
          .filter(([domain]) => domain !== 'external')
          .map(([domain, palette]) => (
            <div key={domain} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: palette.stroke, boxShadow: `0 0 4px ${palette.stroke}80`, display: 'inline-block' }} />
              <span style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{domain}</span>
            </div>
          ))}
      </div>
    </>
  )
}
