'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { catalogue, itemById } from '@/data/catalogue';
import { goalById } from '@/data/goals';
import { isDrinkCategory } from '@/data/labels';
import { bestSellerIds } from '@/data/bestSellers';
import { browsingLimits, qtyOf } from '@/lib/box';
import { recommendForAddOn, recommendForItem, unavailableReason } from '@/lib/recommend';
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
  const { state, setQty, theme, setTheme, returnTo } = useBox();
  const item = itemById(itemId)!;
  const isDrink = isDrinkCategory(item.category);
  const qty = qtyOf(state.lines, item.id);
  const goal = goalById(state.customer.goal);

  // Drinks: the same rules with this drink as the context. Add-ons: the drinks that belong with
  // them (gear: what it brews; bites and sweeteners: what they pair with), topped up with best sellers.
  const limits = browsingLimits(state);
  const pairings = useMemo(
    () =>
      isDrink
        ? recommendForItem(item, state.customer, catalogue, { goalLabel: goal?.railLabel })
        : recommendForAddOn(item, limits, catalogue, bestSellerIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- limits is derived from state
    [isDrink, item, state.customer, state.answered, goal?.railLabel],
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

          <BrewHighlights item={item} customer={limits} />

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
            ) : null}
            <DetailAccordion title="Delivery & storage">
              <p className="font-sans text-body">
                Free delivery, letterbox friendly. Keep sealed, away from light and heat, and use within a month of opening.
              </p>
            </DetailAccordion>
          </div>

          {pairings.length > 0 && (
            <div className="px-8 pb-24 pt-16 lg:pb-8">
              <SuggestionRail
                title="Goes well with this"
                suggestions={pairings}
                lines={state.lines}
                onQtyChange={setQty}
              />
            </div>
          )}
        </div>
      </main>

      <OrderBar item={item} qty={qty} onQtyChange={(n) => setQty(item.id, n)} blockedReason={unavailableReason(item, limits)} />
    </>
  );
}
