import { memo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FileCheck, AlertTriangle } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { LicenseTimeline } from '../../components/ui/LicenseTimeline'
import { W } from '../../app/canvas/canvasTheme'
import { LICENSE_ZONES } from './constants'
import type { LicenseDetail } from '../../components/map/LicenseOverlay'

interface LicensesPanelProps {
  selectedLicense: LicenseDetail | null
  onSelectLicense: (lic: LicenseDetail | null) => void
}

export const LicensesPanel = memo(function LicensesPanel({ selectedLicense, onSelectLicense }: LicensesPanelProps) {
  return (
    <motion.div
      key="licenses-panel"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <GlassCard animate={false} glow="green" style={{ padding: '11px 13px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <GlowingIcon icon={FileCheck} color="green" size={11}/>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text4 }}>
            Environmental Licensing
          </span>
        </div>
        <LicenseTimeline />
      </GlassCard>

      {LICENSE_ZONES.map(zone => (
        <GlassCard
          key={zone.id}
          animate={false}
          glow={selectedLicense?.id === zone.id ? (zone.status === 'lp_approved' ? 'green' : zone.status === 'li_pending' ? 'amber' : 'violet') : 'none'}
          style={{ padding: '10px 12px', flexShrink: 0, cursor: 'pointer' }}
          onClick={() => onSelectLicense(selectedLicense?.id === zone.id ? null : { id: zone.id, name: zone.name, label: zone.label, status: zone.status, area_km2: zone.area, license_count: zone.count, note: zone.note })}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: W.text1 }}>{zone.name}</div>
            <StatusChip
              label={zone.status === 'lp_approved' ? 'LP ✓' : zone.status === 'li_pending' ? 'LI PREP' : 'EXPLORATION'}
              variant={zone.status === 'lp_approved' ? 'green' : zone.status === 'li_pending' ? 'amber' : 'violet'}
              size="sm"
            />
          </div>
          <div style={{ fontSize: 10, color: W.text4, marginBottom: 4 }}>{zone.label}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div><span style={{ fontSize: 10, color: W.text4 }}>Area: </span><span style={{ fontSize: 11, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>{zone.area} km²</span></div>
            <div><span style={{ fontSize: 10, color: W.text4 }}>Licences: </span><span style={{ fontSize: 11, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>{zone.count}</span></div>
          </div>
          
          <AnimatePresence>
            {selectedLicense?.id === zone.id && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 10 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: 8, borderTop: W.hairlineBorder }}>
                  <div style={{ padding: '6px 8px', background: W.glass03, borderRadius: W.radius.sm }}>
                    <span style={{ fontSize: 10, color: W.text3, lineHeight: 1.4, display: 'block' }}>{zone.note}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      ))}

      <GlassCard animate={false} style={{ padding: '10px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
          <AlertTriangle size={9} style={{ color: W.amber, marginTop: 1, flexShrink: 0 }}/>
          <p style={{ fontSize: 11, color: W.text3, margin: 0, lineHeight: 1.45 }}>
            LP approved by COPAM unanimous vote Dec 19 2025 — FEAM technical recommendation accepted.
            CONGEAPA consent obtained for mining inside APA Pedra Branca 3 km buffer.
            LI lodgement Q1 2026 · approval target June 2026.
          </p>
        </div>
      </GlassCard>
    </motion.div>
  )
})
