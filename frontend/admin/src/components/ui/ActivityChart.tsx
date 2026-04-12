import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3, Download, TrendingUp, TrendingDown } from "lucide-react";
import Button from "./Button";
import { cn } from "../../utils/cn";

/* ─── Types ──────────────────────────────────────────────────────────────── */
export type ChartPoint = {
  day: string;
  mpesa: number;
  airtime: number;
};

type PeriodStats = {
  mpesaReceived: number;
  airtimeSent: number;
};

type ActivityChartProps = {
  data: ChartPoint[];
  weekly: PeriodStats;
  monthly: PeriodStats;
};

/* ─── Cast away strict recharts types (unchanged pattern) ─────────────────  */
const RC = ResponsiveContainer as any;
const AC = AreaChart as any;
const AreaC = Area as any;
const XC = XAxis as any;
const YC = YAxis as any;
const CG = CartesianGrid as any;
const TC = Tooltip as any;
const LC = Legend as any;

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const MPESA_COLOR = "#3b82f6";   // blue-500
const AIRTIME_COLOR = "#f59e0b"; // amber-500

function fmt(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}k`;
  return String(v);
}

function pctChange(a: number, b: number): number | null {
  if (!b) return null;
  return Math.round(((a - b) / b) * 10) / 0.1; // 1-decimal percent * 10 / 10
}

function fixedPct(a: number, b: number): number {
  if (!b) return 0;
  return Math.round(((a - b) / b) * 1000) / 10;
}

/* ─── Custom Tooltip ─────────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const mpesaEntry = payload.find((p: any) => p.dataKey === "mpesa");
  const airtimeEntry = payload.find((p: any) => p.dataKey === "airtime");
  const total = (mpesaEntry?.value ?? 0) + (airtimeEntry?.value ?? 0);

  return (
    <div className="min-w-[180px] rounded-2xl border border-slate-100 bg-white px-4 py-3.5 shadow-2xl ring-1 ring-black/5">
      {/* Day header */}
      <p className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span className="normal-case text-slate-500 font-semibold tracking-normal">
          KES {total.toLocaleString()}
        </span>
      </p>

      {/* M-Pesa row */}
      {mpesaEntry && (
        <div className="mb-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: MPESA_COLOR }}
            />
            <span className="text-sm text-slate-600">M-Pesa</span>
          </div>
          <span className="text-sm font-bold text-slate-900">
            KES {Number(mpesaEntry.value).toLocaleString()}
          </span>
        </div>
      )}

      {/* Airtime row */}
      {airtimeEntry && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: AIRTIME_COLOR }}
            />
            <span className="text-sm text-slate-600">Airtime</span>
          </div>
          <span className="text-sm font-bold text-slate-900">
            KES {Number(airtimeEntry.value).toLocaleString()}
          </span>
        </div>
      )}

      {/* Margin hint */}
      {mpesaEntry && airtimeEntry && (
        <div className="mt-3 border-t border-slate-100 pt-2.5 text-xs text-slate-400">
          Margin:{" "}
          <span className="font-semibold text-slate-600">
            KES{" "}
            {(Number(mpesaEntry.value) - Number(airtimeEntry.value)).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Custom Legend ──────────────────────────────────────────────────────── */
function ChartLegend() {
  return (
    <div className="flex justify-center gap-6 pt-3">
      {[
        { color: MPESA_COLOR, label: "M-Pesa Received" },
        { color: AIRTIME_COLOR, label: "Airtime Sent" },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          {label}
        </div>
      ))}
    </div>
  );
}

/* ─── Trend badge ────────────────────────────────────────────────────────── */
function TrendBadge({ value, suffix = "vs last week" }: { value: number | null; suffix?: string }) {
  if (value === null) return null;
  const isUp = value > 0;
  const isFlat = value === 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        isFlat
          ? "bg-slate-100 text-slate-500"
          : isUp
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-700",
      )}
    >
      {isFlat ? null : isUp ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {value > 0 ? "+" : ""}{value.toFixed(1)}% {suffix}
    </span>
  );
}

/* ─── ActivityChart ──────────────────────────────────────────────────────── */
export default function ActivityChart({ data, weekly, monthly }: ActivityChartProps) {
  const [period, setPeriod] = useState<"7d" | "30d">("7d");

  const periodStats = period === "7d" ? weekly : monthly;

  // Weekly trend = weekly vs monthly/4 average
  const weeklyAvgMpesa = monthly.mpesaReceived / 4;
  const weeklyAvgAirtime = monthly.airtimeSent / 4;
  const mpesaTrend = weeklyAvgMpesa
    ? fixedPct(weekly.mpesaReceived, weeklyAvgMpesa)
    : null;

  const hasData = data.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-slate-900">Activity Overview</h3>
            {mpesaTrend !== null && <TrendBadge value={mpesaTrend} />}
          </div>
          <p className="text-sm text-slate-500">
            {period === "7d" ? "Last 7 days" : "Last 30 days"} ·{" "}
            <span className="font-semibold text-slate-700">
              KES {periodStats.mpesaReceived.toLocaleString()} in
            </span>{" "}
            /{" "}
            <span className="font-semibold text-amber-600">
              KES {periodStats.airtimeSent.toLocaleString()} out
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period toggle */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            {(["7d", "30d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded-[10px] px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                  period === p
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {p === "7d" ? "7 Days" : "30 Days"}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* ── Chart body ── */}
      <div className={cn("w-full px-2 pb-2 pt-4", hasData ? "h-[320px]" : "h-[220px]")}>
        {!hasData ? (
          /* Empty state */
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <BarChart3 className="h-7 w-7 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">No activity yet</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Transaction data will appear here once available
              </p>
            </div>
          </div>
        ) : (
          <RC width="100%" height="100%">
            <defs>
              {/* M-Pesa gradient */}
              <linearGradient id="gradMpesa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={MPESA_COLOR} stopOpacity={0.18} />
                <stop offset="95%" stopColor={MPESA_COLOR} stopOpacity={0.01} />
              </linearGradient>
              {/* Airtime gradient */}
              <linearGradient id="gradAirtime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={AIRTIME_COLOR} stopOpacity={0.18} />
                <stop offset="95%" stopColor={AIRTIME_COLOR} stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CG
              strokeDasharray="4 4"
              stroke="#f1f5f9"
              vertical={false}
              strokeOpacity={0.9}
            />

            <XC
              dataKey="day"
              tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />

            <YC
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={fmt}
              width={42}
            />

            <TC
              content={<ChartTooltip />}
              cursor={{
                stroke: "#e2e8f0",
                strokeWidth: 1,
                strokeDasharray: "4 2",
              }}
            />

            <LC content={<ChartLegend />} />

            {/* M-Pesa area */}
            <AreaC
              type="monotone"
              dataKey="mpesa"
              stroke={MPESA_COLOR}
              strokeWidth={3}
              fill="url(#gradMpesa)"
              dot={{ r: 3.5, fill: MPESA_COLOR, strokeWidth: 0 }}
              activeDot={{
                r: 6,
                fill: MPESA_COLOR,
                stroke: "#fff",
                strokeWidth: 2,
                style: { filter: `drop-shadow(0 0 6px ${MPESA_COLOR}60)` },
              }}
            />

            {/* Airtime area */}
            <AreaC
              type="monotone"
              dataKey="airtime"
              stroke={AIRTIME_COLOR}
              strokeWidth={3}
              fill="url(#gradAirtime)"
              dot={{ r: 3.5, fill: AIRTIME_COLOR, strokeWidth: 0 }}
              activeDot={{
                r: 6,
                fill: AIRTIME_COLOR,
                stroke: "#fff",
                strokeWidth: 2,
                style: { filter: `drop-shadow(0 0 6px ${AIRTIME_COLOR}60)` },
              }}
            />
          </RC>
        )}
      </div>
    </div>
  );
}
