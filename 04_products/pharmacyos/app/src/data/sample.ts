// Sample data — demo accuracy layer for Winchester Global Pharmacy
// Replace with live Supabase queries once G2 (Supabase provisioning) is closed
// Every metric, count, and table in the UI derives from these arrays.
// Swap-readiness rule: changing any array value propagates automatically to all pages.

// ─── Types ────────────────────────────────────────────────────────────────────

export type RxStatus      = 'Received' | 'Verified' | 'Filled' | 'Dispensed'
export type JobStatus     = 'Processing' | 'Completed' | 'Failed' | 'Review Required'
export type UserRole      = 'Pharmacist' | 'Technician' | 'Front Desk' | 'Manager' | 'Admin'
export type PaymentMethod = 'Cash' | 'Card' | 'Lynk'

/** Domain-specific AI agent types. Each maps to a job category in SAMPLE_AI_JOBS. */
export type AgentType =
  | 'rx-ocr'             // Prescription image scanning & field extraction
  | 'invoice-ocr'        // Supplier invoice scanning & receive-record creation
  | 'drug-interaction'   // OpenFDA multi-drug interaction check
  | 'inventory-intel'    // Stock optimisation analysis & reorder recommendations
  | 'compliance-monitor' // Regulatory & credential gap monitoring
  | 'report-synthesis'   // Narrative summary generation from pharmacy data
  | 'patient-risk'       // Allergy + interaction risk flagging per patient

export type Department = 'Dispensary' | 'Front Office' | 'Retail' | 'Management' | 'Administration'
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract'

export interface Patient {
  id: string; name: string; dob: string; nhfNumber: string
  phone: string; allergies: string[]; lastVisit: string
}

/** Audit trail entry for prescription workflow transitions. */
export interface RxAuditEntry {
  from: RxStatus; to: RxStatus
  actor: string; role: UserRole; timestamp: string; note?: string
}

export interface Prescription {
  id: string; rxNumber: string; patient: string; patientId: string
  drugs: string[]; prescriber: string; received: string
  status: RxStatus; isSchedule: boolean; isNhf: boolean
  /** Total refills authorised by prescriber (0 = no refills). */
  refills?: number
  /** Refills remaining. Decremented each time the prescription is filled. */
  refillsRemaining?: number
  /** Regulated evidence trail — every status transition is logged here. */
  auditTrail?: RxAuditEntry[]
}

export interface StockItem {
  id: string; drug: string; din: string; lot: string
  qtyOnHand: number; reorderPoint: number; expiryDate: string
  supplier: string; unitCostJmd: number; isSchedule: boolean
}

export interface Supplier {
  id: string; name: string; contact: string; phone: string
  email: string; location: string; lastOrder: string; status: 'Active' | 'Inactive'
}

export interface POSProduct {
  id: string; name: string; barcode: string; category: string
  priceJmd: number; stockQty: number; requiresRx: boolean
}

export interface POSTransaction {
  id: string; txNumber: string; time: string; cashier: string
  items: number; totalJmd: number; method: PaymentMethod
  patient?: string
}

export interface LoyaltyMember {
  id: string; patientId: string; name: string; points: number
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'; lastEarned: string
}

export interface ScheduleLogEntry {
  id: string; logNumber: string; date: string; time: string
  drug: string; din: string; qty: number; rxNumber: string
  patient: string; prescriber: string; dispensedBy: string; verified: boolean
}

export interface AIJob {
  id: string
  jobNumber: string
  type: AgentType
  /** Short human-readable label for the job type. */
  label: string
  target: string
  status: JobStatus
  /** Confidence score 0–1. Display as percentage. */
  confidence?: number
  createdAt: string
  completedAt?: string
  /** True if this job requires human review beyond standard QA. */
  flagged?: boolean
  /** Explanation of why the job was flagged. */
  flagNote?: string
  /** One-line description of input data processed. */
  inputSummary: string
  /** One-line summary of what the agent produced. */
  outputSummary?: string
  /** ID of the linked entity (RxID, PatientID, StaffID, etc.) */
  linkedEntityId?: string
  linkedEntityType?: 'prescription' | 'patient' | 'staff' | 'inventory' | 'report'
  /** External services this job is waiting on before it can complete. */
  integrationPending?: string[]
}

export interface StaffUser {
  id: string
  name: string
  role: UserRole
  email: string
  status: 'Active' | 'Inactive'
  twoFa: boolean
  lastLogin: string
  // ── Extended fields (Phase B) ─────────────────────────────────────────────
  firstName?: string
  lastName?: string
  phone?: string
  /** Auto-generated on staff creation. Format: EMP-NNN */
  employeeNumber?: string
  hireDate?: string
  department?: Department
  employmentType?: EmploymentType
  /** ID of the supervising staff member. */
  supervisorId?: string
  /** Pharmacy Council of Jamaica registration number (Pharmacist/Tech roles). */
  licenseNumber?: string
  /** ISO date: YYYY-MM-DD. Compliance agent flags within 90-day window. */
  licenseExpiry?: string
  /** Per-user permission overrides. true = grant, false = deny, undefined = inherit role. */
  permissionOverrides?: Partial<Record<string, boolean>>
  notes?: string
  createdAt?: string
}

export interface ReceiveRecord {
  id: string; receiveNumber: string; date: string; supplier: string
  drug: string; din: string; lot: string; qtyReceived: number
  expiryDate: string; receivedBy: string; invoiceRef: string
}

export interface ActivityEntry {
  id: string; timestamp: string; user: string; role: string
  action: string; target: string
}

/** Active session record — stub until Supabase auth session management is live. */
export interface SessionEntry {
  id: string
  userId: string
  user: string
  role: UserRole
  device: string
  ip: string
  location: string
  lastActivity: string
  /** True if this is the currently logged-in session. */
  current: boolean
}

/** Shift schedule entry — stub for staff scheduling module. */
export interface ShiftEntry {
  id: string
  staffId: string
  date: string
  startTime: string
  endTime: string
  role: UserRole
  location: 'Dispensary' | 'Front Desk' | 'POS'
}

// ─── Patients ─────────────────────────────────────────────────────────────────

export const SAMPLE_PATIENTS: Patient[] = [
  { id: 'P001', name: 'Marcus Reid',      dob: '1965-03-12', nhfNumber: 'NHF-00123456', phone: '876-421-8830', allergies: ['Penicillin'],             lastVisit: '2026-05-06' },
  { id: 'P002', name: 'Yvette Campbell',  dob: '1978-09-24', nhfNumber: 'NHF-00234567', phone: '876-931-4410', allergies: [],                            lastVisit: '2026-05-07' },
  { id: 'P003', name: 'Devon Williams',   dob: '1991-06-15', nhfNumber: 'NHF-00345678', phone: '876-754-2201', allergies: ['Sulfonamides'],               lastVisit: '2026-05-07' },
  { id: 'P004', name: 'Marcia Brown',     dob: '1955-11-30', nhfNumber: 'NHF-00456789', phone: '876-361-7715', allergies: ['Aspirin', 'NSAIDs'],         lastVisit: '2026-05-05' },
  { id: 'P005', name: 'Trevor Thompson',  dob: '1983-04-07', nhfNumber: 'NHF-00567890', phone: '876-882-0049', allergies: [],                            lastVisit: '2026-05-07' },
  { id: 'P006', name: 'Sandra Clarke',    dob: '1970-08-19', nhfNumber: 'NHF-00678901', phone: '876-514-3382', allergies: ['Codeine'],                   lastVisit: '2026-05-04' },
  { id: 'P007', name: 'Rohan Stewart',    dob: '1948-02-28', nhfNumber: 'NHF-00789012', phone: '876-299-6671', allergies: [],                            lastVisit: '2026-05-06' },
  { id: 'P008', name: 'Keisha Morgan',    dob: '1996-12-05', nhfNumber: 'NHF-00890123', phone: '876-643-1128', allergies: ['Latex'],                     lastVisit: '2026-05-03' },
  { id: 'P009', name: 'Neville Grant',    dob: '1960-07-03', nhfNumber: 'NHF-00991234', phone: '876-531-0072', allergies: [],                            lastVisit: '2026-05-08' },
  { id: 'P010', name: 'Camille Francis',  dob: '1974-01-22', nhfNumber: 'NHF-00112345', phone: '876-774-6690', allergies: ['Penicillin', 'Cephalosporin'], lastVisit: '2026-05-08' },
  { id: 'P011', name: 'Omar Chin',        dob: '1988-10-14', nhfNumber: 'NHF-00223456', phone: '876-921-3345', allergies: [],                            lastVisit: '2026-05-07' },
]

