import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RoleGuard } from '../../components/RoleGuard'

// ── Mocks ─────────────────────────────────────────────────────────────────────
// We mock useCurrentUser and usePermission at the module level so tests
// don't require Supabase client initialisation.

vi.mock('../../hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}))

vi.mock('../../hooks/usePermission', () => ({
  usePermission: vi.fn(),
}))

import { useCurrentUser } from '../../hooks/useCurrentUser'
import { usePermission } from '../../hooks/usePermission'

const mockCurrentUser = vi.mocked(useCurrentUser)
const mockPermission  = vi.mocked(usePermission)

// ── Helpers ───────────────────────────────────────────────────────────────────

function qc() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}

function renderWithGuard(
  permission: string,
  hasPermission: boolean,
  isLoading = false,
  hasUser = true,
) {
  mockPermission.mockReturnValue(hasPermission)
  mockCurrentUser.mockReturnValue({
    data: hasUser
      ? { id: 'u1', email: 'test@test.com', name: 'Test User', role: 'PHARMACIST' }
      : null,
    isLoading,
    isError: false,
    error: null,
  } as ReturnType<typeof useCurrentUser>)

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <QueryClientProvider client={qc()}>
        <Routes>
          <Route
            path="/protected"
            element={
              <RoleGuard permission={permission}>
                <div data-testid="protected-content">Secret content</div>
              </RoleGuard>
            }
          />
          <Route
            path="/403"
            element={<div data-testid="forbidden-page">Forbidden</div>}
          />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RoleGuard', () => {
  it('renders children when user has the required permission', () => {
    renderWithGuard('rx_dispense', true)
    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('does not render children when user lacks the required permission', () => {
    renderWithGuard('staff_manage', false)
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('redirects to /403 when user lacks the required permission', () => {
    renderWithGuard('staff_manage', false)
    expect(screen.getByTestId('forbidden-page')).toBeInTheDocument()
  })

  it('renders nothing while user data is loading', () => {
    // When isLoading = true, RoleGuard returns null
    renderWithGuard('rx_dispense', false, true)
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.queryByTestId('forbidden-page')).not.toBeInTheDocument()
  })

  it('renders nothing when there is no logged-in user', () => {
    // ProtectedRoute handles redirect to /login; RoleGuard just returns null
    renderWithGuard('rx_dispense', false, false, false)
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.queryByTestId('forbidden-page')).not.toBeInTheDocument()
  })

  it('checks the exact permission string passed as prop', () => {
    // Verify the correct permission key is forwarded to usePermission
    renderWithGuard('eod_approve', true)
    expect(mockPermission).toHaveBeenCalledWith('eod_approve')
  })
})
