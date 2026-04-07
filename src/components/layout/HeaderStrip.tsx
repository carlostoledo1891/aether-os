import { motion } from 'motion/react'
import { Wifi, Play, Bell } from 'lucide-react'
import type { EsgScore, SimulationMode, ViewMode } from '../../types/telemetry'
import { EsgScoreRing } from '../EsgScoreRing'
import { ViewSwitcher } from './ViewSwitcher'
import { BATCHES } from '../../data/mockData'
import { W } from '../../app/canvas/canvasTheme'

interface HeaderStripProps {
  esg: EsgScore
  simMode: SimulationMode
  onSimToggle: () => void
  batchId: string
  onBatchChange: (id: string) => void
  alertCount: number
  fieldAlertCount: number
  onAlertOpen: () => void
  view: ViewMode
  onViewChange: (v: ViewMode) => void
}

export function HeaderStrip({
  esg, simMode, onSimToggle,
  batchId, onBatchChange,
  alertCount, fieldAlertCount, onAlertOpen,
  view, onViewChange,
}: HeaderStripProps) {
  const isLive = simMode.type === 'live'

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      height: 56,
      background: 'rgba(13,13,28,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0,
      zIndex: 50,
      gap: 12,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28,
          background: 'linear-gradient(135deg, #7C5CFC, #00D4C8)',
          borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em',
        }}>
          Æ
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: W.text1, letterSpacing: '0.04em' }}>
            METEORIC BOARD OS
          </div>
          <div style={{ fontSize: 10, color: W.text4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Caldeira value protection prototype
          </div>
        </div>
      </div>

      {/* Center: view tabs */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <ViewSwitcher active={view} onChange={onViewChange} alertCount={fieldAlertCount} />
      </div>

      {/* Right: sim toggle + batch + ESG + alerts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {/* Sim mode toggle */}
        <button
          onClick={onSimToggle}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 10px',
            background: isLive ? 'rgba(34,214,138,0.1)' : 'rgba(124,92,252,0.1)',
            border: `1px solid ${isLive ? 'rgba(34,214,138,0.3)' : 'rgba(124,92,252,0.3)'}`,
            borderRadius: 20, cursor: 'pointer', outline: 'none',
          }}
        >
          {isLive ? (
            <>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: 6, height: 6, background: W.green, borderRadius: '50%', boxShadow: `0 0 6px ${W.green}` }}
              />
              <Wifi size={10} style={{ color: W.green }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: W.green, letterSpacing: '0.06em' }}>LIVE</span>
            </>
          ) : (
            <>
              <Play size={10} style={{ color: W.violet }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: W.violet, letterSpacing: '0.06em' }}>PLAYBACK</span>
            </>
          )}
        </button>

        {/* Batch selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, color: W.text4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Batch</span>
          <select
            value={batchId}
            onChange={e => onBatchChange(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 600,
              color: W.violetSoft, fontFamily: 'var(--font-mono)', cursor: 'pointer',
              outline: 'none',
            }}
          >
            {BATCHES.map(b => (
              <option key={b.batch_id} value={b.batch_id} style={{ background: W.panel }}>
                {b.batch_id}
              </option>
            ))}
          </select>
        </div>

        <EsgScoreRing esg={esg} compact />

        <button
          onClick={onAlertOpen}
          style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32,
            background: alertCount > 0 ? 'rgba(255,77,77,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${alertCount > 0 ? 'rgba(255,77,77,0.3)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 8, cursor: 'pointer', outline: 'none',
          }}
        >
          <Bell size={13} style={{ color: alertCount > 0 ? W.red : W.text3 }} />
          {alertCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              width: 14, height: 14, background: W.red,
              borderRadius: '50%', fontSize: 8, fontWeight: 700,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {alertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
