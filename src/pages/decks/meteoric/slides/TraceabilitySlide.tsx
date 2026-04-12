/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import { Suspense, useState, useCallback, useEffect } from 'react'
import { Marker, useMap } from 'react-map-gl/maplibre'
import { Tag, SlidePanel } from '../../../../components/deck'
import { TraceabilityTab } from '../../../../views/buyer/TraceabilityTab'
import { useServiceQuery } from '../../../../hooks/useServiceQuery'
import { LoadingSkeleton } from '../../../../components/ui/LoadingSkeleton'
import { TraceRouteOverlay } from '../../../../components/map/TraceRouteOverlay'
import { MapBase } from '../../../../components/map/MapBase'
import { useMapPreset } from '../../../../components/map/mapPresets'
import type { ComplianceLedger } from '../../../../types/telemetry'
import { W, V } from './shared'

const STEP_STATUS_COLORS: Record<string, string> = {
  verified: W.green,
  active: W.violet,
  pending: W.text4,
}

export default function TraceabilitySlide() {
  const { viewProps } = useMapPreset('traceability')
  const { data: batches } = useServiceQuery('batches', s => s.getBatches())
  const batch: ComplianceLedger | undefined = batches?.[0]
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null)
  
  const maps = useMap()

  useEffect(() => {
    const mapRef = maps['meteoric-trace-map'] ?? maps.current
    if (!mapRef) return

    if (selectedStepIndex === null) {
      if (batch) {
        const coords = batch.molecular_timeline.map(s => s.coordinates).filter(Boolean) as {lat: number, lng: number}[]
        if (coords.length > 0) {
          const minLng = Math.min(...coords.map(c => c.lng))
          const maxLng = Math.max(...coords.map(c => c.lng))
          const minLat = Math.min(...coords.map(c => c.lat))
          const maxLat = Math.max(...coords.map(c => c.lat))
          mapRef.fitBounds(
            [minLng, minLat, maxLng, maxLat],
            { padding: 100, duration: 1500 }
          )
        }
      }
      return
    }

    const activeStep = batch?.molecular_timeline[selectedStepIndex]
    if (!activeStep?.coordinates) return

    mapRef.flyTo({
      center: [activeStep.coordinates.lng, activeStep.coordinates.lat],
      zoom: 12,
      duration: 1500,
    })
  }, [selectedStepIndex, batch, maps])

  const handleStepClick = useCallback((index: number) => {
    setSelectedStepIndex(prev => prev === index ? null : index)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0 }} onClick={e => e.stopPropagation()}>
      <Suspense fallback={<div style={{ width: '100%', height: '100%', background: W.glass04 }} />}>
        <MapBase
          id="meteoric-trace-map"
          initialViewState={{
            bounds: batch 
              ? (() => {
                  const coords = batch.molecular_timeline.map(s => s.coordinates).filter(Boolean) as {lat: number, lng: number}[]
                  if (!coords.length) return undefined
                  const minLng = Math.min(...coords.map(c => c.lng))
                  const maxLng = Math.max(...coords.map(c => c.lng))
                  const minLat = Math.min(...coords.map(c => c.lat))
                  const maxLat = Math.max(...coords.map(c => c.lat))
                  return [minLng, minLat, maxLng, maxLat]
                })()
              : undefined,
            ...viewProps.initialViewState,
          } as any}
          interactive={viewProps.interactive}
          disableZoomControls={viewProps.disableZoomControls}
          hideControls={viewProps.hideControls}
          forceStyle={viewProps.forceStyle}
          containerStyle={{ width: '100%', height: '100%', borderRadius: 0 }}
        >
          {batch && (
            <>
              <TraceRouteOverlay timeline={batch.molecular_timeline} mapId="meteoric-trace-map" selectedStepIndex={selectedStepIndex} />
              {batch.molecular_timeline.map((step, i) => {
                if (!step.coordinates) return null
                const isSelected = selectedStepIndex === i
                const stepColor = STEP_STATUS_COLORS[step.status] ?? W.text4
                return (
                  <Marker key={`step-${i}`} longitude={step.coordinates.lng} latitude={step.coordinates.lat} anchor="center"
                    onClick={(e) => { e.originalEvent.stopPropagation(); handleStepClick(i) }}>
                    <div
                      style={{
                      width: isSelected ? 18 : 12, height: isSelected ? 18 : 12,
                      borderRadius: '50%',
                      background: isSelected ? stepColor : `${stepColor}40`,
                      border: `2px solid ${stepColor}`,
                      boxShadow: isSelected ? `0 0 14px ${stepColor}80` : `0 0 6px ${stepColor}40`,
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isSelected && <span style={{ fontSize: 8, fontWeight: 800, color: W.textInverse, fontFamily: 'var(--font-mono)' }}>{i + 1}</span>}
                    </div>
                  </Marker>
                )
              })}
            </>
          )}
        </MapBase>
      </Suspense>

      <SlidePanel style={{
        position: 'absolute', top: 32, right: 20, bottom: 60, width: 400,
        zIndex: 6, pointerEvents: 'auto',
        overflowY: 'auto', overflowX: 'hidden',
        padding: '16px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Tag>Traceability</Tag>
          <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.1, color: W.text1, margin: 0 }}>Traceability in Action</h2>
        </div>

        {!batch ? (
          <LoadingSkeleton variant="card" label="Loading traceability..." />
        ) : (
          <TraceabilityTab
            batch={batch}
            selectedStepIndex={selectedStepIndex}
            onStepClick={handleStepClick}
          />
        )}
      </SlidePanel>

      <SlidePanel style={{
        position: 'absolute', top: 32, left: 20, width: 320,
        zIndex: 6, pointerEvents: 'auto',
        padding: '14px 16px',
      }}>
        <div style={{ fontSize: 10, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Supply Chain Route</div>
        <p style={{ fontSize: 11, color: W.text2, lineHeight: 1.5, margin: '0 0 10px' }}>
          From Caldeira drill collar to Toyota assembly line — every handoff is traceable. Blockchain anchoring on the roadmap.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[
            { label: 'Audit Chain', value: 'SHA-256' },
            { label: 'DPP Fields', value: '22 / 37' },
            { label: 'Origin Proof', value: 'FEOC Ready' },
          ].map(s => (
            <div key={s.label} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 8, padding: '6px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              <div style={{ fontSize: 8, color: W.text4, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </SlidePanel>
    </div>
  )
}
