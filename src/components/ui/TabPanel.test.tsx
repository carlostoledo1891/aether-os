import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TabPanel } from './TabPanel'

describe('TabPanel', () => {
  it('renders children', () => {
    render(
      <TabPanel tabKey="tab-1">
        <div>Tab Content Here</div>
      </TabPanel>,
    )
    expect(screen.getByText('Tab Content Here')).toBeInTheDocument()
  })
})
