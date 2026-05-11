import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { NewPatientPage } from './NewPatientPage'
import { ToastProvider } from '@/components/Toast'

function renderPage() {
  return render(
    <ToastProvider>
      <MemoryRouter>
        <NewPatientPage />
      </MemoryRouter>
    </ToastProvider>,
  )
}

describe('NewPatientPage (smoke)', () => {
  it('renders all three section headings', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Demographics' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Allergies' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'JDPA Consent' })).toBeInTheDocument()
  })

  it('renders the expected number of demographic textboxes', () => {
    renderPage()
    // First, Last, Phone, Email, Address, Other allergies — at least 5 standard text inputs
    const textboxes = screen.getAllByRole('textbox')
    expect(textboxes.length).toBeGreaterThanOrEqual(5)
  })

  it('clicking Save Patient with empty form shows field errors and a toast', async () => {
    renderPage()
    const save = screen.getByRole('button', { name: /save patient/i })
    expect(save).not.toBeDisabled() // pattern: enabled with validation-on-click
    await userEvent.click(save)
    // Multiple "Required" alerts appear on blank required fields
    const alerts = screen.getAllByText('Required')
    expect(alerts.length).toBeGreaterThan(0)
    // Toast confirms validation failure
    expect(screen.getByText(/Fill the required fields/i)).toBeInTheDocument()
  })

  it('JDPA consent paragraph references the Jamaica Data Protection Act', () => {
    renderPage()
    expect(screen.getByText(/Jamaica Data Protection Act 2020/i)).toBeInTheDocument()
  })

  it('toggles allergy checkboxes when clicked', async () => {
    renderPage()
    const penicillin = screen.getByRole('checkbox', { name: /penicillin/i })
    expect(penicillin).not.toBeChecked()
    await userEvent.click(penicillin)
    expect(penicillin).toBeChecked()
    await userEvent.click(penicillin)
    expect(penicillin).not.toBeChecked()
  })

  it('renders a JDPA consent checkbox', () => {
    renderPage()
    expect(screen.getByRole('checkbox', { name: /patient confirms consent/i })).toBeInTheDocument()
  })
})
