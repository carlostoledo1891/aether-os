import { createContext, useContext } from 'react'
import { openRequestDemo, closeRequestDemo } from './requestDemoBus'

export interface RequestDemoContextValue {
  open: () => void
  close: () => void
  isOpen: boolean
}

export const RequestDemoContext = createContext<RequestDemoContextValue | null>(null)

export function useRequestDemo(): RequestDemoContextValue {
  const ctx = useContext(RequestDemoContext)
  if (ctx) return ctx
  return {
    open: openRequestDemo,
    close: closeRequestDemo,
    isOpen: false,
  }
}
