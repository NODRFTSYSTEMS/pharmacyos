import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RouteSkeleton } from './RouteSkeleton'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <RouteSkeleton />
    </MemoryRouter>,
  )
}

describe('RouteSkeleton', () => {
  it('falls back to a generic loading state for unknown routes', () => {
    const { container } = renderAt('/never-heard-of-this-path')
    expect(container.textContent).toMatch(/Loading/i)
  })

  it('selects the dashboard skeleton for /dashboard (4 metric cards present)', () => {
    const { container } = renderAt('/dashboard')
    // Metric card has 3 skeleton blocks; dashboard renders 4 of them.
    // Total skeleton blocks for the dashboard variant should be substantially > 1.
    const blocks = container.querySelectorAll('[aria-hidden="true"]')
    expect(blocks.length).toBeGreaterThan(10)
  })

  it('selects a form skeleton for /patients/new', () => {
    const { container } = renderAt('/patients/new')
    const blocks = container.querySelectorAll('[aria-hidden="true"]')
    expect(blocks.length).toBeGreaterThan(5)
  })

  it('selects a kanban skeleton for /prescriptions', () => {
    const { container } = renderAt('/prescriptions')
    // KanbanSkeleton renders 4 columns × 7 blocks each + header = ≥29 blocks
    const blocks = container.querySelectorAll('[aria-hidden="true"]')
    expect(blocks.length).toBeGreaterThan(20)
  })

  it('selects a POS skeleton for /pos', () => {
    const { container } = renderAt('/pos')
    expect(container.querySelector('.grid-cols-\\[1\\.5fr_1fr\\]')).toBeInTheDocument()
  })

  it('selects an auth skeleton for /login', () => {
    const { container } = renderAt('/login')
    // AuthSkeleton has min-h-screen wrapper
    expect(container.querySelector('.min-h-screen')).toBeInTheDocument()
  })

  it('selects a detail skeleton for /inventory/catalog/:din', () => {
    const { container } = renderAt('/inventory/catalog/02248993')
    const blocks = container.querySelectorAll('[aria-hidden="true"]')
    expect(blocks.length).toBeGreaterThan(8)
  })
})