// ─── Prescriptions ────────────────────────────────────────────────────────────

export const SAMPLE_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX001', rxNumber: 'RX-2026-0847', patient: 'Marcus Reid', patientId: 'P001',
    drugs: ['Metformin 500mg × 60'], prescriber: 'Dr. K. Patterson',
    received: '2026-05-07 08:14', status: 'Received', isSchedule: false, isNhf: false,
    refills: 3, refillsRemaining: 3,
    auditTrail: [],
  },
  {
    id: 'RX002', rxNumber: 'RX-2026-0846', patient: 'Yvette Campbell', patientId: 'P002',
    drugs: ['Amlodipine 10mg × 30'], prescriber: 'Dr. J. Brown',
    received: '2026-05-07 08:31', status: 'Verified', isSchedule: false, isNhf: true,
    refills: 5, refillsRemaining: 5,
    auditTrail: [
      { from: 'Received', to: 'Verified', actor: 'Dr. K. Powell', role: 'Pharmacist', timestamp: '2026-05-07 08:45', note: 'NHF eligibility confirmed' },
    ],
  },
  {
    id: 'RX003', rxNumber: 'RX-2026-0845', patient: 'Devon Williams', patientId: 'P003',
    drugs: ['Amoxicillin 500mg × 21'], prescriber: 'Dr. M. Singh',
    received: '2026-05-07 09:02', status: 'Filled', isSchedule: false, isNhf: false,
    refills: 0, refillsRemaining: 0,
    auditTrail: [
      { from: 'Received', to: 'Verified', actor: 'Dr. K. Powell', role: 'Pharmacist', timestamp: '2026-05-07 09:15' },
      { from: 'Verified', to: 'Filled', actor: 'Sandra M.', role: 'Technician', timestamp: '2026-05-07 09:48' },
    ],
  },
  {
    id: 'RX004', rxNumber: 'RX-2026-0844', patient: 'Marcia Brown', patientId: 'P004',
    drugs: ['Atorvastatin 20mg × 30', 'Lisinopril 10mg × 30'], prescriber: 'Dr. K. Patterson',
    received: '2026-05-07 09:18', status: 'Verified', isSchedule: false, isNhf: true,
    refills: 11, refillsRemaining: 11,
    auditTrail: [
      { from: 'Received', to: 'Verified', actor: 'Dr. K. Powell', role: 'Pharmacist', timestamp: '2026-05-07 09:30', note: 'NHF · drug interaction check passed' },
    ],
  },
  {
    id: 'RX005', rxNumber: 'RX-2026-0843', patient: 'Trevor Thompson', patientId: 'P005',
    drugs: ['Oxycodone 5mg × 30'], prescriber: 'Dr. R. Lewis',
    received: '2026-05-07 09:45', status: 'Received', isSchedule: true, isNhf: false,
    refills: 0, refillsRemaining: 0,
    auditTrail: [],
  },
  {
    id: 'RX006', rxNumber: 'RX-2026-0842', patient: 'Sandra Clarke', patientId: 'P006',
    drugs: ['Omeprazole 20mg × 30'], prescriber: 'Dr. J. Brown',
    received: '2026-05-07 10:03', status: 'Filled', isSchedule: false, isNhf: false,
    refills: 2, refillsRemaining: 1,
    auditTrail: [
      { from: 'Received', to: 'Verified', actor: 'Dr. K. Powell', role: 'Pharmacist', timestamp: '2026-05-07 10:10' },
      { from: 'Verified', to: 'Filled', actor: 'Sandra M.', role: 'Technician', timestamp: '2026-05-07 10:35' },
    ],
  },
  {
    id: 'RX007', rxNumber: 'RX-2026-0841', patient: 'Rohan Stewart', patientId: 'P007',
    drugs: ['Metformin 500mg × 90'], prescriber: 'Dr. K. Patterson',
    received: '2026-05-06 14:22', status: 'Dispensed', isSchedule: false, isNhf: true,
    refills: 3, refillsRemaining: 2,
    auditTrail: [
      { from: 'Received', to: 'Verified', actor: 'Dr. K. Powell', role: 'Pharmacist', timestamp: '2026-05-06 14:30' },
      { from: 'Verified', to: 'Filled', actor: 'Sandra M.', role: 'Technician', timestamp: '2026-05-06 15:10' },
      { from: 'Filled', to: 'Dispensed', actor: 'Tanya R.', role: 'Front Desk', timestamp: '2026-05-06 16:05', note: 'NHF co-pay collected' },
    ],
  },
  {
    id: 'RX008', rxNumber: 'RX-2026-0840', patient: 'Keisha Morgan', patientId: 'P008',
    drugs: ['Hydrochlorothiazide 25mg × 30'], prescriber: 'Dr. M. Singh',
    received: '2026-05-06 15:47', status: 'Dispensed', isSchedule: false, isNhf: false,
    refills: 5, refillsRemaining: 4,
    auditTrail: [
      { from: 'Received', to: 'Verified', actor: 'Dr. K. Powell', role: 'Pharmacist', timestamp: '2026-05-06 15:55' },
      { from: 'Verified', to: 'Filled', actor: 'Sandra M.', role: 'Technician', timestamp: '2026-05-06 16:20' },
      { from: 'Filled', to: 'Dispensed', actor: 'Tanya R.', role: 'Front Desk', timestamp: '2026-05-06 16:48' },
    ],
  },
  {
    id: 'RX009', rxNumber: 'RX-2026-0839', patient: 'Neville Grant', patientId: 'P009',
    drugs: ['Metformin 500mg × 60', 'Aspirin 81mg × 30'], prescriber: 'Dr. K. Patterson',
    received: '2026-05-08 07:55', status: 'Received', isSchedule: false, isNhf: true,
    refills: 5, refillsRemaining: 5,
    auditTrail: [],
  },
  {
    id: 'RX010', rxNumber: 'RX-2026-0838', patient: 'Camille Francis', patientId: 'P010',
    drugs: ['Amlodipine 10mg × 30', 'Omeprazole 20mg × 30'], prescriber: 'Dr. J. Brown',
    received: '2026-05-08 08:12', status: 'Verified', isSchedule: false, isNhf: false,
    refills: 3, refillsRemaining: 3,
    auditTrail: [
      { from: 'Received', to: 'Verified', actor: 'Dr. K. Powell', role: 'Pharmacist', timestamp: '2026-05-08 08:25', note: 'Allergy check: Penicillin/Cephalosporin — drugs clear' },
    ],
  },
  {
    id: 'RX011', rxNumber: 'RX-2026-0837', patient: 'Omar Chin', patientId: 'P011',
    drugs: ['Diazepam 5mg × 14'], prescriber: 'Dr. R. Lewis',
    received: '2026-05-08 08:30', status: 'Received', isSchedule: true, isNhf: false,
    refills: 0, refillsRemaining: 0,
    auditTrail: [],
  },
  {
    id: 'RX012', rxNumber: 'RX-2026-0836', patient: 'Marcus Reid', patientId: 'P001',
    drugs: ['Atorvastatin 20mg × 30'], prescriber: 'Dr. K. Patterson',
    received: '2026-05-08 08:45', status: 'Filled', isSchedule: false, isNhf: false,
    refills: 11, refillsRemaining: 10,
    auditTrail: [
      { from: 'Received', to: 'Verified', actor: 'Dr. K. Powell', role: 'Pharmacist', timestamp: '2026-05-08 09:00' },
      { from: 'Verified', to: 'Filled', actor: 'Nadine F.', role: 'Technician', timestamp: '2026-05-08 09:30' },
    ],
  },
  {
    id: 'RX013', rxNumber: 'RX-2026-0835', patient: 'Yvette Campbell', patientId: 'P002',
    drugs: ['Lisinopril 10mg × 30', 'Hydrochlorothiazide 25mg × 30'], prescriber: 'Dr. M. Singh',
    received: '2026-05-08 09:10', status: 'Verified', isSchedule: false, isNhf: true,
    refills: 5, refillsRemaining: 4,
    auditTrail: [
      { from: 'Received', to: 'Verified', actor: 'Dr. K. Powell', role: 'Pharmacist', timestamp: '2026-05-08 09:22', note: 'NHF confirmed · interaction check clear' },
    ],
  },
  {
    id: 'RX014', rxNumber: 'RX-2026-0834', patient: 'Neville Grant', patientId: 'P009',
    drugs: ['Omeprazole 20mg × 30'], prescriber: 'Dr. J. Brown',
    received: '2026-05-08 09:30', status: 'Filled', isSchedule: false, isNhf: true,
    refills: 2, refillsRemaining: 2,
    auditTrail: [
      { from: 'Received', to: 'Verified', actor: 'Dr. K. Powell', role: 'Pharmacist', timestamp: '2026-05-08 09:40' },
      { from: 'Verified', to: 'Filled', actor: 'Sandra M.', role: 'Technician', timestamp: '2026-05-08 10:05' },
    ],
  },
  {
    id: 'RX015', rxNumber: 'RX-2026-0833', patient: 'Devon Williams', patientId: 'P003',
    drugs: ['Metformin 500mg × 60', 'Amlodipine 10mg × 30'], prescriber: 'Dr. K. Patterson',
    received: '2026-05-08 10:02', status: 'Dispensed', isSchedule: false, isNhf: false,
    refills: 3, refillsRemaining: 2,
    auditTrail: [
      { from: 'Received', to: 'Verified', actor: 'Dr. K. Powell', role: 'Pharmacist', timestamp: '2026-05-08 10:12' },
      { from: 'Verified', to: 'Filled', actor: 'Nadine F.', role: 'Technician', timestamp: '2026-05-08 10:40' },
      { from: 'Filled', to: 'Dispensed', actor: 'Patrice M.', role: 'Front Desk', timestamp: '2026-05-08 11:15' },
    ],
  },
  {
    id: 'RX016', rxNumber: 'RX-2026-0832', patient: 'Omar Chin', patientId: 'P011',
    drugs: ['Amoxicillin 500mg × 21'], prescriber: 'Dr. M. Singh',
    received: '2026-05-08 10:18', status: 'Dispensed', isSchedule: false, isNhf: false,
    refills: 0, refillsRemaining: 0,
    auditTrail: [
      { from: 'Received', to: 'Verified', actor: 'Dr. K. Powell', role: 'Pharmacist', timestamp: '2026-05-08 10:25' },
      { from: 'Verified', to: 'Filled', actor: 'Winston C.', role: 'Technician', timestamp: '2026-05-08 10:55' },
      { from: 'Filled', to: 'Dispensed', actor: 'Tanya R.', role: 'Front Desk', timestamp: '2026-05-08 11:30' },
    ],
  },
]

