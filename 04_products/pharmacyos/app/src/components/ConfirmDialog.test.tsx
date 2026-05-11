import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmDialog } from './ConfirmDialog'

function renderDialog(overrides: Partial<React.ComponentProps<typeof ConfirmDialog>> = {}) {
  const onConfirm = vi.fn()
  const onCancel = vi.fn()
  render(
    <ConfirmDialog
      open={true}
      title="Confirm action?"
      body="This will advance the prescription."
      confirmLabel="Confirm"
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...overrides}
    />,
  )
  return { onConfirm, onCancel }
}

describe('ConfirmDialog', () => {
  it('renders nothing when open=false', () => {
    render(
      <ConfirmDialog
        open={false}
        title="Hidden"
        body="Not shown"
        confirmLabel="OK"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('renders title and body when open=true', () => {
    renderDialog()
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText('Confirm action?')).toBeInTheDocument()
    expect(screen.getByText('This will advance the prescription.')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button clicked', () => {
    const { onConfirm } = renderDialog()
    fireEvent.click(screen.getByText('Confirm'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Cancel button clicked', () => {
    const { onCancel } = renderDialog()
    fireEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when X (dismiss) button clicked', () => {
    const { onCancel } = renderDialog()
    fireEvent.click(screen.getByRole('button', { name: /dismiss dialog/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel on Escape key', () => {
    const { onCancel } = renderDialog()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('renders the confirm label on the confirm button', () => {
    renderDialog({ confirmLabel: 'Verify Rx' })
    expect(screen.getByText('Verify Rx')).toBeInTheDocument()
  })

  it('renders warning variant without crashing', () => {
    renderDialog({ variant: 'warning' })
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('renders destructive variant without crashing', () => {
    renderDialog({ variant: 'destructive' })
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('has aria-modal=true', () => {
    renderDialog()
    expect(screen.getByRole('alertdialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('has aria-labelledby pointing at the title', () => {
    renderDialog()
    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-dialog-title')
    expect(document.getElementById('confirm-dialog-title')).toHaveTextContent('Confirm action?')
  })
})
