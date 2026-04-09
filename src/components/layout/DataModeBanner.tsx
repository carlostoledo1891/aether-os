import { useEffect, useState } from 'react'
import type { DataContext, ConnectionStatus } from '../../services/dataService'
import { useDataService } from '../../services/DataServiceProvider'
import { W } from '../../app/canvas/canvasTheme'

interface DataModeBannerProps {
  context: DataContext
}

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  connected: '',
  degraded: 'Backend unreachable — showing cached data',
  offline: 'Backend offline — reconnecting...',
}

const BUILD_SHA = (typeof __BUILD_SHA__ !== 'undefined' ? __BUILD_SHA__ : '').slice(0, 7)
const BUILD_TIME = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : ''
const BUILD_DATE = BUILD_TIME ? new Date(BUILD_TIME).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) : ''

export function DataModeBanner({ context }: DataModeBannerProps) {
  const { telemetry } = useDataService()
  const [secondsAgo, setSecondsAgo] = useState(0)

  useEffect(() => {
    const tick = () => {
      setSecondsAgo(Math.max(0, Math.floor((Date.now() - telemetry.lastUpdated) / 1000)))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [telemetry.lastUpdated])

  const showLastTick = context.mode === 'live' || secondsAgo > 10
  const connStatus = context.connectionStatus ?? 'connected'
  const isDegraded = connStatus === 'degraded'
  const isOffline = connStatus === 'offline'

  const isDisclosure = context.disclosureMode
  const bannerBg = isOffline
    ? `${W.red}1A`
    : isDegraded
      ? `${W.amber}1A`
      : isDisclosure
        ? `${W.violet}14`
        : context.mode === 'live' ? W.bannerBgLive : W.bannerBgMock
  const bannerBorder = isOffline
    ? `${W.red}4D`
    : isDegraded
      ? `${W.amber}4D`
      : isDisclosure
        ? `${W.violet}33`
        : context.mode === 'live' ? W.bannerEdgeLive : W.bannerEdgeMock
  const bannerColor = isOffline
    ? W.red
    : isDegraded
      ? W.amber
      : isDisclosure
        ? W.violet
        : context.mode === 'live' ? W.amber : W.cyan

  const statusMsg = STATUS_LABELS[connStatus]

  return (
    <div
      title={context.detail}
      style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '6px 16px',
        background: bannerBg,
        borderBottom: `1px solid ${bannerBorder}`,
      }}
    >
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: bannerColor,
        fontFamily: 'var(--font-mono)',
      }}>
        {statusMsg || context.bannerLabel}
      </span>
      {!statusMsg && (
        <span style={{
          fontSize: 9,
          color: W.text4,
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.35,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          minWidth: 0,
        }}>
          {context.detail}
        </span>
      )}
      {showLastTick && (
        <span
          style={{
            flexShrink: 0,
            fontSize: 9,
            color: W.text4,
            fontFamily: 'var(--font-mono)',
            opacity: 0.85,
          }}
          title="Time since last telemetry update"
        >
          last tick: {secondsAgo}s ago
        </span>
      )}
      {BUILD_SHA && (
        <span
          style={{
            flexShrink: 0,
            fontSize: 8,
            color: W.text4,
            fontFamily: 'var(--font-mono)',
            opacity: 0.55,
            letterSpacing: '0.04em',
          }}
          title={`Build ${BUILD_SHA} — ${BUILD_TIME}`}
          aria-label={`Build ${BUILD_SHA} verified ${BUILD_DATE}`}
        >
          {BUILD_SHA} · {BUILD_DATE}
        </span>
      )}
    </div>
  )
}
