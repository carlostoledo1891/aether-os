/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import { lazy, Suspense, useState, useCallback } from 'react'
import { Tag, SlidePanel } from '../../../../components/deck'
import { MapBase } from '../../../../components/map/MapBase'
import { MapOverlays } from '../../../../components/map/MapOverlays'
import { useMapPreset } from '../../../../components/map/mapPresets'
import { CALDEIRA_BOUNDARY_LAYER_ID } from '../../../../components/map/CaldeiraBoundary'
import { ENV_APA_FILL_LAYER_ID } from '../../../../components/map/EnvironmentalOverlay'
import { SPRING_PIN_LAYER_ID } from '../../../../components/map/SpringPinsOverlay'
import { MapFeaturePopup, type MapPopupData } from '../../../../components/map/MapFeaturePopup'
import type { MapLayerMouseEvent } from '../../../../components/map/MapBase'
import { HydroMonitoringCard } from '../../../../components/map/HydroMonitoringCard'
import { useTelemetry } from '../../../../services/DataServiceProvider'
import { useSiteWeather } from '../../../../hooks/useSiteWeather'
import { W, V } from './shared'

const AnimatedStat = lazy(() => import('../AnimatedStat'))

export default function HydroSlide() {
  const preset = useMapPreset('deck-hydro')
  const [popup, setPopup] = useState<{ data: MapPopupData; x: number; y: number } | null>(null)
  const { env } = useTelemetry()
  const weather = useSiteWeather(30, { enabled: true })

  const springCounts = {
    active: env.springs.filter(s => s.status === 'Active').length,
    reduced: env.springs.filter(s => s.status === 'Reduced').length,
    suppressed: env.springs.filter(s => s.status === 'Suppressed').length,
  }

  const weatherStrip = {
    loading: weather.loading,
    error: weather.error,
    windowPrecipMm: weather.windowPrecipMm,
    anomalyMm: weather.anomalyMm,
    source: weather.source,
    scenarioDroughtIndex: 0,
    scenarioHorizon: '',
  }

  const INTERACTIVE_LAYERS = preset.interactiveLayerIds

  const handleMouseEnter = useCallback((e: MapLayerMouseEvent) => {
    const feats = e.features
    if (!feats?.length) return
    const priority = [SPRING_PIN_LAYER_ID, ENV_APA_FILL_LAYER_ID, CALDEIRA_BOUNDARY_LAYER_ID]
    const feat = priority.reduce<(typeof feats)[number] | undefined>(
      (pick, lid) => pick ?? feats.find(f => f.layer?.id === lid),
      undefined,
    ) ?? feats[0]
    if (!feat) return
    const layerId = feat.layer?.id
    const props = feat.properties as Record<string, unknown> | undefined
    const px = e.point
    if (!props) return

    if (layerId === SPRING_PIN_LAYER_ID) {
      setPopup({
        x: px.x, y: px.y,
        data: {
          title: String(props.id ?? 'Spring'),
          accentColor: W.cyan,
          rows: [
            ...(props.source_label ? [{ label: 'Source', value: String(props.source_label) }] : []),
            ...(props.municipality ? [{ label: 'Municipality', value: String(props.municipality) }] : []),
            { label: 'Network', value: 'CAR Monitored' },
          ],
        },
      })
    } else if (layerId === ENV_APA_FILL_LAYER_ID) {
      setPopup({
        x: px.x, y: px.y,
        data: {
          title: String(props.label ?? 'Environmental Zone'),
          accentColor: W.cyan,
          rows: [
            { label: 'Kind', value: String(props.kind ?? '—') },
            ...(props.note ? [{ label: 'Note', value: String(props.note) }] : []),
          ],
        },
      })
    } else if (layerId === CALDEIRA_BOUNDARY_LAYER_ID) {
      setPopup({
        x: px.x, y: px.y,
        data: {
          title: 'Caldeira Alkaline Complex',
          accentColor: W.violet,
          rows: [
            { label: 'Area', value: '~193 km²' },
            { label: 'Type', value: 'Alkaline intrusion' },
          ],
        },
      })
    }
  }, [])

  const handleMouseLeave = useCallback(() => setPopup(null), [])

  return (
    <div style={{ position: 'absolute', inset: 0 }} onClick={e => e.stopPropagation()}>
      <Suspense fallback={<div style={{ width: '100%', height: '100%', background: W.glass04 }} />}>
        <MapBase
          id="meteoric-hydro-map"
          {...preset.viewProps}
          interactiveLayerIds={INTERACTIVE_LAYERS}
          cursor={popup ? 'pointer' : ''}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          containerStyle={{ width: '100%', height: '100%', borderRadius: 0 }}
        >
          <MapOverlays layers={preset.overlays} environmentalProps={{ showApa: true, showBuffer: true, showMonitoring: true }} />
        </MapBase>
      </Suspense>
      <HydroMonitoringCard 
        springCounts={springCounts}
        sulfatePpm={env.water_quality.sulfate_ppm}
        weatherStrip={weatherStrip}
      />
      <MapFeaturePopup data={popup?.data ?? null} x={popup?.x ?? 0} y={popup?.y ?? 0} />

      <div style={{ position: 'absolute', top: 40, right: 24, width: 300, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 6, pointerEvents: 'auto' }}>
        <SlidePanel>
          <Tag>Hydrology</Tag>
          <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, marginTop: 8, marginBottom: 12, color: W.text1 }}>The Hydro Story</h2>
          <Suspense fallback={null}>
            <AnimatedStat value={1092} label="Springs Monitored" sub="Complete hydrological network" prefix="" />
          </Suspense>
        </SlidePanel>
        <SlidePanel style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: W.cyan, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Environmental Layers</div>
          {['APA boundary with buffer zones', 'Spring network (pH, conductivity, flow)', 'Predictive spring health analysis', 'Piezometer stations with readings', 'FEAM/IGAM compliance zones', 'Community monitoring interface'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: W.cyan, marginTop: 6, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: W.text2, lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </SlidePanel>
        <SlidePanel style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>LAPOC Pipeline + Weather Intelligence</div>
          <p style={{ fontSize: 11, color: W.text2, lineHeight: 1.5, margin: '0 0 8px' }}>
            Platform actively parses and stores real LAPOC CSV data. 16-day environmental forecast powered by Open-Meteo + ECMWF ERA5 baseline.
          </p>
          <p style={{ fontSize: 11, color: W.text2, lineHeight: 1.5, margin: '0 0 8px' }}>
            Dynamic provenance engine automatically upgrades UI badges from <span style={{ color: W.text4 }}>"simulated"</span> to <span style={{ color: W.green }}>"verified_real"</span>.
          </p>
          <p style={{ fontSize: 11, color: W.text2, lineHeight: 1.5, margin: 0 }}>
            5-year historical climate baseline (ERA5 reanalysis) for seasonal compliance forecasting.
          </p>
        </SlidePanel>
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ label: 'Piezometers', value: 'Pre-mapped' }, { label: 'Quality', value: '5 params' }, { label: 'Refresh', value: '< 2s' }].map(s => (
            <SlidePanel key={s.label} style={{ textAlign: 'center', flex: 1, padding: '6px 0', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: W.cyan, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              <div style={{ fontSize: 8, color: W.text4, marginTop: 2 }}>{s.label}</div>
            </SlidePanel>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 48, left: 24, display: 'flex', gap: 6, zIndex: 6 }}>
        {[
          { label: 'Springs', color: W.cyan },
          { label: 'APA Boundary', color: W.cyan },
          { label: 'Monitoring Zone', color: '#3b82f6' },
          { label: 'Buffer Zone', color: `${W.cyan}60` },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: 6, backdropFilter: 'blur(8px)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color }} />
            <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
