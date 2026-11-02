import { formatPrice } from '@/lib/format';
import { afterSaving } from '@/lib/box';

export interface PriceProps {
  value: number;
  /** Previous price, shown struck through. */
  was?: number;
  size?: 'body' | 'small';
  /** Adds "each" after the price, for lines with a quantity. */
  each?: boolean;
  /**
   * The subscription saving (0.1 = 10%). Shows the price after it, with the full price struck
   * through, so the saving is visible on every line, not only in the total.
   */
  discountRate?: number;
}

/** "£12.50 each". Prices are always in the display face with tabular figures. */
export function Price({ value: full, was: given, size = 'body', each = false, discountRate = 0 }: PriceProps) {
  const value = discountRate > 0 ? afterSaving(full, discountRate) : full;
  const was = discountRate > 0 ? full : given;
  const discounted = was !== undefined && was > value;
  return (
    <span className="inline-flex items-baseline gap-4 whitespace-nowrap">
      {discounted && (
        <s className="font-sans text-footnote text-text-muted">
          <span className="sr-only">was </span>
          {formatPrice(was)}
        </s>
      )}
      <span className={`font-sans tabular-nums ${size === 'body' ? 'text-label' : 'text-caption font-bold'}`}>
        {discounted && <span className="sr-only">now </span>}
        {formatPrice(value)}
      </span>
      {each && <span className="font-sans text-footnote text-text-muted">each</span>}
    </span>
  );
}
