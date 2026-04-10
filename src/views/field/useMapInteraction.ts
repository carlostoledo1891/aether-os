import { useState, useCallback, useRef } from 'react'
import type { MapLayerMouseEvent } from '../../components/map/MapBase'
import { PLANT_NODE_LAYER_ID, toPlantNodeDetail } from '../../components/map/PlantOverlay'
import type { PlantOverlayNodeDetail } from '../../components/map/PlantOverlay'
import { HYDRO_NODE_LAYER_ID, HYDRO_SPRING_LAYER_ID, toHydroNodeDetail, toSpringDetail } from '../../components/map/HydroOverlay'
import type { HydroOverlayNodeDetail } from '../../components/map/HydroOverlay'
import { CALDEIRA_BOUNDARY_LAYER_ID } from '../../components/map/CaldeiraBoundary'
import {
  ENV_APA_FILL_LAYER_ID,
  ENV_BUFFER_FILL_LAYER_ID,
  ENV_MONITORING_FILL_LAYER_ID,
  ENV_URBAN_FILL_LAYER_ID,
  ENV_URBAN_CENTROID_CORE_LAYER_ID,
  parseEnvMapFeature,
} from '../../components/map/EnvironmentalOverlay'
import { LICENSE_LAYER_ID, toLicenseDetail } from '../../components/map/LicenseOverlay'
import { DEPOSIT_LAYER_ID, toDepositDetail } from '../../components/map/DepositOverlay'
import { DRILL_LAYER_ID, toDrillHoleDetail, parseLithologyIntervals } from '../../components/map/DrillHoleOverlay'
import { PFS_ENGINEERING_FILL_LAYER_ID, toPfsEngineeringDetail } from '../../components/map/PfsEngineeringOverlay'
import { INFRA_POINT_CORE_LAYER_ID } from '../../components/map/InfraOverlay'
import { OPS_PLANT_SITE_CORE_LAYER_ID } from '../../components/map/OpsPlantSitesOverlay'
import { ACCESS_ROUTE_LINE_LAYER_ID } from '../../components/map/AccessRoutesOverlay'
import { LICENCE_ENVELOPE_FILL_LAYER_ID } from '../../components/map/LicenceEnvelopeOverlay'
import type { MapPopupData } from '../../components/map/MapFeaturePopup'
import { W } from '../../app/canvas/canvasTheme'
import type { MapTab } from './constants'
import type { FieldOpsMapLayers } from './fieldMapLayers'
import {
  type FieldMapGeoSelection,
  toAccessRouteDetail,
  toLicenceEnvelopeDetail,
} from './fieldMapGeoSelection'
import type { SpringTelemetry } from '../../types/telemetry'

const OPS_LAYER_PRIORITY = [
  OPS_PLANT_SITE_CORE_LAYER_ID,
  PLANT_NODE_LAYER_ID,
  INFRA_POINT_CORE_LAYER_ID,
  ACCESS_ROUTE_LINE_LAYER_ID,
  DRILL_LAYER_ID,
  PFS_ENGINEERING_FILL_LAYER_ID,
  LICENSE_LAYER_ID,
  DEPOSIT_LAYER_ID,
  LICENCE_ENVELOPE_FILL_LAYER_ID,
  ENV_APA_FILL_LAYER_ID,
] as const

