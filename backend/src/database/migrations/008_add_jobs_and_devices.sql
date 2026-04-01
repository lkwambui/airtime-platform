-- Migration: Add jobs and devices tables

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  phone TEXT,
  amount INTEGER,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE,
  brand TEXT,
  battery INTEGER,
  charging BOOLEAN,
  status TEXT,
  last_seen TIMESTAMP
);
