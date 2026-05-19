export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

// ── Enums ─────────────────────────────────────────────────────────────────────
export type TransactionType    = 'RETAIL' | 'RX' | 'REFUND' | 'VOID'
export type PaymentMethod      = 'CASH' | 'CARD' | 'LYNK' | 'NHF' | 'MIXED'
export type EodStatus          = 'OPEN' | 'SUBMITTED' | 'APPROVED' | 'DISCREPANCY'
export type ExtractionStatus   = 'PENDING' | 'PROCESSING' | 'REVIEW_REQUIRED' | 'ACCEPTED' | 'REJECTED'
export type DocumentType       = 'PRESCRIPTION' | 'INVOICE' | 'OTHER'
export type ShiftType          = 'MORNING' | 'AFTERNOON' | 'FULL_DAY'
export type PrescriptionStatus = 'RECEIVED' | 'VERIFYING' | 'READY' | 'DISPENSED' | 'CANCELLED'
export type StaffRole          = 'PHARMACIST' | 'CASHIER' | 'TECHNICIAN' | 'MANAGER' | 'ADMIN' | 'AUDITOR'
export type LoyaltyTier        = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM'
export type StockMovementType  = 'SALE' | 'RECEIVE' | 'ADJUST' | 'RETURN' | 'WRITE_OFF'
export type PoStatus           = 'DRAFT' | 'SUBMITTED' | 'RECEIVED' | 'CANCELLED'
export type TimecardStatus     = 'CLOCKED_IN' | 'CLOCKED_OUT' | 'FLAGGED' | 'APPROVED'
export type VisualReferenceStatus = 'VERIFIED' | 'DEMO_ONLY' | 'NEEDS_VERIFICATION' | 'RETIRED'
export type StaffAvatarSourceStatus = 'DEMO_ONLY' | 'VERIFIED' | 'NEEDS_REPLACEMENT'

// ── Row types ─────────────────────────────────────────────────────────────────

export interface RetailTransaction {
  id: string
  ref_number: string
  cashier_id: string | null
  transaction_type: TransactionType
  subtotal: number
  tax: number
  discount: number
  total: number
  payment_method: PaymentMethod
  cash_tendered: number | null
  change_given: number | null
  loyalty_customer_id: string | null
  loyalty_points_earned: number
  loyalty_points_redeemed: number
  notes: string | null
  voided: boolean
  voided_by: string | null
  voided_at: string | null
  void_reason: string | null
  void_requested_by: string | null
  void_requested_by_name: string | null
  void_requested_at: string | null
  void_denied_by: string | null
  void_denied_by_name: string | null
  void_denied_at: string | null
  void_denied_note: string | null
  created_at: string
  // OTP fields added in migration 041 — void_otp is intentionally absent (server-only)
  void_otp_expires_at: string | null
  void_otp_issued_by_name: string | null
}

export interface RetailTransactionItem {
  id: string
  transaction_id: string
  product_id: string | null
  product_name: string
  barcode: string | null
  quantity: number
  unit_price: number
  line_total: number
  created_at: string
}

export interface RxTransaction {
  id: string
  ref_number: string
  prescription_id: string | null
  patient_name: string
  drug_name: string
  quantity_dispensed: number
  cashier_id: string | null
  dispensed_by: string | null
  subtotal: number
  nhf_subsidy: number
  patient_copay: number
  payment_method: PaymentMethod | null
  voided: boolean
  voided_by: string | null
  voided_at: string | null
  created_at: string
}

export interface EodCloseout {
  id: string
  closeout_date: string
  shift: ShiftType
  closed_by: string
  opening_float: number
  system_retail_cash: number
  system_retail_card: number
  system_retail_lynk: number
  system_rx_cash: number
  system_rx_card: number
  system_rx_nhf: number
  system_total: number
  actual_cash_counted: number | null
  actual_card_total: number | null
  actual_lynk_total: number | null
  cash_variance: number | null
  retail_transaction_count: number
  rx_transaction_count: number
  void_count: number
  status: EodStatus
  manager_id: string | null
  manager_approved_at: string | null
  notes: string | null
  created_at: string
}

