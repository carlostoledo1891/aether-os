import { useState, useCallback } from 'react'
import type { MapLayerMouseEvent } from '../../components/map/MapBase'
import { HYDRO_NODE_LAYER_ID, HYDRO_SPRING_LAYER_ID, toHydroNodeDetail, toSpringDetail } from '../../components/map/HydroOverlay'
import type { HydroOverlayNodeDetail } from '../../components/map/HydroOverlay'
import { CALDEIRA_BOUNDARY_LAYER_ID } from '../../components/map/CaldeiraBoundary'
import {
  ENV_APA_FILL_LAYER_ID,
  ENV_BUFFER_FILL_LAYER_ID,
  ENV_MONITORING_FILL_LAYER_ID,
  ENV_URBAN_FILL_LAYER_ID,
  parseEnvMapFeature,
} from '../../components/map/EnvironmentalOverlay'
import { DRILL_LAYER_ID, toDrillHoleDetail, parseLithologyIntervals } from '../../components/map/DrillHoleOverlay'
import { PFS_ENGINEERING_FILL_LAYER_ID, toPfsEngineeringDetail } from '../../components/map/PfsEngineeringOverlay'
import { INFRA_POINT_CORE_LAYER_ID } from '../../components/map/InfraOverlay'
import { OPS_PLANT_SITE_CORE_LAYER_ID } from '../../components/map/OpsPlantSitesOverlay'
import type { MapPopupData } from '../../components/map/MapFeaturePopup'
import { W } from '../../app/canvas/canvasTheme'
import type { MapSurface } from './constants'
import type { FieldOpsMapLayers } from './fieldMapLayers'
import {
  type FieldMapGeoSelection,
} from './fieldMapGeoSelection'
import type { SpringTelemetry } from '../../types/telemetry'
import type { LayerId } from '../../components/map/layerRegistry'
import {
  buildExternalPresentationFromRenderedFeature,
  requestExternalIdentify,
} from '../../components/map/externalLayerIdentify'

const OPS_LAYER_PRIORITY = [
  OPS_PLANT_SITE_CORE_LAYER_ID,
  INFRA_POINT_CORE_LAYER_ID,
  DRILL_LAYER_ID,
  PFS_ENGINEERING_FILL_LAYER_ID,
  ENV_APA_FILL_LAYER_ID,
] as const

const ENV_LAYER_PRIORITY = [
  HYDRO_SPRING_LAYER_ID,
  HYDRO_NODE_LAYER_ID,
  ENV_APA_FILL_LAYER_ID,
  'env-apa-label',
  ENV_BUFFER_FILL_LAYER_ID,
] as const

const OPS_UNIT_LOOKUP_LAYER_PRIORITY = [
  DRILL_LAYER_ID,
  ENV_APA_FILL_LAYER_ID,
  ENV_BUFFER_FILL_LAYER_ID,
  ENV_MONITORING_FILL_LAYER_ID,
  ENV_URBAN_FILL_LAYER_ID,
] as const

const ENV_UNIT_LOOKUP_LAYER_PRIORITY = [
  HYDRO_SPRING_LAYER_ID,
  HYDRO_NODE_LAYER_ID,
  ENV_APA_FILL_LAYER_ID,
  ENV_BUFFER_FILL_LAYER_ID,
  ENV_MONITORING_FILL_LAYER_ID,
  ENV_URBAN_FILL_LAYER_ID,
] as const

function pickFeatureByPriority(
  feats: MapLayerMouseEvent['features'] | undefined,
  order: readonly string[],
) {
  if (!feats?.length) return undefined
  for (const lid of order) {
    const f = feats.find((x) => x.layer?.id === lid)
    if (f) return f
  }
  return undefined
}

export interface UnitLookupCandidate {
  placeId: string
  layerId: string
}

function isUnitLookupFeature(
  feat: NonNullable<MapLayerMouseEvent['features']>[number] | undefined,
  mapTab: MapSurface,
): feat is NonNullable<MapLayerMouseEvent['features']>[number] {
  const layerId = feat?.layer?.id
  const props = feat?.properties as Record<string, unknown> | undefined
  const id = props?.id

  if (typeof layerId !== 'string' || typeof id !== 'string') return false

  if (layerId === DRILL_LAYER_ID || layerId === ENV_APA_FILL_LAYER_ID || layerId === ENV_BUFFER_FILL_LAYER_ID || layerId === ENV_MONITORING_FILL_LAYER_ID || layerId === ENV_URBAN_FILL_LAYER_ID) {
    return true
  }

  if (layerId === HYDRO_SPRING_LAYER_ID) return true

  if (layerId === HYDRO_NODE_LAYER_ID) {
    return mapTab === 'environment' && props?.nodeType === 'piezometer'
  }

  return false
}

