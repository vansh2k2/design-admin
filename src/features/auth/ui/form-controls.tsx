import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const CONTROL =
  "w-full rounded-md border border-dh-line bg-white px-3 text-[13px] text-dh-ink placeholder:text-dh-faint shadow-[var(--shadow-dh-card)] transition focus:border-dh-brand focus:outline-none focus:ring-2 focus:ring-dh-brand/15 disabled:bg-dh-surface disabled:text-dh-muted aria-[invalid=true]:border-red-400";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return <input ref={ref} className={cn(CONTROL, "h-9", className)} {...props} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, rows = 4, ...props },
  ref
) {
  return <textarea ref={ref} rows={rows} className={cn(CONTROL, "resize-y py-2 leading-relaxed", className)} {...props} />;
});

export interface SelectOption {
  label: string;
  value: string;
}

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { options: readonly SelectOption[]; placeholder?: string }
>(function Select({ className, options, placeholder, ...props }, ref) {
  return (
    <select ref={ref} className={cn(CONTROL, "h-9 pr-8", className)} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

/** Label + control + hint/error, laid out consistently across every form. */
export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  labelClassName,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className={cn("block text-xs font-semibold text-dh-ink", labelClassName)}>
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error ? <p className="text-[11px] text-red-600">{error}</p> : hint && <p className="text-[11px] text-dh-muted">{hint}</p>}
    </div>
  );
}
