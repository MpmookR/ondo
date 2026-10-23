import type { BoxLine, Customer, Goal, Item, PlanId } from '../types';
import type { ISODate } from './dates';

export type Theme = 'light' | 'dark';

export interface BoxState {
  lines: BoxLine[];
  plan: PlanId;
  customer: Customer;
  /**
   * The box the suggestion rail is worked out from. It's refreshed when a page opens or a
   * preference changes, not on every add, so cards don't reshuffle under the customer's thumb.
   */
  railLines: BoxLine[];
  /** First delivery, as 'YYYY-MM-DD'. Null until the browser sets a default (today + 7 days). */
  deliveryDate: ISODate | null;
}

export type BoxAction =
  | { type: 'setQty'; itemId: string; qty: number }
  | { type: 'setPlan'; plan: PlanId }
  | { type: 'setGoal'; goal: Goal }
  | { type: 'setMaxCaffeine'; maxCaffeine: Customer['maxCaffeine'] }
  | { type: 'toggleAvoid'; avoid: string }
  | { type: 'refreshRail' }
  | { type: 'setDeliveryDate'; date: ISODate };

export const MAX_QTY = 9;

export function qtyOf(lines: BoxLine[], itemId: string): number {
  return lines.find((l) => l.itemId === itemId)?.qty ?? 0;
}

function withQty(lines: BoxLine[], itemId: string, qty: number): BoxLine[] {
  const clamped = Math.max(0, Math.min(MAX_QTY, qty));
  if (clamped === 0) return lines.filter((l) => l.itemId !== itemId);
  if (lines.some((l) => l.itemId === itemId)) {
    return lines.map((l) => (l.itemId === itemId ? { ...l, qty: clamped } : l));
  }
  return [...lines, { itemId, qty: clamped }];
}

export function boxReducer(state: BoxState, action: BoxAction): BoxState {
  switch (action.type) {
    case 'setQty':
      return { ...state, lines: withQty(state.lines, action.itemId, action.qty) };
    case 'setPlan':
      return { ...state, plan: action.plan };
    case 'setGoal':
      return { ...state, customer: { ...state.customer, goal: action.goal }, railLines: state.lines };
    case 'setMaxCaffeine':
      return { ...state, customer: { ...state.customer, maxCaffeine: action.maxCaffeine }, railLines: state.lines };
    case 'toggleAvoid': {
      const { avoids } = state.customer;
      const next = avoids.includes(action.avoid) ? avoids.filter((a) => a !== action.avoid) : [...avoids, action.avoid];
      return { ...state, customer: { ...state.customer, avoids: next }, railLines: state.lines };
    }
    case 'refreshRail':
      return { ...state, railLines: state.lines };
    case 'setDeliveryDate':
      return { ...state, deliveryDate: action.date };
  }
}

export interface Totals {
  drinkCount: number;
  gearCount: number;
  count: number;
  subtotal: number;
  discount: number;
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function totals(lines: BoxLine[], catalogue: Item[], discountRate: number): Totals {
  let drinkCount = 0;
  let gearCount = 0;
  let subtotal = 0;
  for (const line of lines) {
    const item = catalogue.find((i) => i.id === line.itemId);
    if (!item) continue;
    if (item.category === 'gear') gearCount += line.qty;
    else drinkCount += line.qty;
    subtotal += item.price * line.qty;
  }
  subtotal = round2(subtotal);
  const discount = round2(subtotal * discountRate);
  return { drinkCount, gearCount, count: drinkCount + gearCount, subtotal, discount, total: round2(subtotal - discount) };
}
