/**
 * MaritimeWorkspace — the second live Vero instance.
 *
 * Composition (no new primitives):
 *   - MapBase                       (existing)
 *   - MaritimeAoiOverlay            (Source/Layer, same pattern as EnvironmentalOverlay)
 *   - MaritimeSensorOverlay         (Source/Layer)
 *   - UnitMarkers                   (existing — vessels + alerts come from server seeds)
 *   - LensBar / KpiStrip            (existing — driven by maritime instance lenses)
 *   - InstanceShellChrome           (shared chrome strip)
 *
 * Week 2 deliverable (this commit): static data only — no animation.
 * Week 3 will swap UnitMarkers' position source for the
 * `useAnimatedMaritimeVessels()` hook and add the dark-vessel alert
 * ribbon.
 */

import { useMemo, useState } from 'react'
import type { Severity, UnitTypeDef } from 'shared/units/types'
import { MapBase } from '../../components/map/MapBase'
import { MaritimeAoiOverlay } from '../../components/map/MaritimeAoiOverlay'
import { MaritimeSensorOverlay } from '../../components/map/MaritimeSensorOverlay'
import { MaritimeVesselOverlay } from '../../components/map/MaritimeVesselOverlay'
import { UnitMarkers } from '../../components/map/UnitMarkers'
import { useInstance } from '../../contexts/InstanceContext'
import { useLens } from '../../units/useLens'
import { useServiceQuery } from '../../hooks/useServiceQuery'
import { LensBar } from '../../components/workspace/LensBar'
import { KpiStrip } from '../../components/workspace/KpiStrip'
import { DarkVesselAlertRibbon } from '../../components/maritime/DarkVesselAlertRibbon'
import { InstanceShellChrome } from './InstanceShellChrome'

const CHROME_HEIGHT = 80

export default function MaritimeWorkspacePage() {
  const instance = useInstance()
  const lensConfig = useMemo(
    () => ({ lenses: instance.lenses, defaultLensId: instance.defaultLensId }),
    [instance.lenses, instance.defaultLensId],
  )
  const lens = useLens(lensConfig)

  const { data: unitTypes } = useServiceQuery<UnitTypeDef[]>('unit-types', s => s.getUnitTypes())

  const typeColors = useMemo(
    () => Object.fromEntries((unitTypes ?? []).map(t => [t.id, t.color])) as Record<string, string>,
    [unitTypes],
  )
  const typeLabels = useMemo(
    () => Object.fromEntries((unitTypes ?? []).map(t => [t.id, t.label])) as Record<string, string>,
    [unitTypes],
  )

  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)

  // Vessels render through the animated MaritimeVesselOverlay so they
  // don't double-render through UnitMarkers. Filter the lens-driven
  // type set so static UnitMarkers handle everything *except* vessels.
  const unitMarkerTypeIds = useMemo(
    () => lens.activeTypeIds.filter(id => id !== 'vessel'),
    [lens.activeTypeIds],
  )
  const showAnimatedVessels = lens.activeTypeIds.includes('vessel')

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: 'var(--w-bg)',
      }}
    >
      <MapBase
        id="veroMaritime"
        initialViewState={{
          longitude: instance.cameraPreset.longitude,
          latitude: instance.cameraPreset.latitude,
          zoom: instance.cameraPreset.zoom,
          pitch: instance.cameraPreset.pitch,
          bearing: instance.cameraPreset.bearing,
        }}
        containerStyle={{ top: 0, bottom: 0, left: 0, right: 0 }}
      >
        <MaritimeAoiOverlay />
        <MaritimeSensorOverlay />
        {showAnimatedVessels && <MaritimeVesselOverlay />}
        <UnitMarkers
          activeTypeIds={unitMarkerTypeIds}
          severityFilter={lens.severityFilter as Severity[]}
          typeColors={typeColors}
          typeLabels={typeLabels}
          onUnitClick={setSelectedUnitId}
        />
      </MapBase>

      <InstanceShellChrome instance={instance} />

      {/* Dark-vessel alert ribbon — beneath the chrome, centered. */}
      <div
        style={{
          position: 'absolute',
          top: CHROME_HEIGHT + 8,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
        }}
      >
        <DarkVesselAlertRibbon onSelect={setSelectedUnitId} />
      </div>

      {/* Lens bar — left of chrome, beneath the header strip. */}
      <div
        style={{
          position: 'absolute',
          top: CHROME_HEIGHT + 8,
          left: 12,
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          background: 'var(--w-chrome-header-bg)',
          border: '1px solid var(--w-border2)',
          borderRadius: 12,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: 4,
          maxWidth: 540,
        }}
      >
        <LensBar lens={lens} />
        <KpiStrip activeTypeIds={lens.activeTypeIds} />
      </div>

      {/* Selection breadcrumb — week 2 stub, full inspector wires in week 3+. */}
      {selectedUnitId && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            padding: '8px 16px',
            borderRadius: 999,
            background: 'var(--w-glass-12)',
            border: '1px solid var(--w-border2)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: 'var(--w-text2)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: 'var(--w-text4)' }}>Selected</span>
          <span style={{ color: 'var(--w-text1)', fontWeight: 600 }}>{selectedUnitId}</span>
          <button
            type="button"
            onClick={() => setSelectedUnitId(null)}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--w-text4)',
              cursor: 'pointer',
              padding: '0 4px',
              fontSize: 14,
            }}
            aria-label="Clear selection"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
