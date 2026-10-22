'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Item } from '@/types';
import { catalogue } from '@/data/catalogue';
import { goalById } from '@/data/goals';
import { avoidLabel, shopTabs, type ShopTabId } from '@/data/labels';
import { qtyOf } from '@/lib/box';
import { recommend } from '@/lib/recommend';
import { shopHref } from '@/lib/routes';
import { CategoryTabs, CollapsibleSection, PageHeader, ShopCard, ViewBoxBar, useBox, useFreshRail } from '@/components';

const GRID = 'grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-24';
const PANEL_ID = 'shop-panel';

export function ShopPage() {
  useFreshRail();
  const router = useRouter();
  const params = useSearchParams();
  const { state, totals, setQty, theme, setTheme } = useBox();
  const { customer } = state;
  const goal = goalById(customer.goal);

  const requested = params.get('tab');
  const tab = shopTabs.find((t) => t.id === requested) ?? shopTabs[0];
  const setTab = (id: ShopTabId) => router.replace(shopHref(id), { scroll: false });

  const card = (item: Item, extra: { reason?: string; unavailable?: string } = {}) => (
    <ShopCard key={item.id} item={item} qty={qtyOf(state.lines, item.id)} onQtyChange={(q) => setQty(item.id, q)} {...extra} />
  );

  const renderForYou = () => {
    const picks = recommend(customer, state.railLines, catalogue, { limit: 20, goalLabel: goal.railLabel });
    const drinks = picks.filter((s) => s.item.category !== 'gear');
    const gear = picks.filter((s) => s.item.category === 'gear');
    const avoiding = customer.avoids.length ? `, avoiding ${customer.avoids.map((a) => avoidLabel(a).toLowerCase()).join(', ')}` : '';
    return (
      <>
        <p className="font-serif text-body-sm text-text-muted">
          Picked from your answers: {goal.label.toLowerCase()}, caffeine up to {customer.maxCaffeine} of 5{avoiding}.
        </p>
        {drinks.length > 0 && (
          <section aria-labelledby="fy-drinks" className="flex flex-col gap-12">
            <h2 id="fy-drinks" className="font-display text-label font-bold">Drinks for {goal.railLabel}</h2>
            <div className={GRID}>{drinks.map((s) => card(s.item, { reason: s.reason }))}</div>
          </section>
        )}
        {gear.length > 0 && (
          <section aria-labelledby="fy-gear" className="flex flex-col gap-12">
            <h2 id="fy-gear" className="font-display text-label font-bold">Brew it well</h2>
            <div className={GRID}>{gear.map((s) => card(s.item, { reason: s.reason }))}</div>
          </section>
        )}
        {picks.length === 0 && (
          <p className="rounded-card border border-border bg-bg-surface p-16 font-serif text-body">
            Nothing new fits your answers right now. Browse the other tabs.
          </p>
        )}
      </>
    );
  };

  const renderCategory = (category: ShopTabId) => {
    const inTab = catalogue.filter((i) => i.category === category);
    const available: Item[] = [];
    const overLimit: Item[] = [];
    const avoided: Item[] = [];
    const backSoon: Item[] = [];
    for (const item of inTab) {
      if (qtyOf(state.lines, item.id) > 0) available.push(item);
      else if (!item.inStock) backSoon.push(item);
      else if (item.contains.some((c) => customer.avoids.includes(c))) avoided.push(item);
      else if (item.caffeineLevel > customer.maxCaffeine) overLimit.push(item);
      else available.push(item);
    }
    return (
      <>
        <div className={GRID}>{available.map((item) => card(item))}</div>
        {overLimit.length > 0 && (
          <CollapsibleSection title={`Above your caffeine limit (${overLimit.length})`}>
            <div className={GRID}>{overLimit.map((item) => card(item, { unavailable: 'Above your caffeine limit' }))}</div>
          </CollapsibleSection>
        )}
        {avoided.length > 0 && (
          <CollapsibleSection title={`Contains things you avoid (${avoided.length})`}>
            <div className={GRID}>
              {avoided.map((item) => card(item, { unavailable: `Contains ${item.contains.filter((c) => customer.avoids.includes(c)).join(', ')}` }))}
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
        <PageHeader title="Shop" backHref="/" theme={theme} onThemeChange={setTheme} />
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
