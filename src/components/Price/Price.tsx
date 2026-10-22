import { formatPrice } from '@/lib/format';

export interface PriceProps {
  value: number;
  /** Previous price, shown struck through. */
  was?: number;
  size?: 'body' | 'small';
  /** Adds "each" after the price, for lines with a quantity. */
  each?: boolean;
}

/** "£12.50 each". Prices are always in the display face with tabular figures. */
export function Price({ value, was, size = 'body', each = false }: PriceProps) {
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