// ─── Stock ────────────────────────────────────────────────────────────────────

export const SAMPLE_STOCK: StockItem[] = [
  { id: 'S01', drug: 'Metformin 500mg (500ct)',            din: '02248993', lot: 'LOT-24-8823', qtyOnHand: 340, reorderPoint: 100, expiryDate: '2027-06-30', supplier: 'PharmSource Ltd',            unitCostJmd: 1250,  isSchedule: false },
  { id: 'S02', drug: 'Amlodipine 10mg (100ct)',            din: '02239829', lot: 'LOT-25-1102', qtyOnHand: 88,  reorderPoint: 50,  expiryDate: '2026-09-30', supplier: 'Caribbean Drug Supply',      unitCostJmd: 3800,  isSchedule: false },
  { id: 'S03', drug: 'Amoxicillin 500mg (250ct)',          din: '02177846', lot: 'LOT-25-3341', qtyOnHand: 15,  reorderPoint: 50,  expiryDate: '2026-08-31', supplier: 'PharmSource Ltd',            unitCostJmd: 2100,  isSchedule: false },
  { id: 'S04', drug: 'Atorvastatin 20mg (100ct)',          din: '02230711', lot: 'LOT-24-7712', qtyOnHand: 220, reorderPoint: 75,  expiryDate: '2027-03-31', supplier: 'Caribbean Drug Supply',      unitCostJmd: 4200,  isSchedule: false },
  { id: 'S05', drug: 'Lisinopril 10mg (100ct)',            din: '02145782', lot: 'LOT-25-0045', qtyOnHand: 165, reorderPoint: 60,  expiryDate: '2027-01-31', supplier: 'PharmSource Ltd',            unitCostJmd: 2900,  isSchedule: false },
  { id: 'S06', drug: 'Oxycodone 5mg (30ct)',               din: '02213494', lot: 'LOT-25-2201', qtyOnHand: 30,  reorderPoint: 30,  expiryDate: '2026-12-31', supplier: 'Restricted Narcotics Dist.', unitCostJmd: 8500,  isSchedule: true  },
  { id: 'S07', drug: 'Diazepam 5mg (50ct)',                din: '02216426', lot: 'LOT-24-9910', qtyOnHand: 25,  reorderPoint: 20,  expiryDate: '2026-07-15', supplier: 'Restricted Narcotics Dist.', unitCostJmd: 6100,  isSchedule: true  },
  { id: 'S08', drug: 'Omeprazole 20mg (100ct)',            din: '02245565', lot: 'LOT-25-1876', qtyOnHand: 178, reorderPoint: 80,  expiryDate: '2027-04-30', supplier: 'PharmSource Ltd',            unitCostJmd: 3400,  isSchedule: false },
  { id: 'S09', drug: 'Hydrochlorothiazide 25mg (100ct)',   din: '02245676', lot: 'LOT-24-6634', qtyOnHand: 42,  reorderPoint: 50,  expiryDate: '2026-06-30', supplier: 'Caribbean Drug Supply',      unitCostJmd: 1800,  isSchedule: false },
  { id: 'S10', drug: 'Aspirin 81mg (500ct)',               din: '02190117', lot: 'LOT-25-0891', qtyOnHand: 612, reorderPoint: 200, expiryDate: '2027-08-31', supplier: 'PharmSource Ltd',            unitCostJmd: 950,   isSchedule: false },
]

// ─── Suppliers ────────────────────────────────────────────────────────────────