export interface ExtractionQueueEntry {
  id: string
  ref_number: string
  document_type: DocumentType
  source: string
  storage_path: string
  file_name: string
  file_size: number | null
  mime_type: string | null
  extraction_status: ExtractionStatus
  raw_extraction: Json | null
  extracted_fields: Json | null
  confidence_score: number | null
  patient_name: string | null
  prescriber_name: string | null
  prescriber_reg: string | null
  drug_name: string | null
  dosage: string | null
  quantity: string | null
  issue_date: string | null
  supplier_name: string | null
  invoice_number: string | null
  invoice_date: string | null
  invoice_total: number | null
  reviewed_by: string | null
  reviewed_at: string | null
  review_notes: string | null
  linked_prescription_id: string | null
  linked_purchase_id: string | null
  uploaded_by: string | null
  created_at: string
  updated_at: string
}

// ── Extended tables (migration 003) ───────────────────────────────────────────

export interface Product {
  id: string
  name: string
  barcode: string | null
  category: string | null
  unit_price: number
  cost_price: number | null
  stock_qty: number
  reorder_level: number
  supplier_id: string | null
  is_active: boolean
  notes: string | null
  expiry_date: string | null
  batch_number: string | null
  image_url: string | null
  image_alt: string | null
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  phone: string | null
  address: string | null
  allergies: string | null
  notes: string | null
  is_active: boolean
  // I-13: JDPA 2020 consent timestamp. null = not yet captured.
  jdpa_consent_at: string | null
  created_at: string
  updated_at: string
}

export interface Prescription {
  id: string
  ref_number: string
  patient_id: string | null
  patient_name: string
  prescriber_name: string
  prescriber_reg: string | null
  drug_name: string
  dosage: string | null
  quantity: number
  issue_date: string
  expiry_date: string | null
  status: PrescriptionStatus
  dispensed_by: string | null
  dispensed_at: string | null
  notes: string | null
  extraction_queue_id: string | null
  created_at: string
  updated_at: string
}

export interface MedicationVisualReference {
  id: string
  drug_key: string
  display_name: string
  generic_name: string | null
  strength: string | null
  dosage_form: string | null
  manufacturer: string | null
  image_url: string | null
  image_alt: string | null
  source_name: string | null
  source_url: string | null
  imprint: string | null
  color: string | null
  shape: string | null
  verification_status: VisualReferenceStatus
  verification_notes: string | null
  verified_by: string | null
  verified_by_name: string | null
  verified_at: string | null
  created_at: string
  updated_at: string
}

export interface StaffProfile {
  id: string
  email: string
  full_name: string
  role: StaffRole
  is_active: boolean
  avatar_url: string | null
  avatar_alt: string | null
  avatar_source_status: StaffAvatarSourceStatus
  created_at: string
  updated_at: string
}

export interface LoyaltyCustomer {
  id: string
  name: string
  phone: string | null
  email: string | null
  points_balance: number
  tier: LoyaltyTier
  is_active: boolean
  joined_date: string
  created_at: string
  updated_at: string
}

export interface AuditLogEntry {
  id: string
  actor_id: string | null
  actor_name: string | null
  action: string
  table_name: string | null
  record_id: string | null
  details: Json | null
  created_at: string
}

export interface DashboardUpdate {
  id: string
  title: string
  body: string
  category: 'NEWS' | 'MESSAGE' | 'UPDATE' | 'ALERT'
  audience_role: StaffRole | null
  priority: number
  is_active: boolean
  starts_at: string
  ends_at: string | null
  created_by: string | null
  created_by_name: string | null
  created_at: string
  updated_at: string
}

