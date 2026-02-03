ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS checkout_request_id VARCHAR(100);
