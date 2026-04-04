import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type Variant = "brand" | "success" | "danger" | "neutral";

const variantClass: Record<Variant, string> = {
  brand: "bg-brand-100 text-brand-700",
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-rose-100 text-rose-700",
  neutral: "bg-slate-100 text-slate-700",
};

export default function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", variantClass[variant], className)}>
      {children}
    </span>
  );
}
