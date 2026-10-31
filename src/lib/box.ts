import type { BoxLine, Customer, Goal, Item, PlanId } from '../types';
import type { ISODate } from './dates';
import { isDrinkCategory } from '../data/labels';

export type Theme = 'light' | 'dark';

export interface BoxState {
  lines: BoxLine[];
  /** Null until the customer picks how often (or one-off). Nothing is chosen for them. */
  plan: PlanId | null;
  customer: Customer;
  /**
   * The box the suggestion rail is worked out from. It's refreshed when a page opens or a
   * preference changes, not on every add, so cards don't reshuffle under the customer's thumb.
   */
  railLines: BoxLine[];
  /** First delivery, as 'YYYY-MM-DD'. Null until the browser sets a default (today + 7 days). */
  deliveryDate: ISODate | null;
  /**
   * Whether the customer has told us anything (onboarding, or answers kept from "I'd rather browse").
   * Until then `customer` holds the safe defaults, and Your box and the shop ask instead of showing them.
   */
  answered: boolean;
}

export type BoxAction =
  | { type: 'setQty'; itemId: string; qty: number }
  | { type: 'setPlan'; plan: PlanId }
  | { type: 'setGoal'; goal: Goal }
  | { type: 'setMaxCaffeine'; maxCaffeine: Customer['maxCaffeine'] }
  | { type: 'toggleAvoid'; avoid: string }
  | { type: 'updateCustomer'; patch: Partial<Customer> }
  | { type: 'refreshRail' }
  /**
   * Onboarding finished: take the answers and add the starter box's picks to whatever is already in
   * the box. Nothing they chose is removed or changed, and nothing already there is added twice.
   */
  | { type: 'startFirstBox'; customer: Customer; lines: BoxLine[] }
  /** Restore a saved session (sessionStorage), so a reload keeps the box, answers and choices. */
  | { type: 'restore'; state: BoxState }
  | { type: 'setDeliveryDate'; date: ISODate };

export const MAX_QTY = 9;

/**
 * The limits that apply while browsing (shop tabs, item pages, warnings on Your box). Until the
 * customer has told us anything, there are none: the safe defaults only steer suggestions, so
 * nothing is hidden behind a caffeine limit or an allergy they never set.
 */
export function browsingLimits(state: BoxState): Customer {
  return state.answered ? state.customer : { ...state.customer, maxCaffeine: 5, avoids: [] };
}

/** The customer's own lines first, untouched; then each pick that isn't in the box yet. */
export function mergeLines(own: BoxLine[], picks: BoxLine[]): BoxLine[] {
  const have = new Set(own.map((l) => l.itemId));
  return [...own, ...picks.filter((p) => !have.has(p.itemId))];
}

/** A saved session is only restored if it still has this shape (an older or broken one is ignored). */
export function isBoxState(value: unknown): value is BoxState {
  const s = value as Partial<BoxState> | null;
  return Boolean(
    s &&
      Array.isArray(s.lines) &&
      Array.isArray(s.railLines) &&
      typeof s.answered === 'boolean' &&
      s.customer &&
      typeof s.customer === 'object' &&
      (s.plan === null || typeof s.plan === 'string'),
  );
}

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
    case 'updateCustomer':
      return { ...state, customer: { ...state.customer, ...action.patch }, railLines: state.lines, answered: true };
    case 'refreshRail':
      return { ...state, railLines: state.lines };
    case 'startFirstBox': {
      const lines = mergeLines(state.lines, action.lines);
      return { ...state, customer: action.customer, lines, railLines: lines, answered: true };
    }
    case 'restore':
      return action.state;
    case 'setDeliveryDate':
      return { ...state, deliveryDate: action.date };
  }
}

export interface Totals {
  drinkCount: number;
  /** Gear, bites and sweeteners. */
  addOnCount: number;
  count: number;
  subtotal: number;
  discount: number;
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function totals(lines: BoxLine[], catalogue: Item[], discountRate: number): Totals {
  let drinkCount = 0;
  let addOnCount = 0;
  let subtotal = 0;
  for (const line of lines) {
    const item = catalogue.find((i) => i.id === line.itemId);
    if (!item) continue;
    if (isDrinkCategory(item.category)) drinkCount += line.qty;
    else addOnCount += line.qty;
    subtotal += item.price * line.qty;
  }
  subtotal = round2(subtotal);
  const discount = round2(subtotal * discountRate);
  return { drinkCount, addOnCount, count: drinkCount + addOnCount, subtotal, discount, total: round2(subtotal - discount) };
}
