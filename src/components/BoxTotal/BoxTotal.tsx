import type { Totals } from '@/lib/box';
import { formatPrice, pluralise } from '@/lib/format';
import { Icon } from '../Icon';

export interface BoxTotalProps {
  totals: Totals;
  /** "every 2 weeks", "once"… */
  cadence: string;
  discountRate: number;
  onCheckout?: () => void;
}

/**
 * The price is always in view. Mobile: pinned to the bottom of the screen.
 * Desktop: a sticky card in the sidebar.
 */
export function BoxTotal({ totals, cadence, discountRate, onCheckout }: BoxTotalProps) {
  const { drinkCount, gearCount, subtotal, total } = totals;
  const gearText = gearCount === 0 ? 'no gear' : pluralise(gearCount, 'gear item');
  const note =
    discountRate > 0
      ? `Includes ${Math.round(discountRate * 100)}% subscription saving & free delivery`
      : 'Free delivery. Subscribe to save up to 10%';

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-30 rounded-t-card bg-bg-surface px-8 pt-16 shadow-bar lg:static lg:rounded-card lg:border lg:border-border lg:p-16 lg:shadow-card">
      <div className="mx-auto flex max-w-frame flex-col items-center gap-4 lg:max-w-none">
        <div aria-live="polite" aria-atomic="true" className="flex w-full items-end justify-between px-8 lg:px-0">
          <div className="flex flex-col gap-4">
            <p className="font-display text-label font-bold">Box total</p>
            <p className="font-display text-caption text-text-muted">
              {pluralise(drinkCount, 'drink')} · {gearText}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {subtotal > total && (
              <s className="font-display text-caption text-text-muted">
                <span className="sr-only">was </span>
                {formatPrice(subtotal)}
              </s>
            )}
            <p className="font-display text-title tabular-nums">
              <span className="sr-only">total </span>
              {formatPrice(total)}
              <span className="font-medium text-caption text-text-muted"> {cadence === 'once' ? '' : cadence}</span>
            </p>
          </div>
        </div>
        <p className="text-center font-serif text-footnote text-text-muted">{note}</p>
        <button
          type="button"
          onClick={onCheckout}
          disabled={totals.count === 0}
          className="mt-4 flex min-h-48 w-full items-center justify-center gap-8 rounded-pill bg-action px-16 font-display text-label font-bold text-action-text transition-opacity duration-120 ease-brew hover:opacity-90 disabled:opacity-40"
        >
          <Icon name="bag" size={20} />
          {totals.count === 0 ? 'Add something first' : 'Go to checkout'}
        </button>
      </div>
    </div>
  );
}
