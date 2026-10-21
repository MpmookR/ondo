import { Button, IconButton } from '../Button';

export interface StepperProps {
  qty: number;
  itemName: string;
  onAdd: () => void;
  onRemove: () => void;
  addLabel?: string;
  max?: number;
  className?: string;
}

/** 0 → "Add"; 1 → bin + plus; 2+ → minus + plus. All targets 44px. */
export function Stepper({ qty, itemName, onAdd, onRemove, addLabel = 'Add', max = 9, className = '' }: StepperProps) {
  if (qty === 0) {
    return (
      <Button variant="accent" icon="plus" onClick={onAdd} className={className} aria-label={`${addLabel} ${itemName} to your box`}>
        {addLabel}
      </Button>
    );
  }
  return (
    <div
      className={`inline-flex items-center rounded-pill border border-border ${className}`}
      role="group"
      aria-label={`${itemName}, quantity ${qty}`}
    >
      <IconButton
        variant="ghost"
        icon={qty === 1 ? 'trash' : 'minus'}
        label={qty === 1 ? `Remove ${itemName}` : `Remove one ${itemName}`}
        onClick={onRemove}
      />
      <span className="min-w-24 text-center font-display text-label tabular-nums">{qty}</span>
      <IconButton variant="ghost" icon="plus" label={`Add one more ${itemName}`} onClick={onAdd} disabled={qty >= max} />
    </div>
  );
}
