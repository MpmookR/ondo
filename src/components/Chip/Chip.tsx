import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ChipProps {
  children: ReactNode;
  /** `note` tasting note (accent tint), `outline` quiet label, `solid` accent fill (on photos). */
  tone?: 'note' | 'outline' | 'solid';
  className?: string;
}

const tones = {
  note: 'bg-accent-subtle text-text-primary',
  outline: 'border border-border-strong text-text-muted',
  solid: 'bg-accent text-on-accent',
} as const;

/** Small label: tasting notes, sizes, flags. */
export function Chip({ children, tone = 'note', className = '' }: ChipProps) {
  return (
    <span
      className={`inline-flex h-20 shrink-0 items-center whitespace-nowrap rounded-sm px-8 font-sans text-footnote font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Label + value pill, e.g. "Size 250g". */
export function Pill({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <span className={`inline-flex h-20 shrink-0 items-center gap-4 rounded-sm bg-bg-subtle px-8 font-sans text-footnote ${className}`}>
      <span className="font-regular text-text-muted">{label}</span>
      <span className="font-bold">{value}</span>
    </span>
  );
}

export interface ToggleChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
}

/** On/off chip: 32px visual inside a 44px hit area. */
export function ToggleChip({ pressed, onPressedChange, children, className = '', ...rest }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={`group inline-flex h-44 items-center disabled:pointer-events-none disabled:opacity-40 ${className}`}
      {...rest}
    >
      <span
        className={`inline-flex h-32 items-center gap-4 rounded-pill border px-16 font-sans text-label transition-colors duration-120 ease-brew ${
          pressed ? 'border-brand bg-brand text-on-brand' : 'border-border-strong text-text-primary group-hover:bg-bg-subtle'
        }`}
      >
        {children}
      </span>
    </button>
  );
}
