import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Severity, UnitTypeDef } from 'shared/units/types'
import { MapBase } from '../../components/map/MapBase'
import { MapBookmarkControl } from '../../components/map/MapBookmarkControl'
import { MapFeaturePopup } from '../../components/map/MapFeaturePopup'
import { MapLayerPanel } from '../../components/map/MapLayerPanel'
import { MapOverlays } from '../../components/map/MapOverlays'
import { DrillHoleOverlay } from '../../components/map/DrillHoleOverlay'
import { HydroOverlay } from '../../components/map/HydroOverlay'
import { OpsPlantSitesOverlay } from '../../components/map/OpsPlantSitesOverlay'
import { PfsEngineeringOverlay } from '../../components/map/PfsEngineeringOverlay'
import { UnitMarkers } from '../../components/map/UnitMarkers'
import { UnitInspector } from '../../components/units/UnitInspector'
import { useLayerSurface } from '../../components/map/useMapLayers'
import { VISIBLE_LAYER_GROUPS } from '../../components/map/layerRegistry'
import { useAetherService, useTelemetry } from '../../services/DataServiceProvider'
import { useServiceQuery } from '../../hooks/useServiceQuery'
import { useMapCameraRestore } from '../../hooks/useMapCameraRestore'
import { useSharedMapLayers } from '../../components/map/sharedLayerStore'
import { getUnitLookupCandidate, useMapInteraction } from '../../views/field/useMapInteraction'
import { useLens } from '../../units/useLens'
import { UnitChrome } from './UnitChrome'

// Chrome = DataModeBanner (~28px) + VeroUnit header (52px)
const CHROME_HEIGHT = 80
const INSPECTOR_WIDTH = 380