export const SAMPLE_SUPPLIERS: Supplier[] = [
  { id: 'SUP01', name: 'PharmSource Ltd',            contact: 'Andrew Morris',  phone: '876-927-4410', email: 'orders@pharmsource.com.jm',      location: 'Kingston, JA',     lastOrder: '2026-05-02', status: 'Active'   },
  { id: 'SUP02', name: 'Caribbean Drug Supply',      contact: 'Dianne Foster',  phone: '876-952-8830', email: 'supply@caribbeandrug.com',        location: 'Montego Bay, JA',  lastOrder: '2026-04-28', status: 'Active'   },
  { id: 'SUP03', name: 'Restricted Narcotics Dist.', contact: 'MOH Portal',     phone: '876-967-1100', email: 'narcotics@moh.gov.jm',            location: 'Kingston, JA',     lastOrder: '2026-04-15', status: 'Active'   },
  { id: 'SUP04', name: 'MedTech Solutions JA',       contact: 'Kevin Clarke',   phone: '876-749-2201', email: 'kclarke@medtechja.com',           location: 'Spanish Town, JA', lastOrder: '2026-03-18', status: 'Inactive' },
]

// ─── POS Products ─────────────────────────────────────────────────────────────

export const SAMPLE_POS_PRODUCTS: POSProduct[] = [
  { id: 'PRD01', name: 'Aspirin 81mg (30ct)',        barcode: '8001500001', category: 'OTC',         priceJmd: 350,    stockQty: 48, requiresRx: false },
  { id: 'PRD02', name: 'Vitamin C 500mg (60ct)',     barcode: '8001500002', category: 'Supplements',  priceJmd: 890,    stockQty: 32, requiresRx: false },
  { id: 'PRD03', name: 'Ibuprofen 400mg (24ct)',     barcode: '8001500003', category: 'OTC',         priceJmd: 620,    stockQty: 27, requiresRx: false },
  { id: 'PRD04', name: 'Paracetamol 500mg (20ct)',   barcode: '8001500004', category: 'OTC',         priceJmd: 280,    stockQty: 60, requiresRx: false },
  { id: 'PRD05', name: 'Hand Sanitizer 500ml',       barcode: '8001500005', category: 'Health',      priceJmd: 450,    stockQty: 18, requiresRx: false },
  { id: 'PRD06', name: 'Blood Pressure Monitor',     barcode: '8001500006', category: 'Devices',     priceJmd: 8500,   stockQty: 5,  requiresRx: false },
  { id: 'PRD07', name: 'Glucometer Kit',             barcode: '8001500007', category: 'Devices',     priceJmd: 12000,  stockQty: 4,  requiresRx: false },
  { id: 'PRD08', name: 'Antacid Tablets (20ct)',     barcode: '8001500008', category: 'OTC',         priceJmd: 380,    stockQty: 35, requiresRx: false },
  { id: 'PRD09', name: 'Vitamin D3 1000IU (60ct)',   barcode: '8001500009', category: 'Supplements',  priceJmd: 1200,   stockQty: 22, requiresRx: false },
  { id: 'PRD10', name: 'Bandages Assorted (10ct)',   barcode: '8001500010', category: 'First Aid',   priceJmd: 250,    stockQty: 55, requiresRx: false },
]

// ─── POS Transactions ─────────────────────────────────────────────────────────
// 15 transactions across 3 days. Source of truth for all POS metrics.

export const SAMPLE_TRANSACTIONS: POSTransaction[] = [
  // 2026-05-09
  { id: 'TX001', txNumber: 'POS-2026-0315', time: '2026-05-09 10:45', cashier: 'Tanya R.',   items: 2, totalJmd: 1240,  method: 'Cash',  patient: 'Marcus Reid' },
  { id: 'TX002', txNumber: 'POS-2026-0314', time: '2026-05-09 10:22', cashier: 'Tanya R.',   items: 1, totalJmd: 280,   method: 'Card'  },
  { id: 'TX003', txNumber: 'POS-2026-0313', time: '2026-05-09 09:58', cashier: 'Tanya R.',   items: 1, totalJmd: 12000, method: 'Lynk',  patient: 'Rohan Stewart' },
  { id: 'TX004', txNumber: 'POS-2026-0312', time: '2026-05-09 09:31', cashier: 'Tanya R.',   items: 2, totalJmd: 1070,  method: 'Cash'  },
  { id: 'TX005', txNumber: 'POS-2026-0311', time: '2026-05-09 09:15', cashier: 'Tanya R.',   items: 2, totalJmd: 630,   method: 'Cash'  },
  { id: 'TX006', txNumber: 'POS-2026-0310', time: '2026-05-09 08:52', cashier: 'Tanya R.',   items: 3, totalJmd: 3200,  method: 'Card',  patient: 'Yvette Campbell' },
  { id: 'TX007', txNumber: 'POS-2026-0309', time: '2026-05-09 08:34', cashier: 'Tanya R.',   items: 1, totalJmd: 890,   method: 'Cash'  },
  { id: 'TX008', txNumber: 'POS-2026-0308', time: '2026-05-09 08:11', cashier: 'Tanya R.',   items: 1, totalJmd: 450,   method: 'Lynk'  },
  // 2026-05-10
  { id: 'TX009', txNumber: 'POS-2026-0307', time: '2026-05-10 14:20', cashier: 'Patrice M.', items: 2, totalJmd: 2090,  method: 'Card',  patient: 'Neville Grant' },
  { id: 'TX010', txNumber: 'POS-2026-0306', time: '2026-05-10 13:05', cashier: 'Patrice M.', items: 3, totalJmd: 4750,  method: 'Cash'  },
  { id: 'TX011', txNumber: 'POS-2026-0305', time: '2026-05-10 11:30', cashier: 'Patrice M.', items: 1, totalJmd: 350,   method: 'Cash'  },
  { id: 'TX012', txNumber: 'POS-2026-0304', time: '2026-05-10 10:12', cashier: 'Patrice M.', items: 4, totalJmd: 6800,  method: 'Lynk',  patient: 'Camille Francis' },
  // 2026-05-11
  { id: 'TX013', txNumber: 'POS-2026-0303', time: '2026-05-11 11:00', cashier: 'Tanya R.',   items: 2, totalJmd: 1620,  method: 'Card'  },
  { id: 'TX014', txNumber: 'POS-2026-0302', time: '2026-05-11 09:45', cashier: 'Tanya R.',   items: 1, totalJmd: 880,   method: 'Cash',  patient: 'Marcus Reid' },
  { id: 'TX015', txNumber: 'POS-2026-0301', time: '2026-05-11 08:30', cashier: 'Tanya R.',   items: 2, totalJmd: 1470,  method: 'Lynk'  },
]

/** Today's transactions (2026-05-11) for Dashboard "Sales Today" metric. */
export const TODAY_TRANSACTIONS = SAMPLE_TRANSACTIONS.filter((t) => t.time.startsWith('2026-05-11'))

// ─── Loyalty Members ──────────────────────────────────────────────────────────

export const SAMPLE_LOYALTY: LoyaltyMember[] = [
  { id: 'LOY01', patientId: 'P007', name: 'Rohan Stewart',   points: 5400, tier: 'Platinum', lastEarned: '2026-05-06' },
  { id: 'LOY02', patientId: 'P002', name: 'Yvette Campbell', points: 3850, tier: 'Gold',     lastEarned: '2026-05-07' },
  { id: 'LOY03', patientId: 'P004', name: 'Marcia Brown',    points: 2100, tier: 'Silver',   lastEarned: '2026-05-05' },
  { id: 'LOY04', patientId: 'P001', name: 'Marcus Reid',     points: 1240, tier: 'Silver',   lastEarned: '2026-05-06' },
  { id: 'LOY05', patientId: 'P006', name: 'Sandra Clarke',   points: 480,  tier: 'Bronze',   lastEarned: '2026-05-04' },
]

