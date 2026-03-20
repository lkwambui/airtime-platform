ALTER TABLE transactions
ALTER COLUMN status TYPE TEXT USING status::text;

ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS assigned_device TEXT,
ADD COLUMN IF NOT EXISTS balance_before NUMERIC,
ADD COLUMN IF NOT EXISTS balance_after NUMERIC,
ADD COLUMN IF NOT EXISTS retried_by TEXT;

CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  name TEXT,
  status TEXT,
  enabled BOOLEAN,
  battery INTEGER,
  charging BOOLEAN,
  last_seen TIMESTAMP
);
