import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import type { ReportType } from '../../types/telemetry'
import type { TimeRange } from './reportTheme'
import { WL } from './reportTheme'
import { ReportToolbar } from './ReportToolbar'
import css from './ReportViewer.module.css'

const EnvironmentReport = lazy(() => import('./EnvironmentReport'))
const OperationsReport = lazy(() => import('./OperationsReport'))
const DrillTestsReport = lazy(() => import('./DrillTestsReport'))

const REPORT_TITLES: Record<ReportType, string> = {
  environment: 'Environmental & Community Report',
  operations: 'Operations Report',
  'drill-tests': 'Drill Tests & Resource Report',
}

interface ReportViewerProps {
  type: ReportType
  onClose: () => void
}

export function ReportViewer({ type, onClose }: ReportViewerProps) {
  const [range, setRange] = useState<TimeRange>('all')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleExport = useCallback(() => {
    window.print()
  }, [])

  const reportContent = (
    <Suspense fallback={
      <div style={{ padding: 60, textAlign: 'center', color: WL.text3, fontFamily: 'var(--font-ui)' }}>
        Loading report…
      </div>
    }>
      {type === 'environment' && <EnvironmentReport range={range} />}
      {type === 'operations' && <OperationsReport range={range} />}
      {type === 'drill-tests' && <DrillTestsReport range={range} />}
    </Suspense>
  )

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="report-backdrop"
        className={css.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        key="report-lightbox"
        className={css.lightbox}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-modal
        aria-label={REPORT_TITLES[type]}
      >
        <button className={css.closeBtn} onClick={onClose} aria-label="Close report">
          <X size={16} />
        </button>

        <ReportToolbar
          title={REPORT_TITLES[type]}
          subtitle="Caldeira Project"
          range={range}
          onRangeChange={setRange}
          onExport={handleExport}
        />

        <div className={css.scrollArea}>
          {reportContent}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
