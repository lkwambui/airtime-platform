-- Migration: Align production schema with current backend expectations (idempotent)

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'transactions'
      AND column_name = 'status'
      AND udt_name = 'transaction_status'
  ) THEN
    EXECUTE 'ALTER TABLE transactions ALTER COLUMN status TYPE TEXT USING status::text';
  END IF;
END $$;

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS checkout_request_id VARCHAR(100);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS assigned_device TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS balance_before NUMERIC;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS balance_after NUMERIC;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS retried_by TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS retried_at TIMESTAMP;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS completed_by TEXT;

CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE,
  brand TEXT,
  battery INTEGER,
  charging BOOLEAN,
  status TEXT,
  enabled BOOLEAN DEFAULT true,
  last_seen TIMESTAMP
);

ALTER TABLE devices ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE devices ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE devices ADD COLUMN IF NOT EXISTS battery INTEGER;
ALTER TABLE devices ADD COLUMN IF NOT EXISTS charging BOOLEAN;
ALTER TABLE devices ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE devices ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT true;
ALTER TABLE devices ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP;

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  phone TEXT,
  amount INTEGER,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);
