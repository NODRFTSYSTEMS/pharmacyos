import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IntegrationPendingBadge } from './IntegrationPendingBadge'

describe('IntegrationPendingBadge', () => {
  it('renders service name in badge variant', () => {
    render(<IntegrationPendingBadge service="NHF" />)
    expect(screen.getByText(/NHF/)).toBeInTheDocument()
  })

  it('renders description in banner variant', () => {
    render(<IntegrationPendingBadge service="Printer" description="Label printing" variant="banner" />)
    expect(screen.getByText(/Printer/)).toBeInTheDocument()
    expect(screen.getByText(/Label printing/)).toBeInTheDocument()
  })

  it('renders Integration Pending text in banner', () => {
    render(<IntegrationPendingBadge service="NCB" variant="banner" />)
    expect(screen.getByText(/Integration Pending/i)).toBeInTheDocument()
  })

  it('badge variant does not show description separately', () => {
    render(<IntegrationPendingBadge service="MoH" description="Regulatory submission" />)
    // Badge is compact — description is in the title attribute, not as visible text
    expect(screen.queryByText('Regulatory submission')).not.toBeInTheDocument()
  })
})
