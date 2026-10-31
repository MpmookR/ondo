'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { catalogue, itemById } from '@/data/catalogue';
import { goalById } from '@/data/goals';
import { brewMethodLabel, isDrinkCategory } from '@/data/labels';
import { browsingLimits, qtyOf } from '@/lib/box';
import { recommendForItem, unavailableReason } from '@/lib/recommend';
import { shopHref } from '@/lib/routes';
import {
  BrewGuide,
  BrewHighlights,
  CaffeineMeter,
  CategoryBadge,
  Chip,
  DetailAccordion,
  OrderBar,
  PageHeader,
  ProductImage,
  SuggestionRail,
  caffeineLabel,
  useBox,
  useFreshRail,
} from '@/components';

const caffeineCopy: Record<number, string> = {
  0: 'Naturally caffeine free. Brew it any time of day.',
  1: 'A trace of caffeine. Fine for the evening for most people.',
  2: 'Gentle. Roughly a third of a strong filter coffee.',
  3: 'Moderate. Steady energy that builds slowly.',
  4: 'High. Similar to a strong filter coffee.',
  5: 'Very high. Best before noon.',
};

/** Product page for any item, reached from the box, the rail or the shop. */
export function ItemPage({ itemId }: { itemId: string }) {
  useFreshRail();
  const router = useRouter();
  const { state, suggestions, setQty, theme, setTheme, returnTo } = useBox();
  const item = itemById(itemId)!;
  const isDrink = isDrinkCategory(item.category);
  // Bites and sweeteners don't brew anything; they list the drinks they go with instead.
  const pairsWith = (item.pairsWith ?? []).map(itemById).filter((i) => i !== undefined);
  const qty = qtyOf(state.lines, item.id);
  const goal = goalById(state.customer.goal);

  // Drinks: the same rules with this drink as the context. Add-ons: the box's own rail, minus this item.
  const pairings = useMemo(
    () =>
      isDrink
        ? recommendForItem(item, state.customer, catalogue, { goalLabel: goal?.railLabel })
        : suggestions.filter((s) => s.item.id !== item.id),
    [isDrink, item, state.customer, suggestions, goal?.railLabel],
  );

  // Back to the list they came from (a shop tab, Your box or home), however many products they hopped
  // through on the way; the shop if they opened this page directly.
  const goBack = () => router.push(returnTo ?? shopHref());

  return (
    <>
      <PageHeader title={item.name} onBack={goBack} theme={theme} onThemeChange={setTheme} sticky />

      <main
        data-category={item.category}
        className="mx-auto w-full max-w-content bg-bg-surface pb-144 lg:grid lg:grid-cols-2 lg:items-start lg:gap-24 lg:bg-transparent lg:px-24 lg:pt-8"
      >
        <ProductImage
          category={item.category}
          label={item.size}
          image={item.image}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-273 w-full md:h-400 lg:sticky lg:top-96 lg:aspect-4/3 lg:h-auto lg:rounded-card"
        />

        <div className="flex flex-col gap-8 lg:overflow-hidden lg:rounded-card lg:border lg:border-border lg:bg-bg-surface lg:pb-8">
          <div className="flex flex-col gap-12 px-16 pt-16">
            <p className="font-sans text-body">{item.description}</p>
            <div className="flex flex-wrap items-center gap-8">
              <CategoryBadge category={item.category} />
              {item.notes.map((note) => (
                <Chip key={note}>{note}</Chip>
              ))}
            </div>
            {isDrink && <CaffeineMeter level={item.caffeineLevel} />}
          </div>

          <BrewHighlights item={item} customer={browsingLimits(state)} />

          <div className="flex flex-col">
            {item.brew && (
              <DetailAccordion title="How to brew" defaultOpen>
                <BrewGuide brew={item.brew} />
              </DetailAccordion>
            )}
            {isDrink ? (
              <DetailAccordion title={`Caffeine: ${caffeineLabel[item.caffeineLevel].toLowerCase()}`}>
                <p className="font-sans text-body">{caffeineCopy[item.caffeineLevel]}</p>
                <p className="mt-8 font-sans text-body-sm text-text-muted">
                  Levels are relative, for comparing Ondo products. Caffeine varies with how you brew.
                </p>
              </DetailAccordion>
            ) : item.brewMethods.length > 0 ? (
              <DetailAccordion title="Brews">
                <ul className="flex flex-wrap gap-8">
                  {item.brewMethods.map((m) => (
                    <li key={m}>
                      <Chip tone="outline">{brewMethodLabel[m]}</Chip>
                    </li>
                  ))}
                </ul>
              </DetailAccordion>
            ) : (
              pairsWith.length > 0 && (
                <DetailAccordion title="Pairs with">
                  <ul className="flex flex-wrap gap-8">
                    {pairsWith.map((p) => (
                      <li key={p.id}>
                        <Chip tone="outline">{p.name}</Chip>
                      </li>
                    ))}
                  </ul>
                </DetailAccordion>
              )
            )}
            <DetailAccordion title="Delivery & storage">
              <p className="font-sans text-body">
                Free delivery, letterbox friendly. Keep sealed, away from light and heat, and use within a month of opening.
              </p>
            </DetailAccordion>
          </div>

          {pairings.length > 0 && (
            <div className="px-8 pb-24 pt-16 lg:pb-8">
              <SuggestionRail
                title={isDrink ? 'Goes well with this' : 'Goes well with your box'}
                suggestions={pairings}
                lines={state.lines}
                onQtyChange={setQty}
              />
            </div>
          )}
        </div>
      </main>

      <OrderBar item={item} qty={qty} onQtyChange={(n) => setQty(item.id, n)} blockedReason={unavailableReason(item, browsingLimits(state))} />
    </>
  );
}
