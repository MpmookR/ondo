'use client';

import Link from 'next/link';
import { useId, useState, type ReactNode } from 'react';
import type { BoxLine, Category, Item } from '@/types';
import { addOnCategories, categoryLabel, drinkCategories, isDrinkCategory } from '@/data/labels';
import { afterSaving, repeatRule, type Totals } from '@/lib/box';
import { formatPrice, pluralise } from '@/lib/format';
import { itemHref, shopHref } from '@/lib/routes';
import { CaffeineMeter } from '../CaffeineMeter';
import { Chip, Pill } from '../Chip';
import { ConfirmDialog } from '../ConfirmDialog';
import { Icon } from '../Icon';
import { Price } from '../Price';
import { ProductImage } from '../ProductImage';
import { Stepper } from '../Stepper';
import { Switch } from '../Switch';

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
        <ProductImage category={item.category} image={item.image} sizes="40px" className="size-40 rounded-sm" />
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
  /** Set when the starter box picked it: why it's there ("For calm focus"). */
  pickedReason?: string;
  /**
   * Bites and sweeteners in a subscription: "Keep in every delivery", off (first box only) until
   * the customer turns it on. Leave unset to hide it (a one-off, or no delivery chosen yet).
   */
  everyDelivery?: { on: boolean; cadence: string; onChange: (on: boolean) => void };
  /** Gear and tasters in a subscription: they come once, in the first box. */
  sentOnce?: boolean;
  /** The subscription saving (0.1 = 10%): shows the price after it, with the full price struck. */
  discountRate?: number;
}

