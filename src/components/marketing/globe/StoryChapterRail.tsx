import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { W } from '../../../theme/publicTheme'
import { MarketingBorderBeam } from '../MarketingBorderBeam'
import { subscribeToProgress } from './globeBus'
import {
  getMarketingBeatCount,
  getMarketingBeatIndexForProgress,
  getMarketingProgressForBeatMid,
} from './marketingScrollChapterModel'

const RAIL_HEIGHT = 44

const wrap: CSSProperties = {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 20,
  zIndex: 8,
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none',
}

const inner: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 14px',
  borderRadius: 999,
  border: `1px solid ${W.glass08}`,
  background: 'rgba(8, 11, 22, 0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  pointerEvents: 'auto',
}

function scrollStoryToProgress(t: number, reducedMotion: boolean): void {
  if (typeof document === 'undefined') return
  const container = document.querySelector('[data-scroll-container]') as HTMLElement | null
  const track = document.querySelector('[data-marketing-track]') as HTMLElement | null
  if (!container || !track) return

  const containerRect = container.getBoundingClientRect()
  const trackRect = track.getBoundingClientRect()
  const start =
    trackRect.top - containerRect.top + container.scrollTop
  const range = track.offsetHeight - container.clientHeight
  if (range <= 0) return
  const scrollTop = start + Math.max(0, Math.min(1, t)) * range
  container.scrollTo({
    top: scrollTop,
    behavior: reducedMotion ? 'auto' : 'smooth',
  })
}

/**
 * Six-dot story progress for the marketing scrollytelling track.
 * Subscribes to the same progress bus as the globe (no extra scroll listener).
 */
export function StoryChapterRail() {
  const reducedMotion = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const count = getMarketingBeatCount()

  useEffect(() => {
    const apply = (t: number) => setActive(getMarketingBeatIndexForProgress(t))
    apply(0)
    return subscribeToProgress(apply)
  }, [])

  return (
    <nav className="story-chapter-rail" style={wrap} aria-label="Story chapters">
      <MarketingBorderBeam size="sm" strength={0.44} style={{ display: 'inline-block' }}>
        <div style={inner}>
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to chapter ${i + 1}`}
            aria-current={i === active ? 'step' : undefined}
            onClick={() => scrollStoryToProgress(getMarketingProgressForBeatMid(i), reducedMotion)}
            style={{
              minWidth: RAIL_HEIGHT,
              minHeight: RAIL_HEIGHT,
              width: RAIL_HEIGHT,
              height: RAIL_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              borderRadius: '50%',
              border: `1px solid ${i === active ? 'rgba(124, 92, 252, 0.55)' : W.glass12}`,
              background: i === active ? 'rgba(124, 92, 252, 0.35)' : 'rgba(255,255,255,0.08)',
              cursor: 'pointer',
              boxShadow: i === active ? '0 0 0 2px rgba(124, 92, 252, 0.25)' : undefined,
            }}
          >
            <span
              style={{
                width: i === active ? 8 : 6,
                height: i === active ? 8 : 6,
                borderRadius: '50%',
                background: i === active ? W.violet : W.text3,
                opacity: i === active ? 1 : 0.5,
              }}
            />
          </button>
        ))}
        </div>
      </MarketingBorderBeam>
      <style>{`
        .story-chapter-rail button:focus-visible {
          outline: 2px solid var(--w-violet);
          outline-offset: 3px;
        }
      `}</style>
    </nav>
  )
}
