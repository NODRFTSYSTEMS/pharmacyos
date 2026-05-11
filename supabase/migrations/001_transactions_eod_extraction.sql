-- PharmacyOS — Core Transaction, EOD Close-Out, and Document Extraction Schema
-- Migration: 001
-- Authorisation: ARE + Founder required before applying to production
-- SCA review: REQUIRED before any patient data or health records are written

-- ─── ENUMS ───────────────────────────────────────────────────────────────────

CREATE TYPE payment_method    AS ENUM ('CASH', 'CARD', 'LYNK', 'NHF', 'MIXED');
CREATE TYPE eod_status        AS ENUM ('OPEN', 'SUBMITTED', 'APPROVED', 'DISCREPANCY');
CREATE TYPE extraction_status AS ENUM ('PENDING', 'PROCESSING', 'REVIEW_REQUIRED', 'ACCEPTED', 'REJECTED');
CREATE TYPE document_type     AS ENUM ('PRESCRIPTION', 'INVOICE', 'OTHER');
CREATE TYPE shift_type        AS ENUM ('MORNING', 'AFTERNOON', 'FULL_DAY');


-- ─── RETAIL TRANSACTIONS ─────────────────────────────────────────────────────

CREATE TABLE retail_transactions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ref_number              TEXT UNIQUE NOT NULL,
    cashier_id              UUID,
    transaction_type        TEXT NOT NULL DEFAULT 'RETAIL',
    subtotal                NUMERIC(12,2) NOT NULL,
    tax                     NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount                NUMERIC(12,2) NOT NULL DEFAULT 0,
    total                   NUMERIC(12,2) NOT NULL,
    payment_method          payment_method NOT NULL,
    cash_tendered           NUMERIC(12,2),
    change_given            NUMERIC(12,2),
    loyalty_customer_id     UUID,
    loyalty_points_earned   INTEGER DEFAULT 0,
    loyalty_points_redeemed INTEGER DEFAULT 0,
    notes                   TEXT,
    voided                  BOOLEAN NOT NULL DEFAULT FALSE,
    voided_by               UUID,
    voided_at               TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE retail_transaction_items (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES retail_transactions(id) ON DELETE CASCADE,
    product_id     UUID,
    product_name   TEXT NOT NULL,
    barcode        TEXT,
    quantity       INTEGER NOT NULL CHECK (quantity > 0),
    unit_price     NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    line_total     NUMERIC(12,2) NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_retail_txn_created_at   ON retail_transactions(created_at);
CREATE INDEX idx_retail_txn_cashier      ON retail_transactions(cashier_id);
CREATE INDEX idx_retail_txn_items_txn_id ON retail_transaction_items(transaction_id);


-- ─── RX TRANSACTIONS ─────────────────────────────────────────────────────────
-- Records each prescription dispensing as a billable event.
-- Separate from the prescriptions table to support NHF claim tracking.

CREATE TABLE rx_transactions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ref_number          TEXT UNIQUE NOT NULL,
    prescription_id     UUID,
    patient_name        TEXT NOT NULL,
    drug_name           TEXT NOT NULL,
    quantity_dispensed  INTEGER NOT NULL CHECK (quantity_dispensed > 0),
    cashier_id          UUID,
    dispensed_by        UUID,
    subtotal            NUMERIC(12,2) NOT NULL DEFAULT 0,
    nhf_subsidy         NUMERIC(12,2) NOT NULL DEFAULT 0,
    patient_copay       NUMERIC(12,2) NOT NULL DEFAULT 0,
    payment_method      payment_method,
    voided              BOOLEAN NOT NULL DEFAULT FALSE,
    voided_by           UUID,
    voided_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rx_txn_created_at ON rx_transactions(created_at);
CREATE INDEX idx_rx_txn_patient    ON rx_transactions(patient_name);


-- ─── EOD CLOSE-OUTS ───────────────────────────────────────────────────────────

CREATE TABLE eod_closeouts (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    closeout_date               DATE NOT NULL,
    shift                       shift_type NOT NULL DEFAULT 'FULL_DAY',
    closed_by                   UUID NOT NULL,

    -- Opening float entered by cashier
    opening_float               NUMERIC(12,2) NOT NULL DEFAULT 0,

    -- System-calculated totals (auto-populated at submission)
    system_retail_cash          NUMERIC(12,2) NOT NULL DEFAULT 0,
    system_retail_card          NUMERIC(12,2) NOT NULL DEFAULT 0,
    system_retail_lynk          NUMERIC(12,2) NOT NULL DEFAULT 0,
    system_rx_cash              NUMERIC(12,2) NOT NULL DEFAULT 0,
    system_rx_card              NUMERIC(12,2) NOT NULL DEFAULT 0,
    system_rx_nhf               NUMERIC(12,2) NOT NULL DEFAULT 0,
    system_total                NUMERIC(12,2) NOT NULL DEFAULT 0,

    -- Cashier physically counted
    actual_cash_counted         NUMERIC(12,2),
    actual_card_total           NUMERIC(12,2),
    actual_lynk_total           NUMERIC(12,2),

    -- Variance: actual_cash_counted - (opening_float + system_cash)
    -- Negative = short; Positive = over
    cash_variance               NUMERIC(12,2),

    -- Counts
    retail_transaction_count    INTEGER NOT NULL DEFAULT 0,
    rx_transaction_count        INTEGER NOT NULL DEFAULT 0,
    void_count                  INTEGER NOT NULL DEFAULT 0,

    -- Workflow
    status                      eod_status NOT NULL DEFAULT 'SUBMITTED',
    manager_id                  UUID,
    manager_approved_at         TIMESTAMPTZ,
    notes                       TEXT,

    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (closeout_date, shift)
);

CREATE INDEX idx_eod_closeout_date   ON eod_closeouts(closeout_date);
CREATE INDEX idx_eod_closeout_status ON eod_closeouts(status);


-- ─── DOCUMENT EXTRACTION QUEUE ────────────────────────────────────────────────
-- Holds uploaded prescription images and supplier invoices awaiting AI extraction.
-- JDPA: Prescription images are sensitive health data. RLS enforced below.
-- AI extraction outputs MUST be reviewed by a pharmacist before use.

CREATE TABLE extraction_queue (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ref_number              TEXT UNIQUE NOT NULL,
    document_type           document_type NOT NULL DEFAULT 'PRESCRIPTION',
    source                  TEXT NOT NULL DEFAULT 'UPLOAD',   -- UPLOAD | SCANNER | PATIENT_PORTAL

    -- Storage
    storage_path            TEXT NOT NULL,
    file_name               TEXT NOT NULL,
    file_size               INTEGER,
    mime_type               TEXT,

    -- Extraction state
    extraction_status       extraction_status NOT NULL DEFAULT 'PENDING',
    raw_extraction          JSONB,         -- raw Claude API response
    extracted_fields        JSONB,         -- structured post-parse fields
    confidence_score        NUMERIC(3,2),  -- 0.00–1.00

    -- Prescription fields (populated after extraction)
    patient_name            TEXT,
    prescriber_name         TEXT,
    prescriber_reg          TEXT,
    drug_name               TEXT,
    dosage                  TEXT,
    quantity                TEXT,
    issue_date              DATE,

    -- Invoice fields
    supplier_name           TEXT,
    invoice_number          TEXT,
    invoice_date            DATE,
    invoice_total           NUMERIC(12,2),

    -- Review
    reviewed_by             UUID,
    reviewed_at             TIMESTAMPTZ,
    review_notes            TEXT,

    -- Links (populated after acceptance)
    linked_prescription_id  UUID,
    linked_purchase_id      UUID,

    uploaded_by             UUID,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_extraction_status     ON extraction_queue(extraction_status);
CREATE INDEX idx_extraction_created_at ON extraction_queue(created_at);
CREATE INDEX idx_extraction_type       ON extraction_queue(document_type);


-- ─── ROW-LEVEL SECURITY ───────────────────────────────────────────────────────
-- Enable RLS on all tables. Policies to be defined per role (pharmacist, cashier, manager, admin).
-- SCA (Omari) must review before production deployment.

ALTER TABLE retail_transactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE retail_transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rx_transactions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE eod_closeouts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE extraction_queue         ENABLE ROW LEVEL SECURITY;

-- Permissive placeholder policies — REPLACE with role-scoped policies before production
-- These allow authenticated users to perform CRUD during development only.
-- SCA MUST replace these with restrictive, role-based policies before pilot.

CREATE POLICY "dev_allow_authenticated_retail_txn"
    ON retail_transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "dev_allow_authenticated_retail_items"
    ON retail_transaction_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "dev_allow_authenticated_rx_txn"
    ON rx_transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "dev_allow_authenticated_eod"
    ON eod_closeouts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "dev_allow_authenticated_extraction"
    ON extraction_queue FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ─── HELPER FUNCTION: generate_ref_number ─────────────────────────────────────
-- Generates sequential reference numbers: PREFIX-YYYYMMDD-NNNNN
-- Usage: SELECT generate_ref_number('TXN') → 'TXN-20260511-00001'

CREATE OR REPLACE FUNCTION generate_ref_number(prefix TEXT)
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
    today_str TEXT := TO_CHAR(NOW(), 'YYYYMMDD');
    seq       INT;
BEGIN
    SELECT COALESCE(MAX(
        CASE
            WHEN ref_number LIKE prefix || '-' || today_str || '-%'
            THEN CAST(SPLIT_PART(ref_number, '-', 3) AS INT)
            ELSE 0
        END
    ), 0) + 1
    INTO seq
    FROM (
        SELECT ref_number FROM retail_transactions
        UNION ALL
        SELECT ref_number FROM rx_transactions
        UNION ALL
        SELECT ref_number FROM extraction_queue
    ) all_refs;

    RETURN prefix || '-' || today_str || '-' || LPAD(seq::TEXT, 5, '0');
END;
$$;
