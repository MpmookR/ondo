'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { CaffeineLevel, Count, Customer, PlanId } from '@/types';
import { goals } from '@/data/goals';
import { avoidLabel, avoidOptions, brewKitOptions, countLabel, counts, drinkOptions } from '@/data/labels';
import { planById, plans } from '@/data/plans';
import { addDays, formatShort, type ISODate } from '@/lib/dates';
import type { DeliverySuggestion } from '@/lib/delivery';
import { Button } from '../Button';
import { caffeineLabel } from '../CaffeineMeter';
import { ToggleChip } from '../Chip';
import { DatePicker } from '../DatePicker';
import { Icon, type IconName } from '../Icon';
import { useRadioGroup } from '../shared/useRadioGroup';

export const cardClass = 'rounded-card border border-border bg-bg-surface shadow-card';

const legendClass = 'mb-8 font-sans text-caption uppercase tracking-wide text-text-muted';

function Badge({ icon }: { icon: IconName }) {
  return (
    <span className="grid size-32 shrink-0 place-items-center rounded-pill bg-primary-subtle text-text-primary">
      <Icon name={icon} size={20} />
    </span>
  );
}

interface PillOption<T> {
  value: T;
  label: string;
  sub?: string;
  /** When the visible label isn't enough on its own, e.g. "4+". */
  ariaLabel?: string;
}

