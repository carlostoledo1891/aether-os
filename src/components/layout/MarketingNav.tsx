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
}

/**
 * Transparent topbar with the Vero logo centered. The CTA + section
 * links have been pulled — primary action lives in the hero copy now,
 * and below-the-hero anchors don't exist in the globe-led layout.
 *
 * `links` / `cta` props are kept on the API so existing call sites in
 * deck routes (`/deck/*`) don't break — they're simply ignored.
 */
const navStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 56,
  padding: '0 24px',
  pointerEvents: 'none',
}

const logoLinkStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  textDecoration: 'none',
  color: 'inherit',
  pointerEvents: 'auto',
}

export function MarketingNav({ section }: MarketingNavProps) {
  return (
    <nav style={navStyle}>
      <a href="/" style={logoLinkStyle}>
        <VeroChainLogo size={24} textColor={W.text1} />
        {section && (
          <span style={{ color: W.text4, fontSize: 12, marginLeft: 4, fontFamily: 'var(--font-mono)' }}>
            / {section}
          </span>
        )}
      </a>
    </nav>
  )
}
