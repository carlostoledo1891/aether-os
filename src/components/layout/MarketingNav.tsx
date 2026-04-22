import type { CSSProperties } from 'react'
import { W } from '../../theme/publicTheme'
import { VeroChainLogo } from '../brand/VeroChainLogo'

export interface NavLink {
  label: string
  id?: string
  href?: string
}

interface MarketingNavProps {
  section?: string
  links?: NavLink[]
  cta?: { label: string; href: string; variant?: 'primary' | 'ghost' }
  onScrollTo?: (id: string) => void
  /** When true, show Trust + Product links (homepage / marketing chrome). */
  siteLinks?: boolean
}

const navStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  background: 'transparent',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
  alignItems: 'center',
  height: 56,
  padding: '0 20px',
  pointerEvents: 'none',
}

const siteLinkStyle: CSSProperties = {
  color: W.text2,
  fontSize: 13,
  fontWeight: 600,
  textDecoration: 'none',
  padding: '10px 12px',
  borderRadius: 8,
  minHeight: 44,
  minWidth: 44,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'auto',
}

const logoLinkStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  textDecoration: 'none',
  color: 'inherit',
  pointerEvents: 'auto',
  justifySelf: 'center',
}

export function MarketingNav({ section, siteLinks = false }: MarketingNavProps) {
  return (
    <nav style={navStyle}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          justifySelf: 'start',
          pointerEvents: 'auto',
        }}
      >
        {siteLinks && (
          <>
            <a href="/trust" style={siteLinkStyle}>
              Trust
            </a>
            <a href="/app" style={siteLinkStyle}>
              Product
            </a>
          </>
        )}
      </div>

      <a href="/" style={logoLinkStyle}>
        <VeroChainLogo size={24} textColor={W.text1} />
        {section && (
          <span style={{ color: W.text3, fontSize: 12, marginLeft: 4, fontFamily: 'var(--font-mono)' }}>
            / {section}
          </span>
        )}
      </a>

      <span aria-hidden style={{ justifySelf: 'end' }} />

      <style>{`
        nav a[href="/trust"]:hover,
        nav a[href="/app"]:hover {
          color: var(--w-text1);
          background: rgba(255, 255, 255, 0.05);
        }
        nav a[href="/trust"]:focus-visible,
        nav a[href="/app"]:focus-visible {
          outline: 2px solid var(--w-violet);
          outline-offset: 2px;
        }
      `}</style>
    </nav>
  )
}
