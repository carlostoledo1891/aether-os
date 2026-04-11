import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Map, ShieldCheck, BarChart3, FileText, TreePine, Factory, Crosshair } from 'lucide-react'
import type { ViewMode, ReportType } from '../../types/telemetry'
import { W } from '../../app/canvas/canvasTheme'

interface ViewSwitcherProps {
  active: ViewMode
  onChange: (v: ViewMode) => void
  alertCount?: number
  onReportOpen?: (type: ReportType) => void
}

const VIEWS: { id: ViewMode; label: string; icon: typeof Map; color: string }[] = [
  { id: 'operator',  label: 'Field Operations',              icon: Map,         color: W.violet },
  { id: 'buyer',     label: 'Traceability & Compliance',      icon: ShieldCheck, color: W.green },
  { id: 'executive', label: 'Executive Overview',            icon: BarChart3,   color: W.amber },
]

const REPORTS: { id: ReportType; label: string; icon: typeof FileText }[] = [
  { id: 'environment',  label: 'Environment',   icon: TreePine },
  { id: 'operations',   label: 'Operations',    icon: Factory },
  { id: 'drill-tests',  label: 'Drill Tests',   icon: Crosshair },
]

export function ViewSwitcher({ active, onChange, alertCount = 0, onReportOpen }: ViewSwitcherProps) {
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openDropdown = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setReportDropdownOpen(true)
  }, [])

  const closeDropdown = useCallback(() => {
    timeoutRef.current = setTimeout(() => setReportDropdownOpen(false), 150)
  }, [])

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  return (
    <div style={{ display: 'flex', gap: 2, padding: '3px', background: W.glass04, borderRadius: W.radius.lg, border: W.hairlineBorder }}>
      {VIEWS.map(({ id, label, icon: Icon, color }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange(id)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 12px',
              borderRadius: W.radius.md,
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              outline: 'none',
              transition: 'color 0.2s',
              minWidth: 0,
            }}
          >
            {isActive && (
              <motion.div
                layoutId="view-pill"
                style={{
                  position: 'absolute', inset: 0,
                  borderRadius: W.radius.md,
                  background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                  border: `1px solid ${color}40`,
                  boxShadow: `0 0 12px ${color}20`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <Icon
              size={12}
              style={{
                color: isActive ? color : W.text4,
                filter: isActive ? `drop-shadow(0 0 4px ${color}80)` : undefined,
                transition: 'color 0.2s',
                flexShrink: 0,
                zIndex: 1,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', zIndex: 1, gap: 1 }}>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.02em',
                color: isActive ? W.text1 : W.text3,
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>
            {id === 'operator' && alertCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 6,
                width: 14, height: 14,
                background: W.red,
                borderRadius: '50%',
                fontSize: 8,
                fontWeight: 700,
                color: W.textInverse,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}>
                {alertCount}
              </span>
            )}
          </button>
        )
      })}

      {/* Reports dropdown */}
      {onReportOpen && (
        <div
          ref={dropdownRef}
          style={{ position: 'relative' }}
          onMouseEnter={openDropdown}
          onMouseLeave={closeDropdown}
        >
          <button
            type="button"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 12px',
              borderRadius: W.radius.md,
              border: 'none',
              cursor: 'pointer',
              background: reportDropdownOpen ? W.glass07 : 'transparent',
              outline: 'none',
              transition: 'background 0.2s',
              minWidth: 0,
            }}
          >
            <FileText
              size={12}
              style={{
                color: reportDropdownOpen ? W.cyan : W.text4,
                transition: 'color 0.2s',
                flexShrink: 0,
              }}
            />
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.02em',
              color: reportDropdownOpen ? W.text1 : W.text3,
              transition: 'color 0.2s',
              whiteSpace: 'nowrap',
            }}>
              Reports
            </span>
          </button>

          <AnimatePresence>
            {reportDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: 6,
                  background: W.panel,
                  border: W.chromeBorder,
                  borderRadius: W.radius.md,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
                  padding: 4,
                  minWidth: 170,
                  zIndex: 10,
                }}
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                {REPORTS.map(({ id, label, icon: RIcon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onReportOpen(id)
                      setReportDropdownOpen(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: W.radius.sm,
                      background: 'transparent',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = W.glass07 }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    <RIcon size={12} style={{ color: W.cyan, flexShrink: 0 }} />
                    <span style={{
                      fontSize: 11, fontWeight: 500, color: W.text2,
                      whiteSpace: 'nowrap',
                    }}>
                      {label}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
