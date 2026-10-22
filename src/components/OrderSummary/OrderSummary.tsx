'use client';

import Link from 'next/link';
import { useId, useState, type ReactNode } from 'react';
import type { BoxLine, Category, Item } from '@/types';
import { categoryLabel, categoryOrder } from '@/data/labels';
import type { Totals } from '@/lib/box';
import { formatPrice, pluralise } from '@/lib/format';
import { itemHref, shopHref } from '@/lib/routes';
import { CaffeineMeter } from '../CaffeineMeter';
import { Chip, Pill } from '../Chip';
import { Icon } from '../Icon';
import { Price } from '../Price';
import { ProductImage } from '../ProductImage';
import { Stepper } from '../Stepper';

// ---------- OrderGroup ----------

export interface OrderGroupProps {
  title: string;
  summary: string;
  children: ReactNode;
  /** Shown under the header while collapsed, so the box stays visible. */
  collapsedPreview?: ReactNode;
  defaultOpen?: boolean;
}

/** Header row toggles the group; collapsed groups show thumbnails. */
export function OrderGroup({ title, summary, children, collapsedPreview, defaultOpen = true }: OrderGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  return (
    <div className={`flex flex-col ${open ? 'gap-8' : 'gap-4'}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-44 w-full items-center justify-between gap-8 text-left font-sans text-label"
      >
        <span className="font-bold">{title}</span>
        <span className="flex items-center gap-4 tabular-nums">
          {summary}
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} />
        </span>
      </button>
      <div id={panelId} hidden={!open} className="flex flex-col gap-8">
        {children}
      </div>
      {!open && collapsedPreview}
    </div>
  );
}

// ---------- ItemThumbnail ----------

/** 40×40 pack with the quantity underneath, used in collapsed groups. */
export function ItemThumbnail({ item, qty }: { item: Item; qty: number }) {
  return (
    <li className="w-40 shrink-0">
      <Link href={itemHref(item.id)} className="flex flex-col items-center gap-2 rounded-sm">
        <ProductImage category={item.category} className="size-40 rounded-sm" />
        <span aria-hidden="true" className="font-sans text-caption text-text-muted">
          x{qty}
        </span>
        <span className="sr-only">
          {item.name}, quantity {qty}
        </span>
      </Link>
    </li>
  );
}

// ---------- ItemCard ----------

export interface ItemCardProps {
  item: Item;
  qty: number;
  onQtyChange: (qty: number) => void;
  /** Shown when the item no longer fits the customer's preferences. */
  warning?: string | null;
}

/** One line in the box: pack, name, two-line description, up to three badges, price and stepper. */
export function ItemCard({ item, qty, onQtyChange, warning }: ItemCardProps) {
  const isDrink = item.category !== 'gear';
  return (
    <article
      data-category={item.category}
      className="relative flex flex-col gap-8 rounded-sm border border-border bg-bg-surface px-4 py-8"
    >
      <div className="flex items-start gap-8">
        <ProductImage category={item.category} label={item.size} className="h-88 w-88 shrink-0 rounded-sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-4 pr-4">
          <h4 className="truncate font-sans text-label">
            <Link href={itemHref(item.id)} className="stretched-link">
              {item.name}
            </Link>
          </h4>
          <p className="line-clamp-2 font-sans text-footnote text-text-muted">{item.description}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Pill label="Size" value={item.size} />
            {isDrink && <CaffeineMeter level={item.caffeineLevel} display="compact" />}
            {item.notes[0] && <Chip>{item.notes[0]}</Chip>}
          </div>
        </div>
      </div>

      {warning && (
        <p className="flex items-start gap-4 px-8 font-sans text-body-sm text-danger">
          <Icon name="info" size={16} className="mt-2" />
          <span>{warning}. It&apos;s still in your box.</span>
        </p>
      )}

      <div className="flex items-center justify-between px-8">
        <Price value={item.price} each />
        <div className="relative z-10">
          <Stepper value={qty} onChange={onQtyChange} itemName={item.name} />
        </div>
      </div>
    </article>
  );
}

// ---------- OrderSummary ----------

export interface OrderSummaryProps {
  lines: BoxLine[];
  catalogue: Item[];
  totals: Totals;
  onQtyChange: (itemId: string, qty: number) => void;
  warningFor?: (item: Item) => string | null;
}

type Entry = { line: BoxLine; item: Item };

/** "Order summary": Drinks and Brewing gear, each collapsible; drinks are sub-grouped by category. */
export function OrderSummary({ lines, catalogue, totals, onQtyChange, warningFor }: OrderSummaryProps) {
  const entries = lines
    .map((line) => ({ line, item: catalogue.find((i) => i.id === line.itemId) }))
    .filter((e): e is Entry => Boolean(e.item));
  const drinks = entries.filter((e) => e.item.category !== 'gear');
  const gear = entries.filter((e) => e.item.category === 'gear');
  const drinkGroups = categoryOrder
    .filter((c): c is Exclude<Category, 'gear'> => c !== 'gear')
    .map((category) => ({ category, entries: drinks.filter((e) => e.item.category === category) }))
    .filter((g) => g.entries.length > 0);

  const sum = (list: Entry[]) => list.reduce((n, e) => n + e.item.price * e.line.qty, 0);
  const line = ({ line, item }: Entry) => (
    <ItemCard
      key={item.id}
      item={item}
      qty={line.qty}
      onQtyChange={(qty) => onQtyChange(item.id, qty)}
      warning={warningFor?.(item)}
    />
  );
  const preview = (list: Entry[], label: string) =>
    list.length > 0 ? (
      <ul aria-label={label} className="flex flex-wrap gap-8">
        {list.map(({ line, item }) => (
          <ItemThumbnail key={item.id} item={item} qty={line.qty} />
        ))}
      </ul>
    ) : null;

  return (
    <section aria-labelledby="order-summary-title" className="flex flex-col gap-4 rounded-card border border-border bg-bg-surface p-8 shadow-card">
      <h2 id="order-summary-title" className="px-4 pt-4 font-heading text-title">
        Your box
      </h2>

      <div className="px-4 pb-8">
        <OrderGroup
          title="Drinks"
          summary={`${pluralise(totals.drinkCount, 'item')} · ${formatPrice(sum(drinks))}`}
          collapsedPreview={preview(drinks, 'Drinks in your box')}
        >
          {drinkGroups.length === 0 ? (
            <p className="border-t border-border pt-8 font-sans text-body-sm text-text-muted">
              No drinks yet. Pick a few from the suggestions or the shop.
            </p>
          ) : (
            drinkGroups.map(({ category, entries: list }) => (
              <div key={category} className="flex flex-col gap-8 border-t border-border">
                <div className="flex items-center justify-between pt-8 font-sans text-caption uppercase tracking-wide text-text-muted">
                  <h3>{categoryLabel[category]}</h3>
                  <span>{pluralise(list.reduce((n, e) => n + e.line.qty, 0), 'item')}</span>
                </div>
                {list.map(line)}
              </div>
            ))
          )}
        </OrderGroup>
      </div>

      <hr className="border-border" />

      <div className="px-4 pt-8">
        <OrderGroup
          title="Brewing gear"
          summary={`${pluralise(totals.gearCount, 'item')} · ${formatPrice(sum(gear))}`}
          collapsedPreview={preview(gear, 'Gear in your box')}
        >
          {gear.length === 0 ? (
            <p className="border-t border-border pt-8 font-sans text-body-sm text-text-muted">
              Nothing to brew with yet. We&apos;ve picked a few things that go with your drinks.
            </p>
          ) : (
            <div className="flex flex-col gap-8 border-t border-border pt-8">{gear.map(line)}</div>
          )}
        </OrderGroup>
      </div>

      <Link
        href={shopHref('for-you')}
        className="mt-8 flex min-h-44 w-full items-center justify-center gap-8 rounded-pill border border-brand font-sans text-label font-bold transition-colors duration-120 ease-brew hover:bg-bg-subtle"
      >
        <Icon name="bag" size={20} />
        Add or change items
      </Link>
    </section>
  );
}
