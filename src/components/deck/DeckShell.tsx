import { useState, useCallback, useEffect, useRef, type ReactNode, type TouchEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { W } from '../../app/canvas/canvasTheme'

const ease = [0.16, 1, 0.3, 1] as const
const V = W.violet

interface DeckShellProps {
  /** Total slide count */
  count: number
  /** Render function — receives current index */
  children: (idx: number) => ReactNode
  /** Path to navigate on ESC (default: '/') */
  exitPath?: string
  /** Slide inner padding (default: '48px 56px') */
  padding?: string
}

export function DeckShell({ count, children, exitPath = '/', padding = '48px 56px' }: DeckShellProps) {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(0)
  const touchRef = useRef({ x: 0, y: 0 })
  const navigate = useNavigate()

  const go = useCallback((n: number) => { setDir(n > idx ? 1 : -1); setIdx(n) }, [idx])
  const next = useCallback(() => { setDir(1); setIdx(i => Math.min(i + 1, count - 1)) }, [count])
  const prev = useCallback(() => { setDir(-1); setIdx(i => Math.max(i - 1, 0)) }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      if (e.key === 'Escape') navigate(exitPath)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [next, prev, navigate, exitPath])

  const onTS = useCallback((e: TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const onTE = useCallback((e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.x
    const dy = e.changedTouches[0].clientY - touchRef.current.y
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) { dx < 0 ? next() : prev() }
  }, [next, prev])

  return (
    <div onTouchStart={onTS} onTouchEnd={onTE}
      style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: W.bg, color: W.text1, fontFamily: 'var(--font-sans)', userSelect: 'none' }}>

      {/* Background glow */}
      <motion.div animate={{ opacity: [0.25, 0.45, 0.25] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: '50vw', height: '50vw', borderRadius: '50%', background: `radial-gradient(circle, ${V}10, transparent 70%)`, top: '-10vw', left: '25vw', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* Click zones behind content — prev (left) / next (right) */}
      <div onClick={prev} style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', zIndex: 1, cursor: 'pointer' }} />
      <div onClick={next} style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', zIndex: 1, cursor: 'pointer' }} />

      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 10 }}>
        <motion.div animate={{ width: `${((idx + 1) / count) * 100}%` }} transition={{ duration: 0.35, ease }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${V}, ${V}80)` }} />
      </div>

      {/* Slide content */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={idx} custom={dir}
          initial={{ opacity: 0, x: dir * 80, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: dir * -80, scale: 0.98 }}
          transition={{ duration: 0.4, ease }}
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding, overflow: 'auto', width: '100%', maxWidth: '100vw', zIndex: 5 }}>
          {children(idx)}
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next buttons */}
      {idx > 0 && (
        <button type="button" onClick={e => { e.stopPropagation(); prev() }} aria-label="Previous slide"
          style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: W.glass06, border: `1px solid ${W.glass08}`, borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.text2, cursor: 'pointer', fontSize: 20 }}>‹</button>
      )}
      {idx < count - 1 && (
        <button type="button" onClick={e => { e.stopPropagation(); next() }} aria-label="Next slide"
          style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: W.glass06, border: `1px solid ${W.glass08}`, borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.text2, cursor: 'pointer', fontSize: 20 }}>›</button>
      )}

      {/* Dot pager */}
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 10 }}>
        {Array.from({ length: count }, (_, i) => (
          <button key={i} type="button" aria-label={`Slide ${i + 1}`} onClick={e => { e.stopPropagation(); go(i) }}
            style={{ width: i === idx ? 24 : 6, height: 6, borderRadius: 3, border: 'none', background: i === idx ? V : W.glass12, cursor: 'pointer', padding: 0, transition: 'width 0.3s ease, background 0.3s ease' }} />
        ))}
      </div>

      {/* Counter */}
      <div style={{ position: 'absolute', bottom: 20, right: 24, fontSize: 11, color: W.text4, fontFamily: 'var(--font-mono)', zIndex: 10 }}>
        {String(idx + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </div>

      {/* Hint */}
      <div style={{ position: 'absolute', bottom: 20, left: 24, fontSize: 10, color: W.text4, letterSpacing: '0.04em', zIndex: 10 }}>
        ← → navigate · ESC exit
      </div>
    </div>
  )
}