// ─── Schedule Drug Log ────────────────────────────────────────────────────────

export const SAMPLE_SCHEDULE_LOG: ScheduleLogEntry[] = [
  { id: 'SL001', logNumber: 'LOG-2026-0043', date: '2026-05-07', time: '09:55', drug: 'Oxycodone 5mg',  din: '02213494', qty: 30, rxNumber: 'RX-2026-0843', patient: 'Trevor Thompson', prescriber: 'Dr. R. Lewis',     dispensedBy: 'Dr. K. Powell', verified: false },
  { id: 'SL002', logNumber: 'LOG-2026-0042', date: '2026-05-06', time: '16:10', drug: 'Diazepam 5mg',   din: '02216426', qty: 10, rxNumber: 'RX-2026-0838', patient: 'Gloria Reid',      prescriber: 'Dr. K. Patterson', dispensedBy: 'Dr. K. Powell', verified: true  },
  { id: 'SL003', logNumber: 'LOG-2026-0041', date: '2026-05-06', time: '14:22', drug: 'Oxycodone 5mg',  din: '02213494', qty: 15, rxNumber: 'RX-2026-0839', patient: 'Devon Jackson',    prescriber: 'Dr. R. Lewis',     dispensedBy: 'Dr. K. Powell', verified: true  },
  { id: 'SL004', logNumber: 'LOG-2026-0040', date: '2026-05-05', time: '11:18', drug: 'Diazepam 5mg',   din: '02216426', qty: 10, rxNumber: 'RX-2026-0831', patient: 'Gloria Reid',      prescriber: 'Dr. K. Patterson', dispensedBy: 'Dr. K. Powell', verified: true  },
  { id: 'SL005', logNumber: 'LOG-2026-0039', date: '2026-05-04', time: '09:45', drug: 'Oxycodone 5mg',  din: '02213494', qty: 30, rxNumber: 'RX-2026-0824', patient: 'Albert Moore',     prescriber: 'Dr. R. Lewis',     dispensedBy: 'Dr. K. Powell', verified: true  },
]

// ─── AI Jobs ──────────────────────────────────────────────────────────────────
// Covers all 7 agent types. confidence values are 0–1 (display as %).
// integrationPending lists external services blocking full execution.

export const SAMPLE_AI_JOBS: AIJob[] = [
  // ── rx-ocr ──
  {
    id: 'JOB001', jobNumber: 'JOB-2026-0021', type: 'rx-ocr', label: 'Rx Scan',
    target: 'RX-2026-0847 · Marcus Reid',
    status: 'Completed', confidence: 0.98,
    createdAt: '2026-05-07 08:14', completedAt: '2026-05-07 08:14',
    inputSummary: 'Handwritten prescription — 1 page, 3 fields',
    outputSummary: 'Metformin 500mg × 60 · Dr. K. Patterson · refills 3',
    linkedEntityId: 'RX001', linkedEntityType: 'prescription',
  },
  {
    id: 'JOB002', jobNumber: 'JOB-2026-0020', type: 'rx-ocr', label: 'Rx Scan',
    target: 'RX-2026-0843 · Trevor Thompson',
    status: 'Review Required', confidence: 0.71,
    createdAt: '2026-05-07 09:45', completedAt: '2026-05-07 09:46',
    flagged: true, flagNote: 'Low confidence on dosage field — manual review required',
    inputSummary: 'Printed prescription — 1 page, Schedule II',
    outputSummary: 'Oxycodone 5mg × 30 (dosage field uncertain)',
    linkedEntityId: 'RX005', linkedEntityType: 'prescription',
  },
  // ── invoice-ocr ──
  {
    id: 'JOB003', jobNumber: 'JOB-2026-0019', type: 'invoice-ocr', label: 'Invoice Scan',
    target: 'PharmSource INV-2026-0441',
    status: 'Completed', confidence: 0.99,
    createdAt: '2026-05-07 09:02', completedAt: '2026-05-07 09:02',
    inputSummary: 'PharmSource Ltd invoice — 2 pages, 6 line items',
    outputSummary: 'Amoxicillin 500mg × 250 · RCV-2026-0112 created',
    linkedEntityId: 'RCV01', linkedEntityType: 'inventory',
  },
  {
    id: 'JOB004', jobNumber: 'JOB-2026-0018', type: 'rx-ocr', label: 'Rx Scan',
    target: 'RX-2026-0846 · Yvette Campbell',
    status: 'Completed', confidence: 0.94,
    createdAt: '2026-05-07 08:31', completedAt: '2026-05-07 08:31',
    inputSummary: 'Printed prescription — 1 page, NHF eligible',
    outputSummary: 'Amlodipine 10mg × 30 · NHF flag applied',
    linkedEntityId: 'RX002', linkedEntityType: 'prescription',
  },
  {
    id: 'JOB006', jobNumber: 'JOB-2026-0016', type: 'invoice-ocr', label: 'Invoice Scan',
    target: 'Caribbean Drug INV-2026-0318',
    status: 'Failed', confidence: 0.34,
    createdAt: '2026-05-06 15:30', completedAt: '2026-05-06 15:31',
    flagged: true, flagNote: 'Image quality too low — rescan required',
    inputSummary: 'Caribbean Drug Supply invoice — image blurred',
    outputSummary: undefined,
    linkedEntityId: 'SUP02', linkedEntityType: 'inventory',
  },
  // ── drug-interaction ──
  {
    id: 'JOB005', jobNumber: 'JOB-2026-0017', type: 'drug-interaction', label: 'Drug Interaction',
    target: 'Metformin + Lisinopril · RX004',
    status: 'Completed', confidence: 0.97,
    createdAt: '2026-05-07 10:10', completedAt: '2026-05-07 10:10',
    inputSummary: '2-drug check: Metformin 500mg + Lisinopril 10mg',
    outputSummary: 'No critical interactions found · minor: monitor renal function',
    linkedEntityId: 'RX004', linkedEntityType: 'prescription',
    integrationPending: ['OpenFDA — live data'],
  },
  {
    id: 'JOB013', jobNumber: 'JOB-2026-0009', type: 'drug-interaction', label: 'Drug Interaction',
    target: 'Amlodipine + Omeprazole · RX010',
    status: 'Completed', confidence: 0.95,
    createdAt: '2026-05-08 08:30', completedAt: '2026-05-08 08:30',
    inputSummary: '2-drug check: Amlodipine 10mg + Omeprazole 20mg',
    outputSummary: 'No significant interaction. Monitor BP response.',
    linkedEntityId: 'RX010', linkedEntityType: 'prescription',
    integrationPending: ['OpenFDA — live data'],
  },
  // ── inventory-intel ──
  {
    id: 'JOB007', jobNumber: 'JOB-2026-0015', type: 'inventory-intel', label: 'Inventory Intel',
    target: 'Full stock sweep · 10 SKUs',
    status: 'Completed',
    createdAt: '2026-05-11 06:00', completedAt: '2026-05-11 06:01',
    inputSummary: '10 SKUs analysed — qty, reorder points, expiry, receive history',
    outputSummary: '3 critical reorders (Amoxicillin, HCTZ, Oxycodone) · 2 expiring within 90 days',
    linkedEntityType: 'inventory',
    integrationPending: ['Supplier PO API'],
  },
  // ── compliance-monitor ──
  {
    id: 'JOB008', jobNumber: 'JOB-2026-0014', type: 'compliance-monitor', label: 'Compliance Monitor',
    target: 'Staff credentials + schedule log · 2026-05-11',
    status: 'Completed',
    createdAt: '2026-05-11 06:05', completedAt: '2026-05-11 06:05',
    inputSummary: '12 staff records · 5 schedule log entries · audit gap check',
    outputSummary: '2 flags: USR06 license expires in 47 days · Sandra M. 2FA not enrolled',
    flagged: true, flagNote: '2 compliance gaps require attention',
    linkedEntityType: 'staff',
    integrationPending: ['MoH API', 'Pharmacy Council registry'],
  },
  // ── report-synthesis ──
  {
    id: 'JOB009', jobNumber: 'JOB-2026-0013', type: 'report-synthesis', label: 'Report Synthesis',
    target: '7-day summary · 2026-05-05 to 2026-05-11',
    status: 'Completed',
    createdAt: '2026-05-11 07:00', completedAt: '2026-05-11 07:01',
    inputSummary: '16 prescriptions · 15 POS transactions · 10 stock items',
    outputSummary: 'Winchester Pharmacy filled 16 Rx (4 dispensed, 3 filled, 5 active). Revenue JMD 37,970 over 3 days. 3 stock items below reorder threshold.',
    linkedEntityType: 'report',
    integrationPending: ['Email/SMTP', 'PDF export'],
  },
  // ── patient-risk ──
  {
    id: 'JOB010', jobNumber: 'JOB-2026-0012', type: 'patient-risk', label: 'Patient Risk',
    target: 'Camille Francis · P010',
    status: 'Completed',
    createdAt: '2026-05-08 08:12', completedAt: '2026-05-08 08:12',
    inputSummary: 'Patient P010 · allergies: Penicillin, Cephalosporin · 1 active prescription',
    outputSummary: 'No active allergy conflict detected. RX010 drugs clear.',
    linkedEntityId: 'P010', linkedEntityType: 'patient',
  },
  {
    id: 'JOB011', jobNumber: 'JOB-2026-0011', type: 'patient-risk', label: 'Patient Risk',
    target: 'Marcus Reid · P001',
    status: 'Review Required',
    flagged: true, flagNote: 'Penicillin allergy on file — verify RX drugs do not contain beta-lactam class',
    createdAt: '2026-05-07 08:14', completedAt: '2026-05-07 08:14',
    inputSummary: 'Patient P001 · allergy: Penicillin · 2 active prescriptions',
    outputSummary: 'Current drugs Metformin + Atorvastatin are clear. Alert logged for future fills.',
    linkedEntityId: 'P001', linkedEntityType: 'patient',
  },
  {
    id: 'JOB012', jobNumber: 'JOB-2026-0010', type: 'compliance-monitor', label: 'Compliance Monitor',
    target: 'Schedule V log completeness · May 2026',
    status: 'Completed',
    createdAt: '2026-05-10 06:00', completedAt: '2026-05-10 06:01',
    inputSummary: '5 schedule log entries reviewed for completeness',
    outputSummary: 'LOG-2026-0043 missing verification signature — 1 action required',
    flagged: true, flagNote: 'LOG-2026-0043 unverified',
    linkedEntityType: 'report',
    integrationPending: ['MoH regulatory submission'],
  },
  {
    id: 'JOB014', jobNumber: 'JOB-2026-0008', type: 'inventory-intel', label: 'Inventory Intel',
    target: 'Expiry sweep · Q3 2026',
    status: 'Processing',
    createdAt: '2026-05-11 11:30',
    inputSummary: 'Checking all lots expiring before 2026-09-01',
    linkedEntityType: 'inventory',
  },
  {
    id: 'JOB015', jobNumber: 'JOB-2026-0007', type: 'report-synthesis', label: 'Report Synthesis',
    target: 'Monthly revenue summary · April 2026',
    status: 'Completed',
    createdAt: '2026-05-01 07:00', completedAt: '2026-05-01 07:02',
    inputSummary: 'April 2026 POS + Rx fill data',
    outputSummary: 'April revenue JMD 312,400 · 94 Rx dispensed · avg daily sales JMD 10,413',
    linkedEntityType: 'report',
    integrationPending: ['Email/SMTP'],
  },
  {
    id: 'JOB016', jobNumber: 'JOB-2026-0006', type: 'invoice-ocr', label: 'Invoice Scan',
    target: 'Caribbean Drug INV-2026-0409',
    status: 'Completed', confidence: 0.96,
    createdAt: '2026-04-28 10:00', completedAt: '2026-04-28 10:00',
    inputSummary: 'Caribbean Drug Supply invoice — 3 line items',
    outputSummary: 'Atorvastatin 20mg × 300 · RCV-2026-0110 created',
    linkedEntityId: 'RCV03', linkedEntityType: 'inventory',
  },
]

