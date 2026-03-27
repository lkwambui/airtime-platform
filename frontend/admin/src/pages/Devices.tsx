import { useEffect, useState } from "react";
import api from "../services/api";

export default function Devices() {
  const [devices, setDevices] = useState<any[]>([]);

  const fetchDevices = async () => {
    const res = await api.get("/admin/devices");
    setDevices(res.data);
  };

  useEffect(() => {
    fetchDevices();
    const i = setInterval(fetchDevices, 5000);
    return () => clearInterval(i);
  }, []);

  const toggle = async (id: number) => {
    await api.post('/admin/device/toggle/${id}');
    fetchDevices();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Devices</h2>

      {devices.map((d) => (
        <div key={d.id} className="p-4 bg-white rounded-xl shadow flex justify-between">
          <div>
            <p>{d.name}</p>
            <p className="text-sm text-gray-500">
              {d.status} | Battery: {d.battery}% {d.charging ? "⚡" : ""}
            </p>
          </div>

          <button onClick={() => toggle(d.id)}>
            {d.enabled ? "Disable" : "Enable"}
          </button>
        </div>
      ))}
    </div>
  );
}