import { useEffect } from 'react'
import type { RefObject } from 'react'
import { setScrollProgress } from './globeBus'

interface ScrollDriverOptions {
  /** The scrollable container element. Walked from `trackRef` if omitted. */
  containerRef?: RefObject<HTMLElement | null>
  /**
   * The "story track" element — its bounding box is what scroll
   * progress is measured *against*. Typically a tall spacer that
   * sits behind the sticky beats. When the top of `trackRef` reaches
   * the top of the container, t = 0; when the bottom of `trackRef`
   * meets the bottom of the container's viewport, t = 1.
   */
  trackRef: RefObject<HTMLElement | null>
  /** Smoothing factor in [0..1]. Higher = snappier; lower = more inertial. */
  smoothing?: number
  /** Disable easing (snap to scroll). Use for prefers-reduced-motion. */
  reducedMotion?: boolean
}

/**
 * Drives the global progress channel from a container's scroll
 * position. Runs one rAF loop while mounted and applies a small
 * exponential ease so chunky wheel deltas don't pulse the camera.
 *
 * Math:
 *   start = trackEl.offsetTop - containerEl.offsetTop
 *   end   = start + trackEl.offsetHeight - containerEl.clientHeight
 *   t     = (containerEl.scrollTop - start) / (end - start)
 *
 * Clamped to [0, 1]. If the page hasn't laid out yet (no height),
 * t falls through as 0.
 */
export function useScrollDriver({
  containerRef,
  trackRef,
  smoothing = 0.18,
  reducedMotion = false,
}: ScrollDriverOptions): void {
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const container =
      containerRef?.current ??
      (track.closest('[data-scroll-container]') as HTMLElement | null) ??
      document.scrollingElement ??
      document.documentElement
    if (!container) return

    let raf = 0
    let running = true
    let target = 0
    let current = 0

    const measure = () => {
      const containerRect = (container as HTMLElement).getBoundingClientRect()
      const trackRect = track.getBoundingClientRect()
      // Position of trackEl's top relative to container's scrollable origin.
      const start =
        trackRect.top -
        containerRect.top +
        (container as HTMLElement).scrollTop
      const viewport = (container as HTMLElement).clientHeight
      const range = track.offsetHeight - viewport
      if (range <= 0) {
        target = 0
        return
      }
      const offset = (container as HTMLElement).scrollTop - start
      const raw = offset / range
      target = raw < 0 ? 0 : raw > 1 ? 1 : raw
    }

    const tick = () => {
      if (!running) return
      if (reducedMotion) {
        current = target
      } else {
        current += (target - current) * smoothing
        if (Math.abs(target - current) < 0.0002) current = target
      }
      setScrollProgress(current)
      raf = requestAnimationFrame(tick)
    }

    measure()
    current = target
    setScrollProgress(current)

    const onScroll = () => measure()
    const onResize = () => measure()

    container.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    raf = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      container.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [containerRef, trackRef, smoothing, reducedMotion])
}
