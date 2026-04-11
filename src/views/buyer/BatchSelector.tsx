import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { Z } from '../../components/map/mapStacking'
import type { ComplianceLedger } from '../../types/telemetry'

interface BatchSelectorProps {
  batches: ComplianceLedger[]
  batchIndex: number
  batch: ComplianceLedger
  onSelect: (index: number) => void
}

export function BatchSelector({ batches, batchIndex, batch, onSelect }: BatchSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button type="button" onClick={() => setOpen(p => !p)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 11px', borderRadius: W.radius.md,
        background: W.glass04, border: `1px solid ${W.glass12}`,
        cursor: 'pointer', outline: 'none', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text4 }}>Batch</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: W.violetSoft, fontFamily: 'var(--font-mono)' }}>{batch.batch_id}</span>
          <span style={{ fontSize: 10, color: W.text3 }}>{batch.tonnage_kg} kg</span>
        </div>
        <ChevronDown size={12} style={{ color: W.text4, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : undefined }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: Z.buyerPanel,
              marginTop: 4, borderRadius: W.radius.md, overflow: 'hidden',
              background: `${W.panel}F5`, backdropFilter: 'blur(12px)',
              border: `1px solid ${W.glass12}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}>
            {batches.map((b, i) => (
              <button type="button" key={b.batch_id} onClick={() => { onSelect(i); setOpen(false) }} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 11px', border: 'none', cursor: 'pointer', outline: 'none',
                background: i === batchIndex ? `${W.violet}1F` : 'transparent',
                borderBottom: i < batches.length - 1 ? W.hairlineBorder : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: i === batchIndex ? W.violetSoft : W.text2, fontFamily: 'var(--font-mono)' }}>{b.batch_id}</span>
                  <span style={{ fontSize: 10, color: W.text4 }}>{b.tonnage_kg} kg</span>
                </div>
                <span style={{ fontSize: 10, color: W.text4 }}>{b.offtake_destination.split('—')[0].trim()}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}