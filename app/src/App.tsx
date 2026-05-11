import { Routes, Route, Navigate } from 'react-router'
import { AppShell } from './components/Shell'
import { ProtectedRoute } from './components/ProtectedRoute'

// ─── Page imports ─────────────────────────────────────────────────────────────
// Auth
import Login                from './pages/auth/Login'

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
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected — all routes inside AppShell */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell>
              <Routes>
                {/* Default */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Retail POS */}
                <Route path="/pos"              element={<PosTerminal />} />
                <Route path="/pos/transactions" element={<TransactionLog />} />
                <Route path="/pos/closeout"     element={<CloseOut />} />
                <Route path="/pos/eod-report"   element={<EodReport />} />
                <Route path="/pos/products"     element={<ProductCatalog />} />
                <Route path="/pos/suppliers"    element={<RetailSuppliers />} />
                <Route path="/pos/loyalty"      element={<Loyalty />} />
                <Route path="/pos/reports"      element={<PosReports />} />

                {/* Prescriptions */}
                <Route path="/prescriptions"              element={<RxQueue />} />
                <Route path="/prescriptions/new"          element={<NewPrescription />} />
                <Route path="/prescriptions/schedule-log" element={<ScheduleLog />} />

                {/* Patients */}
                <Route path="/patients"     element={<PatientList />} />
                <Route path="/patients/new" element={<NewPatient />} />

                {/* Reports */}
                <Route path="/reports/revenue"    element={<RevenueReport />} />
                <Route path="/reports/dispensing" element={<DispensingReport />} />
                <Route path="/reports/inventory"  element={<InventoryReport />} />

                {/* Admin */}
                <Route path="/admin/users"    element={<UsersAdmin />} />
                <Route path="/admin/audit"    element={<AuditLog />} />
                <Route path="/admin/settings" element={<Settings />} />

                {/* AI Queue */}
                <Route path="/ai/queue" element={<AiQueue />} />

                {/* 404 */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
