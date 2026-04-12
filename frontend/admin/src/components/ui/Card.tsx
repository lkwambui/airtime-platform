import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type CardProps = {
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
}: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:border-slate-300 hover:shadow-md md:p-6",
        className,
      )}
    >
      {(title || description || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-slate-500">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
