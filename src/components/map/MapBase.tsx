import { useRef, useState, useCallback, type ReactNode } from 'react'
import Map, { NavigationControl } from 'react-map-gl/maplibre'
import type { MapLayerMouseEvent } from 'maplibre-gl'
import type maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { CALDEIRA_GEO } from 'shared/sites/caldeira'
import { MapControlStack } from './MapControlStack'
import { StyleController, MAPTILER_KEY, MAP_STYLE_DEFS, STORAGE_KEY, getInitialStyle, type MapStyleId } from './MapStyleController'
import { FlyToController } from './FlyToController'
import { MapStylePicker } from './MapStylePicker'
import { ResetCameraButton } from './ResetCameraButton'

export type { MapLayerMouseEvent }
export type { FlyToTarget } from './FlyToController'
export type { MapStyleId }

export const CALDEIRA_VIEW_STATE = {
  longitude: CALDEIRA_GEO.center[0],
  latitude:  CALDEIRA_GEO.center[1],
  zoom:      CALDEIRA_GEO.defaultZoom,
  pitch:     CALDEIRA_GEO.defaultPitch,
  bearing:   CALDEIRA_GEO.defaultBearing,
}

export const CALDEIRA_BBOX: [[number, number], [number, number]] = CALDEIRA_GEO.bbox

export interface MapControlSlots {
  topRight?: ReactNode
  topLeft?: ReactNode
  bottomLeft?: ReactNode
  bottomRight?: ReactNode
}

import type { FlyToTarget } from './FlyToController'

interface MapBaseProps {
  id?: string
  initialViewState?: typeof CALDEIRA_VIEW_STATE
  children?: React.ReactNode
  interactiveLayerIds?: string[]
  cursor?: string
  highlightWater?: boolean
  interactive?: boolean
  disableZoomControls?: boolean
  hideControls?: boolean
  containerStyle?: React.CSSProperties
  flyTo?: FlyToTarget
  forceStyle?: MapStyleId
  /** Inject controls into the MapControlStack slots */
  controlSlots?: MapControlSlots
  onMouseEnter?: (e: MapLayerMouseEvent) => void
  onMouseLeave?: (e: MapLayerMouseEvent) => void
  onMouseMove?: (e: MapLayerMouseEvent) => void
  onClick?: (e: MapLayerMouseEvent) => void
}

function Attribution() {
  const HAS_TILER = !!(MAPTILER_KEY && MAPTILER_KEY !== 'your_maptiler_key_here')
  return (
    <div style={{
      fontSize: 9, color: 'rgba(255,255,255,0.18)',
      fontFamily: 'var(--font-mono)', pointerEvents: 'none',
    }}>
      {HAS_TILER
        ? '© MapTiler · OpenStreetMap contributors'
        : '© CARTO · OpenStreetMap contributors'}
    </div>
  )
}

export function MapBase({
  id = 'aetherField',
  initialViewState = CALDEIRA_VIEW_STATE,
  children,
  interactiveLayerIds,
  cursor,
  highlightWater = false,
  interactive = true,
  disableZoomControls = false,
  hideControls = false,
  containerStyle,
  flyTo,
  forceStyle,
  controlSlots,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onClick,
}: MapBaseProps) {
  const [styleId, setStyleId] = useState<MapStyleId>(getInitialStyle)
  const [mapIdle, setMapIdle] = useState(false)
  const nativeMapRef = useRef<maplibregl.Map | null>(null)

  const activeStyleId = forceStyle ?? styleId
  const styleUrl = MAP_STYLE_DEFS.find(d => d.id === activeStyleId)?.url ?? MAP_STYLE_DEFS[0].url

  const handleStyleChange = useCallback((nextId: MapStyleId) => {
    if (forceStyle) return
    setStyleId(nextId)
    try { localStorage.setItem(STORAGE_KEY, nextId) } catch { /* noop */ }
  }, [forceStyle])

  const captureRef = useCallback((ref: { getMap(): maplibregl.Map } | null) => {
    nativeMapRef.current = ref?.getMap() ?? null
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, ...containerStyle }}>
      {!interactive && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }} />}
      <Map
        id={id}
        ref={captureRef as never}
        initialViewState={initialViewState}
        mapStyle={styleUrl}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        logoPosition={hideControls ? undefined : 'bottom-right'}
        interactive={interactive}
        dragPan={interactive}
        dragRotate={interactive}
        scrollZoom={!disableZoomControls}
        doubleClickZoom={!disableZoomControls}
        touchZoomRotate={!disableZoomControls}
        keyboard={!disableZoomControls}
        interactiveLayerIds={interactive ? interactiveLayerIds : undefined}
        cursor={cursor}
        onMouseEnter={interactive ? onMouseEnter : undefined}
        onMouseLeave={interactive ? onMouseLeave : undefined}
        onMouseMove={interactive ? onMouseMove : undefined}
        onClick={interactive ? onClick : undefined}
        onIdle={() => setMapIdle(true)}
        onLoad={() => setMapIdle(false)}
      >
        <StyleController maptilerKey={MAPTILER_KEY} mapId={id} highlightWater={highlightWater} activeStyleId={activeStyleId} />
        {flyTo && <FlyToController mapId={id} target={flyTo} />}
        {!hideControls && (
          <NavigationControl position="top-right" showCompass showZoom visualizePitch />
        )}
        {children}
      </Map>

      <MapControlStack
        hide={hideControls}
        topRight={
          <>
            <ResetCameraButton mapRef={nativeMapRef} />
            {controlSlots?.topRight}
          </>
        }
        topLeft={controlSlots?.topLeft}
        bottomLeft={
          <>
            <MapStylePicker active={activeStyleId} onChange={handleStyleChange} />
            {controlSlots?.bottomLeft}
          </>
        }
        bottomRight={
          <>
            {controlSlots?.bottomRight}
            <Attribution />
          </>
        }
      />
      {mapIdle && <div data-testid="map-idle" style={{ display: 'none' }} />}
    </div>
  )
}
