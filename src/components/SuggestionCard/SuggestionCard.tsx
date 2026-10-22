import Link from 'next/link';
import type { Suggestion } from '@/types';
import { itemHref } from '@/lib/routes';
import { CategoryBadge } from '../CategoryBadge';
import { Icon } from '../Icon';
import { Price } from '../Price';
import { ProductImage } from '../ProductImage';
import { Stepper } from '../Stepper';

export interface SuggestionCardProps {
  suggestion: Suggestion;
  qty: number;
  onQtyChange: (qty: number) => void;
}

/** 148px rail card: pack with category badge, name, the reason it's here, price and quick add. */
export function SuggestionCard({ suggestion, qty, onQtyChange }: SuggestionCardProps) {
  const { item, reason } = suggestion;
  return (
    <article
      data-category={item.category}
      className={`relative flex w-148 shrink-0 snap-start flex-col gap-8 rounded-card border bg-bg-surface p-8 transition-colors duration-200 ease-brew ${
        qty > 0 ? 'border-spark' : 'border-border'
      }`}
    >
      <div className="relative">
        <ProductImage category={item.category} label={item.size} className="h-120 w-full rounded-sm" />
        <CategoryBadge category={item.category} className="absolute left-4 top-4" />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <h4 className="line-clamp-2 min-h-40 text-center font-sans text-label leading-tight">
          <Link href={itemHref(item.id)} className="stretched-link">
            {item.name}
          </Link>
        </h4>
        <p className="line-clamp-2 min-h-32 text-center font-sans text-footnote text-accent">{reason}</p>

        <div className="mt-auto flex min-h-24 items-center justify-between gap-4">
          <Price value={item.price} size="small" />
          <div className="relative z-10">
            {qty === 0 ? (
              <button
                type="button"
                onClick={() => onQtyChange(1)}
                aria-label={`Add ${item.name} to your box`}
                className="relative grid size-24 place-items-center rounded-pill transition-transform duration-120 ease-brew before:absolute before:-inset-10 active:scale-90"
              >
                <Icon name="add" />
              </button>
            ) : (
              <Stepper value={qty} onChange={onQtyChange} itemName={item.name} size="compact" />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
