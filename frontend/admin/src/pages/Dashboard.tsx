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
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

const ResponsiveContainerAny = ResponsiveContainer as any;
const LineChartAny = LineChart as any;
const XAxisAny = XAxis as any;
const YAxisAny = YAxis as any;
const LineAny = Line as any;
const TooltipAny = Tooltip as any;

type Transaction = {
  created_at: string;
  airtime_value: number;
  amount_paid: number;
  status: string;
};

type ChartPoint = {
  day: string;
  profit: number;
};

const statCards = [
  { key: "total", label: "Total Transactions", prefix: "" },
  { key: "profit", label: "Total Profit", prefix: "KES " },
  { key: "successRate", label: "Success Rate", prefix: "", suffix: "%" },
] as const;

export default function Dashboard() {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    profit: 0,
    successRate: 0,
  });

  const fetchData = async () => {
    const res = await api.get("/admin/transactions");
    const tx = res.data as Transaction[];

    const grouped: Record<string, number> = {};
    let success = 0;

    tx.forEach((t) => {
      const day = new Date(t.created_at).toLocaleDateString();
      const profit = t.airtime_value - t.amount_paid;
      grouped[day] = (grouped[day] || 0) + profit;
      if (t.status === "SUCCESS") success++;
    });

    const chartData = Object.entries(grouped)
      .map(([day, profit]) => ({ day, profit }))
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

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
    <div className="app-section">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Track transaction volume, profitability, and success performance in real-time."
      />

      <div className="app-grid sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.key} className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {card.label}
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              {card.prefix}
              {stats[card.key].toLocaleString()}
              {card.suffix ?? ""}
            </p>
          </Card>
        ))}
      </div>

      <Card title="Daily Profit" description="Profit trend grouped by transaction date.">
        <div className="h-[300px] w-full">
          <ResponsiveContainerAny width="100%" height="100%">
            <LineChartAny data={data}>
              <XAxisAny dataKey="day" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxisAny tick={{ fontSize: 12 }} stroke="#64748b" />
              <TooltipAny />
              <LineAny
                type="monotone"
                dataKey="profit"
                stroke="#4f6bff"
                strokeWidth={2}
                dot={false}
              />
            </LineChartAny>
          </ResponsiveContainerAny>
        </div>
      </Card>
    </div>
  );
}