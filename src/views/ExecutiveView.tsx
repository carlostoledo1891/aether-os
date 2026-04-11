import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { TabSwitcher } from '../components/ui/TabSwitcher'
import { GeologyPanel } from './field/GeologyPanel'
import { LicensesPanel } from './field/LicensesPanel'
import type { DepositDetail } from '../data/mockData'
import type { LicenseDetail } from '../components/map/LicenseOverlay'

import type { ExecTab } from './executive/constants'
import { TAB_ITEMS } from './executive/constants'
import { FinancialsTab } from './executive/FinancialsTab'
import { RiskTab } from './executive/RiskTab'
import { PipelineTab } from './executive/PipelineTab'
import { CapitalTab } from './executive/CapitalTab'
import { DfsTab } from './executive/DfsTab'
import { PermitsAgenciesTab } from './executive/PermitsAgenciesTab'
import { AuditTab } from './executive/AuditTab'
import { EsgTab } from './executive/EsgTab'
import { StakeholdersTab } from './executive/StakeholdersTab'
import shell from './ExecutiveShell.module.css'

export function ExecutiveView() {
  const [activeTab, setActiveTab] = useState<ExecTab>('assets')
  const [selectedDeposit, setSelectedDeposit] = useState<DepositDetail | null>(null)
  const [selectedLicense, setSelectedLicense] = useState<LicenseDetail | null>(null)

  const activeLabel = TAB_ITEMS.find((t) => t.id === activeTab)?.label ?? activeTab

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={shell.root}
    >
      <div className={shell.stickyNav}>
        <div className={shell.tabMask}>
          <TabSwitcher
            items={TAB_ITEMS}
            active={activeTab}
            onSelect={setActiveTab}
            layoutId="exec-tab-pill"
            layout="scroll"
          />
        </div>
        <div className={shell.contextStrip}>
          Executive overview
          <span className={shell.contextActive}> · {activeLabel}</span>
        </div>
      </div>

      <div className={shell.body}>
        <AnimatePresence mode="wait">
          {activeTab === 'assets' && (
            <motion.div
              key="assets"
              className={`${shell.tabPane} ${shell.assetsGrid}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <div className="min-w-0">
                <GeologyPanel selectedDeposit={selectedDeposit} onSelectDeposit={setSelectedDeposit} />
              </div>
              <div className="min-w-0">
                <LicensesPanel selectedLicense={selectedLicense} onSelectLicense={setSelectedLicense} />
              </div>
            </motion.div>
          )}
          {activeTab === 'financials' && (
            <motion.div key="financials" className={shell.tabPane} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <FinancialsTab />
            </motion.div>
          )}
          {activeTab === 'risk' && (
            <motion.div key="risk" className={shell.tabPane} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <RiskTab />
            </motion.div>
          )}
          {activeTab === 'pipeline' && (
            <motion.div key="pipeline" className={shell.tabPane} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <PipelineTab />
            </motion.div>
          )}
          {activeTab === 'capital' && (
            <motion.div key="capital" className={shell.tabPane} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <CapitalTab />
            </motion.div>
          )}
          {activeTab === 'dfs' && (
            <motion.div key="dfs" className={shell.tabPane} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <DfsTab />
            </motion.div>
          )}
          {activeTab === 'permits' && (
            <motion.div key="permits" className={shell.tabPane} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <PermitsAgenciesTab />
            </motion.div>
          )}
          {activeTab === 'audit' && (
            <motion.div key="audit" className={shell.tabPane} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <AuditTab />
            </motion.div>
          )}
          {activeTab === 'esg' && (
            <motion.div key="esg" className={shell.tabPane} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <EsgTab />
            </motion.div>
          )}
          {activeTab === 'stakeholders' && (
            <motion.div key="stakeholders" className={shell.tabPane} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <StakeholdersTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
