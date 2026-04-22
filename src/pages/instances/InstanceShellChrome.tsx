/**
 * InstanceShellChrome — pure composition of existing chrome primitives
 * (DataModeBanner, VeroChainLogo). Used by EmptyShell and the new
 * MaritimeWorkspace so the multi-instance shell shows a consistent
 * brand bar across instances. NOT a new design primitive — every
 * style here re-uses existing var(--w-*) tokens.
 */

import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useAetherService } from '../../services/DataServiceProvider'
import { DataModeBanner } from '../../components/layout/DataModeBanner'
import { VeroChainLogo } from '../../components/brand/VeroChainLogo'
import type { InstanceConfig } from '../../config/instances'

interface InstanceShellChromeProps {
  instance: InstanceConfig
  /** Optional right-aligned slot for instance-specific actions (e.g. publish bundle). */
  rightSlot?: React.ReactNode
}

export function InstanceShellChrome({ instance, rightSlot }: InstanceShellChromeProps) {
  const service = useAetherService()
  const dataContext = useMemo(() => service.getDataContext(), [service])

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
        <Link
          to="/app"
          aria-label="Back to instance picker"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
            textDecoration: 'none',
          }}
        >
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
            Vero
          </span>
        </Link>

        <div style={{ width: 1, height: 18, background: 'var(--w-border2)', flexShrink: 0 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              minWidth: 0,
              fontSize: 12,
              color: 'var(--w-text2)',
              fontWeight: 600,
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {instance.brand.brandLine}
            </span>
            {instance.glyph && (
              <span style={{ color: 'var(--w-text4)', fontSize: 11 }}>{instance.glyph}</span>
            )}
            <span
              style={{
                color: 'var(--w-text4)',
                fontWeight: 400,
                fontSize: 11,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {instance.brand.productLine}
            </span>
          </div>
          {instance.brand.contextLine && (
            <div
              style={{
                fontSize: 10,
                color: 'var(--w-text4)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {instance.brand.contextLine}
            </div>
          )}
        </div>

        {instance.kpis.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexShrink: 0,
              fontSize: 11,
              color: 'var(--w-text3)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {instance.kpis.map(kpi => (
              <span
                key={kpi.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: 4,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: 'var(--w-glass-07)',
                  border: '1px solid var(--w-border2)',
                }}
                title={kpi.label}
              >
                <span style={{ color: 'var(--w-text2)', fontWeight: 600 }}>{kpi.value}</span>
                <span style={{ color: 'var(--w-text4)', fontSize: 10 }}>
                  {kpi.label}
                </span>
              </span>
            ))}
          </div>
        )}

        {rightSlot}
      </div>
    </div>
  )
}
