import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import { useCallback, useState } from 'react'
import { BorderBeam } from 'border-beam'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

type BorderBeamProps = ComponentProps<typeof BorderBeam>

const DEFAULT_STRENGTH = 0.68

export type MarketingBorderBeamProps = Omit<
  BorderBeamProps,
  'theme' | 'active' | 'strength' | 'colorVariant' | 'staticColors' | 'onMouseEnter' | 'onMouseLeave'
> & {
  children: ReactNode
  /** @default 'dark' */
  theme?: BorderBeamProps['theme']
  /** Capped at 0.85 for a restrained marketing look. @default 0.68 */
  strength?: number
  /** @default 'ocean' (violet/blue family, quieter than `colorful`) */
  colorVariant?: BorderBeamProps['colorVariant']
  /** @default true — avoids hue-cycling that can fight the globe and ticker */
  staticColors?: boolean
  /**
   * When true (default), the beam runs only while the pointer is over the
   * wrapper or its descendants. Set false for surfaces that should read
   * “always live” (e.g. a focused modal).
   */
  activateOnHover?: boolean
  onMouseEnter?: BorderBeamProps['onMouseEnter']
  onMouseLeave?: BorderBeamProps['onMouseLeave']
}

/**
 * Sole import site for `border-beam` on the marketing surface: restrained
 * defaults, `prefers-reduced-motion` → `active`, and optional hover-gated
 * playback so the edge reads as an affordance, not constant chrome.
 */
export function MarketingBorderBeam({
  children,
  theme = 'dark',
  strength = DEFAULT_STRENGTH,
  colorVariant = 'ocean',
  staticColors = true,
  activateOnHover = true,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: MarketingBorderBeamProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [hovered, setHovered] = useState(false)
  const clampedStrength = Math.min(Math.max(0, strength), 0.85)

  const active = activateOnHover
    ? Boolean(hovered && !prefersReducedMotion)
    : !prefersReducedMotion

  const handleEnter = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onMouseEnter?.(e)
      setHovered(true)
    },
    [onMouseEnter],
  )

  const handleLeave = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(e)
      setHovered(false)
    },
    [onMouseLeave],
  )

  return (
    <BorderBeam
      theme={theme}
      colorVariant={colorVariant}
      staticColors={staticColors}
      strength={clampedStrength}
      active={active}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </BorderBeam>
  )
}
