import { Bell, Sparkles, Layers, Mountain, Settings } from 'lucide-react'
import type { ViewMode } from '../../types/telemetry'
import { ViewSwitcher } from './ViewSwitcher'
import { TabSwitcher } from '../ui/TabSwitcher'
import { W } from '../../app/canvas/canvasTheme'
import { Z } from '../map/mapStacking'
import { useDataService } from '../../services/DataServiceProvider'
import { VeroChainLogo } from '../brand/VeroChainLogo'
import { FIELD_RAIL_TABS } from '../../config/demoExperience'
import type { FieldRailTab } from '../../views/field/constants'

interface HeaderStripProps {
  views: ViewMode[]
  fieldRailTab?: FieldRailTab
  onFieldRailTabChange?: (tab: FieldRailTab) => void
  alertCount: number
  fieldAlertCount: number
  onAlertOpen: () => void
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  onChatOpen?: () => void
}

export function HeaderStrip({
  views,
  fieldRailTab,
  onFieldRailTabChange,
  alertCount, fieldAlertCount, onAlertOpen,
  view, onViewChange,
  onChatOpen,
}: HeaderStripProps) {
  const { service } = useDataService()
  const dataContext = service.getDataContext()
  const fieldTabItems = FIELD_RAIL_TABS.map(item => ({
    ...item,
    icon: item.icon === 'mountain' ? Mountain : item.icon === 'layers' ? Layers : Settings,
  }))

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
      zIndex: Z.header,
      gap: 12,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <VeroChainLogo size={22} textColor={W.text1} />
        {dataContext.disclosureMode && (
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
        {fieldRailTab && onFieldRailTabChange ? (
          <div style={{ width: '100%', maxWidth: 440 }}>
            <TabSwitcher
              items={fieldTabItems}
              active={fieldRailTab}
              onSelect={onFieldRailTabChange}
              layoutId="field-header-tab-pill"
            />
          </div>
        ) : (
          <ViewSwitcher views={views} active={view} onChange={onViewChange} alertCount={fieldAlertCount} />
        )}
      </div>

      {/* Right: utility actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
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
