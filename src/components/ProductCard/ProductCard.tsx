import type { Item } from '@/types';
import { formatPrice } from '@/lib/format';
import { CaffeineMeter } from '../CaffeineMeter';
import { CategoryBadge } from '../CategoryBadge';
import { Chip } from '../Chip';
import { Icon, categoryIcon } from '../Icon';
import { Stepper } from '../Stepper';

export interface ProductCardProps {
  item: Item;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  /** One-line reason from the recommendation rules. */
  reason?: string;
  /** Why it can't be added (over caffeine limit, contains an avoid, out of stock). */
  unavailable?: string | null;
  className?: string;
}

/** One card for every category: the accent comes from data-category, never from props. */
export function ProductCard({ item, qty, onAdd, onRemove, reason, unavailable, className = '' }: ProductCardProps) {
  const inBox = qty > 0;
  const blocked = Boolean(unavailable) && !inBox;
  const isDrink = item.category !== 'gear';

  return (
    <article
      data-category={isDrink ? item.category : undefined}
      aria-label={item.name}
      className={`flex h-full flex-col overflow-hidden rounded-card border bg-bg-surface transition-[border-color,box-shadow] duration-200 ease-brew ${
        inBox ? 'border-accent' : 'border-border hover:shadow-raised'
      } ${blocked ? 'opacity-60' : ''} ${className}`}
    >
      <div className="relative flex aspect-4/3 items-center justify-center bg-accent-subtle text-accent">
        <Icon name={categoryIcon[item.category]} size={64} />
        <CategoryBadge category={item.category} className="absolute left-12 top-12" />
        <span className="absolute right-12 top-12 font-mono text-eyebrow uppercase text-text-muted">
          {item.isSample ? `Taster · ${item.size}` : item.size}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-12 p-16">
        {reason && (
          <p className="flex items-center gap-8 font-display text-caption text-accent">
            <span className="size-8 shrink-0 rounded-pill bg-accent" aria-hidden="true" />
            {reason}
          </p>
        )}
        <div>
          <h3 className="line-clamp-2 font-display text-title text-text-primary">{item.name}</h3>
          <p className="mt-4 line-clamp-2 text-body text-text-muted">{item.description}</p>
        </div>

        {item.notes.length > 0 && (
          <ul className="flex flex-wrap gap-4" aria-label="Tasting notes">
            {item.notes.slice(0, 3).map((note) => (
              <li key={note}>
                <Chip>{note}</Chip>
              </li>
            ))}
          </ul>
        )}

        {isDrink && <CaffeineMeter level={item.caffeineLevel} />}

        <div className="mt-auto flex min-h-44 items-center justify-between gap-12 pt-4">
          <p className="font-display text-title tabular-nums">{formatPrice(item.price)}</p>
          {blocked ? (
            <p className="font-display text-caption text-text-muted">{unavailable}</p>
          ) : (
            <Stepper qty={qty} itemName={item.name} onAdd={onAdd} onRemove={onRemove} />
          )}
        </div>
      </div>
    </article>
  );
}
