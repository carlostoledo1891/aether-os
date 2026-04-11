/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import { lazy, Suspense, useState, useCallback } from 'react'
import { StatCard, Tag, SlidePanel } from '../../../../components/deck'
import { MapBase } from '../../../../components/map/MapBase'
import { CaldeiraBoundary, CALDEIRA_BOUNDARY_LAYER_ID } from '../../../../components/map/CaldeiraBoundary'
import { LicenseOverlay, LICENSE_LAYER_ID } from '../../../../components/map/LicenseOverlay'
import { DrillHoleOverlay, DRILL_LAYER_ID, parseLithologyIntervals } from '../../../../components/map/DrillHoleOverlay'
import { MapFeaturePopup, type MapPopupData } from '../../../../components/map/MapFeaturePopup'
import type { MapLayerMouseEvent } from '../../../../components/map/MapBase'
import { W, V, CALDEIRA_CENTER } from './shared'

const AnimatedStat = lazy(() => import('../AnimatedStat'))

const CAPAO_DO_MEL: [number, number] = [-46.565, -21.848]

const INTERACTIVE_LAYERS = [
  DRILL_LAYER_ID,
  LICENSE_LAYER_ID,
  CALDEIRA_BOUNDARY_LAYER_ID,
]

export default function GeologySlide() {
  const [popup, setPopup] = useState<{ data: MapPopupData; x: number; y: number } | null>(null)

  const handleMouseEnter = useCallback((e: MapLayerMouseEvent) => {
    const feats = e.features
    if (!feats?.length) return
    const priority = [DRILL_LAYER_ID, LICENSE_LAYER_ID, CALDEIRA_BOUNDARY_LAYER_ID]
    const feat = priority.reduce<(typeof feats)[number] | undefined>(
      (pick, lid) => pick ?? feats.find(f => f.layer?.id === lid),
      undefined,
    ) ?? feats[0]
    if (!feat) return
    const layerId = feat.layer?.id
    const props = feat.properties as Record<string, unknown> | undefined
    const px = e.point
    if (!props) return

    if (layerId === DRILL_LAYER_ID) {
      const lithIntervals = parseLithologyIntervals(props.lithology_intervals)
      setPopup({
        x: px.x, y: px.y,
        data: {
          title: String(props.id ?? ''),
          accentColor: W.violetSoft,
          rows: [
            { label: 'TREO', value: `${Number(props.treo_ppm ?? 0)} ppm` },
            { label: 'Depth', value: `${Number(props.depth_m ?? 0)} m` },
            { label: 'Deposit', value: String(props.deposit ?? '—') },
            { label: 'Type', value: String(props.hole_type ?? '—') },
          ],
          lithologyIntervals: lithIntervals,
        },
      })
    } else if (layerId === LICENSE_LAYER_ID) {
      setPopup({
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
    } else if (layerId === CALDEIRA_BOUNDARY_LAYER_ID) {
      setPopup({
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
    }
  }, [])

  const handleMouseLeave = useCallback(() => setPopup(null), [])

  return (
    <div style={{ position: 'absolute', inset: 0 }} onClick={e => e.stopPropagation()}>
      <Suspense fallback={<div style={{ width: '100%', height: '100%', background: W.glass04 }} />}>
        <MapBase
          id="meteoric-geology-map"
          initialViewState={{
            longitude: CALDEIRA_CENTER[0],
            latitude: CALDEIRA_CENTER[1],
            zoom: 10.5,
            pitch: 40,
            bearing: 0,
          }}
          interactive={true}
          interactiveLayerIds={INTERACTIVE_LAYERS}
          cursor={popup ? 'pointer' : ''}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          flyTo={{ center: CAPAO_DO_MEL, zoom: 13, pitch: 45, duration: 4000 }}
          disableZoomControls={true}
          hideControls={true}
          forceStyle="satellite"
          containerStyle={{ width: '100%', height: '100%', borderRadius: 0 }}
        >
          <CaldeiraBoundary />
          <LicenseOverlay />
          <DrillHoleOverlay />
        </MapBase>
      </Suspense>
      <MapFeaturePopup data={popup?.data ?? null} x={popup?.x ?? 0} y={popup?.y ?? 0} />

      <div style={{ position: 'absolute', top: 40, right: 24, width: 320, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 6, pointerEvents: 'auto' }}>
        <SlidePanel>
          <Tag>Data Integrity</Tag>
          <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, marginTop: 8, marginBottom: 12, color: W.text1 }}>Geology &amp; Data Integrity</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
            <Suspense fallback={<StatCard value="19" label="GeoJSON" sub="Schema-tested" />}>
              <AnimatedStat value={19} label="GeoJSON Datasets" sub="Schema-tested" />
            </Suspense>
            <Suspense fallback={<StatCard value="100" label="Source Labels" sub="%" />}>
              <AnimatedStat value={100} label="Source Labels" suffix="%" sub="Modeled / public / field" />
            </Suspense>
          </div>
          <div style={{ fontSize: 10, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Geological Layers</div>
          {['Drill collars with trace metadata', 'Deposit polygons with ASX source refs', 'Resource classification (JORC Table 1)', 'Lithology domains & grade distribution', 'Competent Person–safe labeling'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: V, marginTop: 6, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: W.text2, lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </SlidePanel>
        <SlidePanel style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: W.cyan, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Hydrological Layers</div>
          {['Spring monitoring network (modeled)', 'Piezometer locations and readings', 'Water quality parameters (pH, conductivity)'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: W.cyan, marginTop: 6, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: W.text2, lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </SlidePanel>
      </div>

      <div style={{ position: 'absolute', bottom: 48, left: 24, display: 'flex', gap: 6, zIndex: 6 }}>
        {[
          { label: 'Drill Holes', color: V },
          { label: 'Mining licences', color: W.violetSoft },
          { label: 'Caldeira Boundary', color: W.violet },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: 6, backdropFilter: 'blur(8px)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color }} />
            <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>

      <p style={{ position: 'absolute', bottom: 48, right: 24, fontSize: 10, color: W.text4, maxWidth: 320, textAlign: 'right', zIndex: 6 }}>
        Geology and hydrology are visually separated — the digital twin never pretends to prove the deposit.
      </p>
    </div>
  )
}
