/**
 * Shared Device type — mirrors backend/src/types/device.ts.
 * Reflects the row shape returned by GET /api/admin/devices.
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
