import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../Icon';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

/** Label above, 48px input, hint or error below. Errors use the danger colour and are announced. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, id, className = '', ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <label htmlFor={inputId} className="font-sans text-label">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`min-h-48 w-full rounded-sm border bg-bg-surface px-12 font-sans text-body tabular-nums placeholder:text-text-muted ${
          error ? 'border-danger' : 'border-border-strong'
        }`}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="font-sans text-footnote text-text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-4 font-sans text-footnote font-semibold text-danger">
          <Icon name="info" size={16} />
          {error}
        </p>
      )}
    </div>
  );
});

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children: ReactNode;
}

/** Native checkbox in the brand colour, 44px row. */
export function Checkbox({ children, className = '', ...rest }: CheckboxProps) {
  return (
    <label className={`flex min-h-44 cursor-pointer items-center gap-12 font-sans text-body ${className}`}>
      <input type="checkbox" className="size-20 shrink-0 accent-brand" {...rest} />
      <span>{children}</span>
    </label>
  );
}

/** A rule with a word in the middle: "or pay with card". */
export function Divider({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-center gap-12">
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
      {children && <span className="font-sans text-body-sm text-text-muted">{children}</span>}
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  );
}
