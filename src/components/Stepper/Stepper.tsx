import { MAX_QTY } from '@/lib/box';
import { Icon } from '../Icon';

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  /** Item name, for the button labels screen readers hear. */
  itemName: string;
  /** `default` in cards, `compact` in suggestion cards, `bar` in the item page's order bar. */
  size?: 'default' | 'compact' | 'bar';
}

/**
 * 0 → "Add to box"; 1 → bin + plus; 2+ → minus + plus.
 * Icons are 20–24px but every button has a 44px hit area.
 */
export function Stepper({ value, onChange, itemName, size = 'default' }: StepperProps) {
  if (value === 0) {
    return (
      <button
        type="button"
        onClick={() => onChange(1)}
        aria-label={`Add ${itemName} to your box`}
        className="relative h-32 rounded-pill border border-action px-16 font-sans text-label uppercase text-text-primary transition-colors duration-120 ease-brew before:absolute before:-inset-x-0 before:-inset-y-6 hover:bg-bg-subtle"
      >
        Add to box
      </button>
    );
  }

  const wrap =
    size === 'bar' ? 'gap-4 rounded-pill bg-bg-subtle px-4' : size === 'compact' ? 'gap-4' : 'gap-12 px-4';
  const hit =
    size === 'bar'
      ? 'grid size-44 place-items-center rounded-pill disabled:opacity-30'
      : 'relative grid size-24 place-items-center rounded-pill before:absolute before:-inset-10 disabled:opacity-30';
  const iconSize = size === 'compact' ? 20 : 24;

  return (
    <div className={`flex items-center ${wrap}`} role="group" aria-label={`${itemName} quantity`}>
      <button
        type="button"
        className={hit}
        onClick={() => onChange(value - 1)}
        aria-label={value === 1 ? `Remove ${itemName}` : `Remove one ${itemName}`}
      >
        <Icon name={value === 1 ? 'trash' : 'minus'} size={value === 1 ? 20 : iconSize} />
      </button>
      <output
        aria-live="polite"
        className={`text-center font-sans tabular-nums ${size === 'bar' ? 'w-20 text-title' : 'w-16 text-label'}`}
      >
        {value}
      </output>
      <button
        type="button"
        className={hit}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QTY}
        aria-label={`Add one more ${itemName}`}
      >
        <Icon name="plus" size={iconSize} />
      </button>
    </div>
  );
}
