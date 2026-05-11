-- ============================================================
-- Migration 002 — Retail Suppliers
-- ============================================================

CREATE TABLE IF NOT EXISTS retail_suppliers (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text        NOT NULL,
  contact_person   text,
  phone            text,
  email            text,
  address          text,
  payment_terms    text        CHECK (payment_terms IN ('COD','Net 7','Net 14','Net 30','Net 60','Prepaid','On Account')),
  notes            text,
  active           boolean     NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Keep updated_at current automatically
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER retail_suppliers_updated_at
  BEFORE UPDATE ON retail_suppliers
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE INDEX IF NOT EXISTS idx_retail_suppliers_active ON retail_suppliers (active);
CREATE INDEX IF NOT EXISTS idx_retail_suppliers_name      ON retail_suppliers (lower(name));

-- RLS
ALTER TABLE retail_suppliers ENABLE ROW LEVEL SECURITY;

-- ⚠️  DEVELOPMENT PLACEHOLDER — replace with role-scoped policies before controlled pilot (SCA review required)
CREATE POLICY "dev_suppliers_all"
  ON retail_suppliers FOR ALL
  USING (true)
  WITH CHECK (true);
