import { Suspense, useState, useCallback, useEffect, useRef, type TouchEvent } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { WL } from '../reports/reportTheme'
import { ReportToolbar } from '../reports/ReportToolbar'
import type { TimeRange } from '../reports/reportTheme'
import type { DeckManifest } from './types'
import css from './DeckRunner.module.css'

const ease = [0.16, 1, 0.3, 1] as const
const V = W.violet

/* ── Slides Mode ─────────────────────────────────────────────────── */

function SlidesRunner({ manifest }: { manifest: DeckManifest }) {
  const slides = manifest.slides ?? []
  const count = slides.length
  const [idx, setIdx] = useState(() => {
    const hash = window.location.hash.match(/slide-(\d+)/)
    return hash ? Math.min(Number(hash[1]) - 1, count - 1) : 0
  })
  const [dir, setDir] = useState(0)
  const touchRef = useRef({ x: 0, y: 0 })
  const navigate = useNavigate()

  const go = useCallback((n: number) => { setDir(n > idx ? 1 : -1); setIdx(n) }, [idx])
  const next = useCallback(() => { setDir(1); setIdx(i => Math.min(i + 1, count - 1)) }, [count])
  const prev = useCallback(() => { setDir(-1); setIdx(i => Math.max(i - 1, 0)) }, [])

  useEffect(() => {
    window.history.replaceState(null, '', `#slide-${idx + 1}`)
  }, [idx])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      if (e.key === 'Escape') navigate(manifest.exitPath ?? '/')
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [next, prev, navigate, manifest.exitPath])

  const onTS = useCallback((e: TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const onTE = useCallback((e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.x
    const dy = e.changedTouches[0].clientY - touchRef.current.y
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) next()
      else prev()
    }
  }, [next, prev])

  const SlideComponent = slides[idx]

  return (
    <div onTouchStart={onTS} onTouchEnd={onTE}
      style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: W.bg, color: W.text1, fontFamily: 'var(--font-sans)', userSelect: 'none' }}>

      <motion.div animate={{ opacity: [0.25, 0.45, 0.25] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: '50vw', height: '50vw', borderRadius: '50%', background: `radial-gradient(circle, ${V}10, transparent 70%)`, top: '-10vw', left: '25vw', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') prev() }} onClick={prev} style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', zIndex: 1, cursor: 'pointer' }} />
      <div role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') next() }} onClick={next} style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', zIndex: 1, cursor: 'pointer' }} />

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 10 }}>
        <motion.div animate={{ width: `${((idx + 1) / count) * 100}%` }} transition={{ duration: 0.35, ease }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${V}, ${V}80)` }} />
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={idx} custom={dir}
          initial={{ opacity: 0, x: dir * 80, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: dir * -80, scale: 0.98 }}
          transition={{ duration: 0.4, ease }}
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 56px', overflow: 'auto', width: '100%', maxWidth: '100vw', zIndex: 5 }}>
          <Suspense fallback={null}>
            {SlideComponent && <SlideComponent />}
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {idx > 0 && (
        <button type="button" onClick={e => { e.stopPropagation(); prev() }} aria-label="Previous slide"
          style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: W.glass06, border: `1px solid ${W.glass08}`, borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.text2, cursor: 'pointer', fontSize: 20 }}>‹</button>
      )}
      {idx < count - 1 && (
        <button type="button" onClick={e => { e.stopPropagation(); next() }} aria-label="Next slide"
          style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: W.glass06, border: `1px solid ${W.glass08}`, borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.text2, cursor: 'pointer', fontSize: 20 }}>›</button>
      )}

      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 10 }}>
        {Array.from({ length: count }, (_, i) => (
          <button key={i} type="button" aria-label={`Slide ${i + 1}`} onClick={e => { e.stopPropagation(); go(i) }}
            style={{ width: i === idx ? 24 : 6, height: 6, borderRadius: 3, border: 'none', background: i === idx ? V : W.glass12, cursor: 'pointer', padding: 0, transition: 'width 0.3s ease, background 0.3s ease' }} />
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 24, fontSize: 11, color: W.text4, fontFamily: 'var(--font-mono)', zIndex: 10 }}>
        {String(idx + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </div>

      <div style={{ position: 'absolute', bottom: 20, left: 24, fontSize: 10, color: W.text4, letterSpacing: '0.04em', zIndex: 10 }}>
        ← → navigate · ESC exit
      </div>
    </div>
  )
}

/* ── Dashboard Mode ──────────────────────────────────────────────── */

function DashboardRunner({ manifest }: { manifest: DeckManifest }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: manifest.theme === 'light' ? '#ffffff' : W.bg,
      color: manifest.theme === 'light' ? WL.text1 : W.text1,
      fontFamily: 'var(--font-sans)',
    }}>
      {manifest.children}
    </div>
  )
}

/* ── Report Mode ─────────────────────────────────────────────────── */

const backdropStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 300,
  background: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
}

const lightboxStyle: React.CSSProperties = {
  position: 'fixed', inset: 24, zIndex: 301,
  display: 'flex', flexDirection: 'column',
  borderRadius: 16, overflow: 'hidden',
  background: '#ffffff',
  boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
}

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute', top: 16, right: 16, zIndex: 10,
  width: 36, height: 36,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 10, cursor: 'pointer', color: '#4a4a6a',
}

function ReportRunner({ manifest, onClose }: { manifest: DeckManifest; onClose?: () => void }) {
  const [range, setRange] = useState<TimeRange>('all')
  const navigate = useNavigate()

  const close = useCallback(() => {
    if (onClose) { onClose(); return }
    navigate(manifest.exitPath ?? '/')
  }, [onClose, navigate, manifest.exitPath])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [close])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleExport = useCallback(() => { window.print() }, [])

  const content = (
    <>
      <motion.div
        key="report-backdrop"
        className={css.reportBackdrop}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={backdropStyle}
        onClick={close}
        aria-hidden
      />
      <motion.div
        key="report-lightbox"
        className={css.reportLightbox}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease }}
        style={lightboxStyle}
        role="dialog"
        aria-modal
        aria-label={manifest.title}
      >
        <button type="button" className={css.reportClose} style={closeBtnStyle} onClick={close} aria-label="Close report">
          <X size={16} />
        </button>

        {manifest.timeRange && (
          <div className={css.reportToolbar}>
            <ReportToolbar
              title={manifest.title}
              subtitle={manifest.subtitle ?? ''}
              range={range}
              onRangeChange={setRange}
              onExport={handleExport}
            />
          </div>
        )}

        <div className={css.reportScroll} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
          {manifest.renderContent ? manifest.renderContent(range) : manifest.children}
        </div>
      </motion.div>
    </>
  )

  if (manifest.portal !== false) {
    return createPortal(<AnimatePresence>{content}</AnimatePresence>, document.body)
  }

  return <AnimatePresence>{content}</AnimatePresence>
}

/* ── DeckRunner (unified entry point) ────────────────────────────── */

interface DeckRunnerProps {
  manifest: DeckManifest
  onClose?: () => void
}

export function DeckRunner({ manifest, onClose }: DeckRunnerProps) {
  switch (manifest.mode) {
    case 'slides':
      return <SlidesRunner manifest={manifest} />
    case 'dashboard':
      return <DashboardRunner manifest={manifest} />
    case 'report':
      return <ReportRunner manifest={manifest} onClose={onClose} />
  }
}
