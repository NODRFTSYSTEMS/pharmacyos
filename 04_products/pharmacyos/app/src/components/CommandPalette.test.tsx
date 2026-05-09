import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CommandPalette } from './CommandPalette'

function renderPalette() {
  return render(
    <MemoryRouter>
      <CommandPalette />
    </MemoryRouter>,
  )
}

describe('CommandPalette', () => {
  it('is closed by default', () => {
    renderPalette()
    expect(screen.queryByRole('dialog', { name: /command palette/i })).not.toBeInTheDocument()
  })

  it('opens on Cmd+K', async () => {
    renderPalette()
    await userEvent.keyboard('{Meta>}k{/Meta}')
    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeInTheDocument()
  })

  it('opens on Ctrl+K (Windows/Linux)', async () => {
    renderPalette()
    await userEvent.keyboard('{Control>}k{/Control}')
    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    renderPalette()
    await userEvent.keyboard('{Control>}k{/Control}')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('filters commands as the user types', async () => {
    renderPalette()
    await userEvent.keyboard('{Control>}k{/Control}')
    const input = screen.getByLabelText(/search commands/i)
    await userEvent.type(input, 'patients')
    // Only patient-related commands should remain
    // The filter narrows the option list; "Patients" should be present and "Dashboard" gone.
    expect(screen.getByText('Patients')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  it('shows a no-results message when nothing matches', async () => {
    renderPalette()
    await userEvent.keyboard('{Control>}k{/Control}')
    const input = screen.getByLabelText(/search commands/i)
    await userEvent.type(input, 'zzzznopematch')
    expect(screen.getByText(/No commands match/i)).toBeInTheDocument()
  })

  it('arrow-down navigates the option list', async () => {
    renderPalette()
    await userEvent.keyboard('{Control>}k{/Control}')
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{ArrowDown}')
    const optionsAfter = screen.getAllByRole('option')
    expect(optionsAfter[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('renders dialog with aria-modal=true and role=dialog', async () => {
    renderPalette()
    await userEvent.keyboard('{Control>}k{/Control}')
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Command palette')
  })
})
