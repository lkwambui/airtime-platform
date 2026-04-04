import { useId, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

export default function Input({
  label,
  hint,
  error,
  className,
  containerClassName,
  id,
  ...props
}: Props) {
  const generatedId = useId();
  const inputId = id ?? props.name;
  const resolvedInputId = inputId ?? generatedId;
  const hintId = hint ? `${resolvedInputId}-hint` : undefined;
  const errorId = error ? `${resolvedInputId}-error` : undefined;

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label htmlFor={resolvedInputId} className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          {label}
        </label>
      )}
      <input
        id={resolvedInputId}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId ?? hintId}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100",
          error && "border-rose-300 focus:border-rose-400 focus:ring-rose-100",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-xs font-medium text-rose-600">{error}</p>
      ) : (
        hint && <p id={hintId} className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}
