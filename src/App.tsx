import { Routes, Route, Navigate } from 'react-router'
import { AppShell } from './components/Shell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleGuard } from './components/RoleGuard'

// ─── Page imports ─────────────────────────────────────────────────────────────
// Auth
import Login                from './pages/auth/Login'
import VerifyMFA            from './pages/auth/VerifyMFA'
import SetupMFA             from './pages/auth/SetupMFA'
import ForgotPassword       from './pages/auth/ForgotPassword'
import ResetPassword        from './pages/auth/ResetPassword'

// Error pages
import { Forbidden }             from './pages/errors/Forbidden'
import { NotFound }              from './pages/errors/NotFound'
import { PharmacyClosed }        from './pages/errors/PharmacyClosed'
import { InternalServerError }   from './pages/errors/InternalServerError'

// Dashboard
import { Dashboard }        from './pages/Dashboard'

// Retail POS
import PosTerminal          from './pages/pos/PosTerminal'
import TransactionLog       from './pages/pos/TransactionLog'
import CloseOut             from './pages/pos/CloseOut'
import EodReport            from './pages/pos/EodReport'
import ProductCatalog       from './pages/pos/ProductCatalog'
import RetailSuppliers      from './pages/pos/RetailSuppliers'
import { Loyalty }          from './pages/pos/Loyalty'
import { PosReports }       from './pages/pos/PosReports'

// Prescriptions
import RxQueue              from './pages/prescriptions/Queue'
import NewPrescription      from './pages/prescriptions/NewPrescription'
import { ScheduleLog }      from './pages/prescriptions/ScheduleLog'
import { RxDetail }         from './pages/prescriptions/RxDetail'

// Patients
import PatientList          from './pages/patients/PatientList'
import NewPatient           from './pages/patients/NewPatient'
import PatientProfile       from './pages/patients/PatientProfile'

// Inventory
import ReceiveStock         from './pages/inventory/ReceiveStock'
import StockMovements       from './pages/inventory/StockMovements'
import PurchaseOrders       from './pages/inventory/PurchaseOrders'

// Staff / Timecards
import TimecardClock        from './pages/staff/TimecardClock'
import TimecardManager      from './pages/staff/TimecardManager'

// HR
import LeaveRequests        from './pages/hr/LeaveRequests'
import Certifications       from './pages/hr/Certifications'
import HRManager            from './pages/hr/HRManager'

// Staff — self-service
import MyTimecards          from './pages/staff/MyTimecards'

// Reports
import RevenueReport        from './pages/reports/RevenueReport'
import DispensingReport     from './pages/reports/DispensingReport'
import InventoryReport      from './pages/reports/InventoryReport'
import TimecardReport       from './pages/reports/TimecardReport'
import SalaryReport         from './pages/reports/SalaryReport'

// Admin
import { UsersAdmin }       from './pages/admin/Users'
import { AuditLog }         from './pages/admin/AuditLog'
import { SystemAuditReport } from './pages/admin/SystemAuditReport'
import { Settings }         from './pages/admin/Settings'
import SecurityAdmin        from './pages/admin/Security'

