import type { ButtonHTMLAttributes, ReactNode } from 'react';

const base = 'inline-flex items-center rounded-sm font-display whitespace-nowrap';

export interface ChipProps {
  children: ReactNode;
  /** `note` is a tasting note; `outline` a quiet label. */
  tone?: 'note' | 'outline';
  className?: string;
}

/** Static chip: tasting notes and labels. */
export function Chip({ children, tone = 'note', className = '' }: ChipProps) {
  const look = tone === 'note' ? 'bg-accent-subtle text-text-primary' : 'border border-border text-text-muted';
  return <span className={`${base} h-28 px-12 text-caption ${look} ${className}`}>{children}</span>;
}

export interface ToggleChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
}

/** Filter chip: 32px visual inside a 44px hit area. */
export function ToggleChip({ pressed, onPressedChange, children, className = '', ...rest }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={`group inline-flex h-44 items-center ${className}`}
      {...rest}
    >
      <span
        className={`${base} h-32 border px-16 text-label transition-colors duration-120 ease-brew ${
          pressed
            ? 'border-accent bg-accent text-on-accent'
            : 'border-border-strong text-text-primary group-hover:bg-bg-subtle'
        }`}
      >
        {children}
      </span>
    </button>
  );
}
