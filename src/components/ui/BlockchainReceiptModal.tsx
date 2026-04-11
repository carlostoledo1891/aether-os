import { motion, AnimatePresence } from 'motion/react'
import { X, ExternalLink, ShieldCheck, Cpu } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import type { MolecularTimelineStep } from '../../types/telemetry'

interface BlockchainReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  batchId: string
  step: MolecularTimelineStep | null
}

export function BlockchainReceiptModal({ isOpen, onClose, batchId, step }: BlockchainReceiptModalProps) {
  if (!step) return null

  // Generate some deterministic but pseudo-random looking data based on hash
  const blockNumber = step.hash ? parseInt(step.hash.slice(2, 8), 16) + 12000000 : 12456789
  const gasUsed = step.hash ? parseInt(step.hash.slice(8, 12), 16) % 150000 + 21000 : 64000
  const fromAddress = '0x' + (step.hash ? step.hash.slice(12, 52) : 'AetherNetworkSystem0000000000000000000000')
  const toAddress = '0x' + (step.hash ? step.hash.slice(22, 62) : 'AetherSmartContract000000000000000000000')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              width: '100%',
              maxWidth: 500,
              background: W.panel,
              border: `1px solid ${W.glass12}`,
              borderRadius: W.radius.lg,
              boxShadow: `0 24px 48px rgba(0,0,0,0.5), inset 0 1px 0 ${W.glass07}`,
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderBottom: `1px solid ${W.glass07}`,
              background: `linear-gradient(to right, ${W.glass03}, transparent)`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldCheck size={18} color={W.green} />
                <span style={{ fontSize: 14, fontWeight: 600, color: W.text1 }}>Blockchain Receipt</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: W.text3, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Status Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: W.green, boxShadow: `0 0 8px ${W.green}` }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: W.green }}>Success</span>
                </div>
                <div style={{ fontSize: 12, color: W.text3, fontFamily: 'var(--font-mono)' }}>
                  Block <span style={{ color: W.violetSoft }}>#{blockNumber.toLocaleString()}</span>
                </div>
              </div>

              {/* Data Grid */}
              <div style={{ 
                display: 'grid', gap: '12px 16px', gridTemplateColumns: '120px 1fr',
                fontSize: 12, color: W.text2 
              }}>
                <div style={{ color: W.text4 }}>Transaction Hash:</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: W.cyan, wordBreak: 'break-all', fontSize: 11 }}>
                  {step.hash}
                </div>

                <div style={{ color: W.text4 }}>Status:</div>
                <div>Confirmed ({step.status})</div>

                <div style={{ color: W.text4 }}>Timestamp:</div>
                <div style={{ fontFamily: 'var(--font-mono)' }}>{new Date(step.timestamp).toUTCString()}</div>

                <div style={{ color: W.text4 }}>Batch ID:</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: W.text1 }}>{batchId}</div>

                <div style={{ color: W.text4 }}>Step Action:</div>
                <div style={{ color: W.text1, fontWeight: 500 }}>{step.step}</div>

                <div style={{ color: W.text4 }}>From:</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: W.text3, wordBreak: 'break-all', fontSize: 11 }}>
                  {fromAddress}
                </div>

                <div style={{ color: W.text4 }}>Interacted With:</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: W.text3, wordBreak: 'break-all', fontSize: 11 }}>
                  {toAddress}
                </div>

                <div style={{ color: W.text4 }}>Gas Used:</div>
                <div style={{ fontFamily: 'var(--font-mono)' }}>{gasUsed.toLocaleString()}</div>
              </div>
              
              {/* Payload verification */}
              <div style={{ 
                marginTop: 8, padding: 12, borderRadius: W.radius.md, 
                background: W.glass03, border: `1px dashed ${W.glass12}`,
                display: 'flex', flexDirection: 'column', gap: 8
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: W.text3, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  <Cpu size={12} /> Payload Data
                </div>
                <div style={{ fontSize: 11, color: W.text4, lineHeight: 1.4 }}>
                  {step.description}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{
              padding: '12px 20px', background: W.glass02, borderTop: `1px solid ${W.glass07}`,
              display: 'flex', justifyContent: 'flex-end'
            }}>
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: W.text3, fontSize: 11, textDecoration: 'none', transition: 'color 0.2s',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = W.text1}
                onMouseLeave={(e) => e.currentTarget.style.color = W.text3}
              >
                View on Explorer <ExternalLink size={10} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
