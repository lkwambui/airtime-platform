import { useEffect, useState } from "react";
import api from "../services/api";
import type { Device } from "../types/device";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);

  const fetchDevices = async () => {
    try {
      const { data } = await api.get("/admin/devices");

      if (Array.isArray(data)) {
        setDevices(data as Device[]);
        return;
      }

      if (data && typeof data === "object" && "devices" in data) {
        const payload = data as { devices: Device[] };
        setDevices(Array.isArray(payload.devices) ? payload.devices : []);
        return;
      }

      setDevices([]);
    } catch (err) {
      console.error("Failed to fetch devices", err);
    }
  };

  useEffect(() => {
    fetchDevices();

    const interval = setInterval(() => {
      fetchDevices(); // 🔁 auto refresh
    }, 5000); // every 5 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-section">
      <PageHeader
        eyebrow="Infrastructure"
        title="Devices"
        description="View connected devices and monitor battery and connection status."
      />

      <div className="app-grid md:grid-cols-2">
        {devices.map((d) => (
          <Card key={d.id} className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-900">{d.name}</p>
                {d.brand && <p className="text-sm text-slate-500">{d.brand}</p>}
              </div>
              <Badge variant={d.status === "ONLINE" ? "success" : "danger"}>{d.status}</Badge>
            </div>

            <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <p>
                <span className="font-medium text-slate-700">Battery:</span>{" "}
                {d.battery != null ? `${d.battery}%` : "—"}
              </p>
              <p>
                <span className="font-medium text-slate-700">Charging:</span>{" "}
                {d.charging == null ? "—" : d.charging ? "Yes" : "No"}
              </p>
              <p className="sm:col-span-2">
                <span className="font-medium text-slate-700">Last seen:</span>{" "}
                {d.last_seen ? new Date(d.last_seen).toLocaleString() : "—"}
              </p>
            </div>
          </Card>
        ))}

        {devices.length === 0 && (
          <Card className="md:col-span-2">
            <p className="py-6 text-center text-sm text-slate-500">No devices available.</p>
          </Card>
        )}
      </div>
    </div>
  );
}