const ENV_LAYER_PRIORITY = [
  HYDRO_SPRING_LAYER_ID,
  HYDRO_NODE_LAYER_ID,
  ENV_URBAN_CENTROID_CORE_LAYER_ID,
  ENV_URBAN_FILL_LAYER_ID,
  'env-urban-label',
  'env-urban-centroid-label',
  ENV_APA_FILL_LAYER_ID,
  'env-apa-label',
  ENV_BUFFER_FILL_LAYER_ID,
  ENV_MONITORING_FILL_LAYER_ID,
  LICENSE_LAYER_ID,
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

export interface UseMapInteractionParams {
  mapTab: MapTab
  opsMapLayers: FieldOpsMapLayers
  springsRef: React.RefObject<SpringTelemetry[]>
}

export interface UseMapInteractionReturn {
  hoveredNodeId: string | null
  setHoveredNodeId: React.Dispatch<React.SetStateAction<string | null>>
  mapHoverHint: string | null
  setMapHoverHint: React.Dispatch<React.SetStateAction<string | null>>
  popupData: { data: MapPopupData; x: number; y: number } | null
  setPopupData: React.Dispatch<React.SetStateAction<{ data: MapPopupData; x: number; y: number } | null>>
  selectedPlantNode: PlantOverlayNodeDetail | null
  setSelectedPlantNode: React.Dispatch<React.SetStateAction<PlantOverlayNodeDetail | null>>
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
}: UseMapInteractionParams): UseMapInteractionReturn {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [mapHoverHint, setMapHoverHint] = useState<string | null>(null)
  const [popupData, setPopupData] = useState<{ data: MapPopupData; x: number; y: number } | null>(null)
  const [selectedPlantNode, setSelectedPlantNode] = useState<PlantOverlayNodeDetail | null>(null)
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
      if (
        (layerId === PLANT_NODE_LAYER_ID || layerId === OPS_PLANT_SITE_CORE_LAYER_ID) &&
        typeof id === 'string'
      ) {
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
            accentColor: W.violetSoft,
            rows: [
              { label: 'TREO', value: `${Number(props?.treo_ppm ?? 0)} ppm` },
              { label: 'Depth', value: `${Number(props?.depth_m ?? 0)} m` },
              { label: 'Deposit', value: String(props?.deposit ?? '—') },
              { label: 'Type', value: String(props?.hole_type ?? '—') },
            ],
            lithologyIntervals: lithIntervals,
          },
        })
        return
      }
      if (layerId === DEPOSIT_LAYER_ID && props) {
        setHoveredNodeId(null)
        setMapHoverHint(null)
        setPopupData({
          x: px.x, y: px.y,
          data: {
            title: String(props.name ?? props.id ?? ''),
            accentColor: W.cyan,
            rows: [
              { label: 'Status', value: String(props.status ?? '—') },
              { label: 'TREO', value: `${Number(props.treo_ppm ?? 0)} ppm` },
              { label: 'Tonnage', value: `${Number(props.tonnage_mt ?? 0)} Mt` },
            ],
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
      if (layerId === LICENSE_LAYER_ID && props) {
        setHoveredNodeId(null)
        setMapHoverHint(null)
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

      setHoveredNodeId(null)
      setPopupData(null)
      const label = props?.label ?? props?.name ?? props?.id
      if (typeof label === 'string') setMapHoverHint(label)
    },
    [mapTab],
  )

  const rafRef = useRef(0)
  const handleMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        handleMouseEnter(e)
      })
    },
    [handleMouseEnter],
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredNodeId(null)
    setMapHoverHint(null)
    setPopupData(null)
  }, [])

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feats = e.features

      const nonBoundaryFeat = feats?.find(f => f.layer?.id !== CALDEIRA_BOUNDARY_LAYER_ID)
      const boundaryFeat = feats?.find(f => f.layer?.id === CALDEIRA_BOUNDARY_LAYER_ID)
      if (boundaryFeat && !nonBoundaryFeat) {
        setSelectedPlantNode(null)
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

      if (mapTab === 'operations') {
        const feat = pickFeatureByPriority(feats, OPS_LAYER_PRIORITY as unknown as string[])
        if (!feat?.properties) return
        const layerId = feat.layer?.id
        const props = feat.properties as Record<string, unknown>
        const id = props.id
        if (typeof id !== 'string') return

        if (layerId === PLANT_NODE_LAYER_ID && opsMapLayers.plantSchematic) {
          setGeoSelection(null)
          const coords = (feat.geometry as { coordinates?: [number, number] }).coordinates
          setSelectedPlantNode(prev => {
            if (prev?.id === id) return null
            return toPlantNodeDetail(props, coords)
          })
          return
        }

        if (layerId === OPS_PLANT_SITE_CORE_LAYER_ID && opsMapLayers.plantSites) {
          setSelectedPlantNode(null)
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

        setSelectedPlantNode(null)

        if (layerId === ACCESS_ROUTE_LINE_LAYER_ID && opsMapLayers.accessRoutes) {
          const d = toAccessRouteDetail(props)
          if (d) setGeoSelection((g) => (g?.kind === 'route' && g.detail.id === id ? null : { kind: 'route', detail: d }))
          return
        }

        if (layerId === LICENCE_ENVELOPE_FILL_LAYER_ID && opsMapLayers.licenceEnvelope) {
          const d = toLicenceEnvelopeDetail(props)
          if (d) {
            setGeoSelection((g) =>
              g?.kind === 'licenceEnvelope' && g.detail.id === id ? null : { kind: 'licenceEnvelope', detail: d },
            )
          }
          return
        }

        if (layerId === LICENSE_LAYER_ID && opsMapLayers.tenements) {
          const d = toLicenseDetail(props)
          if (d) setGeoSelection((g) => (g?.kind === 'license' && g.detail.id === id ? null : { kind: 'license', detail: d }))
          return
        }
        if (layerId === DRILL_LAYER_ID && opsMapLayers.drillHoles) {
          const d = toDrillHoleDetail(props)
          if (d) setGeoSelection((g) => (g?.kind === 'drill' && g.detail.id === id ? null : { kind: 'drill', detail: d }))
          return
        }
        if (layerId === DEPOSIT_LAYER_ID && opsMapLayers.deposits) {
          const d = toDepositDetail(props)
          if (d) setGeoSelection((g) => (g?.kind === 'deposit' && g.detail.id === id ? null : { kind: 'deposit', detail: d }))
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

      if (layerId === LICENSE_LAYER_ID) {
        const d = toLicenseDetail(props)
        if (d) setGeoSelection((g) => (g?.kind === 'license' && g.detail.id === id ? null : { kind: 'license', detail: d }))
        return
      }

      const envDetail = parseEnvMapFeature(props)
      if (envDetail) {
        setGeoSelection((g) => (g?.kind === 'env' && g.detail.id === id ? null : { kind: 'env', detail: envDetail }))
      }
    },
    [
      mapTab,
      opsMapLayers.tenements,
      opsMapLayers.deposits,
      opsMapLayers.drillHoles,
      opsMapLayers.pfsEngineering,
      opsMapLayers.plantSites,
      opsMapLayers.infra,
      opsMapLayers.plantSchematic,
      opsMapLayers.accessRoutes,
      opsMapLayers.licenceEnvelope,
      springsRef,
    ],
  )

  return {
    hoveredNodeId,
    setHoveredNodeId,
    mapHoverHint,
    setMapHoverHint,
    popupData,
    setPopupData,
    selectedPlantNode,
    setSelectedPlantNode,
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
