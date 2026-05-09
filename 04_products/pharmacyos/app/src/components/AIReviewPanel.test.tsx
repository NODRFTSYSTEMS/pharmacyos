import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AIReviewPanel, type AIField } from './AIReviewPanel'

const SAMPLE_FIELDS: AIField[] = [
  { label: 'Drug Name', value: 'Metformin 500mg', confidence: 95 },
  { label: 'DIN', value: '02248993', confidence: 88, mono: true },
  { label: 'Patient Name', value: '', confidence: 72 }, // flagged
  { label: 'Quantity', value: '60', confidence: 92 },
]

describe('AIReviewPanel', () => {
  it('renders the title and all field labels', () => {
    render(
      <AIReviewPanel
        title="Invoice scan #INV-001"
        fields={SAMPLE_FIELDS}
        onConfirm={vi.fn()}
        onReject={vi.fn()}
      />,
    )
    expect(screen.getByText('Invoice scan #INV-001')).toBeInTheDocument()
    expect(screen.getByText('Drug Name')).toBeInTheDocument()
    expect(screen.getByText('DIN')).toBeInTheDocument()
    expect(screen.getByText('Patient Name')).toBeInTheDocument()
  })

  it('shows the flag count for fields below confidence threshold (85%)', () => {
    render(
      <AIReviewPanel
        title="t"
        fields={SAMPLE_FIELDS}
        onConfirm={vi.fn()}
        onReject={vi.fn()}
      />,
    )
    // DIN at 88% passes; Patient Name at 72% does not. Only one flagged.
    expect(screen.getByText(/1 field need[s]? review/)).toBeInTheDocument()
  })

  it('disables Confirm All when any flagged field is empty', () => {
    render(
      <AIReviewPanel
        title="t"
        fields={SAMPLE_FIELDS}
        onConfirm={vi.fn()}
        onReject={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /confirm all/i })).toBeDisabled()
  })

  it('enables Confirm All once the empty flagged field is filled', async () => {
    render(
      <AIReviewPanel
        title="t"
        fields={SAMPLE_FIELDS}
        onConfirm={vi.fn()}
        onReject={vi.fn()}
      />,
    )
    const inputs = screen.getAllByRole('textbox')
    // Patient Name is the third field (index 2) and it's empty.
    await userEvent.type(inputs[2]!, 'Marcus Reid')
    expect(screen.getByRole('button', { name: /confirm all/i })).not.toBeDisabled()
  })

  it('fires onConfirm with current field values', async () => {
    const onConfirm = vi.fn()
    const allFilled: AIField[] = SAMPLE_FIELDS.map((f) =>
      f.value === '' ? { ...f, value: 'placeholder' } : f,
    )
    render(
      <AIReviewPanel
        title="t"
        fields={allFilled}
        onConfirm={onConfirm}
        onReject={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /confirm all/i }))
    expect(onConfirm).toHaveBeenCalledOnce()
    expect(onConfirm.mock.calls[0]![0]).toHaveLength(4)
  })

  it('fires onReject when Reject is clicked', async () => {
    const onReject = vi.fn()
    render(
      <AIReviewPanel
        title="t"
        fields={SAMPLE_FIELDS}
        onConfirm={vi.fn()}
        onReject={onReject}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /reject/i }))
    expect(onReject).toHaveBeenCalledOnce()
  })
})
