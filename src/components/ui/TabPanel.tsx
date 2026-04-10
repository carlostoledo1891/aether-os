import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export interface TabPanelProps {
  tabKey: string
  children: ReactNode
}

export function TabPanel({ tabKey, children }: TabPanelProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tabKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
