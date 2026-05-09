// Sample data — demo accuracy layer for Winchester Global Pharmacy
// Replace with live Supabase queries once G2 (Supabase provisioning) is closed

// ─── Types ────────────────────────────────────────────────────────────────────

export type RxStatus     = 'Received' | 'Verified' | 'Filled' | 'Dispensed'
export type JobStatus    = 'Processing' | 'Completed' | 'Failed' | 'Review Required'
export type UserRole     = 'Pharmacist' | 'Technician' | 'Front Desk' | 'Manager' | 'Admin'
export type PaymentMethod = 'Cash' | 'Card' | 'Lynk'

export interface Patient {
  id: string; name: string; dob: string; nhfNumber: string
  phone: string; allergies: string[]; lastVisit: string
}

export interface Prescription {
  id: string; rxNumber: string; patient: string; patientId: string
  drugs: string[]; prescriber: string; received: string
  status: RxStatus; isSchedule: boolean; isNhf: boolean
  /** Total refills authorised by prescriber (0 = no refills). */
  refills?: number
  /** Refills remaining. Decremented each time the prescription is filled. */
  refillsRemaining?: number
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
  id: string; jobNumber: string; type: 'Rx Scan' | 'Invoice Scan' | 'Drug Lookup'
  target: string; status: JobStatus; confidence?: number
  createdAt: string; completedAt?: string; flagged?: string
}

