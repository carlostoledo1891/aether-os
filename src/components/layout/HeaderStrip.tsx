import { Bell, Sparkles } from 'lucide-react'
import type { EsgScore, ViewMode } from '../../types/telemetry'
import { EsgScoreRing } from '../EsgScoreRing'
import { ViewSwitcher } from './ViewSwitcher'
import { W } from '../../app/canvas/canvasTheme'

interface HeaderStripProps {
  esg: EsgScore
  alertCount: number
  fieldAlertCount: number
  onAlertOpen: () => void
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  disclosureMode?: boolean
  onChatOpen?: () => void
}

export function HeaderStrip({
  esg,
  alertCount, fieldAlertCount, onAlertOpen,
  view, onViewChange,
  disclosureMode,
  onChatOpen,
}: HeaderStripProps) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      height: 56,
      background: W.chromeHeaderBg,
      backdropFilter: 'blur(20px)',
      borderBottom: W.hairlineBorder,
      flexShrink: 0,
      zIndex: 50,
      gap: 12,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28,
          background: W.violet,
          borderRadius: W.radius.sm,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, color: W.textInverse, letterSpacing: '-0.03em',
        }}>
          V
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: W.text1, letterSpacing: '0.04em' }}>
            Vero
          </div>
        </div>
        {disclosureMode && (
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: W.violet,
            background: `${W.violet}18`,
            border: `1px solid ${W.violet}30`,
            borderRadius: W.radius.xs,
            padding: '2px 8px',
          }}>
            Disclosure
          </span>
        )}
      </div>

      {/* Center: view tabs */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <ViewSwitcher active={view} onChange={onViewChange} alertCount={fieldAlertCount} />
      </div>

      {/* Right: ESG ring → AI chat → Alerts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <EsgScoreRing esg={esg} compact />

        {onChatOpen && (
          <button
            type="button"
            aria-label="Open AI chat"
            onClick={onChatOpen}
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32,
              background: W.glass04,
              border: W.chromeBorder,
              borderRadius: W.radius.sm, cursor: 'pointer', outline: 'none',
            }}
          >
            <Sparkles size={13} style={{ color: W.violet }} />
            <span style={{
              position: 'absolute', top: -2, right: -2,
              width: 6, height: 6, background: W.violet,
              borderRadius: '50%',
            }} />
          </button>
        )}

        <button
          type="button"
          aria-label="Open alerts"
          onClick={onAlertOpen}
          style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32,
            background: alertCount > 0 ? W.redSubtle : W.glass04,
            border: alertCount > 0 ? `1px solid ${W.redBorderSoft}` : W.chromeBorder,
            borderRadius: W.radius.sm, cursor: 'pointer', outline: 'none',
          }}
        >
          <Bell size={13} style={{ color: alertCount > 0 ? W.red : W.text3 }} />
          {alertCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              width: 14, height: 14, background: W.red,
              borderRadius: '50%', fontSize: 8, fontWeight: 700,
              color: W.textInverse, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {alertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
