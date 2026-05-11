import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PrescriptionDetailPage } from './PrescriptionDetailPage'
import { ToastProvider } from '@/components/Toast'
import { usePrescriptionStore } from '@/stores/prescriptions'

// Reset prescription store state between tests
beforeEach(() => {
  usePrescriptionStore.getState().reset()
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ results: [] }),
  } as Response)
})

afterEach(() => {
  vi.restoreAllMocks()
})

function renderForRx(rxId: string) {
  return render(
    <ToastProvider>
      <MemoryRouter initialEntries={[`/prescriptions/${rxId}`]}>
        <Routes>
          <Route path="/prescriptions/:id" element={<PrescriptionDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>,
  )
}

describe('PrescriptionDetailPage', () => {
  it('renders not-found placeholder for an unknown prescription', () => {
    renderForRx('RX-INVALID')
    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })

  it('renders the Rx number as the page title (RX001)', () => {
    renderForRx('RX001')
    // RxNumber appears in h1 title + breadcrumb — target the heading specifically
    expect(screen.getByRole('heading', { name: 'RX-2026-0847' })).toBeInTheDocument()
  })

  it('renders the workflow stage progression', () => {
    renderForRx('RX001')
    // Stage labels appear in the workflow card
    expect(screen.getAllByText('Received').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Verified').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Filled').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Dispensed').length).toBeGreaterThan(0)
  })

  it('renders the Refills card with authorised and remaining counts', () => {
    // RX004 — Marcia Brown — 11 refills authorised, 11 remaining
    renderForRx('RX004')
    expect(screen.getByText(/11 of 11 remaining/i)).toBeInTheDocument()
  })

  it('shows "No refills left" warning for a 0-refill prescription', () => {
    // RX003 — Devon Williams — Amoxicillin, 0 refills
    renderForRx('RX003')
    expect(screen.getByText(/No refills left/i)).toBeInTheDocument()
  })

  it('action button is ENABLED for an active (non-dispensed) prescription', () => {
    renderForRx('RX001')
    const verifyBtn = screen.getByRole('button', { name: /Verify/i })
    expect(verifyBtn).not.toBeDisabled()
  })

  it('clicking action button opens confirmation dialog', () => {
    renderForRx('RX001')
    const verifyBtn = screen.getByRole('button', { name: /Verify/i })
    fireEvent.click(verifyBtn)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('confirming dialog advances the prescription status', () => {
    renderForRx('RX001')
    fireEvent.click(screen.getByRole('button', { name: /Verify/i }))
    // Click the confirm button scoped inside the dialog (not the CTA button)
    const dialog = screen.getByRole('alertdialog')
    const confirmBtn = within(dialog).getByRole('button', { name: 'Verify' })
    expect(confirmBtn).toBeDefined()
    fireEvent.click(confirmBtn)
    // After advance, no alertdialog
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    // Store should be updated
    expect(usePrescriptionStore.getState().getById('RX001')?.status).toBe('Verified')
  })

  it('cancelling dialog does not advance the prescription', () => {
    renderForRx('RX001')
    fireEvent.click(screen.getByRole('button', { name: /Verify/i }))
    // Click the text "Cancel" button in the dialog (distinct from X/dismiss button)
    fireEvent.click(screen.getByText('Cancel'))
    // Status unchanged
    expect(usePrescriptionStore.getState().getById('RX001')?.status).toBe('Received')
  })

  it('shows Completed status pill for a dispensed prescription instead of action button', () => {
    // RX007 — Rohan Stewart — Dispensed
    renderForRx('RX007')
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Verify|Fill|Dispense/i })).not.toBeInTheDocument()
  })

  it('renders drug interactions section', () => {
    renderForRx('RX004') // multi-drug — triggers OpenFDA section
    expect(screen.getByText(/Drug Interactions/i)).toBeInTheDocument()
  })

  it('renders Back to queue link', () => {
    renderForRx('RX001')
    expect(screen.getByRole('link', { name: /back to queue/i })).toHaveAttribute('href', '/prescriptions')
  })

  it('links to patient record when patient exists', () => {
    renderForRx('RX001') // Marcus Reid — P001
    const patientLink = screen.getByRole('link', { name: /Marcus Reid/i })
    expect(patientLink).toHaveAttribute('href', '/patients/P001')
  })

  it('shows audit trail section when audit entries exist', () => {
    // RX002 has an audit trail entry
    renderForRx('RX002')
    expect(screen.getByText(/Transaction Log/i)).toBeInTheDocument()
  })

  it('does not show audit trail section for prescriptions with empty trail', () => {
    // RX001 starts with empty audit trail
    renderForRx('RX001')
    expect(screen.queryByText(/Transaction Log/i)).not.toBeInTheDocument()
  })
})
