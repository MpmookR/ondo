'use client';

import { useId, useState, type ReactNode } from 'react';
import type { Customer, Item } from '@/types';
import { avoidLabel } from '@/data/labels';
import { formatPrice } from '@/lib/format';
import { Icon } from '../Icon';
import { Stepper } from '../Stepper';

// ---------- DetailAccordion ----------

/** Full-width row, 52px header, divider below. Collapsed by default. */
export function DetailAccordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  return (
    <section className="border-b border-border px-16">
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-52 w-full items-center justify-between py-12 text-left font-sans text-label font-bold"
        >
          {title}
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} />
        </button>
      </h2>
      <div id={panelId} hidden={!open} className="pb-16">
        {children}
      </div>
    </section>
  );
}

// ---------- BrewHighlights ----------

export interface BrewHighlightsProps {
  item: Item;
  customer: Customer;
}

/**
 * Always-visible stats row plus the "Contains" box (never collapsed, like an allergens box).
 * Rows with no data are skipped.
 */
export function BrewHighlights({ item, customer }: BrewHighlightsProps) {
  const isDrink = item.category !== 'gear';
  const stats = [
    { label: 'Caffeine', value: isDrink ? `${item.caffeineLevel}/5` : undefined },
    { label: 'Size', value: isDrink ? undefined : item.size },
    { label: 'Ratio', value: item.brew?.ratio },
    { label: 'Water', value: item.brew ? `${item.brew.tempC}°C` : undefined },
    { label: 'Time', value: item.brew?.time },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value));

  const clashes = item.contains.filter((c) => customer.avoids.includes(c));
  const overLimit = isDrink && item.caffeineLevel > customer.maxCaffeine;

  return (
    <section aria-labelledby="highlights-title" className="flex flex-col gap-16 px-16 py-8">
      <h2 id="highlights-title" className="font-sans text-label font-bold">
        {isDrink ? 'Brew highlights' : 'At a glance'}
      </h2>
      <dl className="flex">
        {stats.map((stat) => (
          <div key={stat.label} className="flex min-w-0 flex-1 flex-col-reverse items-center gap-2 border-r border-border px-2 py-4 last:border-r-0">
            <dd className="whitespace-nowrap font-mono text-caption font-bold">{stat.value}</dd>
            <dt className="font-sans text-footnote text-text-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <div data-category="matcha" className="flex flex-col rounded-sm border border-border-strong bg-accent-subtle px-16 py-8 font-sans text-label">
        <h3 className="font-bold">Contains</h3>
        <p className="font-medium">
          {item.contains.length > 0 ? item.contains.map(avoidLabel).join(', ') : isDrink ? 'Just the leaf or bean. No dairy, nuts or gluten.' : 'Not a food item.'}
        </p>
        {clashes.length > 0 && <p className="font-bold">Contains {clashes.join(', ')}, which you asked us to avoid.</p>}
        {overLimit && (
          <p className="font-bold">Caffeine {item.caffeineLevel} of 5 is above your limit of {customer.maxCaffeine}.</p>
        )}
      </div>
    </section>
  );
}

// ---------- OrderBar ----------

export interface OrderBarProps {
  item: Item;
  qty: number;
  onQtyChange: (qty: number) => void;
  /** Why it can't be added. Ignored once it's in the box. */
  blockedReason?: string | null;
}

/** Pinned to the bottom: "Add to box · price", or quantity + stepper once it's in the box. */
export function OrderBar({ item, qty, onQtyChange, blockedReason }: OrderBarProps) {
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-30 bg-bg-surface px-16 pt-12 shadow-bar">
      <div aria-live="polite" className="mx-auto flex min-h-52 max-w-frame items-center justify-between gap-16">
        {qty === 0 ? (
          blockedReason ? (
            <p className="flex min-h-52 w-full items-center justify-center rounded-pill bg-bg-subtle font-sans text-label font-bold uppercase tracking-wide text-text-muted">
              {blockedReason}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => onQtyChange(1)}
              className="flex min-h-52 w-full items-center justify-center rounded-pill bg-action font-sans text-label font-bold uppercase tracking-wide text-action-text transition-opacity duration-120 ease-brew hover:opacity-90"
            >
              Add to box · {formatPrice(item.price)}
            </button>
          )
        ) : (
          <>
            <p className="flex min-w-0 flex-col gap-2">
              <span className="font-sans text-label font-bold">{qty} in your box</span>
              <span className="font-sans text-caption tabular-nums text-text-muted">{formatPrice(item.price * qty)}</span>
            </p>
            <Stepper value={qty} onChange={onQtyChange} itemName={item.name} size="bar" />
          </>
        )}
      </div>
    </div>
  );
}
