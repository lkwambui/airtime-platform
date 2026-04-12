import type { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../../utils/cn";

export type MetricCardSize = "primary" | "secondary" | "tertiary";
export type MetricCardAccent =
  | "brand"
  | "emerald"
  | "amber"
  | "rose"
  | "violet"
  | "sky";

export type MetricCardTrend = {
  value: number;   // percentage, e.g. 12.5 → "+12.5%"
  label?: string;  // override full text, e.g. "this week"
};

export type MetricCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
  subValue?: string;           // secondary line under main value
  trend?: MetricCardTrend;
  accentColor?: MetricCardAccent;
  size?: MetricCardSize;
  className?: string;
};

/* ─── Design tokens per accent ──────────────────────────────────────────── */
const accentTokens: Record<
  MetricCardAccent,
  { icon: string; border: string; gradient: string; value: string; glow: string; ring: string }
> = {
  brand: {
    icon: "bg-brand-100 text-brand-600",
    border: "border-brand-200",
    gradient: "from-brand-50/80 via-white to-white",
    value: "text-brand-700",
    glow: "bg-brand-400/10",
    ring: "ring-brand-200/60",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-600",
    border: "border-emerald-200",
    gradient: "from-emerald-50/80 via-white to-white",
    value: "text-emerald-700",
    glow: "bg-emerald-400/10",
    ring: "ring-emerald-200/60",
  },
  amber: {
    icon: "bg-amber-100 text-amber-600",
    border: "border-amber-200",
    gradient: "from-amber-50/80 via-white to-white",
    value: "text-amber-700",
    glow: "bg-amber-400/10",
    ring: "ring-amber-200/60",
  },
  rose: {
    icon: "bg-rose-100 text-rose-600",
    border: "border-rose-200",
    gradient: "from-rose-50/80 via-white to-white",
    value: "text-rose-700",
    glow: "bg-rose-400/10",
    ring: "ring-rose-200/60",
  },
  violet: {
    icon: "bg-violet-100 text-violet-600",
    border: "border-violet-200",
    gradient: "from-violet-50/80 via-white to-white",
    value: "text-violet-700",
    glow: "bg-violet-400/10",
    ring: "ring-violet-200/60",
  },
  sky: {
    icon: "bg-sky-100 text-sky-600",
    border: "border-sky-200",
    gradient: "from-sky-50/80 via-white to-white",
    value: "text-sky-700",
    glow: "bg-sky-400/10",
    ring: "ring-sky-200/60",
  },
};

/* ─── Size tokens ────────────────────────────────────────────────────────── */
const sizeTokens: Record<
  MetricCardSize,
  { pad: string; label: string; value: string; icon: string; iconInner: string }
> = {
  primary: {
    pad: "p-7",
    label: "text-xs font-bold uppercase tracking-[0.16em]",
    value: "text-4xl font-extrabold tracking-tight",
    icon: "h-14 w-14 rounded-2xl",
    iconInner: "h-7 w-7",
  },
  secondary: {
    pad: "p-6",
    label: "text-[11px] font-bold uppercase tracking-[0.15em]",
    value: "text-3xl font-bold tracking-tight",
    icon: "h-12 w-12 rounded-xl",
    iconInner: "h-6 w-6",
  },
  tertiary: {
    pad: "p-5",
    label: "text-[11px] font-bold uppercase tracking-[0.14em]",
    value: "text-2xl font-bold tracking-tight",
    icon: "h-10 w-10 rounded-xl",
    iconInner: "h-5 w-5",
  },
};

/* ─── Trend pill ─────────────────────────────────────────────────────────── */
function TrendPill({ trend }: { trend: MetricCardTrend }) {
  const isUp = trend.value > 0;
  const isFlat = trend.value === 0;
  const display = trend.label
    ? trend.label
    : `${trend.value > 0 ? "+" : ""}${trend.value.toFixed(1)}% vs avg`;

  return (
    <span
      className={cn(
        "mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none",
        isFlat
          ? "bg-slate-100 text-slate-500"
          : isUp
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-700",
      )}
    >
      {isFlat ? (
        <Minus className="h-3 w-3" />
      ) : isUp ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {display}
    </span>
  );
}

/* ─── MetricCard ─────────────────────────────────────────────────────────── */
export default function MetricCard({
  label,
  value,
  icon,
  subValue,
  trend,
  accentColor = "brand",
  size = "tertiary",
  className,
}: MetricCardProps) {
  const acc = accentTokens[accentColor];
  const sz = sizeTokens[size];

  const isPrimary = size === "primary";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-gradient-to-br shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-lg",
        isPrimary ? `ring-1 ${acc.ring} shadow-md` : "",
        acc.border,
        acc.gradient,
        sz.pad,
        className,
      )}
    >
      {/* Decorative glow blob — visible on primary */}
      {isPrimary && (
        <>
          <div
            className={cn(
              "pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl",
              acc.glow,
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute -bottom-8 -left-6 h-24 w-24 rounded-full blur-2xl opacity-60",
              acc.glow,
            )}
          />
        </>
      )}

      <div className="relative flex items-start justify-between gap-4">
        {/* ── Left: text ── */}
        <div className="min-w-0 flex-1">
          <p className={cn(sz.label, "text-slate-500")}>{label}</p>

          <p className={cn("mt-2", sz.value, acc.value)}>{value}</p>

          {subValue && (
            <p className="mt-1 text-sm font-medium text-slate-400">{subValue}</p>
          )}

          {trend && <TrendPill trend={trend} />}
        </div>

        {/* ── Right: icon ── */}
        <div
          className={cn(
            "flex shrink-0 items-center justify-center transition-all duration-300",
            "group-hover:scale-110 group-hover:rotate-3",
            sz.icon,
            acc.icon,
          )}
        >
          <span className={cn("block", sz.iconInner)}>{icon}</span>
        </div>
      </div>
    </div>
  );
}