// AI Queue
import AiQueue              from './pages/ai/Queue'

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Routes>
      {/* Public / semi-public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* A-1: /reset-password receives the Supabase magic-link redirect — must be public */}
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* I-09: /verify-mfa is accessible with an AAL1 session (before MFA upgrade) */}
      <Route path="/verify-mfa" element={<VerifyMFA />} />

      {/* Error pages — accessible without AppShell */}
      <Route path="/403" element={<Forbidden />} />
      <Route path="/500" element={<InternalServerError />} />
      <Route path="/pharmacy-closed" element={<PharmacyClosed />} />

      {/* Protected — all routes inside AppShell */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell>
              <Routes>
                {/* Default */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Dashboard — session required, no specific permission */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Retail POS */}
                <Route path="/pos" element={
                  <RoleGuard permission="pos_terminal"><PosTerminal /></RoleGuard>
                } />
                <Route path="/pos/transactions" element={
                  <RoleGuard permission="pos_terminal"><TransactionLog /></RoleGuard>
                } />
                <Route path="/pos/closeout" element={
                  <RoleGuard permission="pos_closeout"><CloseOut /></RoleGuard>
                } />
                <Route path="/pos/eod-report" element={
                  <RoleGuard permission="pos_closeout"><EodReport /></RoleGuard>
                } />
                <Route path="/pos/products" element={
                  <RoleGuard permission="pos_terminal"><ProductCatalog /></RoleGuard>
                } />
                <Route path="/pos/suppliers" element={
                  <RoleGuard permission="inventory_manage"><RetailSuppliers /></RoleGuard>
                } />
                <Route path="/pos/loyalty" element={
                  <RoleGuard permission="loyalty_manage"><Loyalty /></RoleGuard>
                } />
                <Route path="/pos/reports" element={
                  <RoleGuard permission="reports_view"><PosReports /></RoleGuard>
                } />

                {/* Prescriptions */}
                <Route path="/prescriptions" element={
                  <RoleGuard permission="rx_dispense"><RxQueue /></RoleGuard>
                } />
                <Route path="/prescriptions/new" element={
                  <RoleGuard permission="rx_dispense"><NewPrescription /></RoleGuard>
                } />
                <Route path="/prescriptions/schedule-log" element={
                  <RoleGuard permission="rx_schedule_log"><ScheduleLog /></RoleGuard>
                } />
                <Route path="/prescriptions/:id" element={
                  <RoleGuard permission="rx_dispense"><RxDetail /></RoleGuard>
                } />

                {/* Patients */}
                <Route path="/patients" element={
                  <RoleGuard permission="rx_dispense"><PatientList /></RoleGuard>
                } />
                <Route path="/patients/new" element={
                  <RoleGuard permission="rx_dispense"><NewPatient /></RoleGuard>
                } />
                {/* /patients/:id — same permission as patient list; no separate route guard needed */}
                <Route path="/patients/:id" element={
                  <RoleGuard permission="rx_dispense"><PatientProfile /></RoleGuard>
                } />

                {/* Inventory */}
                <Route path="/inventory/receive-stock" element={
                  <RoleGuard permission="inventory_manage"><ReceiveStock /></RoleGuard>
                } />
                <Route path="/inventory/stock-movements" element={
                  <RoleGuard permission="inventory_manage"><StockMovements /></RoleGuard>
                } />
                <Route path="/inventory/purchase-orders" element={
                  <RoleGuard permission="inventory_manage"><PurchaseOrders /></RoleGuard>
                } />

                {/* Staff / Timecards */}
                {/* /staff/timecard — session-only, all authenticated staff */}
                <Route path="/staff/timecard" element={<TimecardClock />} />
                <Route path="/staff/timecards" element={
                  <RoleGuard permission="timecard_manage"><TimecardManager /></RoleGuard>
                } />

                {/* Staff — self-service (Employment Act: right to view own hours) */}
                <Route path="/staff/my-timecards" element={
                  <RoleGuard permission="timecard_view"><MyTimecards /></RoleGuard>
                } />

                {/* HR */}
                {/* /hr/leave — session-only; managers see all pending, staff see own */}
                <Route path="/hr/leave" element={<LeaveRequests />} />
                <Route path="/hr/certifications" element={
                  <RoleGuard permission="staff_manage"><Certifications /></RoleGuard>
                } />
                {/* /hr/manager — ADMIN/MANAGER only: salaries, leave approval, leave calendar */}
                <Route path="/hr/manager" element={
                  <RoleGuard permission="staff_manage"><HRManager /></RoleGuard>
                } />

                {/* Reports */}
                <Route path="/reports/revenue" element={
                  <RoleGuard permission="reports_view"><RevenueReport /></RoleGuard>
                } />
                <Route path="/reports/dispensing" element={
                  <RoleGuard permission="reports_view"><DispensingReport /></RoleGuard>
                } />
                <Route path="/reports/inventory" element={
                  <RoleGuard permission="reports_view"><InventoryReport /></RoleGuard>
                } />
                <Route path="/reports/timecards" element={
                  <RoleGuard permission="reports_view"><TimecardReport /></RoleGuard>
                } />
                <Route path="/reports/salary" element={
                  <RoleGuard permission="reports_view"><SalaryReport /></RoleGuard>
                } />

                {/* Admin */}
                <Route path="/admin/users" element={
                  <RoleGuard permission="staff_manage"><UsersAdmin /></RoleGuard>
                } />
                <Route path="/admin/audit" element={
                  <RoleGuard permission="audit_view"><AuditLog /></RoleGuard>
                } />
                <Route path="/admin/settings" element={
                  <RoleGuard permission="settings_manage"><Settings /></RoleGuard>
                } />
                {/* Security: audit_view minimum — AUDITOR can view; ADMIN/MANAGER also qualify */}
                <Route path="/admin/security" element={
                  <RoleGuard permission="audit_view"><SecurityAdmin /></RoleGuard>
                } />
                {/* System Audit Report: self-audit capability — audit_view required */}
                <Route path="/admin/audit-report" element={
                  <RoleGuard permission="audit_view"><SystemAuditReport /></RoleGuard>
                } />

                {/* AI Queue */}
                <Route path="/ai/queue" element={
                  <RoleGuard permission="ai_queue"><AiQueue /></RoleGuard>
                } />

                {/* Profile / Security — I-09: MFA enrollment, any authenticated staff */}
                <Route path="/profile/security" element={<SetupMFA />} />

                {/* 404 — renders branded page instead of silent redirect */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
