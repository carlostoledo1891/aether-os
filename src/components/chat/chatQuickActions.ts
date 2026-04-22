import { Mountain, Factory, Droplets, ShieldCheck, Ship } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface ChatQuickAction {
  id: string
  label: string
  icon: LucideIcon
  prompt: string
}

export const CHAT_QUICK_ACTIONS: ChatQuickAction[] = [
  {
    id: 'geology',
    label: 'Geology',
    icon: Mountain,
    prompt: 'Summarise the Caldeira resource classification and show drill holes on the map.',
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: Factory,
    prompt: 'What is the current pilot plant status? Show plant sites on the map.',
  },
  {
    id: 'hydrology',
    label: 'Hydrology',
    icon: Droplets,
    prompt: 'Show the APA boundary and spring monitoring network. What is the current environmental risk assessment?',
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: ShieldCheck,
    prompt: 'What is the FEOC status for the latest batch? Summarise DPP compliance readiness.',
  },
  {
    id: 'traceability',
    label: 'Traceability',
    icon: Ship,
    prompt: 'Show the latest compliance batches and their supply chain journey.',
  },
]
