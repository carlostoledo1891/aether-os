import { memo, lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { W } from '../app/canvas/canvasTheme'
import { ViewEngine } from './ViewEngine'
import { getPresetManifest, listPresets } from './presets'

const PrefeituraPage = lazy(() =>
  import('./sandbox/prefeitura/PrefeituraPage').then(m => ({ default: m.PrefeituraPage })),
)

const DEDICATED_PAGES: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'prefeitura-pocos': PrefeituraPage,
}

export const ViewEnginePage = memo(function ViewEnginePage() {
  const { manifestId } = useParams<{ manifestId: string }>()

  const DedicatedPage = manifestId ? DEDICATED_PAGES[manifestId] : undefined
  if (DedicatedPage) {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#060610' }} />}>
        <DedicatedPage />
      </Suspense>
    )
  }

  const manifest = manifestId ? getPresetManifest(manifestId) : undefined

  if (!manifest) {
    return (
      <div style={{
        minHeight: '100vh',
        background: W.bg,
        color: W.text1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        gap: 24,
        padding: 40,
      }}>
        <p style={{ fontSize: 14, color: W.text4 }}>
          {manifestId ? `Manifest "${manifestId}" not found.` : 'No manifest ID specified.'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', color: W.text4, letterSpacing: '0.08em' }}>
            Available presets:
          </p>
          {listPresets().map(id => (
            <Link
              key={id}
              to={`/view/${id}`}
              style={{ color: W.cyan, fontSize: 13, textDecoration: 'none' }}
            >
              {id}
            </Link>
          ))}
        </div>
        <Link to="/" style={{ color: W.text4, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', marginTop: 16 }}>
          <ArrowLeft size={12} /> Back to main
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ minHeight: '100vh', background: W.bg, position: 'relative' }}
    >
      <Link
        to="/"
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 10px',
          borderRadius: W.radius.sm,
          background: W.glass08,
          border: `1px solid ${W.chromeBorder}`,
          color: W.text4,
          fontSize: 10,
          textDecoration: 'none',
          backdropFilter: 'blur(8px)',
        }}
      >
        <ArrowLeft size={10} /> Aether OS
      </Link>
      <ViewEngine manifest={manifest} />
    </motion.div>
  )
})
