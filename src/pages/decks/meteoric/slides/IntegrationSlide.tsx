import { useEffect, useState } from 'react'
import { Terminal } from '../../../../components/deck'
import { W, V } from './shared'

function ApiPingBadge() {
  const [status, setStatus] = useState<'checking' | 'live' | 'offline'>('checking')
  useEffect(() => {
    const ctrl = new AbortController()
    fetch('/api/health', { signal: ctrl.signal, cache: 'no-store' })
      .then(r => setStatus(r.ok ? 'live' : 'offline'))
      .catch(() => setStatus('offline'))
    return () => ctrl.abort()
  }, [])
  const color = status === 'live' ? W.green : status === 'offline' ? W.text4 : W.amber
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: W.glass04, borderRadius: 6, border: `1px solid ${W.glass06}` }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: status === 'live' ? `0 0 6px ${W.green}60` : 'none' }} />
      <span style={{ fontSize: 11, color, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
        {status === 'live' ? 'API Live' : status === 'offline' ? 'API Offline' : 'Checking…'}
      </span>
    </div>
  )
}

export default function IntegrationSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>Ready for Live Data</h2>
      <ApiPingBadge />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, maxWidth: 960, width: '100%', marginTop: 16 }}>
        <Terminal title="REST API · /api/telemetry">
          <span style={{ color: W.text3 }}>{'// Example payload — real channels on connect'}</span><br />
          {'{ '}<span style={{ color: W.green }}>"channel"</span>{': '}<span style={{ color: W.green }}>"ph_meter"</span>{','}<br />
          {'  '}<span style={{ color: W.green }}>"value"</span>{': '}<span style={{ color: W.cyan }}>2.41</span>{','}<br />
          {'  '}<span style={{ color: W.green }}>"source"</span>{': '}<span style={{ color: W.green }}>"lapoc_field"</span>{' }'}
        </Terminal>
        <Terminal title="WebSocket · telemetry stream">
          <span style={{ color: V }}>ws</span>{'.on('}<span style={{ color: W.green }}>'telemetry'</span>{', d => {'}<br />
          {'  updateSensor(d.channel, d.value)'}<br />
          {'  '}<span style={{ color: W.text3 }}>{'// ~2s engine tick'}</span><br />
          {'})'}
        </Terminal>
        <Terminal title="SCADA · OPC-UA surface (planned)">
          <span style={{ color: W.text3 }}>{'// Ingestion surface designed — adapters pending'}</span><br />
          <span style={{ color: V }}>connector</span>{'.map({'}<br />
          {'  opcua: '}<span style={{ color: W.green }}>'equipment/*'</span>{','}<br />
          {'  mqtt: '}<span style={{ color: W.green }}>'sensors/#'</span>{','}<br />
          {'  csv: '}<span style={{ color: W.green }}>'historical/*'</span><br />
          {'})'}
        </Terminal>
      </div>
      <p style={{ fontSize: 13, color: W.text3, marginTop: 20, maxWidth: 500 }}>
        When real channels connect, "Simulated" labels flip to "Field-verified." Every reading already carries provenance metadata.
      </p>
    </>
  )
}