export function getUnitLookupCandidate(
  feats: MapLayerMouseEvent['features'] | undefined,
  mapTab: MapSurface,
): UnitLookupCandidate | null {
  if (!feats?.length) return null

  const priority = mapTab === 'operations'
    ? OPS_UNIT_LOOKUP_LAYER_PRIORITY
    : ENV_UNIT_LOOKUP_LAYER_PRIORITY

  const prioritized = pickFeatureByPriority(
    feats.filter(feat => isUnitLookupFeature(feat, mapTab)),
    priority as unknown as string[],
  )

  const props = prioritized?.properties as Record<string, unknown> | undefined
  const placeId = props?.id
  const layerId = prioritized?.layer?.id
  if (typeof placeId !== 'string' || typeof layerId !== 'string') return null

  return { placeId, layerId }
}

export interface UseMapInteractionParams {
  mapTab: MapSurface
  opsMapLayers: FieldOpsMapLayers
  springsRef: React.RefObject<SpringTelemetry[]>
  visibleLayerIds: LayerId[]
}

export interface UseMapInteractionReturn {
  hoveredNodeId: string | null
  setHoveredNodeId: React.Dispatch<React.SetStateAction<string | null>>
  mapHoverHint: string | null
  setMapHoverHint: React.Dispatch<React.SetStateAction<string | null>>
  popupData: { data: MapPopupData; x: number; y: number } | null
  setPopupData: React.Dispatch<React.SetStateAction<{ data: MapPopupData; x: number; y: number } | null>>
  selectedHydroNode: HydroOverlayNodeDetail | null
  setSelectedHydroNode: React.Dispatch<React.SetStateAction<HydroOverlayNodeDetail | null>>
  geoSelection: FieldMapGeoSelection | null
  setGeoSelection: React.Dispatch<React.SetStateAction<FieldMapGeoSelection | null>>
  handleMouseEnter: (e: MapLayerMouseEvent) => void
  handleMouseMove: (e: MapLayerMouseEvent) => void
  handleMouseLeave: () => void
  handleMapClick: (e: MapLayerMouseEvent) => void
}

