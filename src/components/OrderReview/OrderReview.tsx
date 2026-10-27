'use client';

import { useEffect, useId, useState } from 'react';
import type { BoxLine, Item, Plan } from '@/types';
import { isDrinkCategory } from '@/data/labels';
import type { Totals } from '@/lib/box';
import { formatDay, type ISODate } from '@/lib/dates';
import { formatPrice, pluralise } from '@/lib/format';
import { Icon } from '../Icon';

/** Standard delivery is free on every Ondo box; shown struck through so the saving is visible. */
export const STANDARD_DELIVERY = 3.95;

export interface OrderReviewProps {
  lines: BoxLine[];
  catalogue: Item[];
  totals: Totals;
  plan: Plan;
  deliveryDate: ISODate | null;
  defaultOpen?: boolean;
  /** Start expanded from 1024px, where the sidebar has room for the full breakdown. */
  openOnDesktop?: boolean;
}

type Entry = { qty: number; item: Item };

/** "Your first box": the order at a glance, expandable to every line and how the total is made. */
export function OrderReview({ lines, catalogue, totals, plan, deliveryDate, defaultOpen = false, openOnDesktop = false }: OrderReviewProps) {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => {
    if (openOnDesktop && window.matchMedia('(min-width: 1024px)').matches) setOpen(true);
  }, [openOnDesktop]);
  const [codeOpen, setCodeOpen] = useState(false);
  const [code, setCode] = useState('');
  const [codeMessage, setCodeMessage] = useState('');
  const panelId = useId();
  const codeId = useId();

  const entries = lines
    .map((l) => ({ qty: l.qty, item: catalogue.find((i) => i.id === l.itemId) }))
    .filter((e): e is Entry => Boolean(e.item));
  const drinks = entries.filter((e) => isDrinkCategory(e.item.category));
  const addOns = entries.filter((e) => !isDrinkCategory(e.item.category));
  const subscription = plan.discount > 0;
  const summary = [
    pluralise(totals.drinkCount, 'drink'),
    totals.addOnCount > 0 ? pluralise(totals.addOnCount, 'add-on') : null,
    subscription ? `Every ${plan.label}` : 'One-off',
  ]
    .filter(Boolean)
    .join(' · ');

  const row = 'flex items-baseline justify-between gap-12';
  const group = (title: string, list: Entry[]) =>
    list.length > 0 && (
      <div className="flex flex-col gap-4 border-t border-border pt-8">
        <h3 className="font-sans text-footnote font-semibold uppercase tracking-wide text-text-muted">{title}</h3>
        <ul className="flex flex-col gap-4">
          {list.map(({ qty, item }) => (
            <li key={item.id} className={`${row} font-sans text-body-sm`}>
              <span>
                {qty} × {item.name}
              </span>
              <span className="tabular-nums">{formatPrice(item.price * qty)}</span>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <section aria-labelledby={`${panelId}-title`} className="rounded-card border border-border bg-bg-surface shadow-card">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-12 p-16 text-left"
      >
        <span className="flex min-w-0 flex-col gap-2">
          <span id={`${panelId}-title`} className="font-heading text-title">
            Your first box
          </span>
          <span className="font-sans text-body-sm text-text-muted">{summary}</span>
        </span>
        <span className="flex items-center gap-8 font-sans text-title font-bold tabular-nums">
          {formatPrice(totals.total)}
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={24} />
        </span>
      </button>

      <div id={panelId} hidden={!open} className="flex flex-col gap-12 px-16 pb-16">
        <dl className="flex flex-col gap-4 font-sans text-body-sm">
          <div className={row}>
            <dt>Delivery</dt>
            <dd>{subscription ? `Every ${plan.label}` : 'One-off'}</dd>
          </div>
          <div className={row}>
            <dt>First delivery</dt>
            <dd>{deliveryDate ? formatDay(deliveryDate) : 'Not chosen yet'}</dd>
          </div>
        </dl>

        {group('Drinks', drinks)}
        {group('Add-ons', addOns)}

        <dl className="flex flex-col gap-4 border-t border-border pt-8 font-sans text-body-sm">
          <div className={row}>
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
          </div>
          {totals.discount > 0 && (
            <div className={row}>
              <dt>Subscription saving ({Math.round(plan.discount * 100)}%)</dt>
              <dd className="tabular-nums">−{formatPrice(totals.discount)}</dd>
            </div>
          )}
          <div className={row}>
            <dt>Standard delivery</dt>
            <dd className="flex items-baseline gap-6">
              <s className="text-text-muted">
                <span className="sr-only">was </span>
                {formatPrice(STANDARD_DELIVERY)}
              </s>
              <span className="font-bold text-on-spark-subtle">FREE</span>
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-4 border-t border-border pt-8">
          <div className={`${row} font-sans text-label font-bold`}>
            <span>First box total</span>
            <span className="text-title tabular-nums">{formatPrice(totals.total)}</span>
          </div>
          <p className="font-sans text-footnote text-text-muted">
            {subscription
              ? `Includes your ${Math.round(plan.discount * 100)}% subscription saving and free delivery. Then the same box every ${plan.label} until you change it.`
              : 'Includes free delivery. One-off order, no subscription.'}
          </p>
        </div>

        <div className="border-t border-border pt-8">
          {!codeOpen ? (
            <div className={`${row} font-sans text-body-sm`}>
              <span>Discount code</span>
              <button type="button" onClick={() => setCodeOpen(true)} className="min-h-44 font-bold underline underline-offset-4">
                Add a code
              </button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                setCodeMessage(code.trim() ? "Codes aren't live in this demo." : 'Enter a code first.');
              }}
            >
              <label htmlFor={codeId} className="font-sans text-label">
                Discount code
              </label>
              <div className="flex gap-8">
                <input
                  id={codeId}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  autoComplete="off"
                  className="min-h-44 min-w-0 flex-1 rounded-sm border border-border-strong bg-bg-surface px-12 font-sans text-body uppercase"
                />
                <button type="submit" className="min-h-44 rounded-pill border border-brand px-16 font-sans text-label font-bold">
                  Apply
                </button>
              </div>
              <p aria-live="polite" className="font-sans text-footnote text-text-muted">
                {codeMessage}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
