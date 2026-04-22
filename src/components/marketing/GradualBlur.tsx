import React, { useEffect, useMemo, useRef, useState } from 'react'

import './GradualBlur.css'

export type GradualBlurPosition = 'top' | 'bottom' | 'left' | 'right'
export type GradualBlurCurve = 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out'
export type GradualBlurTarget = 'parent' | 'page'

const PRESETS = {
  top: { position: 'top' as const, height: '6rem' },
  bottom: { position: 'bottom' as const, height: '6rem' },
  left: { position: 'left' as const, height: '6rem' },
  right: { position: 'right' as const, height: '6rem' },
  subtle: { height: '4rem', strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: '10rem', strength: 4, divCount: 8, exponential: true },
  smooth: { height: '8rem', curve: 'bezier' as const, divCount: 10 },
  sharp: { height: '5rem', curve: 'linear' as const, divCount: 4 },
  header: { position: 'top' as const, height: '8rem', curve: 'ease-out' as const },
  footer: { position: 'bottom' as const, height: '8rem', curve: 'ease-out' as const },
  sidebar: { position: 'left' as const, height: '6rem', strength: 2.5 },
  'page-header': { position: 'top' as const, height: '10rem', target: 'page' as const, strength: 3 },
  'page-footer': { position: 'bottom' as const, height: '10rem', target: 'page' as const, strength: 3 },
} as const

export type GradualBlurPreset = keyof typeof PRESETS

const DEFAULT_CONFIG = {
  position: 'bottom' as GradualBlurPosition,
  strength: 2,
  height: '6rem',
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false as boolean | 'scroll',
  duration: '0.3s',
  easing: 'ease-out',
  opacity: 1,
  curve: 'linear' as GradualBlurCurve,
  responsive: false,
  target: 'parent' as GradualBlurTarget,
  className: '',
  style: {} as React.CSSProperties,
}

const CURVE_FUNCTIONS: Record<GradualBlurCurve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  'ease-in': (p) => p * p,
  'ease-out': (p) => 1 - Math.pow(1 - p, 2),
  'ease-in-out': (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
}

const mergeConfigs = (...configs: Record<string, unknown>[]) =>
  configs.reduce<Record<string, unknown>>((acc, c) => ({ ...acc, ...c }), {})

const getGradientDirection = (position: GradualBlurPosition) =>
  (
    ({
      top: 'to top',
      bottom: 'to bottom',
      left: 'to left',
      right: 'to right',
    }) as const
  )[position] || 'to bottom'

const debounce = (fn: () => void, wait: number) => {
  let t: ReturnType<typeof setTimeout>
  return () => {
    clearTimeout(t)
    t = setTimeout(() => fn(), wait)
  }
}

const useResponsiveDimension = (
  responsive: boolean,
  config: Record<string, string | undefined>,
  key: 'height' | 'width',
) => {
  const [value, setValue] = useState(config[key])
  useEffect(() => {
    if (!responsive) return
    const capitalized = key[0].toUpperCase() + key.slice(1)
    const calc = () => {
      const w = window.innerWidth
      let v = config[key]
      const mobileKey = `mobile${capitalized}` as keyof typeof config
      const tabletKey = `tablet${capitalized}` as keyof typeof config
      const desktopKey = `desktop${capitalized}` as keyof typeof config
      if (w <= 480 && config[mobileKey]) v = config[mobileKey] as string
      else if (w <= 768 && config[tabletKey]) v = config[tabletKey] as string
      else if (w <= 1024 && config[desktopKey]) v = config[desktopKey] as string
      setValue(v)
    }
    const debounced = debounce(calc, 100)
    calc()
    window.addEventListener('resize', debounced)
    return () => window.removeEventListener('resize', debounced)
  }, [responsive, config, key])
  return responsive ? value : config[key]
}

const useIntersectionObserver = (ref: React.RefObject<HTMLElement | null>, shouldObserve = false) => {
  const [isVisible, setIsVisible] = useState(!shouldObserve)

  useEffect(() => {
    if (!shouldObserve || !ref.current) return

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.1,
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, shouldObserve])

  return isVisible
}

export type GradualBlurProps = Partial<typeof DEFAULT_CONFIG> & {
  preset?: GradualBlurPreset
  width?: string
  hoverIntensity?: number
  onAnimationComplete?: () => void
  className?: string
  style?: React.CSSProperties
  /** Responsive breakpoints: mobileHeight, tabletHeight, etc. */
  mobileHeight?: string
  tabletHeight?: string
  desktopHeight?: string
  mobileWidth?: string
  tabletWidth?: string
  desktopWidth?: string
}

