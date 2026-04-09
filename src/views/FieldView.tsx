import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Layers, Settings } from 'lucide-react'
import { TabSwitcher } from '../components/ui/TabSwitcher'
import { MapBase, CALDEIRA_BBOX } from '../components/map/MapBase'
import type { MapLayerMouseEvent } from '../components/map/MapBase'
import { PlantOverlay, PLANT_NODE_LAYER_ID, toPlantNodeDetail } from '../components/map/PlantOverlay'
import type { PlantOverlayNodeDetail } from '../components/map/PlantOverlay'
import { HydroOverlay, HYDRO_NODE_LAYER_ID, HYDRO_SPRING_LAYER_ID, toHydroNodeDetail, toSpringDetail } from '../components/map/HydroOverlay'
import type { HydroOverlayNodeDetail } from '../components/map/HydroOverlay'
import { CaldeiraBoundary, CALDEIRA_BOUNDARY_LAYER_ID } from '../components/map/CaldeiraBoundary'
import {
  EnvironmentalOverlay,
  ENV_APA_FILL_LAYER_ID,
  ENV_BUFFER_FILL_LAYER_ID,
  ENV_MONITORING_FILL_LAYER_ID,
  ENV_URBAN_FILL_LAYER_ID,
  ENV_URBAN_CENTROID_CORE_LAYER_ID,
  UDC_REFERENCE_LAYER_ID,
  parseEnvMapFeature,
} from '../components/map/EnvironmentalOverlay'
import { LicenseOverlay, LICENSE_LAYER_ID, toLicenseDetail } from '../components/map/LicenseOverlay'
import { DepositOverlay, DEPOSIT_LAYER_ID, toDepositDetail } from '../components/map/DepositOverlay'
import { DrillHoleOverlay, DRILL_LAYER_ID, toDrillHoleDetail, parseLithologyIntervals } from '../components/map/DrillHoleOverlay'
import { PfsEngineeringOverlay, PFS_ENGINEERING_FILL_LAYER_ID, toPfsEngineeringDetail } from '../components/map/PfsEngineeringOverlay'
import { InfraOverlay, INFRA_POINT_CORE_LAYER_ID } from '../components/map/InfraOverlay'
import { OpsPlantSitesOverlay, OPS_PLANT_SITE_CORE_LAYER_ID } from '../components/map/OpsPlantSitesOverlay'
import { AccessRoutesOverlay, ACCESS_ROUTE_LINE_LAYER_ID } from '../components/map/AccessRoutesOverlay'
import { LicenceEnvelopeOverlay, LICENCE_ENVELOPE_FILL_LAYER_ID } from '../components/map/LicenceEnvelopeOverlay'
import { NeighborOverlay } from '../components/map/NeighborOverlay'
import { MapFeaturePopup } from '../components/map/MapFeaturePopup'
import { MapLayerPicker } from '../components/map/MapLayerPicker'
import type { MapPopupData } from '../components/map/MapFeaturePopup'
import { W } from '../app/canvas/canvasTheme'
import { useMapCamera } from '../contexts/MapCameraContext'
import { useMap } from 'react-map-gl/maplibre'
import { useTelemetry } from '../services/DataServiceProvider'
import { useServiceQuery } from '../hooks/useServiceQuery'
import { useSiteWeather } from '../hooks/useSiteWeather'

import type { MapTab } from './field/constants'
import { TAB_COLOR } from './field/constants'
import { OperationsPanel } from './field/OperationsPanel'
import { EnvironmentPanel } from './field/EnvironmentPanel'
import { FieldBottomMetrics } from './field/FieldBottomMetrics'
import { FieldPinnedAssetCard } from './field/FieldPinnedAssetCard'
// FieldMapGeoInspector content merged into FieldPinnedAssetCard
import {
  DEFAULT_FIELD_ENV_LAYERS,
  DEFAULT_FIELD_OPS_LAYERS,
  type FieldEnvMapLayers,
  type FieldOpsMapLayers,
} from './field/fieldMapLayers'
import {
  type FieldMapGeoSelection,
  toAccessRouteDetail,
  toLicenceEnvelopeDetail,
} from './field/fieldMapGeoSelection'
import fieldChrome from './field/FieldMapChrome.module.css'
const TAB_ITEMS: { id: MapTab; label: string; icon: typeof Settings; color: string }[] = [
  { id: 'operations',  label: 'Operations', icon: Settings,    color: W.violet },
  { id: 'environment', label: 'Hydro Twin', icon: Layers,      color: W.cyan   },
]

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
] as const

