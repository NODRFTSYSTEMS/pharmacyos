-- ============================================================
-- Migration 003 — Extended Schema
-- Products · Patients · Prescriptions · Loyalty ·
-- Staff · Settings · Audit Log
-- ============================================================

-- ── Enums ─────────────────────────────────────────────────────

CREATE TYPE prescription_status AS ENUM (
  'RECEIVED', 'VERIFYING', 'READY', 'DISPENSED', 'CANCELLED'
);

CREATE TYPE staff_role AS ENUM (
  'PHARMACIST', 'CASHIER', 'TECHNICIAN', 'MANAGER', 'ADMIN'
);

CREATE TYPE loyalty_tier AS ENUM (
  'STANDARD', 'SILVER', 'GOLD', 'PLATINUM'
);

-- ── Products ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text          NOT NULL,
  barcode       text          UNIQUE,
  category      text,
  unit_price    numeric(12,2) NOT NULL DEFAULT 0,
  cost_price    numeric(12,2),
  stock_qty     integer       NOT NULL DEFAULT 0,
  reorder_level integer       NOT NULL DEFAULT 5,
  supplier_id   uuid          REFERENCES retail_suppliers(id) ON DELETE SET NULL,
  is_active     boolean       NOT NULL DEFAULT true,
  notes         text,
  created_at    timestamptz   NOT NULL DEFAULT now(),
  updated_at    timestamptz   NOT NULL DEFAULT now()
);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE INDEX IF NOT EXISTS idx_products_barcode    ON products (barcode);
CREATE INDEX IF NOT EXISTS idx_products_is_active  ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_category   ON products (category);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ⚠️  DEVELOPMENT PLACEHOLDER — replace before controlled pilot (SCA review required)
CREATE POLICY "dev_products_all" ON products FOR ALL USING (true) WITH CHECK (true);

-- ── Patients ─────────────────────────────────────────────────
-- ⚠️  JDPA 2020 NOTICE — patient records are sensitive personal data.
--     RLS must be reviewed by SCA + LCA before any pilot use.

CREATE TABLE IF NOT EXISTS patients (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name     text        NOT NULL,
  last_name      text        NOT NULL,
  date_of_birth  date,
  phone          text,
  address        text,
  allergies      text,
  notes          text,
  is_active      boolean     NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE INDEX IF NOT EXISTS idx_patients_last_name ON patients (lower(last_name));
CREATE INDEX IF NOT EXISTS idx_patients_phone     ON patients (phone);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
-- ⚠️  DEVELOPMENT PLACEHOLDER — patient data requires SCA + LCA sign-off before pilot
CREATE POLICY "dev_patients_all" ON patients FOR ALL USING (true) WITH CHECK (true);

-- ── Prescriptions ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS prescriptions (
  id                  uuid                 PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_number          text                 UNIQUE NOT NULL DEFAULT generate_ref_number('RX'),
  patient_id          uuid                 REFERENCES patients(id) ON DELETE SET NULL,
  patient_name        text                 NOT NULL,
  prescriber_name     text                 NOT NULL,
  prescriber_reg      text,
  drug_name           text                 NOT NULL,
  dosage              text,
  quantity            integer              NOT NULL,
  issue_date          date                 NOT NULL,
  expiry_date         date,
  status              prescription_status  NOT NULL DEFAULT 'RECEIVED',
  dispensed_by        text,
  dispensed_at        timestamptz,
  notes               text,
  extraction_queue_id uuid                 REFERENCES extraction_queue(id) ON DELETE SET NULL,
  created_at          timestamptz          NOT NULL DEFAULT now(),
  updated_at          timestamptz          NOT NULL DEFAULT now()
);

CREATE TRIGGER prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE INDEX IF NOT EXISTS idx_prescriptions_status    ON prescriptions (status);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient   ON prescriptions (patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_created   ON prescriptions (created_at DESC);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
-- ⚠️  DEVELOPMENT PLACEHOLDER — prescription data requires SCA review before pilot
CREATE POLICY "dev_prescriptions_all" ON prescriptions FOR ALL USING (true) WITH CHECK (true);

-- ── Staff Profiles ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS staff_profiles (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text        UNIQUE NOT NULL,
  full_name  text        NOT NULL,
  role       staff_role  NOT NULL DEFAULT 'CASHIER',
  is_active  boolean     NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER staff_profiles_updated_at
  BEFORE UPDATE ON staff_profiles
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
-- ⚠️  DEVELOPMENT PLACEHOLDER — requires SCA review before pilot
CREATE POLICY "dev_staff_all" ON staff_profiles FOR ALL USING (true) WITH CHECK (true);

-- ── Pharmacy Settings ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pharmacy_settings (
  key        text        PRIMARY KEY,
  value      text        NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO pharmacy_settings (key, value) VALUES
  ('pharmacy_name',     'Winchester Global Pharmacy'),
  ('pharmacy_address',  ''),
  ('nhf_provider_no',   ''),
  ('default_float',     '5000'),
  ('gct_rate',          '15')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE pharmacy_settings ENABLE ROW LEVEL SECURITY;
-- ⚠️  DEVELOPMENT PLACEHOLDER
CREATE POLICY "dev_settings_all" ON pharmacy_settings FOR ALL USING (true) WITH CHECK (true);

-- ── Loyalty Customers ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS loyalty_customers (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text         NOT NULL,
  phone          text         UNIQUE,
  email          text,
  points_balance integer      NOT NULL DEFAULT 0,
  tier           loyalty_tier NOT NULL DEFAULT 'STANDARD',
  is_active      boolean      NOT NULL DEFAULT true,
  joined_date    date         NOT NULL DEFAULT CURRENT_DATE,
  created_at     timestamptz  NOT NULL DEFAULT now(),
  updated_at     timestamptz  NOT NULL DEFAULT now()
);

CREATE TRIGGER loyalty_customers_updated_at
  BEFORE UPDATE ON loyalty_customers
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE INDEX IF NOT EXISTS idx_loyalty_phone ON loyalty_customers (phone);
CREATE INDEX IF NOT EXISTS idx_loyalty_tier  ON loyalty_customers (tier);

ALTER TABLE loyalty_customers ENABLE ROW LEVEL SECURITY;
-- ⚠️  DEVELOPMENT PLACEHOLDER
CREATE POLICY "dev_loyalty_all" ON loyalty_customers FOR ALL USING (true) WITH CHECK (true);

-- ── Audit Log ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_log (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    text,
  actor_name  text,
  action      text        NOT NULL,
  table_name  text,
  record_id   text,
  details     jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created  ON audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor    ON audit_log (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table    ON audit_log (table_name);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
-- ⚠️  DEVELOPMENT PLACEHOLDER
CREATE POLICY "dev_audit_all" ON audit_log FOR ALL USING (true) WITH CHECK (true);
