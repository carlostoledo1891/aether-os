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
  StoryChapterRail,
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
  /** Trust / Product links in the nav (off when embedded). Default: `!embedded`. */
  showSiteLinks?: boolean
  /** Bottom chapter dots for the scrolly globe track (landing only). */
  showStoryChapterRail?: boolean
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
  showSiteLinks: showSiteLinksProp,
  showStoryChapterRail = false,
  children,
}: MarketingShellProps) {
  useUnlockScroll()
  const showSiteLinks = showSiteLinksProp ?? !embedded

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
        <a
          href="#marketing-main-scroll"
          className="marketing-skip-to-story"
          style={{
            position: 'fixed',
            left: 12,
            top: 12,
            zIndex: 200,
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            color: W.text1,
            background: W.surfaceHigh,
            border: `1px solid ${W.glass12}`,
            boxShadow: W.shadowMd,
            transform: 'translateY(-160%)',
            transition: 'transform 0.18s ease-out',
            pointerEvents: 'auto',
          }}
        >
          Skip to story
        </a>
      )}

      {!embedded && (
        <div style={{ position: 'relative', zIndex: 4 }}>
          <MarketingNav section={section} siteLinks={showSiteLinks} />
        </div>
      )}

      <div
        id="marketing-main-scroll"
        tabIndex={-1}
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

      {showStoryChapterRail && experience && !embedded && <StoryChapterRail />}

      <style>{`
        .marketing-skip-to-story:focus,
        .marketing-skip-to-story:focus-visible {
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}
