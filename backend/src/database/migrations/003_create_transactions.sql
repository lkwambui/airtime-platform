CREATE TABLE transactions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  payer_phone VARCHAR(20) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  airtime_value DECIMAL(10,2) NOT NULL,
  rate_used DECIMAL(5,2) NOT NULL,
  status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
  mpesa_reference VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
