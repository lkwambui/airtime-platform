/**
 * Shared Device type — mirrors the `devices` table row returned by GET /admin/devices.
 * Keep this in sync with the frontend/admin/src/types/device.ts counterpart.
 */
export interface Device {
  id: number;
  name: string;
  brand: string | null;
  battery: number | null;
  charging: boolean | null;
  status: string;
  enabled: boolean;
  last_seen: string | null;
}

export type JobStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface Job {
  id: number;
  phone: string;
  amount: number;
  status: JobStatus;
  created_at: string;
  updated_at: string | null;
}