function GradualBlur(props: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const config = useMemo(() => {
    const presetConfig = props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {}
    return mergeConfigs(DEFAULT_CONFIG, presetConfig, props) as typeof DEFAULT_CONFIG &
      GradualBlurProps & { width?: string; hoverIntensity?: number; onAnimationComplete?: () => void }
  }, [props])

  const responsiveConfig = useMemo(
    () => ({
      height: config.height,
      width: config.width,
      mobileHeight: props.mobileHeight,
      tabletHeight: props.tabletHeight,
      desktopHeight: props.desktopHeight,
      mobileWidth: props.mobileWidth,
      tabletWidth: props.tabletWidth,
      desktopWidth: props.desktopWidth,
    }),
    [
      config.height,
      config.width,
      props.mobileHeight,
      props.tabletHeight,
      props.desktopHeight,
      props.mobileWidth,
      props.tabletWidth,
      props.desktopWidth,
    ],
  )

  const responsiveHeight = useResponsiveDimension(config.responsive, responsiveConfig, 'height')
  const responsiveWidth = useResponsiveDimension(config.responsive, responsiveConfig, 'width')

  const isVisible = useIntersectionObserver(containerRef, config.animated === 'scroll')

  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = []
    const increment = 100 / config.divCount
    const currentStrength =
      isHovered && config.hoverIntensity ? config.strength * config.hoverIntensity : config.strength

    const curveFunc = CURVE_FUNCTIONS[config.curve] ?? CURVE_FUNCTIONS.linear

    for (let i = 1; i <= config.divCount; i++) {
      let progress = i / config.divCount
      progress = curveFunc(progress)

      let blurValue: number
      if (config.exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * currentStrength
      } else {
        blurValue = 0.0625 * (progress * config.divCount + 1) * currentStrength
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10
      const p2 = Math.round(increment * i * 10) / 10
      const p3 = Math.round((increment * i + increment) * 10) / 10
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10

      let gradient = `transparent ${p1}%, black ${p2}%`
      if (p3 <= 100) gradient += `, black ${p3}%`
      if (p4 <= 100) gradient += `, transparent ${p4}%`

      const direction = getGradientDirection(config.position)

      const divStyle: React.CSSProperties = {
        position: 'absolute',
        inset: '0',
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity,
        transition:
          config.animated && config.animated !== 'scroll'
            ? `backdrop-filter ${config.duration} ${config.easing}`
            : undefined,
      }

      divs.push(<div key={i} style={divStyle} />)
    }

    return divs
  }, [config, isHovered])

  const containerStyle = useMemo((): React.CSSProperties => {
    const isVertical = ['top', 'bottom'].includes(config.position)
    const isHorizontal = ['left', 'right'].includes(config.position)
    const isPageTarget = config.target === 'page'

    const baseStyle: React.CSSProperties = {
      position: isPageTarget ? 'fixed' : 'absolute',
      pointerEvents: config.hoverIntensity ? 'auto' : 'none',
      opacity: isVisible ? 1 : 0,
      transition: config.animated ? `opacity ${config.duration} ${config.easing}` : undefined,
      zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
      ...config.style,
    }

    if (isVertical) {
      baseStyle.height = responsiveHeight
      baseStyle.width = responsiveWidth || '100%'
      if (config.position === 'top') baseStyle.top = 0
      else baseStyle.bottom = 0
      baseStyle.left = 0
      baseStyle.right = 0
    } else if (isHorizontal) {
      baseStyle.width = responsiveWidth || responsiveHeight
      baseStyle.height = '100%'
      if (config.position === 'left') baseStyle.left = 0
      else baseStyle.right = 0
      baseStyle.top = 0
      baseStyle.bottom = 0
    }

    return baseStyle
  }, [config, responsiveHeight, responsiveWidth, isVisible])

  const { hoverIntensity, animated, onAnimationComplete, duration } = config

  useEffect(() => {
    if (isVisible && animated === 'scroll' && onAnimationComplete) {
      const ms = parseFloat(String(duration)) * 1000
      const t = setTimeout(() => onAnimationComplete(), ms)
      return () => clearTimeout(t)
    }
  }, [isVisible, animated, onAnimationComplete, duration])

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${config.target === 'page' ? 'gradual-blur-page' : 'gradual-blur-parent'} ${config.className ?? ''}`}
      style={containerStyle}
      onMouseEnter={hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div
        className="gradual-blur-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {blurDivs}
      </div>
    </div>
  )
}

const GradualBlurMemo = React.memo(GradualBlur)
GradualBlurMemo.displayName = 'GradualBlur'

export { GradualBlurMemo as GradualBlur, PRESETS, CURVE_FUNCTIONS }
