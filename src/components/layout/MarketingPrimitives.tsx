import { type ReactNode } from 'react'
import { motion } from 'motion/react'
import { marketingStyles } from './MarketingShared'

const ease = [0.16, 1, 0.3, 1] as const

export function ScrollSection({ children, style, id }: { children: ReactNode; style?: React.CSSProperties; id?: string }) {
  return (
    <motion.section id={id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }} transition={{ duration: 0.8, ease }} style={style}>
      {children}
    </motion.section>
  )
}

export function Stagger({ children, i }: { children: ReactNode; i: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08, ease }}>
      {children}
    </motion.div>
  )
}

export function SectionHeader({ label, heading, body, style }: { label?: string; heading: ReactNode; body?: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 48, ...style }}>
      {label && <div style={marketingStyles.label}>{label}</div>}
      <h2 style={marketingStyles.heading}>{heading}</h2>
      {body && <p style={{ ...marketingStyles.body, margin: '0 auto' }}>{body}</p>}
    </div>
  )
}
