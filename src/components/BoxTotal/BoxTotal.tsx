import type { Totals } from '@/lib/box';
import { formatPrice } from '@/lib/format';
import { Button } from '../Button';

export interface BoxTotalProps {
  totals: Totals;
  cadence: string;
  onCheckout?: () => void;
  /** `bar`: fixed to the bottom on mobile. `card`: sticky summary on desktop. */
  layout: 'bar' | 'card';
  className?: string;
}

export function BoxTotal({ totals, cadence, onCheckout, layout, className = '' }: BoxTotalProps) {
  const { count, subtotal, discount, total } = totals;
  const items = `${count} ${count === 1 ? 'item' : 'items'}`;
  const announcement = `${items}, ${formatPrice(total)} ${cadence}`;
  const cta = count === 0 ? 'Add something first' : cadence === 'once' ? 'Check out' : 'Start subscription';

  if (layout === 'bar') {
    return (
      <div className={`border-t border-border bg-bg-surface px-margin py-12 shadow-raised ${className}`}>
        <div className="mx-auto flex max-w-frame items-center justify-between gap-12">
          <p aria-live="polite" aria-atomic="true">
            <span className="block font-display text-title tabular-nums">{formatPrice(total)}</span>
            <span className="block font-display text-caption text-text-muted">
              {items} · {cadence}
            </span>
            <span className="sr-only">{announcement}</span>
          </p>
          <Button size="lg" onClick={onCheckout} disabled={count === 0}>
            {cta}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-card border border-border bg-bg-surface p-24 ${className}`}>
      <dl className="flex flex-col gap-8 font-display text-label">
        <div className="flex justify-between">
          <dt className="text-text-muted">Subtotal ({items})</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-text-muted">Subscription saving</dt>
            <dd className="tabular-nums">−{formatPrice(discount)}</dd>
          </div>
        )}
        <div className="mt-8 flex items-baseline justify-between border-t border-border pt-16" aria-live="polite" aria-atomic="true">
          <dt className="text-title">Total</dt>
          <dd className="text-right">
            <span className="block text-heading tabular-nums">{formatPrice(total)}</span>
            <span className="block text-caption text-text-muted">{cadence}</span>
          </dd>
        </div>
      </dl>
      <Button size="lg" fullWidth className="mt-24" onClick={onCheckout} disabled={count === 0}>
        {cta}
      </Button>
    </div>
  );
}
