import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type Props = {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function Card({
  title,
  description,
  action,
  children,
  className,
}: Props) {
  return (
    <section className={cn("rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6", className)}>
      {(title || description || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>}
            {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
