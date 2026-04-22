import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { VeroChainLogo } from '../../components/brand/VeroChainLogo'
import { useThemeTokens } from '../../theme/useTheme'
import { PUBLIC_DECK_NAV, isPublicMarketingDeckManifestId } from '../publicDeckNav'
import { RequestDemoButton } from '../../components/marketing/RequestDemo'
import type { PresentationRuntimeState } from '../types'

interface TopChromeProps {
  runtime: PresentationRuntimeState
  alertCount?: number
  disclosureMode?: boolean
  onAlertsOpen?: () => void
  onChatOpen?: () => void
}

export function TopChrome({
  runtime,
  alertCount = 0,
  disclosureMode = false,
  onAlertsOpen,
  onChatOpen,
}: TopChromeProps) {
  const theme = useThemeTokens()
  const location = useLocation()
  const publicDeckNav = Boolean(runtime.manifest.chrome?.showPublicDeckNav && isPublicMarketingDeckManifestId(runtime.manifest.id))
  const showPublicDeckPill = publicDeckNav && PUBLIC_DECK_NAV.length > 1
  const showTabs =
    !publicDeckNav && (runtime.manifest.chrome?.showSceneTabs ?? runtime.manifest.scenes.length > 1)
  const showProgress = runtime.manifest.chrome?.showProgress ?? true
  const showUtilities = runtime.manifest.chrome?.showAppUtilities ?? false
  return (
    <header
      style={{
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        minHeight: 58,
        padding: '10px 16px',
        background: theme.chromeHeaderBg,
        borderBottom: theme.hairlineBorder,
        backdropFilter: 'blur(14px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'inherit', textDecoration: 'none' }}>
          <VeroChainLogo size={22} textColor={theme.text1} />
        </a>
        {disclosureMode && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: theme.text2,
              background: theme.glass05,
              border: `1px solid ${theme.border2}`,
              borderRadius: theme.radius.xs,
              padding: '2px 8px',
            }}
          >
            Disclosure
          </span>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        {showPublicDeckPill ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              maxWidth: 'min(960px, 100%)',
              padding: 4,
              borderRadius: 999,
              border: `1px solid ${theme.border2}`,
              background: theme.card,
              boxShadow: theme.shadowSm,
              overflowX: 'auto',
            }}
          >
            {PUBLIC_DECK_NAV.map(item => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  style={{
                    borderRadius: 999,
                    cursor: 'pointer',
                    padding: '8px 14px',
                    whiteSpace: 'nowrap',
                    background: active ? theme.cardHover : 'transparent',
                    color: active ? theme.text1 : theme.text3,
                    fontSize: 12,
                    fontWeight: active ? 700 : 600,
                    border: active ? `1px solid ${theme.border3}` : '1px solid transparent',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        ) : showTabs ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              maxWidth: 'min(960px, 100%)',
              padding: 4,
              borderRadius: 999,
              border: `1px solid ${theme.border2}`,
              background: theme.card,
              boxShadow: theme.shadowSm,
              overflowX: 'auto',
            }}
          >
            {runtime.manifest.scenes.map((scene, index) => {
              const active = index === runtime.activeSceneIndex
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => runtime.goToScene(scene.id)}
                  style={{
                    borderRadius: 999,
                    cursor: 'pointer',
                    padding: '8px 14px',
                    whiteSpace: 'nowrap',
                    background: active ? theme.cardHover : 'transparent',
                    color: active ? theme.text1 : theme.text3,
                    fontSize: 12,
                    fontWeight: active ? 700 : 600,
                    border: active ? `1px solid ${theme.border3}` : '1px solid transparent',
                  }}
                >
                  {scene.label}
                </button>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', minWidth: 0 }}>
            <div style={{ fontSize: 11, color: theme.text4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {runtime.manifest.title}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.text1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {runtime.activeScene.title ?? runtime.activeScene.label}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, minWidth: 0 }}>
        {publicDeckNav && <RequestDemoButton size="sm" />}
        {showProgress && (
          <>
            <button
              type="button"
              onClick={runtime.previousScene}
              disabled={runtime.isFirstScene}
              aria-label="Previous scene"
              style={navButtonStyle(theme.text2, theme.glass04, runtime.isFirstScene)}
            >
              <ChevronLeft size={16} />
            </button>
            <div style={{ minWidth: 70, textAlign: 'center', fontSize: 11, color: theme.text4, fontFamily: 'var(--font-mono)' }}>
              {String(runtime.activeSceneIndex + 1).padStart(2, '0')} / {String(runtime.manifest.scenes.length).padStart(2, '0')}
            </div>
            <button
              type="button"
              onClick={runtime.nextScene}
              disabled={runtime.isLastScene}
              aria-label="Next scene"
              style={navButtonStyle(theme.text2, theme.glass04, runtime.isLastScene)}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {showUtilities && onChatOpen && (
          <button type="button" onClick={onChatOpen} aria-label="Open AI chat" style={utilityButtonStyle(theme.card, theme.border2, theme.shadowSm)}>
            <Sparkles size={14} color={theme.icon} />
          </button>
        )}
        {showUtilities && onAlertsOpen && (
          <button
            type="button"
            onClick={onAlertsOpen}
            aria-label="Open alerts"
            style={utilityButtonStyle(alertCount > 0 ? theme.cardHover : theme.card, alertCount > 0 ? theme.border3 : theme.border2, theme.shadowSm)}
          >
            <Bell size={14} color={alertCount > 0 ? theme.text1 : theme.icon} />
          </button>
        )}
      </div>
    </header>
  )
}

function navButtonStyle(color: string, background: string, disabled: boolean) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 999,
    border: '1px solid var(--w-border2)',
    cursor: disabled ? 'default' : 'pointer',
    background,
    boxShadow: 'var(--w-shadow-sm)',
    color,
    opacity: disabled ? 0.35 : 1,
  } satisfies CSSProperties
}

function utilityButtonStyle(background: string, borderColor: string, shadow: string) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 10,
    border: `1px solid ${borderColor}`,
    cursor: 'pointer',
    background,
    boxShadow: shadow,
  } satisfies CSSProperties
}
