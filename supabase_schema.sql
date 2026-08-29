-- ==============================================================================
-- OGAWORLD.IN JEWELLERY ERP - SUPABASE CLOUD POSTGRESQL SCHEMA
-- Execute this script in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Account Master Table
CREATE TABLE IF NOT EXISTS erp_accounts (
  account_code TEXT PRIMARY KEY,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  account_group TEXT NOT NULL,
  opening_balance NUMERIC DEFAULT 0,
  balance_type TEXT DEFAULT 'Dr',
  card_charges JSONB DEFAULT '{"card_charges": false, "for_customer_pct": 0, "for_us_pct": 0}'::jsonb,
  phone TEXT,
  area TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. New Order Booking Table
CREATE TABLE IF NOT EXISTS erp_orders (
  id TEXT PRIMARY KEY,
  order_no TEXT NOT NULL,
  header JSONB NOT NULL,
  items JSONB NOT NULL,
  payment JSONB NOT NULL,
  status TEXT DEFAULT 'Booked',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Wholesale Purchases Table
CREATE TABLE IF NOT EXISTS erp_purchases (
  id TEXT PRIMARY KEY,
  header JSONB NOT NULL,
  items JSONB NOT NULL,
  payment JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Refinery Inward Table
CREATE TABLE IF NOT EXISTS erp_refineries (
  id TEXT PRIMARY KEY,
  header JSONB NOT NULL,
  items JSONB NOT NULL,
  weight_summary JSONB NOT NULL,
  calculation JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Day Book Register Table
CREATE TABLE IF NOT EXISTS erp_daybook (
  id TEXT PRIMARY KEY,
  invoice_type TEXT NOT NULL,
  invoice_no TEXT NOT NULL,
  total_amt NUMERIC DEFAULT 0,
  urd_amt NUMERIC DEFAULT 0,
  net_amt NUMERIC DEFAULT 0,
  cash_received NUMERIC DEFAULT 0,
  cash_payment NUMERIC DEFAULT 0,
  bank_received NUMERIC DEFAULT 0,
  bank_payment NUMERIC DEFAULT 0,
  date TEXT NOT NULL,
  details TEXT,
  total_amt_without_disc NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Stock Inventory Table
CREATE TABLE IF NOT EXISTS erp_stock (
  id TEXT PRIMARY KEY,
  item_name TEXT NOT NULL,
  qty NUMERIC DEFAULT 1,
  gross_wt NUMERIC DEFAULT 0,
  net_wt NUMERIC DEFAULT 0,
  fine_wt NUMERIC DEFAULT 0,
  purity NUMERIC DEFAULT 91.6,
  category TEXT DEFAULT 'Gold',
  tag_no TEXT,
  is_urd BOOLEAN DEFAULT FALSE,
  rate_per_gm NUMERIC DEFAULT 0,
  total_value NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY & ALLOW PUBLIC READ/WRITE (WITH ANON KEY)
-- ==============================================================================

ALTER TABLE erp_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on erp_accounts" ON erp_accounts;
CREATE POLICY "Allow anon all on erp_accounts" ON erp_accounts FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE erp_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on erp_orders" ON erp_orders;
CREATE POLICY "Allow anon all on erp_orders" ON erp_orders FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE erp_purchases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on erp_purchases" ON erp_purchases FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE erp_refineries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on erp_refineries" ON erp_refineries FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE erp_daybook ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on erp_daybook" ON erp_daybook FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE erp_stock ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on erp_stock" ON erp_stock FOR ALL USING (true) WITH CHECK (true);
