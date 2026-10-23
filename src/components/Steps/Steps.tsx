import { Icon } from '../Icon';

export interface StepsProps {
  steps: string[];
  /** Index of the current step (0-based). Earlier steps show as done. */
  current: number;
  label?: string;
}

/** Checkout progress: "1. Sign up · 2. Delivery · 3. Payment". Not clickable. */
export function Steps({ steps, current, label = 'Checkout progress' }: StepsProps) {
  return (
    <nav aria-label={label} className="border-b border-border">
      <ol className="mx-auto flex max-w-content">
        {steps.map((step, i) => {
          const isCurrent = i === current;
          const done = i < current;
          return (
            <li
              key={step}
              aria-current={isCurrent ? 'step' : undefined}
              className={`flex min-h-44 flex-1 items-center justify-center gap-4 border-b-3 px-4 font-sans text-label ${
                isCurrent ? 'border-brand font-bold' : 'border-transparent font-medium text-text-muted'
              }`}
            >
              {done && <Icon name="check" size={16} />}
              <span>
                {i + 1}. {step}
              </span>
              {done && <span className="sr-only">, done</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
