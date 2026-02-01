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
