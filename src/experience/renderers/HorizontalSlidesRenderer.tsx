import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { PresentationRuntimeState } from '../types'

interface HorizontalSlidesRendererProps {
  runtime: PresentationRuntimeState
  topOffset: number
}

export function HorizontalSlidesRenderer({ runtime, topOffset }: HorizontalSlidesRendererProps) {
  const scene = runtime.activeScene

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault()
        runtime.nextScene()
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        runtime.previousScene()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [runtime])

  return (
    <div style={{ position: 'relative', zIndex: 1, height: `calc(100vh - ${topOffset}px)`, overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, x: 80, scale: 0.985 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -80, scale: 0.985 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            padding: 16,
          }}
        >
          <div
            style={{
              flex: 1,
              minHeight: 0,
              borderRadius: 24,
              overflow: 'hidden',
              ...getSceneSurfaceStyle(scene),
            }}
          >
            {scene.render()}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function getSceneSurfaceStyle(scene: PresentationRuntimeState['activeScene']) {
  const mode = scene.surface?.mode ?? 'transparent'
  if (mode === 'transparent') {
    return {}
  }
  if (mode === 'solid') {
    return { background: scene.surface?.color ?? 'var(--w-bg)' }
  }
  return {
    background: scene.surface?.color ?? 'color-mix(in srgb, var(--w-bg) 82%, transparent)',
    border: scene.surface?.border ?? '1px solid color-mix(in srgb, var(--w-border2) 75%, transparent)',
    backdropFilter: `blur(${scene.surface?.blur ?? 18}px)`,
  }
}
