import { memo, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { W } from '../app/canvas/canvasTheme'
import { useAetherService } from '../services/DataServiceProvider'
import { useServiceQuery } from '../hooks/useServiceQuery'
import { getWidget } from './WidgetRegistry'
import { resolvePath } from './DataBridge'
import type { ViewManifest, SectionConfig, WidgetConfig } from './types'

/* ── WidgetRenderer ──────────────────────────────────────────────────── */

function WidgetRenderer({ config, index }: { config: WidgetConfig; index: number }) {
  const Component = getWidget(config.type)

  const { data, isLoading } = useServiceQuery(
    config.dataQuery ? `engine:${config.dataQuery}` : `engine:noop:${index}`,
    (service) => {
      if (!config.dataQuery) return undefined
      const method = (service as Record<string, unknown>)[config.dataQuery]
      if (typeof method !== 'function') return undefined
      return method.call(service)
    },
  )

  if (!Component) {
    return (
      <div style={placeholderStyle}>
        <span style={{ color: W.text4, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          [{config.type}]
        </span>
      </div>
    )
  }

  if (config.dataQuery && isLoading) {
    return (
      <div style={placeholderStyle}>
        <span style={{ color: W.text4, fontSize: 10, fontFamily: 'var(--font-mono)' }}>
          loading…
        </span>
      </div>
    )
  }

  const resolved = config.dataPath && data != null ? resolvePath(data, config.dataPath) : data
  const mergedProps = { ...config.props, ...(resolved !== undefined ? { data: resolved } : {}) }

  return <Component {...mergedProps} />
}

const placeholderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 48,
  background: W.glass03,
  border: W.chromeBorder,
  borderRadius: W.radius.sm,
  padding: '8px 12px',
}

/* ── SectionRenderer ─────────────────────────────────────────────────── */

const sectionLayoutBuilders: Record<string, (cfg: SectionConfig) => CSSProperties> = {
  'metric-grid': (cfg) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cfg.columns ?? 4}, 1fr)`,
    gap: cfg.gap ?? 10,
  }),
  'card-stack': (cfg) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: cfg.gap ?? 12,
  }),
  'chart-row': (cfg) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: cfg.gap ?? 14,
    flexWrap: 'wrap',
  }),
  'hero-map': (cfg) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: cfg.gap ?? 8,
    minHeight: 240,
  }),
  table: (cfg) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: cfg.gap ?? 8,
  }),
  timeline: (cfg) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: cfg.gap ?? 8,
  }),
  custom: (cfg) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: cfg.gap ?? 8,
  }),
}

function SectionRenderer({ section }: { section: SectionConfig }) {
  const layoutBuilder = sectionLayoutBuilders[section.kind] ?? sectionLayoutBuilders.custom!
  const layoutStyle = layoutBuilder(section)

  let children: ReactNode

  if (section.kind === 'hero-map') {
    const geoWidget = section.widgets.find((w) => w.geo)
    children = (
      <>
        <div style={heroMapPlaceholderStyle}>
          <span style={{ color: W.text4, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
            [map — {geoWidget?.geo?.layers.join(', ') ?? 'no layers'}]
          </span>
        </div>
        {section.widgets
          .filter((w) => !w.geo)
          .map((w, i) => (
            <WidgetRenderer key={`${section.id}-w-${i}`} config={w} index={i} />
          ))}
      </>
    )
  } else {
    children = section.widgets.map((w, i) => (
      <WidgetRenderer key={`${section.id}-w-${i}`} config={w} index={i} />
    ))
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: 24 }}
    >
      {section.title && (
        <h3 style={sectionTitleStyle}>{section.title}</h3>
      )}
      <div style={layoutStyle}>{children}</div>
    </motion.section>
  )
}

const heroMapPlaceholderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 200,
  background: `linear-gradient(135deg, ${W.glass04}, ${W.glass07})`,
  border: W.chromeBorder,
  borderRadius: W.radius.md,
}

const sectionTitleStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: W.text3,
  fontFamily: 'var(--font-ui)',
  margin: '0 0 10px',
}

/* ── ViewEngine ──────────────────────────────────────────────────────── */

export const ViewEngine = memo(function ViewEngine({ manifest }: { manifest: ViewManifest }) {
  void useAetherService()

  const isLight = manifest.theme === 'light'
  const themeRoot: CSSProperties = {
    ...rootStyle,
    background: isLight ? '#ffffff' : undefined,
    color: isLight ? '#1a1a2e' : W.text1,
  }
  const themeTitle: CSSProperties = {
    ...titleStyle,
    color: isLight ? '#1a1a2e' : W.text1,
  }
  const themeSub: CSSProperties = {
    ...subtitleStyle,
    color: isLight ? '#555' : W.text3,
  }

  return (
    <div style={themeRoot}>
      <header style={headerStyle}>
        {manifest.logo && (
          <img
            src={manifest.logo}
            alt=""
            style={{ height: 32, marginBottom: 8, objectFit: 'contain' }}
          />
        )}
        <h1 style={themeTitle}>{manifest.title}</h1>
        {manifest.subtitle && (
          <p style={themeSub}>{manifest.subtitle}</p>
        )}
      </header>

      {manifest.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  )
})

const rootStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  padding: '16px 20px 32px',
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
}

const headerStyle: CSSProperties = {
  marginBottom: 20,
}

const titleStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: '-0.01em',
  color: W.text1,
  fontFamily: 'var(--font-ui)',
  margin: 0,
}

const subtitleStyle: CSSProperties = {
  fontSize: 12,
  color: W.text3,
  fontFamily: 'var(--font-ui)',
  margin: '4px 0 0',
}
