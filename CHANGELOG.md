# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

## [1.1.0] — 2026-04-01

Merged from `lk-airtime-development` → `main` (commit `b96c54c`).

### Added
- **Shared Device type** (`backend/src/types/device.ts`, `frontend/admin/src/types/device.ts`)  
  Single source of truth for the `Device` shape used by `GET /api/admin/devices`.  
  Includes `Job` and `JobStatus` types aligned with the `jobs` table schema.

- **Jobs & Devices DB migration** (`backend/src/database/migrations/008_add_jobs_and_devices.sql`)  
  Creates `jobs` (SERIAL id, phone, amount, status, timestamps) and  
  `devices` (SERIAL id, name, brand, battery, charging, status, last_seen) tables.

- **Input validation on device endpoints** (`device.controller.ts`)  
  `devicePing`: validates `deviceId` (required string), `battery` (0–100), `charging` (boolean).  
  `getJobs`: validates optional `device` query param type.  
  `submitResult`: validates `jobId` (positive integer) and `status` (PENDING/SUCCESS/FAILED).  
  Returns `400 Bad Request` for invalid input and `404 Not Found` if the job does not exist.

### Changed
- **`device.controller.ts` rewritten** to query the `jobs` table instead of `transactions`.  
  `getJobs` now does `SELECT … FROM jobs WHERE status='PENDING' LIMIT 1`.  
  `submitResult` now does `UPDATE jobs SET status=…, updated_at=NOW() WHERE id=…`.

- **`admin.controller.ts` — `getDevices`** now SELECTs all columns  
  (`id, name, brand, battery, charging, status, enabled, last_seen`) instead of the  
  previous partial query that omitted `brand` and `last_seen`.

- **`Devices.tsx`** (admin frontend)  
  Replaced hardcoded `fetch("http://localhost:4000/api/admin/devices")` with  
  the env-aware `api.get("/admin/devices")` client from `services/api.ts`.  
  Fixed TypeScript narrowing error (`Property 'devices' does not exist on type '{}'`).  
  Imported `Device` type from the new shared `types/device.ts` rather than an inline type.  
  Nullable fields (`brand`, `battery`, `charging`, `last_seen`) now render gracefully with `—` fallback.

- **Client app UI/UX** (`frontend/client/src/`)  
  Two-column grid layout on Home page, quick-amount buttons, toast-based feedback.  
  Theme locked to light-only — all `dark:` Tailwind classes removed.  
  `ThemeContext` hard-locked to `"light"`.

- **Admin app** — strict light background enforced in `index.css`.

### Fixed
- `verifyDevice` string interpolation bug (was single-quoted `'Bearer ${...}'`; fixed to template literal).
- `WhyBuy.tsx` JSX corruption from patch; component fully rewritten.
- EADDRINUSE on port 4000: conflicting Node process identified and removed.

---

## [1.0.0] — Initial release

- M-Pesa STK push payment flow
- Admin panel with transaction monitoring, retry, and settings management
- Client-facing airtime purchase form
- Device/APK integration endpoints (`/ping`, `/jobs`, `/result`)
- Render deployment blueprint (`render.yaml`)
