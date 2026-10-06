CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  postcode TEXT NOT NULL,
  problem TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  ip_hash TEXT NOT NULL,
  email_id TEXT,
  notified TEXT NOT NULL DEFAULT 'pending',
  delivery_error TEXT
);
CREATE INDEX IF NOT EXISTS request_rate ON requests(ip_hash, created_at);