export interface StaffUser {
  id: string; name: string; role: UserRole; email: string
  status: 'Active' | 'Inactive'; twoFa: boolean; lastLogin: string
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

// ─── Patients ─────────────────────────────────────────────────────────────────

export const SAMPLE_PATIENTS: Patient[] = [
  { id: 'P001', name: 'Marcus Reid',     dob: '1965-03-12', nhfNumber: 'NHF-00123456', phone: '876-421-8830', allergies: ['Penicillin'],        lastVisit: '2026-05-06' },
  { id: 'P002', name: 'Yvette Campbell', dob: '1978-09-24', nhfNumber: 'NHF-00234567', phone: '876-931-4410', allergies: [],                     lastVisit: '2026-05-07' },
  { id: 'P003', name: 'Devon Williams',  dob: '1991-06-15', nhfNumber: 'NHF-00345678', phone: '876-754-2201', allergies: ['Sulfonamides'],        lastVisit: '2026-05-07' },
  { id: 'P004', name: 'Marcia Brown',    dob: '1955-11-30', nhfNumber: 'NHF-00456789', phone: '876-361-7715', allergies: ['Aspirin', 'NSAIDs'],  lastVisit: '2026-05-05' },
  { id: 'P005', name: 'Trevor Thompson', dob: '1983-04-07', nhfNumber: 'NHF-00567890', phone: '876-882-0049', allergies: [],                     lastVisit: '2026-05-07' },
  { id: 'P006', name: 'Sandra Clarke',   dob: '1970-08-19', nhfNumber: 'NHF-00678901', phone: '876-514-3382', allergies: ['Codeine'],            lastVisit: '2026-05-04' },
  { id: 'P007', name: 'Rohan Stewart',   dob: '1948-02-28', nhfNumber: 'NHF-00789012', phone: '876-299-6671', allergies: [],                     lastVisit: '2026-05-06' },
  { id: 'P008', name: 'Keisha Morgan',   dob: '1996-12-05', nhfNumber: 'NHF-00890123', phone: '876-643-1128', allergies: ['Latex'],              lastVisit: '2026-05-03' },
]

// ─── Prescriptions ────────────────────────────────────────────────────────────

export const SAMPLE_PRESCRIPTIONS: Prescription[] = [
  { id: 'RX001', rxNumber: 'RX-2026-0847', patient: 'Marcus Reid',     patientId: 'P001', drugs: ['Metformin 500mg × 60'],                        prescriber: 'Dr. K. Patterson', received: '2026-05-07 08:14', status: 'Received',  isSchedule: false, isNhf: false, refills: 3, refillsRemaining: 3 },
  { id: 'RX002', rxNumber: 'RX-2026-0846', patient: 'Yvette Campbell', patientId: 'P002', drugs: ['Amlodipine 10mg × 30'],                         prescriber: 'Dr. J. Brown',     received: '2026-05-07 08:31', status: 'Verified',  isSchedule: false, isNhf: true,  refills: 5, refillsRemaining: 5 },
  { id: 'RX003', rxNumber: 'RX-2026-0845', patient: 'Devon Williams',  patientId: 'P003', drugs: ['Amoxicillin 500mg × 21'],                        prescriber: 'Dr. M. Singh',     received: '2026-05-07 09:02', status: 'Filled',    isSchedule: false, isNhf: false, refills: 0, refillsRemaining: 0 },
  { id: 'RX004', rxNumber: 'RX-2026-0844', patient: 'Marcia Brown',    patientId: 'P004', drugs: ['Atorvastatin 20mg × 30', 'Lisinopril 10mg × 30'], prescriber: 'Dr. K. Patterson', received: '2026-05-07 09:18', status: 'Verified',  isSchedule: false, isNhf: true,  refills: 11, refillsRemaining: 11 },
  { id: 'RX005', rxNumber: 'RX-2026-0843', patient: 'Trevor Thompson', patientId: 'P005', drugs: ['Oxycodone 5mg × 30'],                            prescriber: 'Dr. R. Lewis',     received: '2026-05-07 09:45', status: 'Received',  isSchedule: true,  isNhf: false, refills: 0, refillsRemaining: 0 },
  { id: 'RX006', rxNumber: 'RX-2026-0842', patient: 'Sandra Clarke',   patientId: 'P006', drugs: ['Omeprazole 20mg × 30'],                          prescriber: 'Dr. J. Brown',     received: '2026-05-07 10:03', status: 'Filled',    isSchedule: false, isNhf: false, refills: 2, refillsRemaining: 1 },
  { id: 'RX007', rxNumber: 'RX-2026-0841', patient: 'Rohan Stewart',   patientId: 'P007', drugs: ['Metformin 500mg × 90'],                          prescriber: 'Dr. K. Patterson', received: '2026-05-06 14:22', status: 'Dispensed', isSchedule: false, isNhf: true,  refills: 3, refillsRemaining: 2 },
  { id: 'RX008', rxNumber: 'RX-2026-0840', patient: 'Keisha Morgan',   patientId: 'P008', drugs: ['Hydrochlorothiazide 25mg × 30'],                  prescriber: 'Dr. M. Singh',     received: '2026-05-06 15:47', status: 'Dispensed', isSchedule: false, isNhf: false, refills: 5, refillsRemaining: 4 },
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

export const SAMPLE_TRANSACTIONS: POSTransaction[] = [
  { id: 'TX001', txNumber: 'POS-2026-0315', time: '10:45', cashier: 'Tanya R.', items: 2, totalJmd: 1240, method: 'Cash',  patient: 'Marcus Reid' },
  { id: 'TX002', txNumber: 'POS-2026-0314', time: '10:22', cashier: 'Tanya R.', items: 1, totalJmd: 280,  method: 'Card'  },
  { id: 'TX003', txNumber: 'POS-2026-0313', time: '09:58', cashier: 'Tanya R.', items: 1, totalJmd: 12000,method: 'Lynk', patient: 'Rohan Stewart' },
  { id: 'TX004', txNumber: 'POS-2026-0312', time: '09:31', cashier: 'Tanya R.', items: 2, totalJmd: 1070, method: 'Cash'  },
  { id: 'TX005', txNumber: 'POS-2026-0311', time: '09:15', cashier: 'Tanya R.', items: 2, totalJmd: 630,  method: 'Cash'  },
  { id: 'TX006', txNumber: 'POS-2026-0310', time: '08:52', cashier: 'Tanya R.', items: 3, totalJmd: 3200, method: 'Card', patient: 'Yvette Campbell' },
  { id: 'TX007', txNumber: 'POS-2026-0309', time: '08:34', cashier: 'Tanya R.', items: 1, totalJmd: 890,  method: 'Cash'  },
  { id: 'TX008', txNumber: 'POS-2026-0308', time: '08:11', cashier: 'Tanya R.', items: 1, totalJmd: 450,  method: 'Lynk'  },
]

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

// ─── AI Jobs ─────────────────────────────────────────────────────────────────

export const SAMPLE_AI_JOBS: AIJob[] = [
  { id: 'JOB001', jobNumber: 'JOB-2026-0021', type: 'Rx Scan',      target: 'RX-2026-0847 · Marcus Reid',            status: 'Completed',       confidence: 98, createdAt: '2026-05-07 08:14', completedAt: '2026-05-07 08:14' },
  { id: 'JOB002', jobNumber: 'JOB-2026-0020', type: 'Rx Scan',      target: 'RX-2026-0843 · Trevor Thompson',        status: 'Review Required', confidence: 71, createdAt: '2026-05-07 09:45', completedAt: '2026-05-07 09:46', flagged: 'Low confidence on dosage field — manual review required' },
  { id: 'JOB003', jobNumber: 'JOB-2026-0019', type: 'Invoice Scan', target: 'PharmSource INV-2026-0441',             status: 'Completed',       confidence: 99, createdAt: '2026-05-07 09:02', completedAt: '2026-05-07 09:02' },
  { id: 'JOB004', jobNumber: 'JOB-2026-0018', type: 'Rx Scan',      target: 'RX-2026-0846 · Yvette Campbell',       status: 'Completed',       confidence: 94, createdAt: '2026-05-07 08:31', completedAt: '2026-05-07 08:31' },
  { id: 'JOB005', jobNumber: 'JOB-2026-0017', type: 'Drug Lookup',  target: 'Metformin + Lisinopril interaction',    status: 'Completed',       createdAt: '2026-05-07 10:10', completedAt: '2026-05-07 10:10' },
  { id: 'JOB006', jobNumber: 'JOB-2026-0016', type: 'Invoice Scan', target: 'Caribbean Drug INV-2026-0318',         status: 'Failed',          createdAt: '2026-05-06 15:30', completedAt: '2026-05-06 15:31', flagged: 'Image quality too low — rescan required' },
]

// ─── Staff Users ──────────────────────────────────────────────────────────────

export const SAMPLE_STAFF: StaffUser[] = [
  { id: 'USR01', name: 'Dr. Kezia Powell',  role: 'Pharmacist',  email: 'kpowell@winchester.com.jm',   status: 'Active',   twoFa: true,  lastLogin: '2026-05-07 07:58' },
  { id: 'USR02', name: 'Sandra Mitchell',   role: 'Technician',  email: 'smitchell@winchester.com.jm', status: 'Active',   twoFa: false, lastLogin: '2026-05-07 08:02' },
  { id: 'USR03', name: 'Tanya Richards',    role: 'Front Desk',  email: 'trichards@winchester.com.jm', status: 'Active',   twoFa: false, lastLogin: '2026-05-07 08:05' },
  { id: 'USR04', name: 'Michael Thompson',  role: 'Manager',     email: 'mthompson@winchester.com.jm', status: 'Active',   twoFa: true,  lastLogin: '2026-05-06 09:14' },
  { id: 'USR05', name: 'Admin Account',     role: 'Admin',       email: 'admin@winchester.com.jm',     status: 'Active',   twoFa: true,  lastLogin: '2026-05-07 06:30' },
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
  { id: 'A01',  timestamp: '2026-05-07 10:10', user: 'Dr. Powell',  role: 'Pharmacist', action: 'Drug lookup',    target: 'Metformin + Lisinopril interaction check' },
  { id: 'A02',  timestamp: '2026-05-07 10:03', user: 'Sandra M.',   role: 'Technician', action: 'Rx filled',      target: 'RX-2026-0842 · Sandra Clarke' },
  { id: 'A03',  timestamp: '2026-05-07 09:55', user: 'Dr. Powell',  role: 'Pharmacist', action: 'Schedule log',   target: 'LOG-2026-0043 · Oxycodone 5mg · Trevor Thompson' },
  { id: 'A04',  timestamp: '2026-05-07 09:45', user: 'Dr. Powell',  role: 'Pharmacist', action: 'Rx received',    target: 'RX-2026-0843 · Trevor Thompson (Schedule II)' },
  { id: 'A05',  timestamp: '2026-05-07 09:30', user: 'Dr. Powell',  role: 'Pharmacist', action: 'Rx verified',    target: 'RX-2026-0844 · Marcia Brown (NHF)' },
  { id: 'A06',  timestamp: '2026-05-07 09:02', user: 'Sandra M.',   role: 'Technician', action: 'Stock received', target: 'Amoxicillin 500mg × 250 · LOT-25-3341 · RCV-2026-0112' },
  { id: 'A07',  timestamp: '2026-05-07 08:52', user: 'Tanya R.',    role: 'Front Desk', action: 'Sale completed', target: 'POS-2026-0310 · JMD 3,200 · Card' },
  { id: 'A08',  timestamp: '2026-05-07 08:31', user: 'Dr. Powell',  role: 'Pharmacist', action: 'Rx verified',    target: 'RX-2026-0846 · Yvette Campbell (NHF)' },
  { id: 'A09',  timestamp: '2026-05-07 08:14', user: 'Tanya R.',    role: 'Front Desk', action: 'Patient checked in', target: 'Marcus Reid · P001' },
  { id: 'A10',  timestamp: '2026-05-07 08:05', user: 'Tanya R.',    role: 'Front Desk', action: 'User login',     target: 'Tanya Richards · Front Desk · 192.168.1.12' },
]

// ─── Dashboard metrics ────────────────────────────────────────────────────────

export const DASHBOARD_METRICS = {
  rxQueue:         SAMPLE_PRESCRIPTIONS.filter(r => r.status !== 'Dispensed').length,
  stockAlerts:     SAMPLE_STOCK.filter(s => s.qtyOnHand <= s.reorderPoint).length,
  salesTodayJmd:   SAMPLE_TRANSACTIONS.reduce((s, t) => s + t.totalJmd, 0),
  patientsServed:  28,
}