export function useMapInteraction({
  mapTab,
  opsMapLayers,
  springsRef,
  visibleLayerIds,
}: UseMapInteractionParams): UseMapInteractionReturn {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [mapHoverHint, setMapHoverHint] = useState<string | null>(null)
  const [popupData, setPopupData] = useState<{ data: MapPopupData; x: number; y: number } | null>(null)
  const [selectedHydroNode, setSelectedHydroNode] = useState<HydroOverlayNodeDetail | null>(null)
  const [geoSelection, setGeoSelection] = useState<FieldMapGeoSelection | null>(null)

  const handleMouseEnter = useCallback(
    (e: MapLayerMouseEvent) => {
      const priority = mapTab === 'operations' ? OPS_LAYER_PRIORITY : ENV_LAYER_PRIORITY
      const priorityPick = pickFeatureByPriority(e.features, priority as unknown as string[])
      const feat = priorityPick
        ?? (e.features && e.features.length > 1
          ? e.features.find(f => f.layer?.id !== CALDEIRA_BOUNDARY_LAYER_ID) ?? e.features[0]
          : e.features?.[0])
      const layerId = feat?.layer?.id
      const props = feat?.properties as Record<string, unknown> | undefined
      const id = props?.id
      const px = e.point
      if (layerId === OPS_PLANT_SITE_CORE_LAYER_ID && typeof id === 'string') {
        setHoveredNodeId(id)
        setMapHoverHint(null)
        setPopupData(null)
        return
      }
      if (mapTab === 'environment' && (layerId === HYDRO_NODE_LAYER_ID || layerId === HYDRO_SPRING_LAYER_ID) && typeof id === 'string') {
        setHoveredNodeId(id)
        setMapHoverHint(null)
        setPopupData(null)
        return
      }

      if (layerId === DRILL_LAYER_ID && typeof id === 'string') {
        setHoveredNodeId(id)
        setMapHoverHint(null)
        const lithIntervals = parseLithologyIntervals(props?.lithology_intervals)
        setPopupData({
          x: px.x, y: px.y,
          data: {
            title: String(id),
            subtitle: `${props?.hole_type ?? 'DD'} · ${props?.treo_ppm ?? 0} ppm TREO · ${props?.depth_m ?? 0} m`,
            accentColor: W.violetSoft,
            rows: [
              { label: 'Deposit', value: String(props?.deposit ?? '—') },
            ],
            footer: props?.source_ref ? `${props.source_ref}${props.as_of ? ` · ${props.as_of}` : ''}` : undefined,
            lithologyIntervals: lithIntervals,
          },
        })
        return
      }
      if (layerId === PFS_ENGINEERING_FILL_LAYER_ID && props) {
        setHoveredNodeId(null)
        setMapHoverHint(null)
        setPopupData({
          x: px.x, y: px.y,
          data: {
            title: String(props.label ?? props.id ?? ''),
            accentColor: W.amber,
            rows: [
              { label: 'Type', value: String(props.engineering_kind ?? '—') },
              ...(props.note ? [{ label: 'Note', value: String(props.note) }] : []),
            ],
          },
        })
        return
      }
      if (layerId === INFRA_POINT_CORE_LAYER_ID && props) {
        setHoveredNodeId(null)
        setMapHoverHint(null)
        setPopupData({
          x: px.x, y: px.y,
          data: {
            title: String(props.label ?? props.id ?? ''),
            accentColor: W.green,
            rows: [
              { label: 'Kind', value: String(props.kind ?? '—') },
              ...(props.sublabel ? [{ label: 'Detail', value: String(props.sublabel) }] : []),
            ],
          },
        })
        return
      }
      if (layerId === CALDEIRA_BOUNDARY_LAYER_ID) {
        setHoveredNodeId(null)
        setMapHoverHint(null)
        setPopupData({
          x: px.x, y: px.y,
          data: {
            title: 'Caldeira Alkaline Complex',
            accentColor: W.violet,
            rows: [
              { label: 'Area', value: '~193 km²' },
              { label: 'Type', value: 'Alkaline intrusion' },
              { label: 'Age', value: '~80 Ma (Cretaceous)' },
            ],
          },
        })
        return
      }

      if (layerId && props) {
        const externalPresentation = buildExternalPresentationFromRenderedFeature(layerId, props)
        if (externalPresentation) {
          setHoveredNodeId(null)
          setMapHoverHint(null)
          setPopupData({
            x: px.x,
            y: px.y,
            data: externalPresentation,
          })
          return
        }
      }

      setHoveredNodeId(null)
      setPopupData(null)
      const label = props?.label ?? props?.name ?? props?.id
      if (typeof label === 'string') setMapHoverHint(label)
    },
    [mapTab],
  )

  const handleMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      handleMouseEnter(e)
    },
    [handleMouseEnter],
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredNodeId(null)
    setMapHoverHint(null)
    setPopupData(null)
  }, [])

  const handleMapClick = useCallback(
    async (e: MapLayerMouseEvent) => {
      const feats = e.features

      const nonBoundaryFeat = feats?.find(f => f.layer?.id !== CALDEIRA_BOUNDARY_LAYER_ID)
      const boundaryFeat = feats?.find(f => f.layer?.id === CALDEIRA_BOUNDARY_LAYER_ID)
      if (boundaryFeat && !nonBoundaryFeat) {
        setSelectedHydroNode(null)
        setGeoSelection((g) =>
          g?.kind === 'boundary'
            ? null
            : {
                kind: 'boundary',
                detail: {
                  name: 'Caldeira Alkaline Complex',
                  area_km2: 193,
                  type: 'Alkaline intrusion',
                  age: '~80 Ma (Cretaceous)',
                  geology: 'Phonolite-tinguaite-nepheline syenite complex with laterite cap',
                },
              },
        )
        return
      }

      const externalFeat = feats?.find(f => {
        const layerId = f.layer?.id
        return typeof layerId === 'string' && !!f.properties && buildExternalPresentationFromRenderedFeature(layerId, f.properties as Record<string, unknown>)
      })
      if (externalFeat?.properties && typeof externalFeat.layer?.id === 'string') {
        const snapshotPresentation = buildExternalPresentationFromRenderedFeature(
          externalFeat.layer.id,
          externalFeat.properties as Record<string, unknown>,
        )
        if (snapshotPresentation) {
          setSelectedHydroNode(null)
          try {
            const livePresentation = visibleLayerIds.includes(snapshotPresentation.layerId as LayerId)
              ? await requestExternalIdentify(
                  snapshotPresentation.layerId,
                  e.lngLat.lng,
                  e.lngLat.lat,
                )
              : null
            const nextPresentation = livePresentation ?? snapshotPresentation
            setGeoSelection(g =>
              g?.kind === 'external' && g.detail.layerId === nextPresentation.layerId && g.detail.title === nextPresentation.title
                ? null
                : { kind: 'external', detail: nextPresentation },
            )
          } catch {
            setGeoSelection(g =>
              g?.kind === 'external' && g.detail.layerId === snapshotPresentation.layerId && g.detail.title === snapshotPresentation.title
                ? null
                : { kind: 'external', detail: snapshotPresentation },
            )
          }
          return
        }
      }

      if (mapTab === 'operations') {
        const feat = pickFeatureByPriority(feats, OPS_LAYER_PRIORITY as unknown as string[])
        if (!feat?.properties) return
        const layerId = feat.layer?.id
        const props = feat.properties as Record<string, unknown>
        const id = props.id
        if (typeof id !== 'string') return

        if (layerId === OPS_PLANT_SITE_CORE_LAYER_ID && opsMapLayers.plantSites) {
          setGeoSelection((g) =>
            g?.kind === 'infra' && g.id === id
              ? null
              : {
                  kind: 'infra',
                  id,
                  label: String(props.label ?? ''),
                  sublabel: String(props.sublabel ?? ''),
                  infraKind: String(props.kind ?? 'plant'),
                  details: props.details ? String(props.details) : undefined,
                  source_ref: props.source_ref ? String(props.source_ref) : undefined,
                  as_of: props.as_of ? String(props.as_of) : undefined,
                  confidence: props.confidence ? String(props.confidence) : undefined,
                },
          )
          return
        }

        if (layerId === DRILL_LAYER_ID && opsMapLayers.drillHoles) {
          const d = toDrillHoleDetail(props)
          if (d) setGeoSelection((g) => (g?.kind === 'drill' && g.detail.id === id ? null : { kind: 'drill', detail: d }))
          return
        }
        if (layerId === PFS_ENGINEERING_FILL_LAYER_ID && opsMapLayers.pfsEngineering) {
          const d = toPfsEngineeringDetail(props)
          if (d) setGeoSelection((g) => (g?.kind === 'pfs' && g.detail.id === id ? null : { kind: 'pfs', detail: d }))
          return
        }
        if (layerId === INFRA_POINT_CORE_LAYER_ID && opsMapLayers.infra) {
          setGeoSelection((g) =>
            g?.kind === 'infra' && g.id === id
              ? null
              : {
                  kind: 'infra',
                  id,
                  label: String(props.label ?? ''),
                  sublabel: String(props.sublabel ?? ''),
                  infraKind: String(props.kind ?? ''),
                  details: props.details ? String(props.details) : undefined,
                  source_ref: props.source_ref ? String(props.source_ref) : undefined,
                  as_of: props.as_of ? String(props.as_of) : undefined,
                  confidence: props.confidence ? String(props.confidence) : undefined,
                },
          )
          return
        }
        return
      }

      /* environment tab */
      const feat = pickFeatureByPriority(feats, ENV_LAYER_PRIORITY as unknown as string[])
      if (!feat?.properties) return
      const layerId = feat.layer?.id
      const props = feat.properties as Record<string, unknown>
      const id = props.id
      if (typeof id !== 'string') return

      if (layerId === HYDRO_SPRING_LAYER_ID || layerId === HYDRO_NODE_LAYER_ID) {
        setGeoSelection(null)
        const coords = (feat.geometry as { coordinates?: [number, number] }).coordinates
        setSelectedHydroNode(prev => {
          if (prev?.id === id) return null
          const springTelem = layerId === HYDRO_SPRING_LAYER_ID ? springsRef.current.find((s) => s.id === id) : undefined
          const detail =
            layerId === HYDRO_SPRING_LAYER_ID
              ? toSpringDetail(props, coords, springTelem)
              : toHydroNodeDetail(props, coords)
          return detail ?? null
        })
        return
      }

      setSelectedHydroNode(null)

      const envDetail = parseEnvMapFeature(props)
      if (envDetail) {
        setGeoSelection((g) => (g?.kind === 'env' && g.detail.id === id ? null : { kind: 'env', detail: envDetail }))
      }
    },
    [
      mapTab,
      opsMapLayers.drillHoles,
      opsMapLayers.pfsEngineering,
      opsMapLayers.plantSites,
      opsMapLayers.infra,
      springsRef,
      visibleLayerIds,
    ],
  )

  return {
    hoveredNodeId,
    setHoveredNodeId,
    mapHoverHint,
    setMapHoverHint,
    popupData,
    setPopupData,
    selectedHydroNode,
    setSelectedHydroNode,
    geoSelection,
    setGeoSelection,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
    handleMapClick,
  }
}