export interface AiRoleSetting {
  id: string
  role_key: string
  display_name: string
  description: string | null
  enabled: boolean
  provider: string
  model: string
  temperature: number
  max_tokens: number
  system_prompt: string
  escalation_role: StaffRole | null
  safety_notes: string | null
  last_reviewed_at: string | null
  last_reviewed_by: string | null
  created_at: string
  updated_at: string
}

export interface SystemErrorEvent {
  id: string
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  source: string
  message: string
  stack: string | null
  route: string | null
  user_agent: string | null
  actor_id: string | null
  actor_email: string | null
  metadata: Json
  resolved_at: string | null
  created_at: string
}

export interface DailyInconsistencyReport {
  id: string
  report_date: string
  scheduled_for: string
  generated_at: string
  status: 'GENERATED' | 'DELIVERED' | 'FAILED'
  total_findings: number
  findings: Json
  delivery_roles: StaffRole[]
  delivery_status: string
  created_at: string
}

// ── Migration 002 ─────────────────────────────────────────────────────────────

export interface RetailSupplier {
  id: string
  name: string
  contact_person: string | null
  phone: string | null
  email: string | null
  address: string | null
  payment_terms: string | null
  notes: string | null
  active: boolean
  created_at: string
  updated_at: string
}

// ── Pharmacy Settings ─────────────────────────────────────────────────────────

export interface PharmacySetting {
  key: string
  value: string
  updated_at: string
}

// ── Migration 016–019 interfaces ─────────────────────────────────────────────

export interface StockMovement {
  id: string
  product_id: string
  movement_type: StockMovementType
  quantity_delta: number
  quantity_after: number
  actor_id: string | null
  actor_name: string | null
  reference_id: string | null
  reference_type: string | null
  notes: string | null
  created_at: string
}

export interface PurchaseOrder {
  id: string
  ref_number: string
  supplier_id: string | null
  supplier_name: string
  status: PoStatus
  total_cost: number
  notes: string | null
  created_by: string | null
  created_by_name: string | null
  received_by: string | null
  received_by_name: string | null
  received_at: string | null
  created_at: string
  updated_at: string
}

export interface PurchaseOrderItem {
  id: string
  purchase_order_id: string
  product_id: string | null
  product_name: string
  quantity_ordered: number
  quantity_received: number
  unit_cost: number
  line_total: number
  expiry_date: string | null
  batch_number: string | null
  created_at: string
}

