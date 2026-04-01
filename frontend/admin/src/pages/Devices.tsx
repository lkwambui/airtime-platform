import { useEffect, useState } from "react";
import api from "../services/api";

type Device = {
  id: number;
  name: string;
  brand: string;
  battery: number;
  charging: boolean;
  status: string;
  last_seen: string;
};

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
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Devices</h2>

      <div className="grid gap-4">
        {devices.map((d) => (
          <div
            key={d.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{d.name}</p>
              <p className="text-sm text-gray-500">{d.brand}</p>
              <p className="text-sm">
                Last Seen: {new Date(d.last_seen).toLocaleString()}
              </p>
            </div>

            <div className="text-right space-y-1">
              <p>🔋 {d.battery}%</p>
              <p>{d.charging ? "⚡ Charging" : "🔌 Not Charging"}</p>
              <p
                className={
                  d.status === "ONLINE"
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                {d.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}