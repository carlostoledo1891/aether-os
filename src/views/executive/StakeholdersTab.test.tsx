import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataServiceProvider } from '../../services/DataServiceProvider'
import { createMockDataService } from '../../services/mockDataService'
import type { AetherDataService } from '../../services/dataService'
import type { ReactNode } from 'react'

let service: AetherDataService

function TestWrapper({ children }: { children: ReactNode }) {
  return <DataServiceProvider service={service}>{children}</DataServiceProvider>
}

beforeEach(() => {
  vi.useFakeTimers()
  service = createMockDataService()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('StakeholdersTab', () => {
  it('renders all four stakeholder groups', async () => {
    const { StakeholdersTab } = await import('./StakeholdersTab')
    render(
      <TestWrapper><StakeholdersTab /></TestWrapper>,
    )
    expect(screen.getByText('Community Pulse')).toBeInTheDocument()
    expect(screen.getByText('Regulatory Temperature')).toBeInTheDocument()
    expect(screen.getByText('Commercial Pipeline')).toBeInTheDocument()
    expect(screen.getByText('ESG & Media Readiness')).toBeInTheDocument()
  })

  it('displays community items from mock data', async () => {
    const { StakeholdersTab } = await import('./StakeholdersTab')
    render(
      <TestWrapper><StakeholdersTab /></TestWrapper>,
    )
    expect(screen.getByText('Grievances')).toBeInTheDocument()
    expect(screen.getByText('0 open / 3 total')).toBeInTheDocument()
  })

  it('displays regulatory agency rows', async () => {
    const { StakeholdersTab } = await import('./StakeholdersTab')
    render(
      <TestWrapper><StakeholdersTab /></TestWrapper>,
    )
    expect(screen.getByText('FEAM')).toBeInTheDocument()
    expect(screen.getByText('Approved')).toBeInTheDocument()
  })

  it('does not crash when register has no groups (empty API response)', async () => {
    service = {
      ...createMockDataService(),
      getStakeholderRegister: () => ({} as unknown as ReturnType<AetherDataService['getStakeholderRegister']>),
    }
    const { StakeholdersTab } = await import('./StakeholdersTab')
    expect(() => {
      render(<TestWrapper><StakeholdersTab /></TestWrapper>)
    }).not.toThrow()
  })
})
