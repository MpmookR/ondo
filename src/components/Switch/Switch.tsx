'use client';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** The id of the visible text that names the switch (its label). */
  labelledBy: string;
  /** Optional id of a line that says what the current setting means. */
  describedBy?: string;
  disabled?: boolean;
}

/**
 * An on/off choice that takes effect straight away ("Keep in every delivery"). Blue when on, the
 * same blue as every selected state. The tap target is 44px tall around a smaller track.
 */
export function Switch({ checked, onChange, labelledBy, describedBy, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group inline-flex min-h-44 shrink-0 items-center rounded-pill disabled:opacity-40"
    >
      <span
        aria-hidden="true"
        className={`flex h-20 w-36 items-center rounded-pill p-2 transition-colors duration-120 ease-brew ${
          checked ? 'bg-primary' : 'bg-border-strong'
        }`}
      >
        <span
          className={`size-16 rounded-pill bg-bg-surface shadow-card transition-transform duration-120 ease-brew motion-reduce:transition-none ${
            checked ? 'translate-x-16' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}