export interface Timecard {
  id: string
  staff_id: string | null
  staff_name: string
  staff_role: StaffRole
  clocked_in_at: string
  clocked_out_at: string | null
  total_minutes: number | null
  status: TimecardStatus
  ai_flag_overtime: boolean
  ai_flag_short_shift: boolean
  ai_flag_anomaly: boolean
  ai_flag_reason: string | null
  approved_by: string | null
  approved_by_name: string | null
  approved_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// ── Database type map ─────────────────────────────────────────────────────────
// Structured to satisfy @supabase/supabase-js GenericDatabase constraint.
// Each table requires Relationships: []; schema requires Views/Functions/Enums/CompositeTypes.

export type Database = {
  public: {
    Tables: {
      retail_transactions: {
        Row: RetailTransaction
        Insert: Omit<RetailTransaction, 'id' | 'created_at'>
        Update: Partial<Omit<RetailTransaction, 'id' | 'created_at'>>
        Relationships: []
      }
      retail_transaction_items: {
        Row: RetailTransactionItem
        Insert: Omit<RetailTransactionItem, 'id' | 'created_at'>
        Update: Partial<Omit<RetailTransactionItem, 'id' | 'created_at'>>
        Relationships: []
      }
      rx_transactions: {
        Row: RxTransaction
        Insert: Omit<RxTransaction, 'id' | 'created_at'>
        Update: Partial<Omit<RxTransaction, 'id' | 'created_at'>>
        Relationships: []
      }
      eod_closeouts: {
        Row: EodCloseout
        Insert: Omit<EodCloseout, 'id' | 'created_at'>
        Update: Partial<Omit<EodCloseout, 'id' | 'created_at'>>
        Relationships: []
      }
      extraction_queue: {
        Row: ExtractionQueueEntry
        Insert: Omit<ExtractionQueueEntry, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ExtractionQueueEntry, 'id' | 'created_at'>>
        Relationships: []
      }
      retail_suppliers: {
        Row: RetailSupplier
        Insert: Omit<RetailSupplier, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<RetailSupplier, 'id' | 'created_at'>>
        Relationships: []
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
        Relationships: []
      }
      patients: {
        Row: Patient
        Insert: Omit<Patient, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Patient, 'id' | 'created_at'>>
        Relationships: []
      }
      prescriptions: {
        Row: Prescription
        Insert: Omit<Prescription, 'id' | 'ref_number' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Prescription, 'id' | 'created_at'>>
        Relationships: []
      }
      medication_visual_references: {
        Row: MedicationVisualReference
        Insert: Omit<MedicationVisualReference, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MedicationVisualReference, 'id' | 'created_at'>>
        Relationships: []
      }
      staff_profiles: {
        Row: StaffProfile
        Insert: Omit<StaffProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StaffProfile, 'id' | 'created_at'>>
        Relationships: []
      }
      loyalty_customers: {
        Row: LoyaltyCustomer
        Insert: Omit<LoyaltyCustomer, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<LoyaltyCustomer, 'id' | 'created_at'>>
        Relationships: []
      }
      pharmacy_settings: {
        Row: PharmacySetting
        Insert: Omit<PharmacySetting, 'updated_at'>
        Update: Partial<PharmacySetting>
        Relationships: []
      }
      audit_log: {
        Row: AuditLogEntry
        Insert: Omit<AuditLogEntry, 'id' | 'created_at'>
        Update: Partial<Omit<AuditLogEntry, 'id' | 'created_at'>>
        Relationships: []
      }
      dashboard_updates: {
        Row: DashboardUpdate
        Insert: Omit<DashboardUpdate, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DashboardUpdate, 'id' | 'created_at'>>
        Relationships: []
      }
      ai_role_settings: {
        Row: AiRoleSetting
        Insert: Omit<AiRoleSetting, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AiRoleSetting, 'id' | 'created_at'>>
        Relationships: []
      }
      system_error_events: {
        Row: SystemErrorEvent
        Insert: Omit<SystemErrorEvent, 'id' | 'created_at'>
        Update: Partial<Omit<SystemErrorEvent, 'id' | 'created_at'>>
        Relationships: []
      }
      daily_inconsistency_reports: {
        Row: DailyInconsistencyReport
        Insert: Omit<DailyInconsistencyReport, 'id' | 'created_at'>
        Update: Partial<Omit<DailyInconsistencyReport, 'id' | 'created_at'>>
        Relationships: []
      }
      stock_movements: {
        Row: StockMovement
        Insert: Omit<StockMovement, 'id' | 'created_at'>
        Update: Partial<Omit<StockMovement, 'id' | 'created_at'>>
        Relationships: []
      }
      purchase_orders: {
        Row: PurchaseOrder
        Insert: Omit<PurchaseOrder, 'id' | 'ref_number' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PurchaseOrder, 'id' | 'created_at'>>
        Relationships: []
      }
      purchase_order_items: {
        Row: PurchaseOrderItem
        Insert: Omit<PurchaseOrderItem, 'id' | 'created_at'>
        Update: Partial<Omit<PurchaseOrderItem, 'id' | 'created_at'>>
        Relationships: []
      }
      timecards: {
        Row: Timecard
        Insert: Omit<Timecard, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Timecard, 'id' | 'created_at'>>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_daily_inconsistency_report: {
        Args: { p_report_date?: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
