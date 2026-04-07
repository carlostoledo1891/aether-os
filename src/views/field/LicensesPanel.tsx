import { memo } from 'react'
import { motion } from 'motion/react'
import { FileCheck, AlertTriangle } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { W } from '../../app/canvas/canvasTheme'
import { LICENSE_COLORS, LICENSE_ITEMS, LICENSE_ZONES } from './constants'
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {LICENSE_ITEMS.map(({ label, full, sub, status }, i) => {
            const color = LICENSE_COLORS[status]
            return (
              <div key={label} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, background: status === 'pending' ? 'transparent' : `${color}20`, border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: status !== 'pending' ? `0 0 5px ${color}40` : undefined }}>
                    <span style={{ fontSize: 7, fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>{label}</span>
                  </div>
                  {i < 2 && <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.07)', margin: '3px 0' }}/>}
                </div>
                <div style={{ paddingBottom: i < 2 ? 10 : 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: W.text1, display: 'block', marginBottom: 1 }}>{full}</span>
                  <span style={{ fontSize: 10, color: W.text4 }}>{sub}</span>
                </div>
              </div>
            )
          })}
        </div>
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
