'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { catalogue } from '@/data/catalogue';
import { railTitle } from '@/data/goals';
import { planById } from '@/data/plans';
import { suggestDelivery } from '@/lib/delivery';
import { browsingLimits } from '@/lib/box';
import { bestSellerSuggestions, unavailableReason } from '@/lib/recommend';
import { bestSellerIds } from '@/data/bestSellers';
import {
  BoxTotal,
  BuildBoxPrompt,
  DeliveryCard,
  OrderSummary,
  PageHeader,
  PreferencesCard,
  SavingsLine,
  Steps,
  SuggestionRail,
  useBox,
  useFreshRail,
  useReturnHere,
} from '@/components';
import { CHECKOUT_STEPS, STEP_DELIVERY } from '@/data/labels';
import { formatPrice } from '@/lib/format';
import { boxHref, homeHref, onboardingHref } from '@/lib/routes';

/** Your box: the order summary. Mobile first; two columns from 1024px. */
export function YourBoxPage() {
  useFreshRail();
  useReturnHere(boxHref);
  const router = useRouter();
  const { state, dispatch, totals, repeatTotals, discountRate, suggestions, setQty, theme, setTheme } = useBox();
  const plan = state.plan ? planById(state.plan) : null;
  // A brand-new visitor: nothing in the box (when the page opened) and no answers, so nothing to go
  // with yet. The rail shows the best sellers; it stays put while they add from it, like any rail.
  const coldStart = !state.answered && state.railLines.length === 0;
  // Counts taps on checkout with no delivery chosen; each one opens and points at the Delivery card.
  const [deliveryAttention, setDeliveryAttention] = useState(0);
  const checkout = () => (plan ? router.push('/checkout') : setDeliveryAttention((n) => n + 1));
  const deliverySuggestion = suggestDelivery(state.lines, catalogue, state.customer);

  return (
    <>
      <PageHeader backHref={homeHref} theme={theme} onThemeChange={setTheme}>
        {/* The real saving once there's a subscription saving, otherwise the best one on offer. */}
        <SavingsLine saving={totals.discount > 0 ? formatPrice(totals.discount) : '10%'} />
        {/* <Steps steps={CHECKOUT_STEPS} current={STEP_DELIVERY} /> */}
      </PageHeader>

      <main className="mx-auto w-full max-w-content px-16 pb-240 pt-16 lg:grid lg:grid-cols-12 lg:items-start lg:gap-24 lg:px-24 lg:pb-48 lg:pt-24">
        <div className="mx-auto flex max-w-column flex-col gap-16 lg:col-span-7 lg:mx-0 lg:max-w-none">
          {/* No answers yet: offer help instead of showing defaults they never chose. */}
          {state.answered ? (
            <PreferencesCard customer={state.customer} onChange={(patch) => dispatch({ type: 'updateCustomer', patch })} />
          ) : (
            <BuildBoxPrompt href={onboardingHref} />
          )}
          <DeliveryCard
            plan={state.plan}
            onPlanChange={(p) => dispatch({ type: 'setPlan', plan: p })}
            date={state.deliveryDate}
            onDateChange={(date) => dispatch({ type: 'setDeliveryDate', date })}
            suggestion={deliverySuggestion}
            drinkers={state.customer.drinkers}
            attention={deliveryAttention}
          />
          <OrderSummary
            lines={state.lines}
            catalogue={catalogue}
            totals={totals}
            onQtyChange={setQty}
            warningFor={(item) => unavailableReason(item, browsingLimits(state))}
            cadence={repeatTotals ? plan?.cadence : undefined}
            onEveryDeliveryChange={(itemId, on) => dispatch({ type: 'setEveryDelivery', itemId, on })}
            discountRate={discountRate}
          />
        </div>

        <div className="mx-auto mt-16 flex max-w-column flex-col gap-16 lg:sticky lg:top-24 lg:col-span-5 lg:mx-0 lg:mt-0 lg:max-w-none">
          <SuggestionRail
            title={coldStart ? 'Best sellers' : railTitle(state.customer.goal)}
            suggestions={coldStart ? bestSellerSuggestions(bestSellerIds, browsingLimits(state), catalogue) : suggestions}
            lines={state.lines}
            onQtyChange={setQty}
            discountRate={discountRate}
          />
          <BoxTotal
            totals={totals}
            cadence={plan?.cadence ?? ''}
            discountRate={plan?.discount ?? 0}
            repeatTotal={repeatTotals?.total}
            onCheckout={checkout}
          />
        </div>
      </main>
    </>
  );
}
