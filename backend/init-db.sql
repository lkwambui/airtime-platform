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

-- Create transaction status enum
CREATE TYPE IF NOT EXISTS transaction_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  payer_phone VARCHAR(20) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  airtime_value DECIMAL(10,2) NOT NULL,
  rate_used DECIMAL(5,2) NOT NULL,
  status transaction_status DEFAULT 'PENDING',
  mpesa_reference VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
