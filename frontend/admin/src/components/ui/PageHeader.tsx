import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {eyebrow && (
          <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
            {eyebrow}
          </span>
        )}
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
