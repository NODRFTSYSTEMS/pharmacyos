import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { Placeholder } from '@/components/Placeholder'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AdminPortalLayout } from '@/layouts/AdminPortalLayout'
import { PosLayout } from '@/layouts/PosLayout'
import { ROUTE_PERMISSIONS } from '@/config/route-permissions'

/**
 * Single source of truth for routing.
 * Authority: ADR Decision 9 (createBrowserRouter + RouterProvider).
 * Route inventory and roles: pharmacyos-design-handoff-claude-design-2026-05-07.md Section 5.
 */
export const router = createBrowserRouter([
  // Auth — no ProtectedRoute wrapper
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Placeholder title="Sign in" /> },
      { path: '/login/2fa', element: <Placeholder title="Two-factor verification" /> },
    ],
  },

  // Authenticated routes — Admin portal layout
  {
    element: (
      <ProtectedRoute>
        <AdminPortalLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <Placeholder title="Dashboard" /> },
      { path: '/profile', element: <Placeholder title="My profile" /> },

      // Inventory (7)
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory'].roles}><Placeholder title="Stock overview" /></RoleGuard>,
        path: '/inventory',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory/catalog'].roles}><Placeholder title="Drug catalog" /></RoleGuard>,
        path: '/inventory/catalog',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory/catalog/:id'].roles}><Placeholder title="Drug detail" /></RoleGuard>,
        path: '/inventory/catalog/:id',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory/receive'].roles}><Placeholder title="Receive stock" /></RoleGuard>,
        path: '/inventory/receive',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory/scanner'].roles}><Placeholder title="AI invoice scanner" /></RoleGuard>,
        path: '/inventory/scanner',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory/alerts'].roles}><Placeholder title="Inventory alerts" /></RoleGuard>,
        path: '/inventory/alerts',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory/suppliers'].roles}><Placeholder title="Suppliers" /></RoleGuard>,
        path: '/inventory/suppliers',
      },

      // Prescriptions (5)
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/prescriptions'].roles}><Placeholder title="Prescription queue" /></RoleGuard>,
        path: '/prescriptions',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/prescriptions/new'].roles}><Placeholder title="New prescription" /></RoleGuard>,
        path: '/prescriptions/new',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/prescriptions/:id'].roles}><Placeholder title="Prescription detail" /></RoleGuard>,
        path: '/prescriptions/:id',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/prescriptions/scanner'].roles}><Placeholder title="AI Rx scanner" /></RoleGuard>,
        path: '/prescriptions/scanner',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/prescriptions/schedule-log'].roles}><Placeholder title="Schedule drug log" /></RoleGuard>,
        path: '/prescriptions/schedule-log',
      },

      // Patients (5)
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/patients'].roles}><Placeholder title="Patient search" /></RoleGuard>,
        path: '/patients',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/patients/new'].roles}><Placeholder title="New patient" /></RoleGuard>,
        path: '/patients/new',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/patients/:id'].roles}><Placeholder title="Patient profile" /></RoleGuard>,
        path: '/patients/:id',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/patients/:id/insurance'].roles}><Placeholder title="Patient insurance" /></RoleGuard>,
        path: '/patients/:id/insurance',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/patients/:id/jdpa'].roles}><Placeholder title="Patient JDPA" /></RoleGuard>,
        path: '/patients/:id/jdpa',
      },

      // Reports (5)
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/reports'].roles}><Placeholder title="Reports hub" /></RoleGuard>,
        path: '/reports',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/reports/inventory'].roles}><Placeholder title="Inventory report" /></RoleGuard>,
        path: '/reports/inventory',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/reports/dispensing'].roles}><Placeholder title="Dispensing report" /></RoleGuard>,
        path: '/reports/dispensing',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/reports/schedule-log'].roles}><Placeholder title="Schedule log report" /></RoleGuard>,
        path: '/reports/schedule-log',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/reports/revenue'].roles}><Placeholder title="Revenue report" /></RoleGuard>,
        path: '/reports/revenue',
      },

      // AI (1)
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/ai/queue'].roles}><Placeholder title="AI job queue" /></RoleGuard>,
        path: '/ai/queue',
      },

      // Admin (4)
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/admin/users'].roles}><Placeholder title="User management" /></RoleGuard>,
        path: '/admin/users',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/admin/audit'].roles}><Placeholder title="Audit log" /></RoleGuard>,
        path: '/admin/audit',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/admin/settings'].roles}><Placeholder title="System settings" /></RoleGuard>,
        path: '/admin/settings',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/admin/security'].roles}><Placeholder title="Security" /></RoleGuard>,
        path: '/admin/security',
      },
    ],
  },

  // POS — separate layout
  {
    element: (
      <ProtectedRoute>
        <PosLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos'].roles}><Placeholder title="POS terminal" /></RoleGuard>,
        path: '/pos',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/products'].roles}><Placeholder title="POS products" /></RoleGuard>,
        path: '/pos/products',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/products/:id'].roles}><Placeholder title="POS product detail" /></RoleGuard>,
        path: '/pos/products/:id',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/inventory'].roles}><Placeholder title="POS inventory" /></RoleGuard>,
        path: '/pos/inventory',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/suppliers'].roles}><Placeholder title="POS suppliers" /></RoleGuard>,
        path: '/pos/suppliers',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/reports'].roles}><Placeholder title="POS reports" /></RoleGuard>,
        path: '/pos/reports',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/loyalty'].roles}><Placeholder title="Loyalty search" /></RoleGuard>,
        path: '/pos/loyalty',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/loyalty/new'].roles}><Placeholder title="New loyalty member" /></RoleGuard>,
        path: '/pos/loyalty/new',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/loyalty/:id'].roles}><Placeholder title="Loyalty member profile" /></RoleGuard>,
        path: '/pos/loyalty/:id',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/loyalty/dashboard'].roles}><Placeholder title="Loyalty dashboard" /></RoleGuard>,
        path: '/pos/loyalty/dashboard',
      },
    ],
  },

  // Errors
  { path: '/unauthorized', element: <Placeholder title="Access denied" /> },
  { path: '*', element: <Placeholder title="Not found" /> },
])
