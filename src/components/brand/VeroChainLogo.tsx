import type { CSSProperties } from 'react'

interface VeroChainLogoProps {
  /** Render only the hexagon icon without the wordmark */
  iconOnly?: boolean
  /** Height of the icon in pixels (wordmark scales proportionally) */
  size?: number
  /** Override the wordmark fill color (defaults to #F0EEFF) */
  textColor?: string
  /** Additional inline styles on the outer wrapper */
  style?: CSSProperties
  className?: string
}

/**
 * VeroChain brand mark — concentric violet hexagon + "verochain" wordmark.
 * Scales proportionally based on the `size` prop (default 28).
 */
export function VeroChainLogo({ iconOnly, size = 28, textColor = '#F0EEFF', style, className }: VeroChainLogoProps) {
  if (iconOnly) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="VeroChain"
        className={className}
        style={style}
      >
        <polygon points="20,2 34,10 34,30 20,38 6,30 6,10" fill="#7C5CFC" />
        <polygon points="20,8 28,13 28,27 20,32 12,27 12,13" fill="#5A3DD4" />
        <polygon points="20,14 24,16.5 24,23.5 20,26 16,23.5 16,16.5" fill="#3D2499" />
      </svg>
    )
  }

  const totalWidth = (260 / 40) * size
  return (
    <svg
      width={totalWidth}
      height={size}
      viewBox="0 0 260 40"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="VeroChain"
      className={className}
      style={style}
    >
      <polygon points="20,2 34,10 34,30 20,38 6,30 6,10" fill="#7C5CFC" />
      <polygon points="20,8 28,13 28,27 20,32 12,27 12,13" fill="#5A3DD4" />
      <polygon points="20,14 24,16.5 24,23.5 20,26 16,23.5 16,16.5" fill="#3D2499" />
      <text x="46" y="28" fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif" fontWeight="500" fontSize="22" fill={textColor} letterSpacing="-0.4">verochain</text>
    </svg>
  )
}
