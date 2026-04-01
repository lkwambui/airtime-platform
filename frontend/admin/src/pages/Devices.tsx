import { useEffect, useState } from "react";

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
      const res = await fetch("http://localhost:4000/api/admin/devices");
      const data = await res.json();
      setDevices(data);
    } catch (err) {
      console.error("Failed to fetch devices", err);
    }
  };

  useEffect(() => {
    fetchDevices();
    const i = setInterval(fetchDevices, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Devices</h2>

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
  );
}