/** One line in the box: pack, name, two-line description, up to three badges, price and stepper. */
export function ItemCard({ item, qty, onQtyChange, warning, pickedReason, everyDelivery, sentOnce, discountRate }: ItemCardProps) {
  const isDrink = isDrinkCategory(item.category);
  const keepId = useId();
  return (
    <article
      data-category={item.category}
      className="relative flex flex-col gap-8 rounded-sm border border-border bg-bg-surface px-4 py-8"
    >
      <div className="flex items-start gap-8">
        <ProductImage category={item.category} label={item.size} image={item.image} sizes="88px" className="h-88 w-88 shrink-0 rounded-sm" />
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

      {pickedReason && (
        <p className="flex flex-wrap items-center gap-x-8 gap-y-4 px-8 font-sans text-caption">
          <span className="flex items-center gap-4 font-semibold text-brand">
            <Icon name="check" size={16} />
            Picked for you
          </span>
          <span className="text-text-muted">{pickedReason}</span>
        </p>
      )}

      {everyDelivery && (
        <div className="relative z-10 flex items-center justify-between gap-12 rounded-sm bg-bg-page px-8">
          <span className="flex flex-col py-4 font-sans">
            <span id={`${keepId}-label`} className="text-label">
              Switch to subscription
            </span>
            <span id={`${keepId}-state`} className="text-caption text-text-muted">
              {everyDelivery.on ? `Comes ${everyDelivery.cadence}` : 'For discounted price'}
            </span>
          </span>
          <Switch
            checked={everyDelivery.on}
            onChange={everyDelivery.onChange}
            labelledBy={`${keepId}-label`}
            describedBy={`${keepId}-state`}
          />
        </div>
      )}

      {warning && (
        <p className="flex items-start gap-4 px-8 font-sans text-body-sm text-danger">
          <Icon name="info" size={16} className="mt-2" />
          <span>{warning}. It&apos;s still in your box.</span>
        </p>
      )}

      <div className="flex items-center justify-between px-8">
        <span className="flex items-baseline gap-8">
          <Price value={item.price} each discountRate={discountRate} />
          {sentOnce && <span className="font-sans text-caption text-text-muted">One Time Off</span>}
        </span>
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
  /** "every 15 days" when a subscription is chosen; unset for a one-off or no choice yet. */
  cadence?: string;
  /** Turning "Keep in every delivery" on is confirmed first; turning it off isn't. */
  onEveryDeliveryChange?: (itemId: string, on: boolean) => void;
  /** The subscription saving (0.1 = 10%): shows the price after it, with the full price struck. */
  discountRate?: number;
}

type Entry = { line: BoxLine; item: Item };

/** "Your box": Drinks and Add-ons, each collapsible and sub-grouped by category. */
export function OrderSummary({ lines, catalogue, totals, onQtyChange, warningFor, cadence, onEveryDeliveryChange, discountRate }: OrderSummaryProps) {
  // The add-on waiting for "Add to subscription" in the dialog.
  const [confirming, setConfirming] = useState<Entry | null>(null);
  const entries = lines
    .map((line) => ({ line, item: catalogue.find((i) => i.id === line.itemId) }))
    .filter((e): e is Entry => Boolean(e.item));
  const drinks = entries.filter((e) => isDrinkCategory(e.item.category));
  const addOns = entries.filter((e) => !isDrinkCategory(e.item.category));
  const groupBy = (list: Entry[], categories: Category[]) =>
    categories
      .map((category) => ({ category, entries: list.filter((e) => e.item.category === category) }))
      .filter((g) => g.entries.length > 0);
  const drinkGroups = groupBy(drinks, drinkCategories);
  const addOnGroups = groupBy(addOns, addOnCategories);

  const sum = (list: Entry[]) => list.reduce((n, e) => n + e.item.price * e.line.qty, 0);
  const line = ({ line, item }: Entry) => (
    <ItemCard
      key={item.id}
      item={item}
      qty={line.qty}
      onQtyChange={(qty) => onQtyChange(item.id, qty)}
      warning={warningFor?.(item)}
      pickedReason={line.pickedReason}
      everyDelivery={
        cadence && onEveryDeliveryChange && repeatRule(item) === 'choice'
          ? {
              on: line.everyDelivery === true,
              cadence,
              onChange: (on) => (on ? setConfirming({ line, item }) : onEveryDeliveryChange(item.id, false)),
            }
          : undefined
      }
      sentOnce={Boolean(cadence) && repeatRule(item) === 'once'}
      // The saving is only on what repeats: one-off lines stay at full price.
      discountRate={repeatRule(item) === 'always' || line.everyDelivery ? discountRate : undefined}
    />
  );
  const subgroup = ({ category, entries: list }: { category: Category; entries: Entry[] }) => (
    <div key={category} className="flex flex-col gap-8 border-t border-border">
      <div className="flex items-center justify-between pt-8 font-sans text-caption uppercase tracking-wide text-text-muted">
        <h3>{categoryLabel[category]}</h3>
        <span>{pluralise(list.reduce((n, e) => n + e.line.qty, 0), 'item')}</span>
      </div>
      {list.map(line)}
    </div>
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
            drinkGroups.map(subgroup)
          )}
        </OrderGroup>
      </div>

      <hr className="border-border" />

      <div className="px-4 pt-8">
        <OrderGroup
          title="Add-Ons"
          summary={`${pluralise(totals.addOnCount, 'item')} · ${formatPrice(sum(addOns))}`}
          collapsedPreview={preview(addOns, 'Add-ons in your box')}
        >
          {addOnGroups.length === 0 ? (
            <p className="border-t border-border pt-8 font-sans text-body-sm text-text-muted">
              No add-ons yet. We&apos;ve picked a few things that go with your drinks.
            </p>
          ) : (
            addOnGroups.map(subgroup)
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

      <ConfirmDialog
        open={confirming !== null}
        title="Add to your subscription?"
        confirmLabel="Add to subscription"
        onCancel={() => setConfirming(null)}
        onConfirm={() => {
          if (confirming) onEveryDeliveryChange?.(confirming.item.id, true);
          setConfirming(null);
        }}
      >
        {confirming && (
          <>
            <p>
              {confirming.line.qty > 1 ? `${confirming.line.qty} × ` : ''}
              {confirming.item.name} will come in every delivery, {cadence}, at {formatPrice(afterSaving(confirming.item.price, discountRate ?? 0))} each.
            </p>
            <p className="text-body-sm text-text-muted">You can add, remove or cancel anything in your subscription at any time.</p>
          </>
        )}
      </ConfirmDialog>
    </section>
  );
}
