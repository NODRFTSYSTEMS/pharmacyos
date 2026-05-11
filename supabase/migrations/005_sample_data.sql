-- ============================================================
-- Migration 005 — Sample Data (Development / Demo Only)
-- Suppliers · Products · Patients · Prescriptions
-- ⚠️  Remove or gate behind an env flag before production
-- ============================================================

-- ── Suppliers ─────────────────────────────────────────────────

INSERT INTO retail_suppliers (id, name, contact_person, phone, email, payment_terms, active)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'PharmaCo Distributors Ltd',
    'Marcia Thompson',
    '876-922-1100',
    'orders@pharmacodist.com',
    'Net 30',
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'Caribbean Medical Supplies',
    'Devon Reid',
    '876-960-4477',
    'sales@caribmedical.com',
    'Net 14',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- ── Products ──────────────────────────────────────────────────
-- Prices in JMD. stock_qty set to realistic levels for demo.

INSERT INTO products (name, barcode, category, unit_price, cost_price, stock_qty, reorder_level, supplier_id, is_active)
VALUES

  -- OTC Medications
  ('Paracetamol 500mg Tabs ×24',         '5000112300001', 'OTC Medications', 350.00, 210.00, 80, 15, 'a1000000-0000-0000-0000-000000000001', true),
  ('Ibuprofen 400mg Tabs ×24',           '5000112300002', 'OTC Medications', 480.00, 290.00, 60, 12, 'a1000000-0000-0000-0000-000000000001', true),
  ('Cetirizine 10mg Tabs ×10',           '5000112300003', 'OTC Medications', 680.00, 420.00, 45, 10, 'a1000000-0000-0000-0000-000000000001', true),
  ('Loratadine 10mg Tabs ×10',           '5000112300004', 'OTC Medications', 620.00, 380.00, 40, 10, 'a1000000-0000-0000-0000-000000000001', true),
  ('Omeprazole 20mg Caps ×14',           '5000112300005', 'OTC Medications', 950.00, 580.00, 55, 10, 'a1000000-0000-0000-0000-000000000001', true),
  ('Antacid Chewable Tabs ×30',          '5000112300006', 'OTC Medications', 380.00, 220.00, 70, 15, 'a1000000-0000-0000-0000-000000000001', true),
  ('Cough Syrup DM 100ml',               '5000112300007', 'OTC Medications', 720.00, 450.00, 35, 8,  'a1000000-0000-0000-0000-000000000001', true),
  ('Nasal Decongestant Spray 15ml',      '5000112300008', 'OTC Medications', 850.00, 520.00, 28, 8,  'a1000000-0000-0000-0000-000000000001', true),
  ('Antifungal Cream 30g',               '5000112300009', 'OTC Medications', 780.00, 480.00, 30, 8,  'a1000000-0000-0000-0000-000000000001', true),
  ('Calamine Lotion 100ml',              '5000112300010', 'OTC Medications', 420.00, 250.00, 40, 10, 'a1000000-0000-0000-0000-000000000001', true),

  -- Vitamins & Supplements
  ('Vitamin C 1000mg ×30',              '5000112300011', 'Vitamins & Supplements', 980.00,  580.00, 55, 12, 'a1000000-0000-0000-0000-000000000002', true),
  ('Multivitamin Adults ×30',           '5000112300012', 'Vitamins & Supplements', 1250.00, 750.00, 45, 10, 'a1000000-0000-0000-0000-000000000002', true),
  ('Vitamin D3 1000IU ×60',             '5000112300013', 'Vitamins & Supplements', 1100.00, 660.00, 40, 10, 'a1000000-0000-0000-0000-000000000002', true),
  ('Calcium + D3 Tabs ×60',             '5000112300014', 'Vitamins & Supplements', 1480.00, 890.00, 35, 8,  'a1000000-0000-0000-0000-000000000002', true),
  ('Iron 65mg Tabs ×30',                '5000112300015', 'Vitamins & Supplements',  720.00, 430.00, 50, 12, 'a1000000-0000-0000-0000-000000000002', true),
  ('Zinc 50mg Tabs ×30',                '5000112300016', 'Vitamins & Supplements',  780.00, 470.00, 40, 10, 'a1000000-0000-0000-0000-000000000002', true),
  ('Fish Oil 1000mg ×30',               '5000112300017', 'Vitamins & Supplements', 1150.00, 690.00, 30, 8,  'a1000000-0000-0000-0000-000000000002', true),

  -- Personal Care
  ('Hand Sanitizer Gel 250ml',          '5000112300018', 'Personal Care', 420.00, 250.00, 60, 15, 'a1000000-0000-0000-0000-000000000002', true),
  ('Antiseptic Cream 50g',              '5000112300019', 'Personal Care', 480.00, 290.00, 35, 10, 'a1000000-0000-0000-0000-000000000002', true),
  ('Medicated Shampoo 200ml',           '5000112300020', 'Personal Care', 880.00, 530.00, 25, 8,  'a1000000-0000-0000-0000-000000000002', true),
  ('Petroleum Jelly 100g',              '5000112300021', 'Personal Care', 290.00, 170.00, 50, 12, 'a1000000-0000-0000-0000-000000000002', true),
  ('Bandages Assorted ×20',             '5000112300022', 'Personal Care', 450.00, 270.00, 45, 10, 'a1000000-0000-0000-0000-000000000002', true),
  ('Cotton Balls ×100',                 '5000112300023', 'Personal Care', 300.00, 180.00, 60, 15, 'a1000000-0000-0000-0000-000000000002', true),
  ('Surgical Tape 1" Roll',             '5000112300024', 'Personal Care', 370.00, 220.00, 40, 10, 'a1000000-0000-0000-0000-000000000002', true),

  -- Diabetic Supplies
  ('Blood Glucose Test Strips ×50',     '5000112300025', 'Diabetic Supplies', 2900.00, 1750.00, 20, 5, 'a1000000-0000-0000-0000-000000000001', true),
  ('Lancets ×100',                      '5000112300026', 'Diabetic Supplies',  680.00,  410.00, 25, 6, 'a1000000-0000-0000-0000-000000000001', true),
  ('Insulin Syringes U-100 ×10',        '5000112300027', 'Diabetic Supplies',  520.00,  310.00, 30, 8, 'a1000000-0000-0000-0000-000000000001', true),

  -- Baby Care
  ('Infant Paracetamol Syrup 60ml',     '5000112300028', 'Baby Care', 520.00, 310.00, 35, 8, 'a1000000-0000-0000-0000-000000000002', true),
  ('Baby Powder 200g',                  '5000112300029', 'Baby Care', 580.00, 350.00, 30, 8, 'a1000000-0000-0000-0000-000000000002', true),
  ('Gripe Water 150ml',                 '5000112300030', 'Baby Care', 420.00, 250.00, 35, 8, 'a1000000-0000-0000-0000-000000000002', true)

