import Link from 'next/link';
import type { Item } from '@/types';
import { isDrinkCategory } from '@/data/labels';
import { itemHref } from '@/lib/routes';
import { caffeineText } from '../CaffeineMeter';
import { CategoryBadge } from '../CategoryBadge';
import { Chip } from '../Chip';
import { Icon } from '../Icon';
import { Price } from '../Price';
import { ProductImage } from '../ProductImage';
import { Stepper } from '../Stepper';

export interface ShopCardProps {
  item: Item;
  qty: number;
  onQtyChange: (qty: number) => void;
  /** Why it's suggested (For you tab). */
  reason?: string;
  /** Why it can't be added. Faded, no price or stepper. */
  unavailable?: string | null;
}

/** Shop grid card: 2 columns on mobile, 3 at 768px, 4 at 1024px. */
export function ShopCard({ item, qty, onQtyChange, reason, unavailable }: ShopCardProps) {
  const isDrink = isDrinkCategory(item.category);
  const blocked = Boolean(unavailable) && qty === 0;

  return (
    <article
      data-category={item.category}
      className={`relative flex flex-col overflow-hidden rounded-card border bg-bg-surface ${
        qty > 0 ? 'border-spark ring-1 ring-spark' : 'border-border'
      } ${blocked ? 'opacity-50' : ''}`}
    >
      <div className="relative">
        <ProductImage category={item.category} label={item.size} className="h-120 w-full md:h-140 lg:h-160" />
        <CategoryBadge category={item.category} className="absolute left-8 top-8" />
      </div>

      <div className="flex flex-1 flex-col items-center gap-6 px-10 pb-12 pt-10">
        <h3 className="line-clamp-2 min-h-40 w-full text-center font-sans text-label font-bold leading-tight">
          <Link href={itemHref(item.id)} className="stretched-link">
            {item.name}
          </Link>
        </h3>

        {item.notes.length > 0 && (
          <div className="flex w-full flex-wrap justify-center gap-4">
            {item.notes.slice(0, 2).map((note) => (
              <Chip key={note}>{note}</Chip>
            ))}
          </div>
        )}

        <p className="w-full text-center font-sans text-caption text-text-muted">
          {isDrink ? caffeineText(item.caffeineLevel) : item.size}
        </p>

        {reason && <p className="w-full text-center font-sans text-caption font-bold text-accent">{reason}</p>}

        <p className={`w-full text-center font-sans text-body-sm ${reason ? 'line-clamp-2' : 'line-clamp-3'}`}>
          {item.description}
        </p>

        {blocked ? (
          <p className="mt-auto flex items-center gap-4 pt-4 font-sans text-caption font-bold">
            <Icon name="info" size={16} />
            {unavailable}
          </p>
        ) : (
          <div className="mt-auto flex w-full flex-col items-center gap-8 pt-4">
            <Price value={item.price} />
            <div className="relative z-10">
              <Stepper value={qty} onChange={onQtyChange} itemName={item.name} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
