import { type ReactNode } from 'react'
import { MarketingNav } from '../layout/MarketingNav'
import { MARKETING_NAV_HEIGHT, useUnlockScroll } from '../layout/MarketingShared'
import { W } from '../../theme/publicTheme'
import {
  AuditTicker,
  LiveCounter,
  MarketingGlobe,
  ProvenanceCardOverlay,
  ProvenanceChip,
} from './globe'

interface MarketingShellProps {
  /** Optional section label rendered next to the logo (e.g. "tech", "trust"). */
  section?: string
  /** Hide nav (useful when embedded). */
  embedded?: boolean
  /**
   * When true, mounts the full award-grade chrome: provenance chip,
   * live counter, audit ribbon, click-to-reveal provenance card.
   * Defaults to true for the landing experience.
   */
  experience?: boolean
  children: ReactNode
}

/**
 * Shared chrome for all public marketing routes.
 *
 * Mounts:
 *   - The fixed-background `<MarketingGlobe />`.
 *   - The marketing nav (centered logo, transparent background).
 *   - When `experience` is true: persistent `ProvenanceChip` (top-right),
 *     `LiveCounter` (top-left), `AuditTicker` (bottom ribbon), and the
 *     `ProvenanceCardOverlay` revealed on hash-chip click.
 *
 * Pages provide their own `<section>` blocks inside `children` — keep
 * those backgrounds transparent (or low-alpha) for the globe to show.
 */
export function MarketingShell({
  section,
  embedded = false,
  experience = true,
  children,
}: MarketingShellProps) {
  useUnlockScroll()

  return (
    <div
      style={
        {
          position: 'relative',
          minHeight: '100vh',
          height: '100vh',
          overflow: 'hidden',
          background: 'transparent',
          color: W.text1,
          fontFamily: 'var(--font-sans)',
          // The slide root reads this — translucent so globe peeks through,
          // dark enough to keep paragraph copy readable.
          ['--marketing-slide-bg' as string]: 'rgba(6,9,20,0.62)',
        } as React.CSSProperties
      }
    >
      <MarketingGlobe />

      {!embedded && (
        <div style={{ position: 'relative', zIndex: 4 }}>
          <MarketingNav section={section} />
        </div>
      )}

      <div
        data-scroll-container
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100vh',
          overflowY: 'auto',
          // No CSS scroll-snap: this is a continuous scrollytelling track,
          // not a snap-to-section deck. The story progress is driven by
          // useScrollDriver with an inertial smoothing pass so the camera
          // glides instead of jumping per wheel tick.
          scrollPaddingTop: MARKETING_NAV_HEIGHT,
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        {children}
      </div>

      {experience && !embedded && (
        <>
          <ProvenanceChip />
          <LiveCounter />
          <AuditTicker />
          <ProvenanceCardOverlay />
        </>
      )}
    </div>
  )
}