ON CONFLICT (barcode) DO NOTHING;

-- ── Sample Patients ────────────────────────────────────────────
-- ⚠️  Fictional names — JDPA 2020 applies to real patient records

INSERT INTO patients (id, first_name, last_name, date_of_birth, phone, allergies, is_active)
VALUES
  ('b2000000-0000-0000-0000-000000000001', 'Marcus',  'Reid',     '1978-04-12', '876-555-0101', 'Penicillin',       true),
  ('b2000000-0000-0000-0000-000000000002', 'Simone',  'Brown',    '1992-09-25', '876-555-0102', NULL,               true),
  ('b2000000-0000-0000-0000-000000000003', 'Devon',   'Campbell', '1965-01-30', '876-555-0103', 'Sulfa drugs',      true),
  ('b2000000-0000-0000-0000-000000000004', 'Natasha', 'Williams', '1988-07-14', '876-555-0104', NULL,               true),
  ('b2000000-0000-0000-0000-000000000005', 'Omar',    'Grant',    '2001-11-03', '876-555-0105', 'Aspirin, NSAIDs',  true)
ON CONFLICT (id) DO NOTHING;

-- ── Sample Prescriptions ───────────────────────────────────────
-- Mixed statuses to populate the queue for testing

INSERT INTO prescriptions (
  ref_number, patient_id, patient_name, prescriber_name, prescriber_reg,
  drug_name, dosage, quantity, issue_date, expiry_date, status
)
VALUES
  ('RX-000001', 'b2000000-0000-0000-0000-000000000001', 'Marcus Reid',     'Dr. Yvonne Clarke',  'MC-04421', 'Amlodipine 5mg',    '1 tab daily',     30, CURRENT_DATE - 2, CURRENT_DATE + 28, 'RECEIVED'),
  ('RX-000002', 'b2000000-0000-0000-0000-000000000002', 'Simone Brown',    'Dr. Paul Henriques', 'MC-07732', 'Metformin 500mg',   '1 tab twice daily',60, CURRENT_DATE - 1, CURRENT_DATE + 29, 'VERIFYING'),
  ('RX-000003', 'b2000000-0000-0000-0000-000000000003', 'Devon Campbell',  'Dr. Yvonne Clarke',  'MC-04421', 'Atorvastatin 20mg', '1 tab nightly',   30, CURRENT_DATE,     CURRENT_DATE + 30, 'READY'),
  ('RX-000004', 'b2000000-0000-0000-0000-000000000004', 'Natasha Williams','Dr. Sandra Levy',    'MC-11205', 'Amoxicillin 500mg', '1 cap three daily',21, CURRENT_DATE - 3, CURRENT_DATE + 27, 'DISPENSED'),
  ('RX-000005', 'b2000000-0000-0000-0000-000000000005', 'Omar Grant',      'Dr. Paul Henriques', 'MC-07732', 'Salbutamol Inhaler','2 puffs as needed', 1, CURRENT_DATE - 1, CURRENT_DATE + 29, 'RECEIVED'),
  ('RX-000006', 'b2000000-0000-0000-0000-000000000001', 'Marcus Reid',     'Dr. Sandra Levy',    'MC-11205', 'Lisinopril 10mg',   '1 tab daily',     30, CURRENT_DATE - 5, CURRENT_DATE + 25, 'CANCELLED')
ON CONFLICT (ref_number) DO NOTHING;