/** A segmented pill radiogroup (arrow keys move the selection). */
function PillGroup<T extends string | number>({
  options,
  value,
  onChange,
  labelledBy,
}: {
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  labelledBy: string;
}) {
  const { getOptionProps } = useRadioGroup(
    options.map((o) => o.value),
    value,
    onChange,
  );
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="flex gap-4 rounded-pill bg-bg-subtle p-4">
      {options.map((o, i) => {
        const checked = o.value === value;
        return (
          <div
            key={String(o.value)}
            {...getOptionProps(o.value, i)}
            aria-label={o.ariaLabel}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-pill border-2 px-4 py-4 transition-colors duration-120 ease-brew ${
              o.sub ? 'min-h-48' : 'min-h-36'
            } ${checked ? 'border-primary bg-bg-surface' : 'border-transparent hover:bg-bg-page'}`}
          >
            <span className={`whitespace-nowrap font-sans text-label tabular-nums ${checked ? 'font-bold' : 'font-medium'}`}>{o.label}</span>
            {o.sub && <span className="whitespace-nowrap font-sans text-footnote text-text-muted">{o.sub}</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ Delivery */

const planNote: Record<PlanId, string> = {
  'every-15': 'The same box every 15 days. Skip, swap or pause any time.',
  'every-30': 'The same box every 30 days. Skip, swap or pause any time.',
  'every-45': 'The same box every 45 days. Skip, swap or pause any time.',
  once: 'Just this box, at full price. No subscription.',
};

const saving = (discount: number) => (discount > 0 ? `Save ${Math.round(discount * 100)}%` : 'Full price');

const perDayText = (s: DeliverySuggestion, drinkers: Count) =>
  `${s.cupsPerDay} cup${s.cupsPerDay === 1 ? '' : 's'} a day${drinkers > 1 ? ' between you' : ''}`;

export interface DeliveryCardProps {
  plan: PlanId;
  onPlanChange: (plan: PlanId) => void;
  date: ISODate | null;
  onDateChange: (date: ISODate) => void;
  /** From the box and the preferences; null when the box has no drinks. */
  suggestion: DeliverySuggestion | null;
  /** Used only to word the suggestion ("between you"). */
  drinkers: Count;
  defaultOpen?: boolean;
}

/**
 * Delivery: a suggestion worked out from the box and how much they drink, how often, then the
 * first delivery date. Collapsed to "Every 30 days · Tue 3 Nov"; it opens when someone follows a
 * link to #delivery. The suggestion never changes the choice by itself, because the saving (and
 * so the price) differs between frequencies; the options are one tap away.
 */
export function DeliveryCard({ plan, onPlanChange, date, onDateChange, suggestion, drinkers, defaultOpen = false }: DeliveryCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const freqId = useId();
  const current = planById(plan);
  const suggested = suggestion ? planById(suggestion.planId) : null;
  const summary = `${current.days ? `Every ${current.label}` : 'One-off'}${date ? ` · ${formatShort(date)}` : ''}`;

  // "How it works" in the header links here: open the card so the link lands on something.
  useEffect(() => {
    const openOnHash = () => {
      if (window.location.hash === '#delivery') setOpen(true);
    };
    openOnHash();
    window.addEventListener('hashchange', openOnHash);
    return () => window.removeEventListener('hashchange', openOnHash);
  }, []);

  return (
    <section id="delivery" aria-label="Delivery" className={`relative z-40 flex scroll-mt-16 flex-col gap-8 p-8 ${cardClass}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-36 w-full items-center justify-between gap-8 text-left"
      >
        <span className="flex items-center gap-8 font-sans text-label">
          <Badge icon="truck" />
          Delivery
        </span>
        <span className="flex items-center gap-4 font-sans text-caption text-text-muted">
          {!open && <span className="max-w-160 truncate">{summary}</span>}
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} className="text-text-primary" />
        </span>
      </button>

      <div id={panelId} hidden={!open} className="flex flex-col gap-16 px-4 pb-8">
        <div className="flex flex-col gap-8">
          <h3 id={freqId} className="font-sans text-caption uppercase tracking-wide text-text-muted">
            How often
          </h3>
          {suggestion && suggested && (
            <p className="rounded-sm bg-primary-subtle px-12 py-8 font-sans text-body-sm">
              {suggestion.runsShort ? (
                <>
                  Your box makes about {suggestion.cupsInBox} cups: about {suggestion.daysLasting} days at{' '}
                  {perDayText(suggestion, drinkers)}. Every 15 days is the most often we deliver, so you may want a little more in
                  your box.
                </>
              ) : (
                <>
                  <span className="font-bold">We suggest every {suggested.label}.</span> Your box makes about {suggestion.cupsInBox}{' '}
                  cups: about {suggestion.daysLasting} days at {perDayText(suggestion, drinkers)}.
                </>
              )}
            </p>
          )}
          <PillGroup
            labelledBy={freqId}
            value={plan}
            onChange={onPlanChange}
            options={plans.map((p) => ({ value: p.id, label: p.label, sub: saving(p.discount) }))}
          />

          <p className="px-4 font-sans text-body-sm text-text-muted">{planNote[plan]}</p>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-16">
          <div className="flex items-center justify-between gap-8">
            <span className="font-sans text-label">First delivery</span>
            <DatePicker value={date} onChange={onDateChange} label="First delivery date" placeholder="Choose date" />
          </div>
          {date && (
            <p className="font-sans text-footnote text-text-muted">
              {current.days ? `Then every ${current.label}: next on ${formatShort(addDays(date, current.days))}.` : 'Just this delivery.'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Preferences */

const levels = [1, 2, 3, 4, 5] as const;

const joinOr = (labels: string[], empty: string) => (labels.length === 0 ? empty : labels.join(', '));
const countAria = (n: Count, one: string, many: string) => `${n === 4 ? '4 or more' : n} ${n === 1 ? one : many}`;

function ToggleGroup<T extends string>({
  legend,
  options,
  selected,
  onChange,
}: {
  legend: string;
  options: readonly { id: T; label: string }[];
  selected: T[];
  onChange: (next: T[]) => void;
}) {
  return (
    <fieldset>
      <legend className="font-sans text-caption uppercase tracking-wide text-text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-x-8">
        {options.map((o) => {
          const on = selected.includes(o.id);
          return (
            <ToggleChip
              key={o.id}
              pressed={on}
              onPressedChange={() => onChange(on ? selected.filter((s) => s !== o.id) : [...selected, o.id])}
            >
              {on && <Icon name="check" size={16} />}
              {o.label}
            </ToggleChip>
          );
        })}
      </div>
    </fieldset>
  );
}

function summaryRows(c: Customer): { label: string; value: ReactNode }[] {
  const goal = goals.find((g) => g.id === c.goal);
  return [
    { label: 'Goal', value: goal?.label },
    { label: 'People', value: c.drinkers === 1 ? 'Just you' : `${countLabel(c.drinkers)} people` },
    { label: 'Cups a day', value: c.drinkers === 1 ? countLabel(c.cupsPerDay) : `${countLabel(c.cupsPerDay)} each` },
    { label: 'Drinks', value: joinOr(drinkOptions.filter((d) => c.drinks.includes(d.id)).map((d) => d.label), 'Not sure yet') },
    { label: 'Brews with', value: joinOr(brewKitOptions.filter((b) => c.brewKit.includes(b.id)).map((b) => b.label), 'Nothing yet') },
    { label: 'Caffeine limit', value: `Up to ${c.maxCaffeine} · ${caffeineLabel[c.maxCaffeine]}` },
    { label: 'Avoid', value: joinOr(c.avoids.map(avoidLabel), 'Nothing') },
  ];
}

export interface PreferencesCardProps {
  customer: Customer;
  /** Any change re-ranks the rail. */
  onChange: (patch: Partial<Customer>) => void;
  defaultOpen?: boolean;
  defaultEditing?: boolean;
}

/**
 * The onboarding answers, replayed. Collapsed to the goal; open, a short summary with
 * "Edit preferences", which swaps the summary for the controls.
 */
export function PreferencesCard({ customer, onChange, defaultOpen = false, defaultEditing = false }: PreferencesCardProps) {
  const [open, setOpen] = useState(defaultOpen || defaultEditing);
  const [editing, setEditing] = useState(defaultEditing);
  const panelId = useId();
  const peopleId = useId();
  const cupsId = useId();
  const caffeineId = useId();
  const editRef = useRef<HTMLButtonElement>(null);
  const goalGroup = useRadioGroup(
    goals.map((g) => g.id),
    customer.goal,
    (goal) => onChange({ goal }),
  );
  const goal = goals.find((g) => g.id === customer.goal);
  const total = customer.drinkers * customer.cupsPerDay;
  const totalLabel = `${total}${customer.drinkers === 4 || customer.cupsPerDay === 4 ? '+' : ''}`;

  const done = () => {
    setEditing(false);
    requestAnimationFrame(() => editRef.current?.focus());
  };

  return (
    <div className={`flex flex-col gap-8 p-8 ${cardClass}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-36 w-full items-center justify-between gap-8 text-left"
      >
        <span className="flex items-center gap-8 font-sans text-label">
          <Badge icon="sliders" />
          Your preferences
        </span>
        <span className="flex items-center gap-4 font-sans text-caption text-text-muted">
          {!open && <span className="max-w-128 truncate">{goal?.label}</span>}
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} className="text-text-primary" />
        </span>
      </button>

      <div id={panelId} hidden={!open} className="flex flex-col gap-16 px-4 pb-8">
        {!editing ? (
          <>
            <dl className="flex flex-col divide-y divide-border">
              {summaryRows(customer).map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-16 py-8">
                  <dt className="shrink-0 font-sans text-body-sm text-text-muted">{r.label}</dt>
                  <dd className="text-right font-sans text-body-sm font-medium">{r.value}</dd>
                </div>
              ))}
            </dl>
            <Button ref={editRef} variant="secondary" fullWidth onClick={() => setEditing(true)} icon="sliders">
              Edit preferences
            </Button>
          </>
        ) : (
          <>
            <fieldset className="flex flex-col gap-8">
              <legend className={legendClass}>Goal</legend>
              <div role="radiogroup" aria-label="Goal" className="grid grid-cols-2 gap-8">
                {goals.map((g, i) => {
                  const checked = g.id === customer.goal;
                  return (
                    <div
                      key={g.id}
                      {...goalGroup.getOptionProps(g.id, i)}
                      className={`flex min-h-44 flex-col justify-center rounded-sm border px-12 py-8 transition-colors duration-120 ease-brew ${
                        checked ? 'border-primary bg-primary-subtle' : 'border-border hover:border-border-strong'
                      }`}
                    >
                      <span className="font-mono text-footnote uppercase text-text-muted">{g.eyebrow}</span>
                      <span className={`font-sans text-label ${checked ? 'font-bold' : 'font-medium'}`}>{g.label}</span>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <p id={peopleId} className={legendClass}>
                How many people drink it?
              </p>
              <PillGroup
                labelledBy={peopleId}
                value={customer.drinkers}
                onChange={(drinkers) => onChange({ drinkers })}
                options={counts.map((n) => ({ value: n, label: countLabel(n), ariaLabel: countAria(n, 'person', 'people') }))}
              />
            </div>

            <div>
              <p id={cupsId} className={legendClass}>
                {customer.drinkers === 1 ? 'Cups a day' : 'Cups a day, each'}
              </p>
              <PillGroup
                labelledBy={cupsId}
                value={customer.cupsPerDay}
                onChange={(cupsPerDay) => onChange({ cupsPerDay })}
                options={counts.map((n) => ({ value: n, label: countLabel(n), ariaLabel: countAria(n, 'cup', 'cups') }))}
              />
              {customer.drinkers > 1 && (
                <p className="mt-4 px-4 font-sans text-footnote text-text-muted">That&apos;s {totalLabel} cups a day between you.</p>
              )}
            </div>

            <ToggleGroup legend="What do you drink?" options={drinkOptions} selected={customer.drinks} onChange={(drinks) => onChange({ drinks })} />
            <ToggleGroup
              legend="What do you brew with?"
              options={brewKitOptions}
              selected={customer.brewKit}
              onChange={(brewKit) => onChange({ brewKit })}
            />

            <div>
              <p id={caffeineId} className={legendClass}>
                Caffeine limit
              </p>
              <PillGroup
                labelledBy={caffeineId}
                value={customer.maxCaffeine}
                onChange={(maxCaffeine) => onChange({ maxCaffeine })}
                options={levels.map((level) => ({
                  value: level,
                  label: String(level),
                  ariaLabel: `Up to ${level}, ${caffeineLabel[level as CaffeineLevel].toLowerCase()}`,
                }))}
              />
              <p className="mt-4 px-4 font-sans text-footnote text-text-muted">
                We won&apos;t suggest anything above {customer.maxCaffeine} of 5 ({caffeineLabel[customer.maxCaffeine].toLowerCase()}).
              </p>
            </div>

            <ToggleGroup<string>
              legend="Avoid"
              options={avoidOptions}
              selected={customer.avoids}
              onChange={(avoids) => onChange({ avoids })}
            />

            <Button variant="secondary" fullWidth onClick={done}>
              Done
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
