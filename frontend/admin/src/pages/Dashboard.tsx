import { useEffect, useState } from "react";
import api from "../services/api";
import MetricCard from "../components/ui/MetricCard";
import PageHeader from "../components/ui/PageHeader";
import ActivityChart from "../components/ui/ActivityChart";
import {
  Wallet,
  Zap,
  BarChart3,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

type Transaction = {
  created_at: string;
  airtime_value: number;
  amount_paid: number;
  status: string;
};

type ChartPoint = {
  day: string;
  mpesa: number;
  airtime: number;
};

type DashboardStats = {
  weekly: { mpesaReceived: number; airtimeSent: number };
  monthly: { mpesaReceived: number; airtimeSent: number };
  chart: ChartPoint[];
};

/** % change of current vs reference (weekly vs monthly/4 avg), clamped to 1dp */
function weeklyTrend(weekly: number, monthly: number): number {
  const avg = monthly / 4;
  if (!avg) return 0;
  return Math.round(((weekly - avg) / avg) * 1000) / 10; // 1 decimal
}

export default function Dashboard() {
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [dashStats, setDashStats] = useState<DashboardStats>({
    weekly: { mpesaReceived: 0, airtimeSent: 0 },
    monthly: { mpesaReceived: 0, airtimeSent: 0 },
    chart: [],
  });
  const [txStats, setTxStats] = useState({
    total: 0,
    profit: 0,
    successRate: 0,
  });

  const fetchData = async () => {
    const [txRes, statsRes] = await Promise.all([
      api.get("/admin/transactions"),
      api.get("/admin/dashboard-stats"),
    ]);

    const tx = txRes.data as Transaction[];
    const stats = statsRes.data as DashboardStats;

    let success = 0;
    let totalProfit = 0;
    tx.forEach((t) => {
      if (t.status === "SUCCESS") {
        success++;
        totalProfit += (t.airtime_value || 0) - (t.amount_paid || 0);
      }
    });

    setTxStats({
      total: tx.length,
      profit: totalProfit,
      successRate: tx.length ? Math.round((success / tx.length) * 100) : 0,
    });

    setDashStats(stats);
    setChart(stats.chart);
  };

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, 5000);
    return () => clearInterval(i);
  }, []);

  // Derived trend values
  const mpesaTrend = weeklyTrend(
    dashStats.weekly.mpesaReceived,
    dashStats.monthly.mpesaReceived,
  );
  const airtimeTrend = weeklyTrend(
    dashStats.weekly.airtimeSent,
    dashStats.monthly.airtimeSent,
  );
  const successAccent =
    txStats.successRate >= 80
      ? "emerald"
      : txStats.successRate >= 50
      ? "amber"
      : "rose";

  return (
    <div className="app-section">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Track M-Pesa received, airtime sent, and overall performance in real-time."
      />

      {/* ════════════════════════════════════════════════════════════════════
          Row 1 — Primary hierarchy
          [Total Profit ×2 col] [Total Transactions] [Success Rate]
      ════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* PRIMARY — Total Profit, spans 2 cols */}
        <MetricCard
          size="primary"
          label="Total Profit"
          value={`KES ${txStats.profit.toLocaleString()}`}
          subValue="Cumulative across all successful transactions"
          icon={<TrendingUp className="h-7 w-7" />}
          accentColor={txStats.profit >= 0 ? "emerald" : "rose"}
          trend={{
            value: txStats.profit >= 0 ? Math.min(txStats.successRate, 99) : -txStats.successRate,
            label: txStats.profit >= 0 ? "positive margin" : "negative margin",
          }}
          className="sm:col-span-2"
        />

        {/* SECONDARY — Total Transactions */}
        <MetricCard
          size="secondary"
          label="Total Transactions"
          value={txStats.total.toLocaleString()}
          icon={<BarChart3 className="h-6 w-6" />}
          accentColor="violet"
          trend={{ value: 0, label: "all time" }}
        />

        {/* SECONDARY — Success Rate */}
        <MetricCard
          size="secondary"
          label="Success Rate"
          value={`${txStats.successRate}%`}
          icon={<CheckCircle2 className="h-6 w-6" />}
          accentColor={successAccent}
          trend={{
            value: txStats.successRate - 75,
            label:
              txStats.successRate >= 80
                ? "on target"
                : txStats.successRate >= 50
                ? "below target"
                : "needs attention",
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          Row 2 — Tertiary hierarchy
          [M-Pesa Week] [M-Pesa Month] [Airtime Week] [Airtime Month]
      ════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          size="tertiary"
          label="M-Pesa Received · Week"
          value={`KES ${dashStats.weekly.mpesaReceived.toLocaleString()}`}
          icon={<Wallet className="h-5 w-5" />}
          accentColor="brand"
          trend={{ value: mpesaTrend, label: `${mpesaTrend > 0 ? "+" : ""}${mpesaTrend.toFixed(1)}% vs weekly avg` }}
        />
        <MetricCard
          size="tertiary"
          label="M-Pesa Received · Month"
          value={`KES ${dashStats.monthly.mpesaReceived.toLocaleString()}`}
          icon={<Wallet className="h-5 w-5" />}
          accentColor="sky"
          trend={{ value: 0, label: "this month" }}
        />
        <MetricCard
          size="tertiary"
          label="Airtime Sent · Week"
          value={`KES ${dashStats.weekly.airtimeSent.toLocaleString()}`}
          icon={<Zap className="h-5 w-5" />}
          accentColor="amber"
          trend={{ value: airtimeTrend, label: `${airtimeTrend > 0 ? "+" : ""}${airtimeTrend.toFixed(1)}% vs weekly avg` }}
        />
        <MetricCard
          size="tertiary"
          label="Airtime Sent · Month"
          value={`KES ${dashStats.monthly.airtimeSent.toLocaleString()}`}
          icon={<Zap className="h-5 w-5" />}
          accentColor="amber"
          trend={{ value: 0, label: "this month" }}
        />
      </div>

      {/* ── Activity Chart ── */}
      <ActivityChart
        data={chart}
        weekly={dashStats.weekly}
        monthly={dashStats.monthly}
      />
    </div>
  );
}
