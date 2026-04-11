import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { W } from '../../app/canvas/canvasTheme'

const V = W.violet

interface AnimatedStatProps {
  value: number
  label: string
  sub?: string
  prefix?: string
  suffix?: string
  duration?: number
}

export default function AnimatedStat({ value, label, sub, prefix = '', suffix = '', duration = 1200 }: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(eased * value))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center', padding: '18px 14px' }}
    >
      <div style={{ fontSize: 32, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
        {prefix}{display}{suffix}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: W.text1, marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: W.text4, marginTop: 2 }}>{sub}</div>}
    </motion.div>
  )
}
