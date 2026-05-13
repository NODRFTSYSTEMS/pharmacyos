export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

// ── Enums ─────────────────────────────────────────────────────────────────────
export type TransactionType    = 'RETAIL' | 'RX' | 'REFUND' | 'VOID'
export type PaymentMethod      = 'CASH' | 'CARD' | 'LYNK' | 'NHF' | 'MIXED'
export type EodStatus          = 'OPEN' | 'SUBMITTED' | 'APPROVED' | 'DISCREPANCY'
export type ExtractionStatus   = 'PENDING' | 'PROCESSING' | 'REVIEW_REQUIRED' | 'ACCEPTED' | 'REJECTED'
export type DocumentType       = 'PRESCRIPTION' | 'INVOICE' | 'OTHER'
export type ShiftType          = 'MORNING' | 'AFTERNOON' | 'FULL_DAY'
export type PrescriptionStatus = 'RECEIVED' | 'VERIFYING' | 'READY' | 'DISPENSED' | 'CANCELLED'
export type StaffRole          = 'PHARMACIST' | 'CASHIER' | 'TECHNICIAN' | 'MANAGER' | 'ADMIN'
export type LoyaltyTier        = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM'

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
  created_at: string
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

export interface StaffProfile {
  id: string
  email: string
  full_name: string
  role: StaffRole
  is_active: boolean
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
