import { useMemo, useState } from 'react'
import { VeroChainLogo } from '../../components/brand/VeroChainLogo'
import { DataModeBanner } from '../../components/layout/DataModeBanner'
import { BundleExporter } from '../../components/units/BundleExporter'
import { useAetherService } from '../../services/DataServiceProvider'
import { useServiceQuery } from '../../hooks/useServiceQuery'
import type { UseLensReturn } from '../../units/useLens'

interface UnitChromeProps {
  lens: UseLensReturn
}

const BOARD_PACK_LENSES = new Set(['executive', 'everything'])

export function UnitChrome({ lens }: UnitChromeProps) {
  const service = useAetherService()
  const dataContext = useMemo(() => service.getDataContext(), [service])
  const { data: stats } = useServiceQuery('unitStats', s => s.getUnitStats())
  const [boardPackOpen, setBoardPackOpen] = useState(false)

  const totalUnits = stats
    ? Object.values(stats).reduce((sum, severities) => {
        return sum + Object.values(severities as Record<string, number>).reduce((s, n) => s + n, 0)
      }, 0)
    : null

  const showBoardPack = BOARD_PACK_LENSES.has(lens.activeLens.id)

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--w-chrome-header-bg)',
        borderBottom: 'var(--w-border-hairline)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <DataModeBanner context={dataContext} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          height: 52,
          padding: '0 16px',
        }}
      >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <VeroChainLogo iconOnly size={22} />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--w-text3)',
          }}
        >
          VeroUnit
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 18, background: 'var(--w-border2)', flexShrink: 0 }} />

      {/* Lens pills */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
        {lens.allLenses.map(l => {
          const active = lens.activeLens.id === l.id
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => lens.setLens(l.id)}
              style={{
                padding: '4px 12px',
                borderRadius: 999,
                border: active ? '1px solid var(--w-violet)' : '1px solid var(--w-border2)',
                fontSize: 12,
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                background: active ? 'var(--w-violet-subtle)' : 'transparent',
                color: active ? 'var(--w-violet-soft)' : 'var(--w-text3)',
                transition: 'all 120ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {l.label}
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 18, background: 'var(--w-border2)', flexShrink: 0 }} />

      {/* Per-type toggle chips for the active lens */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          alignItems: 'center',
          flex: 1,
          minWidth: 0,
          overflowX: 'auto',
        }}
      >
        {lens.activeLens.unitTypes.map(typeId => {
          const on = lens.typeToggles[typeId] !== false
          return (
            <button
              key={typeId}
              type="button"
              onClick={() => lens.toggleType(typeId)}
              aria-pressed={on}
              title={on ? `Hide ${typeId.replace(/_/g, ' ')} on map` : `Show ${typeId.replace(/_/g, ' ')} on map`}
              style={{
                padding: '3px 10px',
                borderRadius: 999,
                border: '1px solid var(--w-border2)',
                background: on ? 'var(--w-glass-07)' : 'transparent',
                color: on ? 'var(--w-text2)' : 'var(--w-text4)',
                fontSize: 11,
                fontWeight: on ? 600 : 400,
                opacity: on ? 1 : 0.55,
                textTransform: 'capitalize',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 120ms ease',
              }}
            >
              {typeId.replace(/_/g, ' ')}
            </button>
          )
        })}
      </div>

      {/* Board Pack — executive / everything lenses only */}
      {showBoardPack && (
        <button
          type="button"
          onClick={() => setBoardPackOpen(true)}
          aria-label="Generate board pack evidence bundle"
          style={{
            flexShrink: 0,
            padding: '4px 12px',
            borderRadius: 999,
            border: '1px solid var(--w-violet)',
            background: 'var(--w-violet-subtle)',
            color: 'var(--w-violet-soft)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 120ms ease',
          }}
        >
          Board Pack
        </button>
      )}

      {/* Unit count */}
      {totalUnits !== null && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
            fontSize: 11,
            color: 'var(--w-text4)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 999,
              background: 'var(--w-glass-07)',
              border: '1px solid var(--w-border2)',
              color: 'var(--w-text2)',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
            }}
          >
            {totalUnits} units
          </span>
        </div>
      )}

      {boardPackOpen && (
        <BundleExporter
          preset="boardPack"
          onClose={() => setBoardPackOpen(false)}
        />
      )}
      </div>
    </div>
  )
}
