import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { RouteSkeleton } from '@/components/RouteSkeleton'

import { AuthLayout } from '@/layouts/AuthLayout'
import { AdminPortalLayout } from '@/layouts/AdminPortalLayout'
import { PosLayout } from '@/layouts/PosLayout'
import { ROUTE_PERMISSIONS } from '@/config/route-permissions'

// Lazy-loaded real pages — feature-by-feature replacement of <Placeholder /> as work lands.
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const StockPage = lazy(() => import('@/pages/inventory/StockPage'))
const CatalogPage = lazy(() => import('@/pages/inventory/CatalogPage'))
const SuppliersPage = lazy(() => import('@/pages/inventory/SuppliersPage'))
const QueuePage = lazy(() => import('@/pages/prescriptions/QueuePage'))
const ScheduleLogPage = lazy(() => import('@/pages/prescriptions/ScheduleLogPage'))
const PatientsPage = lazy(() => import('@/pages/patients/PatientsPage'))
const AuditLogPage = lazy(() => import('@/pages/admin/AuditLogPage'))
const JobQueuePage = lazy(() => import('@/pages/ai/JobQueuePage'))
const LoyaltyPage = lazy(() => import('@/pages/pos/LoyaltyPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const TwoFactorPage = lazy(() => import('@/pages/auth/TwoFactorPage'))
const PatientDetailPage = lazy(() => import('@/pages/patients/PatientDetailPage'))
const PrescriptionDetailPage = lazy(() => import('@/pages/prescriptions/PrescriptionDetailPage'))
const DrugDetailPage = lazy(() => import('@/pages/inventory/DrugDetailPage'))
const POSTerminalPage = lazy(() => import('@/pages/pos/POSTerminalPage'))
const POSProductsPage = lazy(() => import('@/pages/pos/POSProductsPage'))
const POSReportsPage = lazy(() => import('@/pages/pos/POSReportsPage'))
const ReportingHubPage = lazy(() => import('@/pages/reporting/ReportingHubPage'))
const InventoryReportPage = lazy(() => import('@/pages/reporting/InventoryReportPage'))
const DispensingReportPage = lazy(() => import('@/pages/reporting/DispensingReportPage'))
const ScheduleLogReportPage = lazy(() => import('@/pages/reporting/ScheduleLogReportPage'))
const RevenueReportPage = lazy(() => import('@/pages/reporting/RevenueReportPage'))
const UsersPage = lazy(() => import('@/pages/admin/UsersPage'))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))
const SecurityPage = lazy(() => import('@/pages/admin/SecurityPage'))
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const AlertsPage = lazy(() => import('@/pages/inventory/AlertsPage'))
const POSInventoryPage = lazy(() => import('@/pages/pos/POSInventoryPage'))
const POSSuppliersPage = lazy(() => import('@/pages/pos/POSSuppliersPage'))
const POSProductDetailPage = lazy(() => import('@/pages/pos/POSProductDetailPage'))
const LoyaltyMemberPage = lazy(() => import('@/pages/pos/LoyaltyMemberPage'))
const LoyaltyDashboardPage = lazy(() => import('@/pages/pos/LoyaltyDashboardPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const ReceiveStockPage = lazy(() => import('@/pages/inventory/ReceiveStockPage'))
const NewPatientPage = lazy(() => import('@/pages/patients/NewPatientPage'))
const NewLoyaltyMemberPage = lazy(() => import('@/pages/pos/NewLoyaltyMemberPage'))
const NewPrescriptionPage = lazy(() => import('@/pages/prescriptions/NewPrescriptionPage'))
const InvoiceScannerPage = lazy(() => import('@/pages/inventory/InvoiceScannerPage'))
const RxScannerPage = lazy(() => import('@/pages/prescriptions/RxScannerPage'))

function lazyPage(Component: React.ComponentType) {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <Component />
    </Suspense>
  )
}

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
      { path: '/login', element: lazyPage(LoginPage) },
      { path: '/login/2fa', element: lazyPage(TwoFactorPage) },
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
      { path: '/dashboard', element: lazyPage(DashboardPage) },
      { path: '/profile', element: <RoleGuard roles={ROUTE_PERMISSIONS['/profile'].roles}>{lazyPage(ProfilePage)}</RoleGuard> },

      // Patient tab redirects — content lives inside /patients/:id
      {
        path: '/patients/:id/insurance',
        element: <Navigate to="/patients/:id" replace />,
      },
      {
        path: '/patients/:id/jdpa',
        element: <Navigate to="/patients/:id" replace />,
      },

      // Inventory (7)
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory'].roles}>{lazyPage(StockPage)}</RoleGuard>,
        path: '/inventory',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory/catalog'].roles}>{lazyPage(CatalogPage)}</RoleGuard>,
        path: '/inventory/catalog',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory/catalog/:id'].roles}>{lazyPage(DrugDetailPage)}</RoleGuard>,
        path: '/inventory/catalog/:id',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory/receive'].roles}>{lazyPage(ReceiveStockPage)}</RoleGuard>,
        path: '/inventory/receive',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory/scanner'].roles}>{lazyPage(InvoiceScannerPage)}</RoleGuard>,
        path: '/inventory/scanner',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory/alerts'].roles}>{lazyPage(AlertsPage)}</RoleGuard>,
        path: '/inventory/alerts',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/inventory/suppliers'].roles}>{lazyPage(SuppliersPage)}</RoleGuard>,
        path: '/inventory/suppliers',
      },

      // Prescriptions (5)
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/prescriptions'].roles}>{lazyPage(QueuePage)}</RoleGuard>,
        path: '/prescriptions',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/prescriptions/new'].roles}>{lazyPage(NewPrescriptionPage)}</RoleGuard>,
        path: '/prescriptions/new',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/prescriptions/:id'].roles}>{lazyPage(PrescriptionDetailPage)}</RoleGuard>,
        path: '/prescriptions/:id',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/prescriptions/scanner'].roles}>{lazyPage(RxScannerPage)}</RoleGuard>,
        path: '/prescriptions/scanner',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/prescriptions/schedule-log'].roles}>{lazyPage(ScheduleLogPage)}</RoleGuard>,
        path: '/prescriptions/schedule-log',
      },

      // Patients (5)
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/patients'].roles}>{lazyPage(PatientsPage)}</RoleGuard>,
        path: '/patients',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/patients/new'].roles}>{lazyPage(NewPatientPage)}</RoleGuard>,
        path: '/patients/new',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/patients/:id'].roles}>{lazyPage(PatientDetailPage)}</RoleGuard>,
        path: '/patients/:id',
      },


      // Reports (5)
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/reports'].roles}>{lazyPage(ReportingHubPage)}</RoleGuard>,
        path: '/reports',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/reports/inventory'].roles}>{lazyPage(InventoryReportPage)}</RoleGuard>,
        path: '/reports/inventory',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/reports/dispensing'].roles}>{lazyPage(DispensingReportPage)}</RoleGuard>,
        path: '/reports/dispensing',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/reports/schedule-log'].roles}>{lazyPage(ScheduleLogReportPage)}</RoleGuard>,
        path: '/reports/schedule-log',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/reports/revenue'].roles}>{lazyPage(RevenueReportPage)}</RoleGuard>,
        path: '/reports/revenue',
      },

      // POS back-office (under sidebar — terminal itself is fullscreen)
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/products'].roles}>{lazyPage(POSProductsPage)}</RoleGuard>,
        path: '/pos/products',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/products/:id'].roles}>{lazyPage(POSProductDetailPage)}</RoleGuard>,
        path: '/pos/products/:id',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/inventory'].roles}>{lazyPage(POSInventoryPage)}</RoleGuard>,
        path: '/pos/inventory',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/suppliers'].roles}>{lazyPage(POSSuppliersPage)}</RoleGuard>,
        path: '/pos/suppliers',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/reports'].roles}>{lazyPage(POSReportsPage)}</RoleGuard>,
        path: '/pos/reports',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/loyalty'].roles}>{lazyPage(LoyaltyPage)}</RoleGuard>,
        path: '/pos/loyalty',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/loyalty/new'].roles}>{lazyPage(NewLoyaltyMemberPage)}</RoleGuard>,
        path: '/pos/loyalty/new',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/loyalty/:id'].roles}>{lazyPage(LoyaltyMemberPage)}</RoleGuard>,
        path: '/pos/loyalty/:id',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos/loyalty/dashboard'].roles}>{lazyPage(LoyaltyDashboardPage)}</RoleGuard>,
        path: '/pos/loyalty/dashboard',
      },

      // AI (1)
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/ai/queue'].roles}>{lazyPage(JobQueuePage)}</RoleGuard>,
        path: '/ai/queue',
      },

      // Admin (4)
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/admin/users'].roles}>{lazyPage(UsersPage)}</RoleGuard>,
        path: '/admin/users',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/admin/audit'].roles}>{lazyPage(AuditLogPage)}</RoleGuard>,
        path: '/admin/audit',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/admin/settings'].roles}>{lazyPage(SettingsPage)}</RoleGuard>,
        path: '/admin/settings',
      },
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/admin/security'].roles}>{lazyPage(SecurityPage)}</RoleGuard>,
        path: '/admin/security',
      },
    ],
  },

  // POS terminal — fullscreen, no sidebar (handoff Section 3.2)
  {
    element: (
      <ProtectedRoute>
        <PosLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        element: <RoleGuard roles={ROUTE_PERMISSIONS['/pos'].roles}>{lazyPage(POSTerminalPage)}</RoleGuard>,
        path: '/pos',
      },
    ],
  },

  // Errors
  { path: '/unauthorized', element: lazyPage(UnauthorizedPage) },
  { path: '*', element: lazyPage(NotFoundPage) },
])
