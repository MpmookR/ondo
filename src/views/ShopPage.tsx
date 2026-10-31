'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Item } from '@/types';
import { catalogue, itemById } from '@/data/catalogue';
import { bestSellerIds } from '@/data/bestSellers';
import { goalById } from '@/data/goals';
import {
  avoidLabel,
  caffeineBands,
  inCaffeineBand,
  isDrinkCategory,
  shopTabs,
  type CaffeineBand,
  type ShopTabId,
} from '@/data/labels';
import { browsingLimits, qtyOf } from '@/lib/box';
import { recommend } from '@/lib/recommend';
import { boxHref, onboardingHref, shopHref } from '@/lib/routes';
import { BuildBoxPrompt, CaffeineFilter, CategoryTabs, CollapsibleSection, PageHeader, ShopCard, ViewBoxBar, useBox, useFreshRail } from '@/components';

/** The homepage's best sellers, shown on For you until the customer has told us anything. */
const bestSellers = bestSellerIds.map(itemById).filter((item): item is Item => Boolean(item));

const GRID = 'grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-24';
const PANEL_ID = 'shop-panel';

export function ShopPage() {
  useFreshRail();
  const router = useRouter();
  const params = useSearchParams();
  const { state, totals, setQty, theme, setTheme } = useBox();
  const { customer } = state;
  const limits = browsingLimits(state);
  const goal = goalById(customer.goal);
  // Kept when switching between Coffee, Tea and Matcha, so "Low" stays low across drinks.
  const [band, setBand] = useState<CaffeineBand>('all');

  const requested = params.get('tab');
  const tab = shopTabs.find((t) => t.id === requested) ?? shopTabs[0];
  const setTab = (id: ShopTabId) => router.replace(shopHref(id), { scroll: false });

  const card = (item: Item, extra: { reason?: string; unavailable?: string } = {}) => (
    <ShopCard key={item.id} item={item} qty={qtyOf(state.lines, item.id)} onQtyChange={(q) => setQty(item.id, q)} {...extra} />
  );

  // Nothing to go on yet: ask for a little about them, and show what other people buy meanwhile.
  const renderNoAnswers = () => (
    <>
      <BuildBoxPrompt
        href={onboardingHref}
        align="centered"
        title="Tell us a little about you"
        body="Tell us how you like your cup, and we'll find your perfect match. It only takes a minute."
        className="mx-auto w-full max-w-column"
      />
      <section aria-labelledby="fy-best" className="flex flex-col gap-12">
        <h2 id="fy-best" className="font-heading text-title">Best sellers</h2>
        <div className={GRID}>{bestSellers.map((item) => card(item))}</div>
      </section>
    </>
  );

  const renderForYou = () => {
    if (!state.answered) return renderNoAnswers();
    const picks = recommend(customer, state.railLines, catalogue, { limit: 20, goalLabel: goal?.railLabel });
    const drinks = picks.filter((s) => isDrinkCategory(s.item.category));
    const gear = picks.filter((s) => s.item.category === 'gear');
    const onTheSide = picks.filter((s) => s.item.category === 'bites' || s.item.category === 'sweeteners');
    const avoiding = customer.avoids.length ? `, avoiding ${customer.avoids.map((a) => avoidLabel(a).toLowerCase()).join(', ')}` : '';
    return (
      <>
        <p className="font-sans text-body-sm text-text-muted">
          Picked from your answers: {goal ? `${goal.label.toLowerCase()}, ` : ''}caffeine up to {customer.maxCaffeine} of 5{avoiding}.
        </p>
        {drinks.length > 0 && (
          <section aria-labelledby="fy-drinks" className="flex flex-col gap-12">
            <h2 id="fy-drinks" className="font-heading text-title">{goal ? `Drinks for ${goal.railLabel}` : 'Drinks for you'}</h2>
            <div className={GRID}>{drinks.map((s) => card(s.item, { reason: s.reason }))}</div>
          </section>
        )}
        {gear.length > 0 && (
          <section aria-labelledby="fy-gear" className="flex flex-col gap-12">
            <h2 id="fy-gear" className="font-heading text-title">Brew it well</h2>
            <div className={GRID}>{gear.map((s) => card(s.item, { reason: s.reason }))}</div>
          </section>
        )}
        {onTheSide.length > 0 && (
          <section aria-labelledby="fy-side" className="flex flex-col gap-12">
            <h2 id="fy-side" className="font-heading text-title">On the side</h2>
            <div className={GRID}>{onTheSide.map((s) => card(s.item, { reason: s.reason }))}</div>
          </section>
        )}
        {picks.length === 0 && (
          <p className="rounded-card border border-border bg-bg-surface p-16 font-sans text-body">
            Nothing new fits your answers right now. Browse the other tabs.
          </p>
        )}
      </>
    );
  };

  const renderCategory = (category: Exclude<ShopTabId, 'for-you'>) => {
    const allInTab = catalogue.filter((i) => i.category === category);
    const filterable = isDrinkCategory(category);
    const counts = {
      all: allInTab.length,
      ...Object.fromEntries(caffeineBands.map((b) => [b.id, allInTab.filter((i) => inCaffeineBand(i.caffeineLevel, b.id)).length])),
    } as Record<CaffeineBand, number>;
    // A band with nothing on this tab (say Low on Matcha) shows everything, without forgetting the choice.
    const activeBand: CaffeineBand = counts[band] > 0 ? band : 'all';
    const inTab = filterable ? allInTab.filter((i) => inCaffeineBand(i.caffeineLevel, activeBand)) : allInTab;
    const available: Item[] = [];
    const overLimit: Item[] = [];
    const avoided: Item[] = [];
    const backSoon: Item[] = [];
    for (const item of inTab) {
      if (qtyOf(state.lines, item.id) > 0) available.push(item);
      else if (!item.inStock) backSoon.push(item);
      else if (item.contains.some((c) => limits.avoids.includes(c))) avoided.push(item);
      else if (item.caffeineLevel > limits.maxCaffeine) overLimit.push(item);
      else available.push(item);
    }
    return (
      <>
        {filterable && <CaffeineFilter value={activeBand} onChange={setBand} counts={counts} />}
        {available.length > 0 && <div className={GRID}>{available.map((item) => card(item))}</div>}
        {overLimit.length > 0 && (
          <CollapsibleSection title={`Above your caffeine limit (${overLimit.length})`}>
            <div className={GRID}>{overLimit.map((item) => card(item, { unavailable: 'Above your caffeine limit' }))}</div>
          </CollapsibleSection>
        )}
        {avoided.length > 0 && (
          <CollapsibleSection title={`Contains things you avoid (${avoided.length})`}>
            <div className={GRID}>
              {avoided.map((item) => card(item, { unavailable: `Contains ${item.contains.filter((c) => limits.avoids.includes(c)).join(', ')}` }))}
            </div>
          </CollapsibleSection>
        )}
        {backSoon.length > 0 && (
          <CollapsibleSection title={`Back soon (${backSoon.length})`}>
            <div className={GRID}>{backSoon.map((item) => card(item, { unavailable: 'Back soon' }))}</div>
          </CollapsibleSection>
        )}
      </>
    );
  };

  return (
    <>
      <div className="sticky top-0 z-20">
        <PageHeader title="Shop" backHref={boxHref} theme={theme} onThemeChange={setTheme} />
        <CategoryTabs tabs={shopTabs} active={tab.id} onChange={setTab} panelId={PANEL_ID} />
      </div>

      <main
        id={PANEL_ID}
        role="tabpanel"
        aria-labelledby={`tab-${tab.id}`}
        className="mx-auto flex w-full max-w-content flex-col gap-16 px-16 pb-144 pt-16 lg:gap-24 lg:px-24 lg:pt-24"
      >
        {tab.id === 'for-you' ? renderForYou() : renderCategory(tab.id)}
      </main>

      <ViewBoxBar totals={totals} />
    </>
  );
}
