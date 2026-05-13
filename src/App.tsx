import { Routes, Route, Navigate } from 'react-router'
import { AppShell } from './components/Shell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleGuard } from './components/RoleGuard'

// ─── Page imports ─────────────────────────────────────────────────────────────
// Auth
import Login                from './pages/auth/Login'
import VerifyMFA            from './pages/auth/VerifyMFA'
import SetupMFA             from './pages/auth/SetupMFA'

// Error pages
import { Forbidden }        from './pages/errors/Forbidden'
import { NotFound }         from './pages/errors/NotFound'

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

// Reports
import RevenueReport        from './pages/reports/RevenueReport'
import DispensingReport     from './pages/reports/DispensingReport'
import InventoryReport      from './pages/reports/InventoryReport'

// Admin
import { UsersAdmin }       from './pages/admin/Users'
import { AuditLog }         from './pages/admin/AuditLog'
import { Settings }         from './pages/admin/Settings'

// AI Queue
import AiQueue              from './pages/ai/Queue'

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Routes>
      {/* Public / semi-public auth routes */}
      <Route path="/login" element={<Login />} />
      {/* I-09: /verify-mfa is accessible with an AAL1 session (before MFA upgrade) */}
      <Route path="/verify-mfa" element={<VerifyMFA />} />

      {/* Error pages — accessible without AppShell */}
      <Route path="/403" element={<Forbidden />} />

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
                  <RoleGuard permission="eod_approve"><EodReport /></RoleGuard>
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