const ENV_LAYER_PRIORITY = [
  HYDRO_SPRING_LAYER_ID,
  HYDRO_NODE_LAYER_ID,
  UDC_REFERENCE_LAYER_ID,
  'env-udc-label',
  ENV_URBAN_CENTROID_CORE_LAYER_ID,
  ENV_URBAN_FILL_LAYER_ID,
  'env-urban-label',
  'env-urban-centroid-label',
  ENV_APA_FILL_LAYER_ID,
  'env-apa-label',
  ENV_BUFFER_FILL_LAYER_ID,
  ENV_MONITORING_FILL_LAYER_ID,
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

interface FieldViewProps {
  highlightFeatureId?: string | null
}

export function FieldView({ highlightFeatureId }: FieldViewProps) {
  const { saveCamera, getCamera, clearCamera } = useMapCamera()
  const maps = useMap()
  const { plant, env } = useTelemetry()
  const springsRef = useRef(env.springs)
  springsRef.current = env.springs

  const [initialCamera] = useState(() => {
    const saved = getCamera()
    if (saved) {
      clearCamera()
      return saved
    }
    return null
  })

  const didInitialFit = useRef(false)
  useEffect(() => {
    if (initialCamera || didInitialFit.current) return
    const mapRef = maps['aetherField' as keyof typeof maps] ?? maps.current
    if (!mapRef) return
    didInitialFit.current = true
    mapRef.fitBounds(CALDEIRA_BBOX, { padding: 60, duration: 1000, pitch: 35, bearing: 0 })
  }, [maps, initialCamera])

  useEffect(() => {
    return () => {
      const mapRef = maps['aetherField' as keyof typeof maps] ?? maps.current
      if (!mapRef) return
      const map = (mapRef as any).getMap?.()
      if (!map) return
      const center = map.getCenter()
      saveCamera({
        longitude: center.lng,
        latitude: center.lat,
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      })
    }
  }, [maps, saveCamera])

  const { data: PROJECT_FINANCIALS } = useServiceQuery('project-financials', s => s.getProjectFinancials())
  const { data: PREDICTIVE_HYDROLOGY_SCENARIOS } = useServiceQuery('hydrology-scenarios', s => s.getHydrologyScenarios())
  const { data: SPRING_COUNT } = useServiceQuery('spring-count', s => s.getSpringCount())
  const [mapTab, setMapTab] = useState<MapTab>('operations')
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [mapHoverHint, setMapHoverHint] = useState<string | null>(null)
  const [selectedPlantNode, setSelectedPlantNode] = useState<PlantOverlayNodeDetail | null>(null)
  const [selectedHydroNode, setSelectedHydroNode] = useState<HydroOverlayNodeDetail | null>(null)
  const [geoSelection, setGeoSelection] = useState<FieldMapGeoSelection | null>(null)
  const [opsMapLayers, setOpsMapLayers] = useState<FieldOpsMapLayers>(DEFAULT_FIELD_OPS_LAYERS)
  const [envMapLayers, setEnvMapLayers] = useState<FieldEnvMapLayers>(DEFAULT_FIELD_ENV_LAYERS)
  const [popupData, setPopupData] = useState<{ data: MapPopupData; x: number; y: number } | null>(null)

  const interactiveLayerIds = useMemo(() => {
    if (mapTab === 'operations') {
      const ids: string[] = []
      if (opsMapLayers.deposits) ids.push(DEPOSIT_LAYER_ID)
      if (opsMapLayers.tenements) ids.push(LICENSE_LAYER_ID)
      if (opsMapLayers.drillHoles) ids.push(DRILL_LAYER_ID)
      if (opsMapLayers.pfsEngineering) ids.push(PFS_ENGINEERING_FILL_LAYER_ID)
      if (opsMapLayers.plantSites) ids.push(OPS_PLANT_SITE_CORE_LAYER_ID)
      if (opsMapLayers.infra) ids.push(INFRA_POINT_CORE_LAYER_ID)
      if (opsMapLayers.plantSchematic) ids.push(PLANT_NODE_LAYER_ID)
      if (opsMapLayers.accessRoutes) ids.push(ACCESS_ROUTE_LINE_LAYER_ID)
      if (opsMapLayers.licenceEnvelope) ids.push(LICENCE_ENVELOPE_FILL_LAYER_ID)
      if (opsMapLayers.apa) ids.push(ENV_APA_FILL_LAYER_ID, 'env-apa-label')
      ids.push(CALDEIRA_BOUNDARY_LAYER_ID)
      return ids
    }
    const e: string[] = [HYDRO_NODE_LAYER_ID, HYDRO_SPRING_LAYER_ID]
    if (envMapLayers.apa) e.push(ENV_APA_FILL_LAYER_ID, 'env-apa-label')
    if (envMapLayers.buffer) e.push(ENV_BUFFER_FILL_LAYER_ID)
    if (envMapLayers.monitoring) e.push(ENV_MONITORING_FILL_LAYER_ID)
    if (envMapLayers.urban) {
      e.push(
        ENV_URBAN_CENTROID_CORE_LAYER_ID,
        'env-urban-centroid-label',
        ENV_URBAN_FILL_LAYER_ID,
        'env-urban-label',
      )
    }
    if (envMapLayers.udc) e.push(UDC_REFERENCE_LAYER_ID, 'env-udc-label')
    e.push(CALDEIRA_BOUNDARY_LAYER_ID)
    return e
  }, [mapTab, opsMapLayers, envMapLayers])

  const handleMouseEnter = useCallback(
    (e: MapLayerMouseEvent) => {
      // Prefer specific features over broad area layers (boundary fill/line)
      const feat = e.features && e.features.length > 1
        ? e.features.find(f => f.layer?.id !== CALDEIRA_BOUNDARY_LAYER_ID) ?? e.features[0]
        : e.features?.[0]
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

  const handleMouseLeave = useCallback(() => {
    setHoveredNodeId(null)
    setMapHoverHint(null)
    setPopupData(null)
  }, [])

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feats = e.features

      // Check if ONLY the boundary was hit (no more specific features)
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
          if (selectedPlantNode?.id === id) {
            setSelectedPlantNode(null)
            return
          }
          setSelectedPlantNode(toPlantNodeDetail(props, coords))
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
        if (selectedHydroNode?.id === id) {
          setSelectedHydroNode(null)
          return
        }
        const springTelem = layerId === HYDRO_SPRING_LAYER_ID ? springsRef.current.find((s) => s.id === id) : undefined
        const detail =
          layerId === HYDRO_SPRING_LAYER_ID
            ? toSpringDetail(props, coords, springTelem)
            : toHydroNodeDetail(props, coords)
        if (detail) setSelectedHydroNode(detail)
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
      opsMapLayers.tenements,
      opsMapLayers.deposits,
      opsMapLayers.drillHoles,
      opsMapLayers.pfsEngineering,
      opsMapLayers.plantSites,
      opsMapLayers.infra,
      opsMapLayers.plantSchematic,
      opsMapLayers.accessRoutes,
      opsMapLayers.licenceEnvelope,
      selectedPlantNode,
      selectedHydroNode,
    ],
  )

  const switchTab = useCallback((tab: MapTab) => {
    setMapTab(tab)
    setHoveredNodeId(null)
    setMapHoverHint(null)
    setGeoSelection(null)
  }, [])

  const handleClearGeoSelection = useCallback(() => setGeoSelection(null), [])

  const clearPinnedNode = useCallback(() => {
    if (mapTab === 'operations') setSelectedPlantNode(null)
    else setSelectedHydroNode(null)
  }, [mapTab])

  const currentScenario = PREDICTIVE_HYDROLOGY_SCENARIOS?.[1] ?? PREDICTIVE_HYDROLOGY_SCENARIOS?.[0]

  const weather = useSiteWeather(30, { enabled: mapTab === 'environment' })
  const hydroWeatherStrip = useMemo(
    () => ({
      loading: weather.loading,
      error: weather.error,
      windowPrecipMm: weather.windowPrecipMm,
      anomalyMm: weather.anomalyMm,
      source: weather.source,
      scenarioDroughtIndex: currentScenario?.drought_index ?? 0,
      scenarioHorizon: currentScenario?.horizon ?? '',
    }),
    [weather, currentScenario],
  )

  const layerToggles = useMemo(() => {
    if (mapTab === 'operations') {
      return [
        { id: 'plantSites', label: 'Pilot + commercial plant sites', checked: opsMapLayers.plantSites },
        { id: 'tenements', label: 'Mining licences (per block)', checked: opsMapLayers.tenements },
        { id: 'pfsEngineering', label: 'PFS starter pit + spent clay', checked: opsMapLayers.pfsEngineering },
        { id: 'drillHoles', label: 'Named drill collars', checked: opsMapLayers.drillHoles },
        { id: 'accessRoutes', label: 'Access road (concept)', checked: opsMapLayers.accessRoutes },
        { id: 'licenceEnvelope', label: 'Caldeira 193 km² envelope', checked: opsMapLayers.licenceEnvelope },
        { id: 'apa', label: 'APA Pedra Branca (protected area)', checked: opsMapLayers.apa },
        { id: 'deposits', label: 'Deposit shell polygons', checked: opsMapLayers.deposits },
        { id: 'infra', label: 'Logistics mesh', checked: opsMapLayers.infra },
        { id: 'plantSchematic', label: 'Pilot flow schematic', checked: opsMapLayers.plantSchematic },
        { id: 'neighbors', label: 'Adjacent tenement', checked: opsMapLayers.neighbors },
      ]
    }
    return [
      { id: 'apa', label: 'APA Pedra Branca (core)', checked: envMapLayers.apa },
      { id: 'buffer', label: 'APA buffer ring', checked: envMapLayers.buffer },
      { id: 'monitoring', label: 'Monitoring / cumulative zone', checked: envMapLayers.monitoring },
      { id: 'urban', label: 'Urban context (OSM-style)', checked: envMapLayers.urban },
      { id: 'udc', label: 'UDC / reference footprint', checked: envMapLayers.udc },
    ]
  }, [mapTab, opsMapLayers, envMapLayers])

  const handleLayerToggle = useCallback((id: string) => {
    if (mapTab === 'operations') {
      setOpsMapLayers(prev => ({ ...prev, [id]: !prev[id as keyof FieldOpsMapLayers] }))
    } else {
      setEnvMapLayers(prev => ({ ...prev, [id]: !prev[id as keyof FieldEnvMapLayers] }))
    }
  }, [mapTab, setOpsMapLayers, setEnvMapLayers])

  const activeNode: PlantOverlayNodeDetail | HydroOverlayNodeDetail | null =
    mapTab === 'operations' ? selectedPlantNode : mapTab === 'environment' ? selectedHydroNode : null
  const isPinned = activeNode !== null
  const isHovering = hoveredNodeId !== null || mapHoverHint !== null

  const bottomMetrics = useMemo(
    () =>
      mapTab === 'operations'
        ? [
            { label: 'MREC Output', value: `${plant.output.mrec_kg_hr.toFixed(1)} kg/hr`, sub: 'XRF (simulated) · pilot scale' },
            { label: 'NdPr Ratio', value: `${plant.output.ndpr_ratio_pct.toFixed(1)}%`, sub: 'of TREO basket' },
            { label: 'Inflow', value: `${plant.flow_metrics.in_liters_sec.toFixed(0)} L/s`, sub: 'Process water in' },
            { label: 'NH₄ Feed', value: `${plant.leaching_circuit.ammonium_sulfate_ml_min.toFixed(0)} ml/min`, sub: 'Tracked reagent feed' },
            { label: 'Annual NdPr', value: `${PROJECT_FINANCIALS?.annual_ndpr_t.toLocaleString() ?? '—'} t/yr`, sub: 'LOM target' },
          ]
        : [
            { label: 'Spring Preservation', value: `${currentScenario?.spring_preservation_pct ?? '—'}%`, sub: currentScenario?.horizon ?? '' },
            { label: 'Active Springs', value: `${currentScenario?.active_springs ?? '—'}/${SPRING_COUNT ?? '—'}`, sub: 'Modeled protected count' },
            { label: 'Guardband', value: `${currentScenario?.sulfate_guardband_ppm ?? '—'} ppm`, sub: 'Before sulfate breach' },
            { label: 'Recirculation', value: `${currentScenario?.recirculation_pct?.toFixed(1) ?? '—'}%`, sub: 'Commercial case model' },
            { label: 'LI Signal', value: currentScenario?.permitting_signal ?? '—', sub: 'Hearing readiness' },
          ],
    [mapTab, plant, currentScenario, PROJECT_FINANCIALS, SPRING_COUNT],
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        padding: '12px 14px',
        gap: 10,
      }}
    >
      <div style={{ flex: 1, display: 'flex', gap: 10, minHeight: 0 }}>
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          <div
            className={fieldChrome.mapHero}
            style={{
              borderRadius: W.radius.lg,
              border: `1px solid ${TAB_COLOR[mapTab]}30`,
              boxShadow: `0 0 22px ${TAB_COLOR[mapTab]}14`,
              transition: 'border-color 0.4s, box-shadow 0.4s',
            }}
          >
            <MapBase
              initialViewState={initialCamera ?? undefined}
              interactiveLayerIds={interactiveLayerIds}
              cursor={isHovering ? 'pointer' : ''}
              highlightWater={mapTab === 'environment'}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleMapClick}
            >
              <CaldeiraBoundary />
              {mapTab === 'operations' && (
                <>
                  {opsMapLayers.neighbors && <NeighborOverlay />}
                  {opsMapLayers.licenceEnvelope && <LicenceEnvelopeOverlay />}
                  {opsMapLayers.deposits && (
                    <DepositOverlay hoveredDepositId={null} selectedDepositId={null} />
                  )}
                  {opsMapLayers.tenements && (
                    <LicenseOverlay hoveredLicenseId={null} selectedLicenseId={null} />
                  )}
                  {opsMapLayers.pfsEngineering && (
                    <PfsEngineeringOverlay hoveredId={null} selectedId={null} />
                  )}
                  {opsMapLayers.accessRoutes && <AccessRoutesOverlay />}
                  {opsMapLayers.drillHoles && (
                    <DrillHoleOverlay
                      hoveredHoleId={hoveredNodeId}
                      holeTypeFilter={opsMapLayers.holeTypeFilter}
                    />
                  )}
                  {opsMapLayers.plantSites && (
                    <OpsPlantSitesOverlay
                      hoveredId={hoveredNodeId}
                      selectedId={
                        geoSelection?.kind === 'infra' &&
                        (geoSelection.id === 'PLANT-PILOT-01' || geoSelection.id === 'PLANT-COMM-01')
                          ? geoSelection.id
                          : null
                      }
                    />
                  )}
                  {opsMapLayers.infra && <InfraOverlay showRoute={false} mapId="aetherField" />}
                  {opsMapLayers.apa && (
                    <EnvironmentalOverlay showApa showBuffer showMonitoring={false} showUrban={false} showUdc={false} />
                  )}
                  {opsMapLayers.plantSchematic && (
                    <PlantOverlay
                      plant={plant}
                      env={env}
                      hoveredNodeId={hoveredNodeId}
                      selectedNodeId={selectedPlantNode?.id ?? null}
                    />
                  )}
                </>
              )}
              {mapTab === 'environment' && (
                <>
                  <EnvironmentalOverlay
                    showApa={envMapLayers.apa}
                    showBuffer={envMapLayers.buffer}
                    showMonitoring={envMapLayers.monitoring}
                    showUrban={envMapLayers.urban}
                    showUdc={envMapLayers.udc}
                  />
                  <HydroOverlay
                    env={env}
                    hoveredNodeId={hoveredNodeId}
                    selectedNodeId={selectedHydroNode?.id ?? null}
                    weatherStrip={hydroWeatherStrip}
                  />
                </>
              )}
            </MapBase>
            <MapFeaturePopup data={popupData?.data ?? null} x={popupData?.x ?? 0} y={popupData?.y ?? 0} />
            <AnimatePresence>
              {highlightFeatureId && (
                <motion.div
                  key="highlight-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '3px 10px',
                    borderRadius: W.radius.sm,
                    background: W.violetSubtle,
                    border: `1px solid ${W.violet}40`,
                    fontSize: 9,
                    fontWeight: 600,
                    color: W.violetSoft,
                    fontFamily: 'var(--font-mono)',
                    pointerEvents: 'none',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    zIndex: 50,
                  }}
                >
                  Alert source: {highlightFeatureId}
                </motion.div>
              )}
            </AnimatePresence>
            <MapLayerPicker layers={layerToggles} onToggle={handleLayerToggle} />
            {mapTab === 'operations' && (
              <div style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                zIndex: 8,
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
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  <span>TREO ≥ 2.0%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#eab308' }} />
                  <span>TREO 1.0–2.0%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                  <span>TREO &lt; 1.0%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 3, borderRadius: 1, background: W.violet }} />
                  <span>Licence area</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 3, borderRadius: 1, background: '#fff3', border: '1px dashed #fff6' }} />
                  <span>Caldeira boundary</span>
                </div>
              </div>
            )}
          </div>

          <FieldBottomMetrics tabKey={mapTab} items={bottomMetrics} />
        </div>

        <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, minHeight: 0 }}>
          <TabSwitcher items={TAB_ITEMS} active={mapTab} onSelect={switchTab} layoutId="field-tab-pill" />

          <FieldPinnedAssetCard
            mapTab={mapTab}
            isPinned={isPinned}
            isHovering={isHovering && !geoSelection}
            activeNode={activeNode}
            geoSelection={geoSelection}
            onClear={clearPinnedNode}
            onClearGeo={handleClearGeoSelection}
          />

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AnimatePresence mode="wait">
              {mapTab === 'operations' && (
                <OperationsPanel />
              )}
              {mapTab === 'environment' && (
                <EnvironmentPanel siteWeather={weather} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
