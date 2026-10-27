import type { BoxLine, Customer, Item, PlanId } from '../types';
import { subscriptionPlans } from '../data/plans';

export interface DeliverySuggestion {
  planId: PlanId;
  /** Roughly how many cups the box makes. */
  cupsInBox: number;
  /** Cups a day across everyone who drinks it. */
  cupsPerDay: number;
  /** How long the box lasts at that rate, in whole days. */
  daysLasting: number;
  /** True when the box lasts less than the most frequent delivery. */
  runsShort: boolean;
}

/** Roughly how many cups the drinks in the box make (gear makes none). */
export function cupsInBox(lines: BoxLine[], catalogue: Item[]): number {
  return lines.reduce((sum, line) => {
    const item = catalogue.find((i) => i.id === line.itemId);
    return sum + (item?.cups ?? 0) * line.qty;
  }, 0);
}

/**
 * Suggest how often to deliver: the frequency closest to how long the box lasts.
 * Null when the box has no drinks, because there's nothing to work it out from.
 */
export function suggestDelivery(lines: BoxLine[], catalogue: Item[], customer: Customer): DeliverySuggestion | null {
  const cups = cupsInBox(lines, catalogue);
  if (cups === 0) return null;
  const perDay = customer.drinkers * customer.cupsPerDay;
  const daysLasting = Math.floor(cups / perDay);
  const plan = subscriptionPlans.reduce((best, p) =>
    Math.abs(p.days - daysLasting) < Math.abs(best.days - daysLasting) ? p : best,
  );
  return { planId: plan.id, cupsInBox: cups, cupsPerDay: perDay, daysLasting, runsShort: daysLasting < subscriptionPlans[0].days };
}
