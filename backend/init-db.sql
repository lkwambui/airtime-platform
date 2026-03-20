-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  rate DECIMAL(5,2) NOT NULL,
  in_stock BOOLEAN NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default settings
INSERT INTO settings (id, rate, in_stock)
VALUES (1, 0.85, true)
ON CONFLICT (id) DO NOTHING;

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  payer_phone VARCHAR(20) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  airtime_value DECIMAL(10,2) NOT NULL,
  rate_used DECIMAL(5,2) NOT NULL,
  status TEXT DEFAULT 'PENDING',
  mpesa_reference VARCHAR(100),
  checkout_request_id VARCHAR(100),
  assigned_device TEXT,
  balance_before NUMERIC,
  balance_after NUMERIC,
  retried_by TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  name TEXT,
  status TEXT,
  enabled BOOLEAN,
  battery INTEGER,
  charging BOOLEAN,
  last_seen TIMESTAMP
);
