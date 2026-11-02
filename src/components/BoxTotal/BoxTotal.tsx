import type { Totals } from '@/lib/box';
import { formatPrice, pluralise } from '@/lib/format';
import { Icon } from '../Icon';

export interface BoxTotalProps {
  totals: Totals;
  /** "every 15 days", "once"… */
  cadence: string;
  discountRate: number;
  /**
   * What every later delivery costs (the drinks and the add-ons they keep), with a subscription.
   * When it differs from the first box, both prices show: the total never hides what comes next.
   */
  repeatTotal?: number | null;
  onCheckout?: () => void;
}

/**
 * The price is always in view. Mobile: pinned to the bottom of the screen.
 * Desktop: a sticky card in the sidebar.
 */
export function BoxTotal({ totals, cadence, discountRate, repeatTotal, onCheckout }: BoxTotalProps) {
  const { drinkCount, addOnCount, subtotal, total } = totals;
  const subscription = cadence !== '' && cadence !== 'once';
  // The first box differs from the ones after it when something in it comes only once.
  const split = subscription && repeatTotal != null && repeatTotal !== total;
  const addOnText = addOnCount === 0 ? 'no add-ons' : pluralise(addOnCount, 'add-on');
  const note =
    discountRate > 0
      ? `Includes ${Math.round(discountRate * 100)}% subscription saving & free delivery`
      : 'Free delivery. Subscribe to save up to 10%';

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-30 rounded-t-card bg-bg-surface px-8 pt-16 shadow-bar lg:static lg:rounded-card lg:border lg:border-border lg:p-16 lg:shadow-card">
      <div className="mx-auto flex max-w-frame flex-col items-center gap-4 lg:max-w-none">
        <div aria-live="polite" aria-atomic="true" className="flex w-full items-end justify-between px-8 lg:px-0">
          <div className="flex flex-col gap-4">
            <p className="font-sans text-label font-bold">Box total</p>
            <p className="font-sans text-caption text-text-muted">
              {pluralise(drinkCount, 'drink')} · {addOnText}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {subtotal > total && (
              <s className="font-sans text-caption text-text-muted">
                <span className="sr-only">was </span>
                {formatPrice(subtotal)}
              </s>
            )}
            <p className="font-sans text-title tabular-nums">
              <span className="sr-only">total </span>
              {formatPrice(total)}
              <span className="font-medium text-caption text-text-muted"> {split ? 'first box' : subscription ? cadence : ''}</span>
            </p>
            {split && (
              <p className="font-sans text-caption text-text-muted tabular-nums">
                {repeatTotal > 0 ? `then ${formatPrice(repeatTotal)} ${cadence}` : 'Nothing repeats yet'}
              </p>
            )}
          </div>
        </div>
        <p className="text-center font-sans text-footnote text-text-muted">{note}</p>
        <button
          type="button"
          onClick={onCheckout}
          disabled={totals.count === 0}
          className="mt-4 flex min-h-48 w-full items-center justify-center gap-8 rounded-pill bg-action px-16 font-sans text-label font-bold text-action-text transition-opacity duration-120 ease-brew hover:opacity-90 disabled:opacity-40"
        >
          <Icon name="bag" size={20} />
          {totals.count === 0 ? 'Add something first' : 'Go to checkout'}
        </button>
      </div>
    </div>
  );
}
