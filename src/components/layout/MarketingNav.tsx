import type { CSSProperties } from 'react'
import { W } from '../../app/canvas/canvasTheme'

const V = W.violet

export interface NavLink {
  label: string
  id?: string
  href?: string
}

interface MarketingNavProps {
  section?: string
  links: NavLink[]
  cta?: { label: string; href: string; variant?: 'primary' | 'ghost' }
  onScrollTo?: (id: string) => void
}

const navStyle: CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
  background: W.navScrim, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${W.glass06}`, height: 56,
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
}

const linkStyle: CSSProperties = {
  color: W.text3, fontSize: 13, fontWeight: 500, textDecoration: 'none',
}

export function MarketingNav({ section, links, cta, onScrollTo }: MarketingNavProps) {
  return (
    <nav style={navStyle}>
      <a href="/lp" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
        <div style={{ width: 28, height: 28, background: V, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: section ? 14 : 13, fontWeight: 800, color: '#fff' }}>V</div>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>Vero</span>
        {section && (
          <span style={{ color: W.text4, fontSize: 12, marginLeft: 4, fontFamily: 'var(--font-mono)' }}>/ {section}</span>
        )}
      </a>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {links.map(n => {
          if (n.href) {
            return <a key={n.href} href={n.href} style={linkStyle}>{n.label}</a>
          }
          return (
            <a key={n.id} href={`#${n.id}`} onClick={e => { e.preventDefault(); onScrollTo?.(n.id!) }}
              style={linkStyle}>{n.label}</a>
          )
        })}
        {cta && (
          cta.variant === 'ghost'
            ? <a href={cta.href} style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>{cta.label}</a>
            : <a href={cta.href} style={{ background: V, color: '#fff', padding: '8px 18px', borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>{cta.label}</a>
        )}
      </div>
    </nav>
  )
}