// ─── Staff Users ──────────────────────────────────────────────────────────────
// 12 staff members. Backfilled fields on original 5; 7 new staff added.
// All emails: firstname-initial + lastname @winchester.com.jm

export const SAMPLE_STAFF: StaffUser[] = [
  {
    id: 'USR01', name: 'Dr. Kezia Powell', role: 'Pharmacist',
    email: 'kpowell@winchester.com.jm', status: 'Active', twoFa: true,
    lastLogin: '2026-05-11 07:58',
    firstName: 'Kezia', lastName: 'Powell', phone: '876-554-7701',
    employeeNumber: 'EMP-001', hireDate: '2021-03-15',
    department: 'Dispensary', employmentType: 'Full-time',
    licenseNumber: 'PCJ-2021-0041', licenseExpiry: '2027-06-30',
    createdAt: '2021-03-15',
  },
  {
    id: 'USR02', name: 'Sandra Mitchell', role: 'Technician',
    email: 'smitchell@winchester.com.jm', status: 'Active', twoFa: false,
    lastLogin: '2026-05-11 08:02',
    firstName: 'Sandra', lastName: 'Mitchell', phone: '876-442-3310',
    employeeNumber: 'EMP-002', hireDate: '2022-08-01',
    department: 'Dispensary', employmentType: 'Full-time',
    licenseNumber: 'PCJ-TECH-0089', licenseExpiry: '2027-03-15',
    createdAt: '2022-08-01',
  },
  {
    id: 'USR03', name: 'Tanya Richards', role: 'Front Desk',
    email: 'trichards@winchester.com.jm', status: 'Active', twoFa: false,
    lastLogin: '2026-05-11 08:05',
    firstName: 'Tanya', lastName: 'Richards', phone: '876-776-8820',
    employeeNumber: 'EMP-003', hireDate: '2023-01-16',
    department: 'Front Office', employmentType: 'Full-time',
    supervisorId: 'USR04',
    createdAt: '2023-01-16',
  },
  {
    id: 'USR04', name: 'Michael Thompson', role: 'Manager',
    email: 'mthompson@winchester.com.jm', status: 'Active', twoFa: true,
    lastLogin: '2026-05-10 09:14',
    firstName: 'Michael', lastName: 'Thompson', phone: '876-931-0045',
    employeeNumber: 'EMP-004', hireDate: '2019-06-01',
    department: 'Management', employmentType: 'Full-time',
    createdAt: '2019-06-01',
  },
  {
    id: 'USR05', name: 'Admin Account', role: 'Admin',
    email: 'admin@winchester.com.jm', status: 'Active', twoFa: true,
    lastLogin: '2026-05-11 06:30',
    firstName: 'System', lastName: 'Admin',
    employeeNumber: 'EMP-005', hireDate: '2019-01-01',
    department: 'Administration', employmentType: 'Full-time',
    createdAt: '2019-01-01',
  },
  // ── 7 new staff ──────────────────────────────────────────────────────────────
  {
    id: 'USR06', name: 'Dr. Delroy Campbell', role: 'Pharmacist',
    email: 'dcampbell@winchester.com.jm', status: 'Inactive', twoFa: true,
    lastLogin: '2026-03-15 09:22',
    firstName: 'Delroy', lastName: 'Campbell', phone: '876-882-5512',
    employeeNumber: 'EMP-006', hireDate: '2020-11-01',
    department: 'Dispensary', employmentType: 'Full-time',
    licenseNumber: 'PCJ-2020-0033',
    licenseExpiry: '2026-06-27', // Expires in 47 days → compliance flag
    supervisorId: 'USR04',
    notes: 'On leave. License renewal pending. Compliance agent flag active.',
    createdAt: '2020-11-01',
  },
  {
    id: 'USR07', name: 'Nadine Foster', role: 'Technician',
    email: 'nfoster@winchester.com.jm', status: 'Active', twoFa: true,
    lastLogin: '2026-05-11 08:15',
    firstName: 'Nadine', lastName: 'Foster', phone: '876-501-7843',
    employeeNumber: 'EMP-007', hireDate: '2024-05-15',
    department: 'Dispensary', employmentType: 'Full-time',
    licenseNumber: 'PCJ-TECH-0112', licenseExpiry: '2028-05-15',
    supervisorId: 'USR01',
    createdAt: '2024-05-15',
  },
  {
    id: 'USR08', name: 'Winston Clarke', role: 'Technician',
    email: 'wclarke@winchester.com.jm', status: 'Active', twoFa: false,
    lastLogin: '2026-05-10 08:05',
    firstName: 'Winston', lastName: 'Clarke', phone: '876-643-2290',
    employeeNumber: 'EMP-008', hireDate: '2024-11-01',
    department: 'Dispensary', employmentType: 'Full-time',
    licenseNumber: 'PCJ-TECH-0124', licenseExpiry: '2026-11-01',
    supervisorId: 'USR01',
    createdAt: '2024-11-01',
  },
  {
    id: 'USR09', name: 'Patrice Morgan', role: 'Front Desk',
    email: 'pmorgan@winchester.com.jm', status: 'Active', twoFa: false,
    lastLogin: '2026-05-09 10:30',
    firstName: 'Patrice', lastName: 'Morgan', phone: '876-719-4401',
    employeeNumber: 'EMP-009', hireDate: '2025-02-01',
    department: 'Front Office', employmentType: 'Part-time',
    supervisorId: 'USR04',
    createdAt: '2025-02-01',
  },
  {
    id: 'USR10', name: 'Beverley Reid', role: 'Manager',
    email: 'breed@winchester.com.jm', status: 'Active', twoFa: true,
    lastLogin: '2026-05-10 07:45',
    firstName: 'Beverley', lastName: 'Reid', phone: '876-365-9921',
    employeeNumber: 'EMP-010', hireDate: '2023-09-01',
    department: 'Management', employmentType: 'Full-time',
    supervisorId: 'USR04',
    createdAt: '2023-09-01',
  },
  {
    id: 'USR11', name: 'Ingrid Bryan', role: 'Admin',
    email: 'ibryan@winchester.com.jm', status: 'Active', twoFa: true,
    lastLogin: '2026-05-11 06:55',
    firstName: 'Ingrid', lastName: 'Bryan', phone: '876-443-8870',
    employeeNumber: 'EMP-011', hireDate: '2020-06-15',
    department: 'Administration', employmentType: 'Full-time',
    createdAt: '2020-06-15',
  },
  {
    id: 'USR12', name: 'Clifton Henry', role: 'Admin',
    email: 'chenry@winchester.com.jm', status: 'Active', twoFa: true,
    lastLogin: '2026-05-08 08:10',
    firstName: 'Clifton', lastName: 'Henry', phone: '876-554-0033',
    employeeNumber: 'EMP-012', hireDate: '2021-09-01',
    department: 'Administration', employmentType: 'Full-time',
    createdAt: '2021-09-01',
  },
]

