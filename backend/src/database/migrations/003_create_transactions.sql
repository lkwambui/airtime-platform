CREATE TYPE transaction_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

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