export default function UnitPage() {
  const service = useAetherService()
  const { env } = useTelemetry()
  const springsRef = useRef(env.springs)
  const suppressNextClickRef = useRef(false)
  const initialCamera = useMapCameraRestore('veroUnit')
  const lens = useLens()
  const { opsMapLayers } = useSharedMapLayers()

  const mapLayers = useLayerSurface({ mode: 'shared-field' })
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)
  const [unitHoverPopup, setUnitHoverPopup] = useState<{ data: import('../../components/map/MapFeaturePopup').MapPopupData; x: number; y: number } | null>(null)

  const { data: unitTypes } = useServiceQuery<UnitTypeDef[]>('unit-types', s => s.getUnitTypes())

  const typeColors = useMemo(
    () => Object.fromEntries((unitTypes ?? []).map(t => [t.id, t.color])) as Record<string, string>,
    [unitTypes],
  )
  const typeLabels = useMemo(
    () => Object.fromEntries((unitTypes ?? []).map(t => [t.id, t.label])) as Record<string, string>,
    [unitTypes],
  )

  useEffect(() => {
    springsRef.current = env.springs
  }, [env.springs])

  useEffect(() => {
    mapLayers.setActiveGroups(VISIBLE_LAYER_GROUPS)
  }, [mapLayers])

  const mapSurface = lens.activeLens.id === 'environmental' ? 'environment' as const : 'operations' as const

  const {
    hoveredNodeId,
    setHoveredNodeId,
    mapHoverHint,
    setMapHoverHint,
    selectedHydroNode,
    setSelectedHydroNode,
    geoSelection,
    setGeoSelection,
    popupData,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
    handleMapClick,
  } = useMapInteraction({
    mapTab: mapSurface,
    opsMapLayers,
    springsRef,
    visibleLayerIds: mapLayers.visibleLayerIds,
  })

  const handleUnitMarkerSelect = useCallback((unitId: string) => {
    suppressNextClickRef.current = true
    setUnitHoverPopup(null)
    setSelectedHydroNode(null)
    setGeoSelection(null)
    setSelectedUnitId(unitId)
  }, [setSelectedHydroNode, setGeoSelection])

  const handleMapClickWithUnits = useCallback(async (e: Parameters<typeof handleMapClick>[0]) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false
      return
    }
    setUnitHoverPopup(null)
    const candidate = getUnitLookupCandidate(e.features, mapSurface)
    if (candidate) {
      try {
        const unit = await service.getUnitByPlace(candidate.placeId)
        if (unit) {
          setSelectedHydroNode(null)
          setGeoSelection(null)
          setSelectedUnitId(unit.id)
          return
        }
      } catch {
        // fall through to legacy handling
      }
    }
    setSelectedUnitId(null)
    await handleMapClick(e)
  }, [handleMapClick, mapSurface, service, setGeoSelection, setSelectedHydroNode])

  const ls = mapLayers.state
  const activePopup = unitHoverPopup ?? popupData
  const isHovering = hoveredNodeId !== null || mapHoverHint !== null || unitHoverPopup !== null

  // Clear hydro/geo/hover selection when the lens or map surface changes.
  // Implemented as the React-canonical "reset on prop change" render-phase
  // pattern (replaces a setState-in-effect that triggered the
  // react-hooks/set-state-in-effect lint).
  const lensSurfaceSignature = `${lens.activeLens.id}|${mapSurface}`
  const [prevLensSurface, setPrevLensSurface] = useState(lensSurfaceSignature)
  if (prevLensSurface !== lensSurfaceSignature) {
    setPrevLensSurface(lensSurfaceSignature)
    setHoveredNodeId(null)
    setMapHoverHint(null)
    setGeoSelection(null)
    setUnitHoverPopup(null)
    if (mapSurface !== 'environment') setSelectedHydroNode(null)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: 'var(--w-bg)',
      }}
    >
      {/* Full-screen map */}
      <MapBase
        id="veroUnit"
        initialViewState={initialCamera ?? undefined}
        interactiveLayerIds={mapLayers.interactiveLayerIds}
        cursor={isHovering ? 'pointer' : ''}
        highlightWater={mapSurface === 'environment'}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleMapClickWithUnits}
        containerStyle={{ top: 0, bottom: 0, left: 0, right: 0 }}
        controlSlots={{
          rightCenterPrimary: <MapBookmarkControl mapId="veroUnit" />,
          rightCenterSecondary: (
            <MapLayerPanel
              state={ls}
              onToggle={mapLayers.toggle}
              groups={VISIBLE_LAYER_GROUPS}
              terrainExaggeration={mapLayers.terrainExaggeration}
              onTerrainExaggerationChange={mapLayers.setTerrainExaggeration}
            />
          ),
        }}
      >
        <MapOverlays
          layers={mapLayers.visibleLayerIds}
          terrainExaggeration={mapLayers.terrainExaggeration}
          renderOverrides={{
            drillholes: ls.drillholes ? (
              <DrillHoleOverlay
                hoveredHoleId={hoveredNodeId}
                holeTypeFilter={opsMapLayers.holeTypeFilter}
              />
            ) : null,
            pfs: ls.pfs ? (
              <PfsEngineeringOverlay hoveredId={null} selectedId={null} />
            ) : null,
            plantSites: ls.plantSites ? (
              <OpsPlantSitesOverlay
                hoveredId={hoveredNodeId}
                selectedId={
                  geoSelection?.kind === 'infra' &&
                  (geoSelection.id === 'PLANT-PILOT-01' || geoSelection.id === 'PLANT-COMM-01')
                    ? geoSelection.id
                    : null
                }
              />
            ) : null,
            hydroSprings: (ls.hydroSprings || ls.hydroNodes) && mapSurface === 'environment' ? (
              <HydroOverlay
                env={env}
                hoveredNodeId={hoveredNodeId}
                selectedNodeId={selectedHydroNode?.id ?? null}
              />
            ) : undefined,
            hydroNodes: (ls.hydroSprings || ls.hydroNodes) && mapSurface === 'environment' ? (
              <HydroOverlay
                env={env}
                hoveredNodeId={hoveredNodeId}
                selectedNodeId={selectedHydroNode?.id ?? null}
              />
            ) : undefined,
          }}
        />
        <UnitMarkers
          activeTypeIds={lens.activeTypeIds}
          severityFilter={lens.severityFilter as Severity[]}
          typeColors={typeColors}
          typeLabels={typeLabels}
          onUnitClick={handleUnitMarkerSelect}
          onUnitHover={setUnitHoverPopup}
        />
      </MapBase>

      {/* Floating popup */}
      <MapFeaturePopup
        data={activePopup?.data ?? null}
        x={activePopup?.x ?? 0}
        y={activePopup?.y ?? 0}
      />

      {/* Floating chrome — sits above the map */}
      <UnitChrome lens={lens} />

      {/* Slide-in inspector panel */}
      <div
        style={{
          position: 'absolute',
          top: CHROME_HEIGHT,
          right: selectedUnitId ? 0 : -INSPECTOR_WIDTH,
          bottom: 0,
          width: INSPECTOR_WIDTH,
          background: 'color-mix(in srgb, var(--w-panel) 92%, transparent)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: '1px solid var(--w-border2)',
          transition: 'right 220ms cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          zIndex: 30,
          boxShadow: selectedUnitId ? 'var(--w-shadow-lg)' : 'none',
        }}
      >
        {selectedUnitId && (
          <UnitInspector
            unitId={selectedUnitId}
            onClose={() => setSelectedUnitId(null)}
            onNavigate={setSelectedUnitId}
            openGraphByDefault
          />
        )}
      </div>
    </div>
  )
}
