'use client';

import { useRouter } from 'next/navigation';
import { catalogue } from '@/data/catalogue';
import { goalById } from '@/data/goals';
import { planById } from '@/data/plans';
import { suggestDelivery } from '@/lib/delivery';
import { unavailableReason } from '@/lib/recommend';
import {
  BoxTotal,
  DeliveryCard,
  OrderSummary,
  PageHeader,
  PreferencesCard,
  SavingsLine,
  Steps,
  SuggestionRail,
  useBox,
  useFreshRail,
} from '@/components';
import { CHECKOUT_STEPS, STEP_DELIVERY } from '@/data/labels';
import { formatPrice } from '@/lib/format';

/** Your box: the order summary. Mobile first; two columns from 1024px. */
export function YourBoxPage() {
  useFreshRail();
  const router = useRouter();
  const { state, dispatch, totals, suggestions, setQty, theme, setTheme } = useBox();
  const goal = goalById(state.customer.goal);
  const plan = planById(state.plan);
  const deliverySuggestion = suggestDelivery(state.lines, catalogue, state.customer);

  return (
    <>
      <PageHeader theme={theme} onThemeChange={setTheme}>
        {/* The real saving once there's a subscription saving, otherwise the best one on offer. */}
        <SavingsLine saving={totals.discount > 0 ? formatPrice(totals.discount) : '10%'} />
        {/* <Steps steps={CHECKOUT_STEPS} current={STEP_DELIVERY} /> */}
      </PageHeader>

      <main className="mx-auto w-full max-w-content px-16 pb-240 pt-16 lg:grid lg:grid-cols-12 lg:items-start lg:gap-24 lg:px-24 lg:pb-48 lg:pt-24">
        <div className="mx-auto flex max-w-column flex-col gap-16 lg:col-span-7 lg:mx-0 lg:max-w-none">
          <PreferencesCard customer={state.customer} onChange={(patch) => dispatch({ type: 'updateCustomer', patch })} />
          <DeliveryCard
            plan={state.plan}
            onPlanChange={(p) => dispatch({ type: 'setPlan', plan: p })}
            date={state.deliveryDate}
            onDateChange={(date) => dispatch({ type: 'setDeliveryDate', date })}
            suggestion={deliverySuggestion}
            drinkers={state.customer.drinkers}
          />
          <OrderSummary
            lines={state.lines}
            catalogue={catalogue}
            totals={totals}
            onQtyChange={setQty}
            warningFor={(item) => unavailableReason(item, state.customer)}
          />
        </div>

        <div className="mx-auto mt-16 flex max-w-column flex-col gap-16 lg:sticky lg:top-24 lg:col-span-5 lg:mx-0 lg:mt-0 lg:max-w-none">
          <SuggestionRail
            title={`For ${goal.railLabel}`}
            suggestions={suggestions}
            lines={state.lines}
            onQtyChange={setQty}
          />
          <BoxTotal totals={totals} cadence={plan.cadence} discountRate={plan.discount} onCheckout={() => router.push('/checkout')} />
        </div>
      </main>
    </>
  );
}