// ─── Active Sessions (stub — integration pending: Supabase auth) ──────────────

export const SAMPLE_SESSIONS: SessionEntry[] = [
  {
    id: 'SES001', userId: 'USR01', user: 'Dr. Kezia Powell', role: 'Pharmacist',
    device: 'Windows · Chrome 142', ip: '10.0.1.12', location: 'Kingston, JA',
    lastActivity: '2026-05-11 10:45', current: false,
  },
  {
    id: 'SES002', userId: 'USR03', user: 'Tanya Richards', role: 'Front Desk',
    device: 'Windows · Chrome 142', ip: '10.0.1.14', location: 'Kingston, JA',
    lastActivity: '2026-05-11 10:50', current: false,
  },
  {
    id: 'SES003', userId: 'USR05', user: 'Admin Account', role: 'Admin',
    device: 'macOS · Safari 18', ip: '10.0.1.10', location: 'Kingston, JA',
    lastActivity: '2026-05-11 11:05', current: true,
  },
  {
    id: 'SES004', userId: 'USR07', user: 'Nadine Foster', role: 'Technician',
    device: 'Windows · Edge 125', ip: '10.0.1.16', location: 'Kingston, JA',
    lastActivity: '2026-05-11 09:30', current: false,
  },
]

// ─── Shift Schedule (stub — scheduling module pending) ────────────────────────

export const SAMPLE_SHIFTS: ShiftEntry[] = [
  { id: 'SHF001', staffId: 'USR01', date: '2026-05-11', startTime: '08:00', endTime: '17:00', role: 'Pharmacist',  location: 'Dispensary'  },
  { id: 'SHF002', staffId: 'USR02', date: '2026-05-11', startTime: '08:00', endTime: '17:00', role: 'Technician',  location: 'Dispensary'  },
  { id: 'SHF003', staffId: 'USR03', date: '2026-05-11', startTime: '08:00', endTime: '16:00', role: 'Front Desk',  location: 'Front Desk'  },
  { id: 'SHF004', staffId: 'USR07', date: '2026-05-11', startTime: '08:00', endTime: '17:00', role: 'Technician',  location: 'Dispensary'  },
  { id: 'SHF005', staffId: 'USR09', date: '2026-05-11', startTime: '10:00', endTime: '15:00', role: 'Front Desk',  location: 'POS'         },
  { id: 'SHF006', staffId: 'USR01', date: '2026-05-12', startTime: '08:00', endTime: '17:00', role: 'Pharmacist',  location: 'Dispensary'  },
  { id: 'SHF007', staffId: 'USR02', date: '2026-05-12', startTime: '08:00', endTime: '17:00', role: 'Technician',  location: 'Dispensary'  },
  { id: 'SHF008', staffId: 'USR08', date: '2026-05-12', startTime: '09:00', endTime: '18:00', role: 'Technician',  location: 'Dispensary'  },
  { id: 'SHF009', staffId: 'USR03', date: '2026-05-12', startTime: '08:00', endTime: '16:00', role: 'Front Desk',  location: 'Front Desk'  },
  { id: 'SHF010', staffId: 'USR01', date: '2026-05-13', startTime: '08:00', endTime: '17:00', role: 'Pharmacist',  location: 'Dispensary'  },
  { id: 'SHF011', staffId: 'USR07', date: '2026-05-13', startTime: '08:00', endTime: '17:00', role: 'Technician',  location: 'Dispensary'  },
  { id: 'SHF012', staffId: 'USR09', date: '2026-05-13', startTime: '10:00', endTime: '15:00', role: 'Front Desk',  location: 'POS'         },
  { id: 'SHF013', staffId: 'USR02', date: '2026-05-14', startTime: '08:00', endTime: '17:00', role: 'Technician',  location: 'Dispensary'  },
  { id: 'SHF014', staffId: 'USR08', date: '2026-05-14', startTime: '09:00', endTime: '18:00', role: 'Technician',  location: 'Dispensary'  },
  { id: 'SHF015', staffId: 'USR03', date: '2026-05-14', startTime: '08:00', endTime: '16:00', role: 'Front Desk',  location: 'Front Desk'  },
  { id: 'SHF016', staffId: 'USR01', date: '2026-05-15', startTime: '08:00', endTime: '17:00', role: 'Pharmacist',  location: 'Dispensary'  },
  { id: 'SHF017', staffId: 'USR07', date: '2026-05-15', startTime: '08:00', endTime: '17:00', role: 'Technician',  location: 'Dispensary'  },
  { id: 'SHF018', staffId: 'USR09', date: '2026-05-15', startTime: '10:00', endTime: '15:00', role: 'Front Desk',  location: 'POS'         },
  { id: 'SHF019', staffId: 'USR02', date: '2026-05-16', startTime: '08:00', endTime: '17:00', role: 'Technician',  location: 'Dispensary'  },
  { id: 'SHF020', staffId: 'USR03', date: '2026-05-16', startTime: '08:00', endTime: '16:00', role: 'Front Desk',  location: 'Front Desk'  },
]

