'use client';

import { useMemo, useReducer, useState } from 'react';
import type { BoxLine, Category, Goal } from '@/types';
import { catalogue, itemById } from '@/data/catalogue';
import { defaultBox, defaultCustomer } from '@/data/customer';
import { goalById } from '@/data/goals';
import { planById } from '@/data/plans';
import { boxReducer, qtyOf, totals } from '@/lib/box';
import { formatPrice } from '@/lib/format';
import { recommend, unavailableReason } from '@/lib/recommend';
import {
  BoxTotal,
  CategoryBadge,
  GoalPicker,
  PlanPicker,
  ProductCard,
  Stepper,
  SuggestionRail,
  ToggleChip,
} from '@/components';

type Filter = 'all' | Category;
const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'tea', label: 'Tea' },
  { id: 'matcha', label: 'Matcha' },
  { id: 'gear', label: 'Gear' },
];

export function BuildYourBox() {
  const [state, dispatch] = useReducer(boxReducer, {
    lines: defaultBox,
    goal: defaultCustomer.goal,
    plan: 'fortnightly',
  });
  // The rail is built from the box as it was when the goal was picked, so adding from it never reshuffles it.
  const [railBox, setRailBox] = useState<BoxLine[]>(defaultBox);
  const [filter, setFilter] = useState<Filter>('all');

  const customer = { ...defaultCustomer, goal: state.goal };
  const goal = goalById(state.goal);
  const plan = planById(state.plan);

  const suggestions = useMemo(
    () => recommend(customer, railBox, catalogue, { goalLabel: goal.railLabel }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.goal, railBox],
  );
  const sum = totals(state.lines, catalogue, plan.discount);
  const shop = catalogue.filter((i) => filter === 'all' || i.category === filter);

  const add = (itemId: string) => dispatch({ type: 'add', itemId });
  const remove = (itemId: string) => dispatch({ type: 'remove', itemId });
  const setGoal = (g: Goal) => {
    dispatch({ type: 'setGoal', goal: g });
    setRailBox(state.lines);
  };

  return (
    <>
      <Hero />

      <main id="build" className="mx-auto max-w-content px-margin pb-128 pt-48 lg:grid lg:grid-cols-12 lg:gap-x-gutter lg:pb-96 lg:pt-80">
        <section aria-labelledby="goal-title" className="lg:col-span-8 lg:col-start-1 lg:row-start-1">
          <p className="font-mono text-eyebrow uppercase text-text-muted">Step 1</p>
          <h2 id="goal-title" className="mt-8 font-display text-heading">How do you want your day to feel?</h2>
          <p className="mt-8 max-w-frame text-body text-text-muted">
            We&apos;ll suggest drinks and gear for it. You can change this any time.
          </p>
          <GoalPicker value={state.goal} onChange={setGoal} className="mt-24" />
        </section>

        <aside
          aria-label="Your box"
          className="mt-48 lg:sticky lg:top-24 lg:col-span-4 lg:col-start-9 lg:row-span-3 lg:row-start-1 lg:mt-0 lg:self-start"
        >
          <div className="rounded-card border border-border p-16">
            <h2 className="font-display text-title">Your box</h2>
            {state.lines.length === 0 ? (
              <p className="mt-8 text-body text-text-muted">Empty for now. Pick something below.</p>
            ) : (
              <ul className="mt-8 divide-y divide-border">
                {state.lines.map((line) => {
                  const item = itemById(line.itemId);
                  if (!item) return null;
                  return (
                    <li key={line.itemId} className="flex items-center gap-12 py-12">
                      <div className="min-w-0 flex-1">
                        <CategoryBadge category={item.category} />
                        <p className="mt-4 truncate font-display text-label">{item.name}</p>
                        <p className="font-display text-caption tabular-nums text-text-muted">
                          {formatPrice(item.price * line.qty)}
                        </p>
                      </div>
                      <Stepper qty={line.qty} itemName={item.name} onAdd={() => add(item.id)} onRemove={() => remove(item.id)} />
                    </li>
                  );
                })}
              </ul>
            )}
            <h3 className="mt-16 font-display text-label text-text-muted">Delivery</h3>
            <PlanPicker value={state.plan} onChange={(p) => dispatch({ type: 'setPlan', plan: p })} className="mt-8" />
          </div>
          <BoxTotal layout="card" totals={sum} cadence={plan.cadence} className="mt-16 hidden lg:block" />
        </aside>

        <SuggestionRail
          title={`For ${goal.railLabel}`}
          description="Picked for your goal, your caffeine limit and what's already in your box."
          className="mt-64 lg:col-span-8 lg:col-start-1 lg:row-start-2"
        >
          {suggestions.map((s) => (
            <ProductCard
              key={s.item.id}
              item={s.item}
              reason={s.reason}
              qty={qtyOf(state.lines, s.item.id)}
              onAdd={() => add(s.item.id)}
              onRemove={() => remove(s.item.id)}
            />
          ))}
        </SuggestionRail>

        <section aria-labelledby="shop-title" className="mt-64 lg:col-span-8 lg:col-start-1 lg:row-start-3">
          <h2 id="shop-title" className="font-display text-heading">The full range</h2>
          <div className="mt-8 flex flex-wrap gap-x-8" role="group" aria-label="Filter by category">
            {filters.map((f) => (
              <ToggleChip key={f.id} pressed={filter === f.id} onPressedChange={() => setFilter(f.id)}>
                {f.label}
              </ToggleChip>
            ))}
          </div>
          <ul className="mt-16 grid grid-cols-1 gap-gutter sm:grid-cols-2 xl:grid-cols-3">
            {shop.map((item) => (
              <li key={item.id}>
                <ProductCard
                  item={item}
                  qty={qtyOf(state.lines, item.id)}
                  unavailable={unavailableReason(item, customer)}
                  onAdd={() => add(item.id)}
                  onRemove={() => remove(item.id)}
                />
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border px-margin py-32">
        <p className="mx-auto max-w-content font-display text-caption text-text-muted">
          Ondo is a fictional brand: a design system case study by Mook, built with Claude and code. Product data is
          illustrative. Type: Cabinet Grotesk and Erode from Fontshare.
        </p>
      </footer>

      <BoxTotal layout="bar" totals={sum} cadence={plan.cadence} className="fixed inset-x-0 bottom-0 z-10 lg:hidden" />
    </>
  );
}

function Hero() {
  return (
    <header data-theme="dark" className="grain relative isolate overflow-hidden bg-bg-page text-text-primary">
      <div className="absolute inset-0 -z-10 bg-radial from-bg-subtle to-bg-page to-70%" aria-hidden="true" />
      <div className="mx-auto flex min-h-640 max-w-content flex-col px-margin py-24 lg:min-h-720">
        <div className="flex justify-between font-mono text-eyebrow uppercase text-text-muted" aria-hidden="true">
          <span>01&nbsp;&nbsp;&nbsp;Int. kitchen — 06:30</span>
          <span>01</span>
        </div>

        <div className="my-auto py-64 text-center">
          <h1 className="font-display text-display">Ondo</h1>
          <p className="mx-auto mt-16 max-w-frame font-serif text-body-lg text-text-primary">
            Coffee, tea and matcha, paced to how you want your day to feel.
          </p>
          <a
            href="#build"
            className="mt-32 inline-flex h-52 items-center gap-8 rounded-pill bg-action px-28 font-display text-label text-action-text transition-opacity duration-120 ease-brew hover:opacity-90"
          >
            Build your box
          </a>
        </div>

        <div className="text-center">
          <p className="font-mono text-eyebrow uppercase text-text-muted">Now brewing</p>
          <ul className="mt-12 flex justify-center gap-8" aria-label="Categories">
            {(['coffee', 'tea', 'matcha'] as const).map((c) => (
              <li key={c}>
                <CategoryBadge category={c} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
