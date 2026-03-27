import { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    profit: 0,
    successRate: 0,
  });

  const fetchData = async () => {
    const res = await api.get("/admin/transactions");
    const tx = res.data;

    // Group by day
    const grouped: Record<string, number> = {};

    let success = 0;

    tx.forEach((t: any) => {
      const day = new Date(t.created_at).toLocaleDateString();

      const profit = t.airtime_value - t.amount_paid;

      grouped[day] = (grouped[day] || 0) + profit;

      if (t.status === "SUCCESS") success++;
    });

    const chartData = Object.keys(grouped).map((d) => ({
      day: d,
      profit: grouped[d],
    }));

    setData(chartData);

    setStats({
      total: tx.length,
      profit: chartData.reduce((a, b) => a + b.profit, 0),
      successRate: tx.length ? Math.round((success / tx.length) * 100) : 0,
    });
  };

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl shadow">
          Total: {stats.total}
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          Profit: {stats.profit}
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          Success: {stats.successRate}%
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="mb-4 font-semibold">Daily Profit</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="profit" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}