// ─── Receive Records ──────────────────────────────────────────────────────────

export const SAMPLE_RECEIVES: ReceiveRecord[] = [
  { id: 'RCV01', receiveNumber: 'RCV-2026-0112', date: '2026-05-07', supplier: 'PharmSource Ltd',       drug: 'Amoxicillin 500mg (250ct)',   din: '02177846', lot: 'LOT-25-3341', qtyReceived: 250, expiryDate: '2026-08-31', receivedBy: 'Sandra M.', invoiceRef: 'INV-2026-0441' },
  { id: 'RCV02', receiveNumber: 'RCV-2026-0111', date: '2026-05-02', supplier: 'PharmSource Ltd',       drug: 'Metformin 500mg (500ct)',     din: '02248993', lot: 'LOT-24-8823', qtyReceived: 500, expiryDate: '2027-06-30', receivedBy: 'Sandra M.', invoiceRef: 'INV-2026-0428' },
  { id: 'RCV03', receiveNumber: 'RCV-2026-0110', date: '2026-04-28', supplier: 'Caribbean Drug Supply', drug: 'Atorvastatin 20mg (100ct)',   din: '02230711', lot: 'LOT-24-7712', qtyReceived: 300, expiryDate: '2027-03-31', receivedBy: 'Sandra M.', invoiceRef: 'INV-2026-0409' },
  { id: 'RCV04', receiveNumber: 'RCV-2026-0109', date: '2026-04-22', supplier: 'Caribbean Drug Supply', drug: 'Hydrochlorothiazide 25mg',    din: '02245676', lot: 'LOT-24-6634', qtyReceived: 100, expiryDate: '2026-06-30', receivedBy: 'Sandra M.', invoiceRef: 'INV-2026-0392' },
  { id: 'RCV05', receiveNumber: 'RCV-2026-0108', date: '2026-04-15', supplier: 'Restricted Narcotics',  drug: 'Oxycodone 5mg (30ct)',        din: '02213494', lot: 'LOT-25-2201', qtyReceived: 60,  expiryDate: '2026-12-31', receivedBy: 'Dr. K. Powell', invoiceRef: 'MOH-AUTH-0041' },
]

// ─── Activity Log ─────────────────────────────────────────────────────────────

export const SAMPLE_ACTIVITY: ActivityEntry[] = [
  { id: 'A01',  timestamp: '2026-05-11 10:10', user: 'Dr. Powell',  role: 'Pharmacist', action: 'Drug lookup',        target: 'Metformin + Lisinopril interaction check' },
  { id: 'A02',  timestamp: '2026-05-11 10:03', user: 'Sandra M.',   role: 'Technician', action: 'Rx filled',          target: 'RX-2026-0842 · Sandra Clarke' },
  { id: 'A03',  timestamp: '2026-05-11 09:55', user: 'Dr. Powell',  role: 'Pharmacist', action: 'Schedule log',       target: 'LOG-2026-0043 · Oxycodone 5mg · Trevor Thompson' },
  { id: 'A04',  timestamp: '2026-05-11 09:45', user: 'Dr. Powell',  role: 'Pharmacist', action: 'Rx received',        target: 'RX-2026-0843 · Trevor Thompson (Schedule II)' },
  { id: 'A05',  timestamp: '2026-05-11 09:30', user: 'Dr. Powell',  role: 'Pharmacist', action: 'Rx verified',        target: 'RX-2026-0844 · Marcia Brown (NHF)' },
  { id: 'A06',  timestamp: '2026-05-11 09:02', user: 'Sandra M.',   role: 'Technician', action: 'Stock received',     target: 'Amoxicillin 500mg × 250 · LOT-25-3341 · RCV-2026-0112' },
  { id: 'A07',  timestamp: '2026-05-11 08:52', user: 'Tanya R.',    role: 'Front Desk', action: 'Sale completed',     target: 'POS-2026-0310 · JMD 3,200 · Card' },
  { id: 'A08',  timestamp: '2026-05-11 08:31', user: 'Dr. Powell',  role: 'Pharmacist', action: 'Rx verified',        target: 'RX-2026-0846 · Yvette Campbell (NHF)' },
  { id: 'A09',  timestamp: '2026-05-11 08:14', user: 'Tanya R.',    role: 'Front Desk', action: 'Patient checked in', target: 'Marcus Reid · P001' },
  { id: 'A10',  timestamp: '2026-05-11 08:05', user: 'Tanya R.',    role: 'Front Desk', action: 'User login',         target: 'Tanya Richards · Front Desk · 192.168.1.12' },
  { id: 'A11',  timestamp: '2026-05-10 16:30', user: 'Nadine F.',   role: 'Technician', action: 'Rx filled',          target: 'RX-2026-0836 · Marcus Reid' },
  { id: 'A12',  timestamp: '2026-05-10 15:45', user: 'Dr. Powell',  role: 'Pharmacist', action: 'Rx verified',        target: 'RX-2026-0835 · Yvette Campbell (NHF)' },
  { id: 'A13',  timestamp: '2026-05-10 14:20', user: 'Patrice M.',  role: 'Front Desk', action: 'Sale completed',     target: 'POS-2026-0307 · JMD 2,090 · Card' },
  { id: 'A14',  timestamp: '2026-05-09 10:45', user: 'Tanya R.',    role: 'Front Desk', action: 'Sale completed',     target: 'POS-2026-0315 · JMD 1,240 · Cash' },
  { id: 'A15',  timestamp: '2026-05-09 08:05', user: 'Admin',       role: 'Admin',      action: 'User login',         target: 'Admin Account · Admin · 10.0.1.10' },
]

// ─── Dashboard metrics ────────────────────────────────────────────────────────
// All values derived from sample arrays above. No hardcoded numbers.

export const DASHBOARD_METRICS = {
  rxQueue:        SAMPLE_PRESCRIPTIONS.filter(r => r.status !== 'Dispensed').length,
  stockAlerts:    SAMPLE_STOCK.filter(s => s.qtyOnHand <= s.reorderPoint).length,
  salesTodayJmd:  TODAY_TRANSACTIONS.reduce((s, t) => s + t.totalJmd, 0),
  patientsServed: SAMPLE_PATIENTS.length,
}
